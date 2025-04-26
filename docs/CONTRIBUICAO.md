# Guia de Contribuição

Este documento fornece orientações para desenvolvedores que desejam contribuir para o projeto do Sistema de Gerenciamento de QR Codes.

## Sumário

1. [Configuração do Ambiente](#configuração-do-ambiente)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Convenções de Código](#convenções-de-código)
4. [Fluxo de Trabalho Git](#fluxo-de-trabalho-git)
5. [Testes](#testes)
6. [Build e Deploy](#build-e-deploy)
7. [Documentação](#documentação)

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 16.x ou superior)
- npm (versão 8.x ou superior) ou Yarn (versão 1.22.x ou superior)
- Git
- Editor de código (recomendado: VS Code)
- Conta no Supabase

### Passos para Configuração

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd qr-code-system
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configure as variáveis de ambiente**
   - Crie um arquivo `.env.local` na raiz do projeto
   - Copie o conteúdo do arquivo `.env.example`
   - Substitua os valores conforme necessário

   Exemplo de arquivo `.env.local`:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_KEY=sua-chave-anon-key
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse o projeto**
   - O projeto estará disponível em `http://localhost:5173`

## Estrutura do Projeto

O projeto segue uma arquitetura modular baseada em componentes, com separação clara de responsabilidades:

```
src/
├── assets/             # Recursos estáticos
├── components/         # Componentes reutilizáveis
├── context/            # Contextos para estado global
├── data/               # Operações de CRUD e acesso a dados
├── hooks/              # Hooks personalizados
├── i18n/               # Arquivos de internacionalização
├── models/             # Interfaces e tipos
├── pages/              # Componentes de página
├── services/           # Serviços e lógica de negócios
├── utils/              # Funções utilitárias
└── zustand/            # Estados globais com Zustand
```

## Convenções de Código

### Estilo de Código

- **Formatação**: Utilizamos ESLint e Prettier para manter um estilo de código consistente.
- **Regras principais**:
  - Use 2 espaços para indentação
  - Utilize ponto e vírgula (`;`) no final das instruções
  - Aspas simples para strings
  - Tipos explícitos para props em componentes React

### Nomenclatura

- **Arquivos**:
  - Componentes: PascalCase (ex: `UserForm.tsx`)
  - Hooks: camelCase com prefixo "use" (ex: `useAuth.ts`)
  - Utilitários: camelCase (ex: `formatDate.ts`)

- **Variáveis e Funções**:
  - camelCase para variáveis e funções (ex: `getUserData`)
  - PascalCase para componentes React (ex: `UserProfile`)
  - UPPER_SNAKE_CASE para constantes (ex: `MAX_USERS`)

### Componentes React

- Prefira componentes funcionais com hooks em vez de componentes de classe
- Use TypeScript para definir tipos de props
- Estruture componentes grandes em subcomponentes menores
- Utilize o padrão de componente controlado para formulários

Exemplo:
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

## Fluxo de Trabalho Git

### Branches

- `main`: Branch principal, sempre estável
- `develop`: Branch de desenvolvimento
- `feature/nome-da-feature`: Para novas funcionalidades
- `bugfix/nome-do-bug`: Para correções de bugs
- `hotfix/nome-do-hotfix`: Para correções urgentes em produção

### Processo de Contribuição

1. **Crie uma branch** a partir de `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nova-funcionalidade
   ```

2. **Desenvolva a funcionalidade** na sua branch

3. **Commit das alterações** seguindo as convenções de mensagem
   ```bash
   git add .
   git commit -m "feat: adiciona funcionalidade X"
   ```

4. **Push para o repositório remoto**
   ```bash
   git push origin feature/nova-funcionalidade
   ```

5. **Crie um Pull Request** para a branch `develop`
   - Descreva claramente o que foi implementado
   - Referencie quaisquer issues relacionadas
   - Solicite revisão de código

### Convenções de Mensagens de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para alterações na documentação
- `style:` para alterações de formatação que não afetam o código
- `refactor:` para refatorações de código
- `test:` para adição ou modificação de testes
- `chore:` para atualizações de ferramentas, configurações, etc.

## Testes

### Tipos de Testes

- **Testes Unitários**: Para testar componentes e funções isoladamente
- **Testes de Integração**: Para testar a interação entre componentes
- **Testes E2E**: Para testar fluxos completos de usuário

### Executando Testes

```bash
# Executar todos os testes
npm run test

# Executar testes com watch mode
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## Build e Deploy

### Build para Produção

```bash
npm run build
# ou
yarn build
```

O resultado do build será gerado na pasta `dist/`.

### Deploy

O projeto está configurado para deploy automático via Vercel ou similar:

1. Conecte o repositório à plataforma de deploy
2. Configure as variáveis de ambiente
3. Habilite a integração contínua para deploy automático

## Documentação

### Documentação de Código

- Use JSDoc para documentar funções e componentes
- Mantenha os tipos TypeScript atualizados

Exemplo:
```tsx
/**
 * Componente que exibe um QR Code para um participante específico
 * 
 * @param {string} participantId - ID do participante
 * @param {number} size - Tamanho do QR Code em pixels
 * @returns {JSX.Element} Componente de QR Code
 */
export const QRCodeDisplay: React.FC<QRCodeProps> = ({ 
  participantId, 
  size = 200 
}) => {
  // Implementação...
};
```

### Documentação do Projeto

- Mantenha o README.md atualizado com informações relevantes
- Utilize a pasta `/docs` para documentação detalhada
- Atualize a documentação quando implementar novas funcionalidades

## Recursos Adicionais

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Supabase Documentation](https://supabase.io/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 
