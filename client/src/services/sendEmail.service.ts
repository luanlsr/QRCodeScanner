export interface EmailPayload {
  to: string;
  subject: string;
  body: string; // HTML
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 sem prefixo
  type: string; // exemplo: "image/png"
  disposition?: "inline" | "attachment"; // padrão pode ser "inline"
  content_id: string;
}

export const sendConfirmationEmail = async (payload: EmailPayload) => {
  const response = await fetch('/api/email/send-email', {
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

