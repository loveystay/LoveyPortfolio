export type ChatRequestBody = {
  language?: unknown;
  messages?: unknown;
  projects?: unknown;
};

export type ChatResult = {
  reply: string;
  recommendedProjectIds: string[];
  shouldContact: boolean;
};

type SupportedLanguage = 'ko' | 'en' | 'ja';
type ProjectSummary = {
  id: string;
  title: string;
  category: string;
  description: string;
  client?: string;
  duration?: string;
  highlights?: string[];
};

const cleanText = (value: unknown, maxLength: number) =>
  String(value ?? '').trim().slice(0, maxLength);

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
        ? source.highlights.slice(0, 3).map((item) => cleanText(item, 240)).filter(Boolean)
        : undefined,
    }];
  });
};

export async function generateChatResponse(
  body: ChatRequestBody,
  apiKey: string | undefined,
  model = 'gemini-3.6-flash',
): Promise<{ status: number; data: ChatResult | { error: string } }> {
  const language = normalizeLanguage(body.language);
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { status: 400, data: { error: 'messages is required' } };
  }
  if (!apiKey) return { status: 503, data: fallback(language) };

  const messages = body.messages
    .slice(-12)
    .flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const message = item as Record<string, unknown>;
      const text = cleanText(message.text, 2000);
      return text ? [{ role: message.role === 'user' ? 'user' : 'model', text }] : [];
    });
  const projects = sanitizeProjects(body.projects);
  const validProjectIds = new Set(projects.map((project) => project.id));
  const responseLanguage = language === 'ja' ? 'Japanese' : language === 'en' ? 'English' : 'Korean';
  const instruction = [
    `You are Lovey's portfolio consultation assistant. Reply only in ${responseLanguage}.`,
    'Lovey provides YouTube long-form video editing, Shorts/Reels editing, and e-commerce product detail page design.',
    'Do not offer standalone thumbnail work. Projects begin after deposit confirmation and standard revisions include two rounds.',
    'Help the visitor clarify project type, quantity or video length, desired deadline, reference style, and budget range.',
    'Never invent prices, schedules, clients, performance metrics, policies, or portfolio facts.',
    'Recommend no more than three relevant projects, using only exact IDs from the supplied public project catalog.',
    'Set shouldContact to true for a quote, booking, direct-contact request, or once enough project details are supplied.',
    'Keep the reply concise and helpful. Return only valid JSON with reply, recommendedProjectIds, and shouldContact.',
    `Public project catalog: ${JSON.stringify(projects)}`,
  ].join('\n');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instruction }] },
          contents: messages.map((message) => ({
            role: message.role,
            parts: [{ text: message.text }],
          })),
          generationConfig: { temperature: 0.45, responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(25_000),
      },
    );

    if (!response.ok) return { status: 502, data: fallback(language) };
    const payload = await response.json();
    const rawText = payload.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('')
      .trim();
    if (!rawText) return { status: 502, data: fallback(language) };

    const normalized = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(normalized) as Record<string, unknown>;
    const reply = cleanText(parsed.reply, 6000);
    if (!reply) return { status: 502, data: fallback(language) };
    const recommendedProjectIds = Array.isArray(parsed.recommendedProjectIds)
      ? parsed.recommendedProjectIds
          .map((id) => cleanText(id, 120))
          .filter((id, index, values) => validProjectIds.has(id) && values.indexOf(id) === index)
          .slice(0, 3)
      : [];

    return {
      status: 200,
      data: { reply, recommendedProjectIds, shouldContact: parsed.shouldContact === true },
    };
  } catch {
    return { status: 502, data: fallback(language) };
  }
}
