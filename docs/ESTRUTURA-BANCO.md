# Estrutura do Banco de Dados

Este documento descreve a estrutura do banco de dados do sistema de gerenciamento de QR Codes, implementado no Supabase.

## Tabelas Principais

### participants

Armazena os dados dos participantes.

| Campo       | Tipo      | Descrição                                       |
|-------------|-----------|------------------------------------------------|
| id          | uuid      | Identificador único (chave primária)            |
| name        | text      | Nome do participante                            |
| last_name   | text      | Sobrenome do participante                       |
| email       | text      | Email do participante                           |
| phone       | text      | Telefone do participante                        |
| photo_url   | text      | URL da foto de perfil (opcional)                |
| sent        | boolean   | Indica se o QR Code foi enviado                 |
| read        | boolean   | Indica se o QR Code foi lido/verificado         |
| valor       | numeric   | Valor associado ao participante                 |
| deleted     | boolean   | Flag para exclusão lógica                       |
| created_at  | timestamp | Data de criação do registro                     |
| updated_at  | timestamp | Data da última atualização                      |

### user_profiles

Armazena os perfis de usuários do sistema.

| Campo       | Tipo      | Descrição                                       |
|-------------|-----------|------------------------------------------------|
| id          | uuid      | Identificador único (chave primária)            |
| user_id     | uuid      | Referência ao usuário no auth.users             |
| name        | text      | Nome do usuário                                 |
| email       | text      | Email do usuário                                |
| phone       | text      | Telefone do usuário (opcional)                  |
| role        | text      | Papel do usuário (USER, ADMIN, MASTER)          |
| created_at  | timestamp | Data de criação do registro                     |
| updated_at  | timestamp | Data da última atualização                      |

## Políticas de Segurança (RLS)

### Políticas para 'participants'

#### Leitura (SELECT)

```sql
CREATE POLICY "Usuários podem ver seus próprios participantes" 
ON "public"."participants"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
  )
);
```

#### Inserção (INSERT)

```sql
CREATE POLICY "Usuários podem criar participantes" 
ON "public"."participants"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
  )
);
```

#### Atualização (UPDATE)

```sql
CREATE POLICY "Usuários podem atualizar seus próprios participantes" 
ON "public"."participants"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
  )
);
```

#### Exclusão (DELETE)

```sql
CREATE POLICY "Usuários podem excluir seus próprios participantes" 
ON "public"."participants"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
  )
);
```

### Políticas para 'user_profiles'

#### Leitura (SELECT)

```sql
CREATE POLICY "Usuários podem ver seus próprios perfis" 
ON "public"."user_profiles"
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todos os perfis" 
ON "public"."user_profiles"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND (user_profiles.role = 'ADMIN' OR user_profiles.role = 'MASTER')
  )
);
```

#### Inserção (INSERT)

```sql
CREATE POLICY "Apenas MASTER pode criar novos perfis" 
ON "public"."user_profiles"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'MASTER'
  )
);
```

#### Atualização (UPDATE)

```sql
CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
ON "public"."user_profiles"
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "MASTER pode atualizar qualquer perfil" 
ON "public"."user_profiles"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'MASTER'
  )
);
```

#### Exclusão (DELETE)

```sql
CREATE POLICY "Apenas MASTER pode excluir perfis" 
ON "public"."user_profiles"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'MASTER'
  )
);
```

## Funções e Gatilhos

### Função para Criar Perfil de Usuário

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, role, created_at, updated_at)
  VALUES (NEW.id, NEW.email, 'USER', NOW(), NOW());
  RETURN NEW;
END;
$$;
```

### Gatilho para Novos Usuários

```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

## Funções de Serviço

### Convidar Usuário por Email

```sql
CREATE OR REPLACE FUNCTION invite_user_by_email(email_address text, user_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_sent boolean;
BEGIN
  -- Verifica se o email já existe
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = email_address) THEN
    RETURN false;
  END IF;

  -- Enviar convite (simplificado, na implementação real usaria auth.invites)
  INSERT INTO auth.invites (email, role, invited_by)
  VALUES (email_address, user_role, auth.uid());
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;
```

## Configurações Importantes

1. **Autenticação**
   - Email/senha habilitado
   - Confirmação de email opcional
   - Período de expiração de links de reset: 24 horas

2. **Storage**
   - Bucket `profile-photos`: Armazena fotos de perfil dos participantes
   - Bucket `qr-codes`: Armazena QR Codes gerados

3. **Configurações de API**
   - CORS: Permitido para o domínio da aplicação
   - Rate Limiting: 100 requisições/minuto por usuário 
