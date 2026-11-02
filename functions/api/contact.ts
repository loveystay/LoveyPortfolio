import { sendProjectInquiryEmail } from '../../api/_contact';

type ContactEnvironment = {
  RESEND_API_KEY?: string;
  CONTACT_EMAIL_FROM?: string;
};

type PagesFunctionContext = {
  request: Request;
  env: ContactEnvironment;
};

const jsonResponse = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export async function onRequest(context: PagesFunctionContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const result = await sendProjectInquiryEmail(
    body,
    context.env.RESEND_API_KEY,
    context.env.CONTACT_EMAIL_FROM,
  );
  return jsonResponse(result.data, result.status);
}
