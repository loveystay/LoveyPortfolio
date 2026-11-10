import { sendProjectInquiryEmail } from './_contact.js';

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  try {
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    let body = request.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        response.status(400).json({ error: 'Invalid request body' });
        return;
      }
    }

    const result = await sendProjectInquiryEmail(
      body,
      process.env.RESEND_API_KEY,
      process.env.CONTACT_EMAIL_FROM,
    );
    response.status(result.status).json(result.data);
  } catch (error) {
    const errorDetails = error instanceof Error
      ? `${error.name}: ${error.message}`
      : String(error);
    console.error(`[Contact API] Unexpected handler error: ${errorDetails}`);
    response.status(500).json({ error: 'Internal server error.' });
  }
}
