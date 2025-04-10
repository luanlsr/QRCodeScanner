// components/SuccessScreen.tsx
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { sendConfirmationEmail } from "../services/sendEmail.service";
import { Button } from "@headlessui/react";
import QRCode from "qrcode";

type SuccessScreenProps = {
    name: string;
    email: string;
    participantId: string;
    onNewRegistration: () => void;
};

export function SuccessScreen({
    name,
    email,
    participantId,
    onNewRegistration,
}: SuccessScreenProps) {
    useEffect(() => {
        const sendEmail = async () => {
            const qrCodeBase64 = await QRCode.toDataURL(participantId);

            const emailHtml = `
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family: sans-serif; background-color: #f9f9f9; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 20px; text-align: center;">
                    <h2 style="color: #333;">Inscrição Confirmada!</h2>
                    <p style="font-size: 16px; color: #666; max-width: 500px; margin: 0 auto 20px;">
                      Olá <strong>${name}</strong>, sua inscrição foi realizada com sucesso.
                    </p>
                    <p style="font-size: 16px; color: #666; max-width: 500px; margin: 0 auto 30px;">
                      Apresente este QR Code na entrada do evento:
                    </p>
                    <img src="${qrCodeBase64}" alt="QR Code" width="200" height="200" style="margin-bottom: 20px;" />
                    <p style="font-size: 14px; color: #999;">Nos vemos em breve!</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

            await sendConfirmationEmail({
                to: email,
                subject: 'Confirmação de Inscrição no Evento',
                body: emailHtml,
            });
        };

        sendEmail();
    }, [name, email, participantId]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-10">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                Inscrição realizada com sucesso!
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-center max-w-sm">
                O participante foi cadastrado com sucesso. Você pode realizar uma nova inscrição se desejar.
            </p>
            <Button onClick={onNewRegistration} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
                Fazer nova inscrição
            </Button>
        </div>
    );
}
