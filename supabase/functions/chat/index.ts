import { corsHeaders } from '../_shared/cors.ts';

type ChatMessage = { role: 'user' | 'model'; text: string };

const fallback = (language: string) => {
  if (language === 'ko') return '현재 AI 상담을 사용할 수 없습니다. contact@staylovey.com으로 문의해 주세요.';
  if (language === 'ja') return '現在AI相談をご利用いただけません。contact@staylovey.com までお問い合わせください。';
  return 'AI consultation is temporarily unavailable. Please contact contact@staylovey.com.';
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  try {
    const { messages, language = 'ko' } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('messages is required');
    const safeMessages: ChatMessage[] = messages.slice(-12).map((message: ChatMessage) => ({
      role: message.role === 'user' ? 'user' : 'model',
      text: String(message.text ?? '').slice(0, 4000),
    }));
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) return Response.json({ reply: fallback(language) }, { headers: corsHeaders });

    const instruction = `You are lovey's portfolio consultation assistant. Reply only in ${language === 'ja' ? 'Japanese' : language === 'en' ? 'English' : 'Korean'}. Lovey provides video editing (long-form and shorts) and e-commerce product detail page design. Do not offer standalone thumbnails. Projects begin after deposit confirmation; standard revisions include two rounds. Keep replies concise and direct users to contact@staylovey.com for quotes.`;
    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instruction }] },
        contents: safeMessages.map((message) => ({ role: message.role, parts: [{ text: message.text }] })),
        generationConfig: { temperature: 0.5 },
      }),
    });
    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
    const payload = await response.json();
    const reply = payload.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('').trim();
    return Response.json({ reply: reply || fallback(language) }, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return Response.json({ reply: fallback('ko') }, { headers: corsHeaders });
  }
});
