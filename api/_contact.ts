type ContactRequestBody = {
  summary?: unknown;
  email?: unknown;
  companyOrChannel?: unknown;
  website?: unknown;
};

type ContactResult = {
  status: number;
  data: { ok?: true; error?: string };
};

const readText = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function sendProjectInquiryEmail(
  input: unknown,
  apiKey: string | undefined,
  from: string | undefined,
): Promise<ContactResult> {
  const body: ContactRequestBody =
    input && typeof input === 'object' && !Array.isArray(input)
      ? input as ContactRequestBody
      : {};

  // Silently accept honeypot submissions without sending email.
  if (readText(body.website)) return { status: 200, data: { ok: true } };

  const rawSummary = readText(body.summary);
  const email = readText(body.email).slice(0, 254);
  const companyOrChannel = readText(body.companyOrChannel)
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 160);

  if (!rawSummary || !companyOrChannel || !isValidEmail(email)) {
    return { status: 400, data: { error: 'Please provide a valid email and project summary.' } };
  }
  if (rawSummary.length > 20_000) {
    return { status: 413, data: { error: 'The project summary is too long.' } };
  }
  if (!apiKey || !from) {
    return { status: 503, data: { error: 'Email delivery is not configured.' } };
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: ['contact@staylovey.com'],
        reply_to: email,
        subject: `[프로젝트 문의] ${companyOrChannel}`,
        text: rawSummary,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!resendResponse.ok) {
      const errorPayload = await resendResponse.json().catch(() => null) as {
        name?: unknown;
        message?: unknown;
      } | null;
      const providerError = [readText(errorPayload?.name), readText(errorPayload?.message)]
        .filter(Boolean)
        .join(': ')
        .slice(0, 500);
      console.error(
        `[Contact email] Resend returned HTTP ${resendResponse.status}${providerError ? `: ${providerError}` : '.'}`,
      );
      return { status: 502, data: { error: 'Could not send the project inquiry.' } };
    }

    return { status: 200, data: { ok: true } };
  } catch {
    return { status: 502, data: { error: 'Could not send the project inquiry.' } };
  }
}
