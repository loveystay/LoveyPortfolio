import { corsHeaders } from '../_shared/cors.ts';

type SupportedLanguage = 'ko' | 'en' | 'ja';
type ChatMessage = { role: 'user' | 'model'; text: string };
type ProjectSummary = {
  id: string;
  title: string;
  category: string;
  description: string;
  client?: string;
  duration?: string;
  highlights?: string[];
};
type ChatResult = {
  reply: string;
  recommendedProjectIds: string[];
  shouldContact: boolean;
};

const normalizeLanguage = (value: unknown): SupportedLanguage =>
  value === 'en' || value === 'ja' ? value : 'ko';

const fallback = (language: SupportedLanguage): ChatResult => {
  const replies: Record<SupportedLanguage, string> = {
    ko: '현재 AI 상담 연결이 원활하지 않습니다. 잠시 후 다시 시도하거나 contact@staylovey.com으로 문의해 주세요.',
    en: 'AI consultation is temporarily unavailable. Please try again or contact contact@staylovey.com.',
    ja: '現在AI相談に接続できません。しばらくしてから再度お試しいただくか、contact@staylovey.comまでお問い合わせください。',
  };

  return { reply: replies[language], recommendedProjectIds: [], shouldContact: true };
};

const cleanText = (value: unknown, maxLength: number) =>
  String(value ?? '').trim().slice(0, maxLength);

const sanitizeProjects = (value: unknown): ProjectSummary[] => {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 40).flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const source = item as Record<string, unknown>;
    const id = cleanText(source.id, 120);
    const title = cleanText(source.title, 200);
    if (!id || !title) return [];

    return [{
      id,
      title,
      category: cleanText(source.category, 100),
      description: cleanText(source.description, 600),
      client: cleanText(source.client, 160) || undefined,
      duration: cleanText(source.duration, 160) || undefined,
      highlights: Array.isArray(source.highlights)
        ? source.highlights.slice(0, 3).map((highlight) => cleanText(highlight, 240)).filter(Boolean)
        : undefined,
    }];
  });
};

const parseModelResult = (
  text: string,
  projectIds: Set<string>,
  language: SupportedLanguage,
): ChatResult => {
  try {
    const normalized = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(normalized) as Record<string, unknown>;
    const reply = cleanText(parsed.reply, 6000);
    const recommendedProjectIds = Array.isArray(parsed.recommendedProjectIds)
      ? parsed.recommendedProjectIds
          .map((id) => cleanText(id, 120))
          .filter((id, index, values) => projectIds.has(id) && values.indexOf(id) === index)
          .slice(0, 3)
      : [];

    if (!reply) return fallback(language);
    return {
      reply,
      recommendedProjectIds,
      shouldContact: parsed.shouldContact === true,
    };
  } catch {
    return text.trim()
      ? { reply: text.trim().slice(0, 6000), recommendedProjectIds: [], shouldContact: false }
      : fallback(language);
  }
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let language: SupportedLanguage = 'ko';

  try {
    const body = await request.json();
    language = normalizeLanguage(body.language);
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json({ error: 'messages is required' }, { status: 400, headers: corsHeaders });
    }

    const safeMessages: ChatMessage[] = body.messages
      .slice(-12)
      .map((message: Record<string, unknown>) => ({
        role: message.role === 'user' ? 'user' as const : 'model' as const,
        text: cleanText(message.text, 2000),
      }))
      .filter((message: ChatMessage) => message.text.length > 0);
    const projects = sanitizeProjects(body.projects);
    const projectIds = new Set(projects.map((project) => project.id));
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) return Response.json(fallback(language), { headers: corsHeaders });

    const responseLanguage = language === 'ja' ? 'Japanese' : language === 'en' ? 'English' : 'Korean';
    const instruction = [
      `You are Lovey's portfolio consultation assistant. Reply only in ${responseLanguage}.`,
      'Lovey provides YouTube long-form video editing, Shorts/Reels editing, and e-commerce product detail page design.',
      'Do not offer standalone thumbnail work. Projects begin after deposit confirmation and standard revisions include two rounds.',
      'Help the visitor clarify project type, quantity or video length, desired deadline, reference style, and budget range.',
      'Never invent prices, schedules, clients, performance metrics, policies, or portfolio facts.',
      'Recommend no more than three relevant projects, using only exact IDs from the supplied public project catalog.',
      'If the visitor requests a quote, booking, or direct contact, or has supplied enough project details, set shouldContact to true.',
      'Keep the reply concise, helpful, and commercially natural. Mention contact@staylovey.com only when direct contact is useful.',
      'Return only valid JSON with this shape: {"reply":"string","recommendedProjectIds":["exact-project-id"],"shouldContact":boolean}.',
      `Public project catalog: ${JSON.stringify(projects)}`,
    ].join('\n');

    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.6-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instruction }] },
          contents: safeMessages.map((message) => ({
            role: message.role,
            parts: [{ text: message.text }],
          })),
          generationConfig: {
            temperature: 0.45,
            responseMimeType: 'application/json',
          },
        }),
      },
    );

    if (!response.ok) {
      console.error(`Gemini request failed with status ${response.status}`);
      return Response.json(fallback(language), { status: 502, headers: corsHeaders });
    }

    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('')
      .trim();

    return Response.json(
      parseModelResult(text ?? '', projectIds, language),
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown chat error');
    return Response.json(fallback(language), { status: 500, headers: corsHeaders });
  }
});
