import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { to, subject, body, attachments } = req.body;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("Chave da Resend não definida");
        return res.status(500).json({ error: "Chave da Resend não definida" });
    }

    console.log("Payload recebido:", req.body);
    console.log("Usando API key:", process.env.RESEND_API_KEY ? '✅ OK' : '❌ Faltando');
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: 'QR Evento <contato@qrevento.com.br>',
                to,
                subject,
                html: body,
                attachments
            }),

        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro ao enviar email:', errorText);
            return res.status(500).json({ error: 'Erro ao enviar e-mail' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erro geral:', error);
        return res.status(500).json({ error: 'Erro inesperado' });
    }
}
