# Sistema de Gerenciamento de QR Codes

## Visão Geral

O Sistema de Gerenciamento de QR Codes é uma aplicação web desenvolvida para criar, gerenciar e verificar QR Codes para controle de acesso em eventos. O sistema permite o gerenciamento completo de participantes, envio de convites por WhatsApp, geração de QR Codes personalizados e verificação da validade dos códigos em tempo real.

## Tecnologias Utilizadas

### Frontend
- **React**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Ferramenta de build rápida para desenvolvimento web
- **Tailwind CSS**: Framework CSS utilitário
- **React Router Dom**: Roteamento para aplicações React
- **Supabase**: Plataforma backend-as-a-service (BaaS)
- **React Hot Toast**: Notificações elegantes
- **React Data Table Component**: Tabelas de dados avançadas
- **Lucide React**: Biblioteca de ícones
- **i18next**: Internacionalização
- **HTML5-QRCode**: Leitura de QR Codes
- **Zustand**: Gerenciamento de estado

### Backend
- **Supabase**: Serviço de banco de dados PostgreSQL
- **APIs RESTful**: Comunicação entre cliente e servidor
- **Row Level Security (RLS)**: Segurança a nível de linha no banco de dados

## Estrutura do Projeto

```
qr-code-system/
├── src/                      # Código fonte do projeto
│   ├── assets/               # Imagens e outros recursos estáticos
│   ├── components/           # Componentes reutilizáveis
│   ├── context/              # Contextos React (Auth, User)
│   ├── data/                 # Camada de acesso a dados
│   ├── hooks/                # Hooks personalizados
│   ├── i18n/                 # Configurações e arquivos de internacionalização
│   ├── models/               # Interfaces e tipos
│   ├── pages/                # Componentes de página
│   ├── services/             # Serviços e camada de comunicação com API
│   ├── utils/                # Funções utilitárias
│   ├── zustand/              # Estados globais com Zustand
│   ├── App.tsx               # Componente principal da aplicação
│   ├── main.tsx              # Ponto de entrada da aplicação
│   └── superbase.ts          # Configuração do cliente Supabase
├── public/                   # Arquivos públicos
├── scripts/                  # Scripts utilitários
└── docs/                     # Documentação do projeto
```

## Principais Funcionalidades

### Gerenciamento de Participantes
- Cadastro completo com nome, sobrenome, e-mail, telefone e foto
- Listagem com filtros e pesquisa
- Edição e exclusão de participantes
- Seleção múltipla e ações em lote

### Geração de QR Codes
- Geração de QR Code único para cada participante
- Visualização e compartilhamento do QR Code
- Integração com WhatsApp para envio direto

### Verificação de QR Codes
- Leitura de QR Codes via câmera
- Validação automática dos participantes
- Marcação do status de leitura

### Autenticação e Autorização
- Login e registro de usuários
- Recuperação de senha
- Controle de acesso baseado em perfis (USER, ADMIN, MASTER)
- Proteção de rotas

### Internacionalização
- Suporte a múltiplos idiomas (Português, Inglês, Espanhol, Francês, Alemão)
- Detecção automática do idioma do navegador
- Seleção manual de idioma

## Fluxos Principais

### Cadastro e Envio de QR Code
1. Acesse a página de Participantes
2. Clique em "Adicionar Participante"
3. Preencha os dados do participante
4. Após o cadastro, o participante aparecerá na lista
5. Clique no botão de WhatsApp para enviar o QR Code
6. O status "Enviado" será atualizado automaticamente

### Leitura e Verificação de QR Code
1. Acesse a página de Leitura
2. Permita o acesso à câmera quando solicitado
3. Aponte para o QR Code do participante
4. O sistema verificará automaticamente a validade
5. Exibirá as informações do participante se for válido
6. O status "Lido" será atualizado

## Configuração e Execução

### Pré-requisitos
- Node.js v16 ou superior
- NPM ou Yarn
- Acesso ao Supabase (solicitar credenciais)

### Instalação
1. Clone o repositório
   ```bash
   git clone [url-do-repositorio]
   cd qr-code-system
   ```

2. Instale as dependências
   ```bash
   npm install
   # ou
   yarn
   ```

3. Configure as variáveis de ambiente
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
     ```
     VITE_SUPABASE_URL=sua_url_do_supabase
     VITE_SUPABASE_KEY=sua_chave_do_supabase
     ```

4. Execute a aplicação
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse a aplicação em `http://localhost:5173`

## Configuração do Supabase

### Tabelas Principais
- **participants**: Armazena os dados dos participantes
- **user_profiles**: Perfis de usuários do sistema

### Políticas de Segurança (RLS)
O sistema utiliza políticas de Row Level Security (RLS) para garantir que:
- Usuários comuns só podem ver seus próprios dados
- Administradores podem ver e gerenciar todos os participantes
- Apenas MASTER pode gerenciar outros usuários

## Solução de Problemas

### Erros de RLS (403 Forbidden)
Se encontrar erros de permissão ao acessar ou modificar dados:
1. Verifique se o usuário tem o perfil adequado
2. Consulte as políticas RLS no Supabase
3. Use funções de serviço que possuem privilégios elevados

### Erros de Autenticação
Se ocorrerem problemas no login ou registro:
1. Verifique as credenciais do Supabase
2. Limpe os dados de autenticação no navegador
3. Verifique se o email foi confirmado (se necessário)

## Boas Práticas

1. **Gerenciamento de Estado**: Utilize os contextos ou Zustand para estado global
2. **Componentes**: Mantenha componentes pequenos e reutilizáveis
3. **Internacionalização**: Use as chaves i18n para todos os textos visíveis
4. **Tipagem**: Mantenha as interfaces e tipos atualizados
5. **Segurança**: Nunca exponha chaves sensíveis no código frontend

## Contribuição

Para contribuir com o projeto:
1. Siga o padrão de código existente
2. Documente novas funcionalidades
3. Teste completamente antes de submeter alterações
4. Atualize este documento conforme necessário

## Contato

Para suporte ou esclarecimentos, entre em contato com a equipe de desenvolvimento. 
