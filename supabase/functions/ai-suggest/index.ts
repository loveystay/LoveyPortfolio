import { corsHeaders } from '../_shared/cors.ts';

type Suggestion = { description: string; fullStory: string; highlights: string[] };

const fallback = (title: string, category: string): Suggestion => ({
  description: `${title || '프로젝트'}의 핵심 메시지와 시각적 흐름을 정리한 ${category === 'PRODUCT PAGE' ? '상세 페이지' : '영상'} 작업입니다.`,
  fullStory: '목표 고객과 핵심 메시지를 기준으로 정보 구조와 시각적 리듬을 설계했습니다. 핵심 장점을 빠르게 전달하고, 모바일 환경에서도 읽기 쉬운 흐름을 유지했습니다.',
  highlights: ['핵심 메시지를 빠르게 전달하는 구조', '브랜드 톤에 맞춘 시각적 일관성', '모바일 환경을 고려한 가독성'],
});

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  try {
    const body = await request.json();
    const title = String(body.title ?? '').slice(0, 200);
    const category = String(body.category ?? '').slice(0, 100);
    const targetField = body.targetField === 'description' || body.targetField === 'fullStory' ? body.targetField : 'all';
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      const result = fallback(title, category);
      return Response.json({ result: targetField === 'description' ? result.description : targetField === 'fullStory' ? result.fullStory : result }, { headers: corsHeaders });
    }

    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.6-flash';
    const prompt = `Write Korean portfolio copy for a ${category} project. Title: ${title}. Client: ${String(body.client ?? '').slice(0, 160)}. Role: ${String(body.role ?? '').slice(0, 160)}. Notes: ${String(body.roughNotes ?? '').slice(0, 3000)}. Return only valid JSON with description (1-2 sentences), fullStory (2 short paragraphs), and highlights (3 strings). Do not invent performance metrics.`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.7 } }),
    });
    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('');
    const result = text ? JSON.parse(text) as Suggestion : fallback(title, category);
    return Response.json({ result: targetField === 'description' ? result.description : targetField === 'fullStory' ? result.fullStory : result }, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return Response.json({ result: fallback('', '') }, { headers: corsHeaders });
  }
});
