// api/email/send-email.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, subject, body, attachments } = req.body;

    try {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error("❌ RESEND_API_KEY não definida");
            return res.status(500).json({ error: "Missing RESEND_API_KEY" });
        }

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "QR Evento <contato@seudominio.com.br>", // verificado na Resend
                to,
                subject,
                html: body,
                attachments,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro Resend:", data);
            return res.status(500).json({ error: "Erro no envio de e-mail", details: data });
        }

        return res.status(200).json({ success: true });
    } catch (err: any) {
        console.error("Erro no handler:", err);
        return res.status(500).json({ error: "Erro no envio", message: err.message });
    }
}
