# 📲 Sistema de Geração e Leitura de QR Codes

Este projeto é composto por duas aplicações integradas:

1. **Frontend Web (React + Vite + Tailwind):** Gera QR Codes com base em dados de pessoas, envia por WhatsApp e marca como enviado.
2. **App Mobile (React Native):** Lê QR Codes e verifica os dados, destacando visualmente quando encontrados.

---

## 🚀 Funcionalidades

### ✅ Web - QR Generator
- Cadastro de pessoas com **nome**, **email** e **telefone**
- Geração de QR Code único por pessoa (ID)
- Envio de QR Code via **WhatsApp**
- Marcação automática de status "enviado"
- Edição e exclusão de cadastros
- Interface moderna com TailwindCSS

### ✅ App Mobile - QR Scanner
- Leitura de QR Codes via câmera
- Verificação dos dados com base no QR lido
- Destaque visual para dados encontrados
- Marcação como "lido"

---

## 🧱 Tecnologias Utilizadas

### Web
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [Lucide Icons](https://lucide.dev/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-qr-code](https://github.com/rosskhanas/react-qr-code)

### Mobile
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Native Camera / Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [@zxing/library](https://github.com/zxing-js/library) (para decodificação de QR)


---

## 📦 Instalação e Execução

### 🖥️ Frontend Web

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/seu-repo.git
cd frontend

# Instale as dependências
npm install

# Inicie o projeto
npm run dev
Acesse em: http://localhost:5173
```

### 🗃️ Estrutura de Dados
```
interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  sent: boolean;
  read?: boolean;
}
```

### 📌 Roadmap
 -[] Cadastro e listagem de pessoas

 -[] Geração e exibição de QR Codes

 -[] Envio via WhatsApp

 -[] Leitura de QR Codes no app

 -[] Integração com banco de dados (Supabase/Firebase)

 -[] Autenticação de usuários

 -[] Histórico de leituras

### 💡 Inspiração
Este projeto foi criado para facilitar o envio e leitura de QR Codes em eventos, listas de presença, ou convites personalizados.

🧑‍💻 Autor
Feito com ❤️ por Luan da Silva Ramalho

### 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Se quiser, posso gerar as imagens para a prévia (`preview-web.png` e `preview-mobile.png`) com base no que você tem ou montar um `README.md` final já pronto para colar no GitHub com essas imagens incluídas.

Quer que eu faça isso também?
