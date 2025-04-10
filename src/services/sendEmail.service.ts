export interface EmailPayload {
  to: string;
  subject: string;
  body: string; // HTML
}

export const sendConfirmationEmail = async (payload: EmailPayload) => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error('Erro ao enviar email:', await response.text());
    return false;
  }

  return true;
};

