import { useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { EmailAttachment, sendConfirmationEmail } from "../services/sendEmail.service";
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
  const hasSentEmail = useRef(false); // 👈 controle de envio

  useEffect(() => {
    if (hasSentEmail.current) return; // impede reenvio
    hasSentEmail.current = true;

    const sendEmail = async () => {
      const qrCodeBase64 = await QRCode.toDataURL(participantId);
      const base64 = qrCodeBase64.replace(/^data:image\/png;base64,/, "");
      const cid = `qr-${participantId}@evento`;

      const attachment: EmailAttachment = {
        filename: `qr-${participantId}.png`,
        content: base64,
        type: "image/png",
        disposition: "inline",
        content_id: cid,
      };

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
                      Apresente o QR Code em anexo na entrada do evento.
                    </p>
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
        subject: "Confirmação de Inscrição no Evento",
        body: emailHtml,
        attachments: [attachment],
      });
    };

    sendEmail();
  }, [name, email, participantId]);

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 p-10  rounded-xl ">
        <CheckCircle className="w-16 h-16 text-green-600" />
        <h2 className="text-2xl font-semibold text-center text-white">
          Inscrição realizada com sucesso!
        </h2>
        <p className="text-gray-200 text-center max-w-sm">
          O participante <b><u>{name}</u></b> foi cadastrado com sucesso. Você pode realizar uma nova inscrição se desejar.
        </p>
        <Button
          onClick={onNewRegistration}
          className="w-64 bg-white hover:bg-gray-100 text-green-600 font-bold py-2 rounded border border-green-600 transition"
        >
          Fazer nova inscrição
        </Button>
      </div>
    </div>

  );
}
