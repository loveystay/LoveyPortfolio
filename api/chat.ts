import { generateChatResponse, type ChatRequestBody } from './_chat';

type ApiRequest = {
  method?: string;
  body?: ChatRequestBody | string;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'POST, OPTIONS');
    response.status(204).end();
    return;
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body ?? {};
    const result = await generateChatResponse(
      body,
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_MODEL ?? 'gemini-3.6-flash',
    );
    response.status(result.status).json(result.data);
  } catch {
    response.status(400).json({ error: 'Invalid request body' });
  }
}
