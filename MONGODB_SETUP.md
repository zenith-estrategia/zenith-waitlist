# Configuração do MongoDB Atlas

Este documento explica como configurar o MongoDB Atlas para a aplicação Zenith Waitlist.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Criação do Cluster](#criação-do-cluster)
- [Configuração da Aplicação](#configuração-da-aplicação)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Segurança e Boas Práticas](#segurança-e-boas-práticas)
- [Monitoramento](#monitoramento)

## 🎯 Pré-requisitos

- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuita ou paga)
- Node.js 18+ instalado
- Conhecimento básico de MongoDB

## 🚀 Criação do Cluster

### 1. Criar conta no MongoDB Atlas

1. Acesse [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Clique em "Try Free" e crie sua conta
3. Confirme seu email

### 2. Criar um novo cluster

1. No dashboard, clique em **"Build a Database"**
2. Escolha o plano:

   - **Shared (M0)**: Gratuito, ideal para desenvolvimento e pequenas aplicações
   - **Dedicated**: Para produção com mais recursos

3. Configure o cluster:

   - **Provider**: AWS, Google Cloud ou Azure (recomendado: AWS)
   - **Region**: Escolha a região mais próxima (ex: São Paulo para Brasil)
   - **Cluster Name**: `zenith-waitlist` ou nome de sua preferência

4. Clique em **"Create"** e aguarde 3-5 minutos

### 3. Configurar segurança

#### 3.1. Criar usuário do banco de dados

1. Vá em **Database Access** no menu lateral
2. Clique em **"Add New Database User"**
3. Configure:
   - **Authentication Method**: Password
   - **Username**: `zenith_app` (ou qualquer nome)
   - **Password**: Gere uma senha segura (salve-a!)
   - **Database User Privileges**: "Read and write to any database"
4. Clique em **"Add User"**

#### 3.2. Configurar Network Access

1. Vá em **Network Access** no menu lateral
2. Clique em **"Add IP Address"**
3. Opções:
   - **Para desenvolvimento**: "Allow Access from Anywhere" (0.0.0.0/0)
   - **Para produção**: Adicione o IP específico da sua aplicação
4. Clique em **"Confirm"**

### 4. Obter string de conexão

1. Vá em **Database** no menu lateral
2. Clique em **"Connect"** no seu cluster
3. Selecione **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 6.7 or later
6. Copie a connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## ⚙️ Configuração da Aplicação

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://zenith_app:SUA_SENHA_AQUI@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=zenith_waitlist

# Rate Limiting (opcional - Upstash Redis)
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

**⚠️ IMPORTANTE**:

- Substitua `SUA_SENHA_AQUI` pela senha do usuário criado
- Nunca commite o arquivo `.env.local` no Git
- O `.env.local` já está no `.gitignore`

### 2. Variáveis de ambiente obrigatórias

| Variável          | Descrição                                                    | Exemplo             |
| ----------------- | ------------------------------------------------------------ | ------------------- |
| `MONGODB_URI`     | String de conexão do MongoDB Atlas                           | `mongodb+srv://...` |
| `MONGODB_DB_NAME` | Nome do banco de dados (opcional, padrão: `zenith_waitlist`) | `zenith_waitlist`   |

### 3. Testar a conexão

Execute o projeto em desenvolvimento:

```bash
bun dev
# ou
npm run dev
```

Acesse `http://localhost:3000` e teste o formulário de waitlist.

## 🗄️ Estrutura do Banco de Dados

### Collection: `waitlist_entries`

Armazena todas as inscrições da waitlist.

#### Schema do documento

```typescript
{
  _id: ObjectId,
  name: string,              // Nome completo
  email: string,             // Email (único, em lowercase)
  company: string,           // Nome da empresa
  position: string,          // Cargo
  tags: string[],            // Tags para categorização
  source: string,            // Fonte de origem (ex: "website")
  status: string,            // Status: "pending" | "contacted" | "converted" | "declined"
  createdAt: Date,           // Data de criação
  updatedAt: Date,           // Data de atualização
  metadata: {
    ip?: string,             // IP do usuário
    userAgent?: string,      // User agent do navegador
    referrer?: string,       // URL de referência
    language?: string        // Idioma preferido
  }
}
```

#### Índices

Os seguintes índices são criados automaticamente pela aplicação:

1. **Email único**: `{ email: 1 }` - Previne duplicatas
2. **Status**: `{ status: 1 }` - Otimiza filtros por status
3. **Data de criação**: `{ createdAt: -1 }` - Otimiza ordenação
4. **Composto**: `{ status: 1, createdAt: -1 }` - Otimiza analytics

### Collection: `_indexes` (sistema)

Criada automaticamente pelo MongoDB para gerenciar índices.

## 🔒 Segurança e Boas Práticas

### 1. Variáveis de ambiente

- ✅ Use `.env.local` para desenvolvimento
- ✅ Configure variáveis de ambiente no Vercel/hosting para produção
- ❌ Nunca commite credenciais no Git
- ✅ Use senhas fortes e únicas

### 2. Network Access

- **Desenvolvimento**: 0.0.0.0/0 (qualquer IP)
- **Produção**: Restrinja aos IPs específicos do servidor

### 3. Privilégios do usuário

- ✅ Use usuários com privilégios mínimos necessários
- ✅ Crie usuários separados para desenvolvimento e produção
- ❌ Evite usar usuários com privilégios de admin

### 4. Backup

O MongoDB Atlas faz backup automático, mas você pode:

1. Ir em **Backup** no menu do cluster
2. Configurar snapshots automáticos
3. Configurar retenção de backups

### 5. Monitoramento

1. **Atlas Dashboard**: Monitore performance e uso
2. **Alerts**: Configure alertas para uso excessivo
3. **Logs**: Revise logs regularmente em **Database > Logs**

## 📊 Monitoramento

### Métricas importantes

1. **Connection Count**: Número de conexões ativas
2. **Query Performance**: Tempo de resposta das queries
3. **Storage**: Uso de armazenamento
4. **Network**: Tráfego de entrada/saída

### Ver dados no Atlas

1. Vá em **Database** > **Browse Collections**
2. Selecione o banco `zenith_waitlist`
3. Navegue pela collection `waitlist_entries`
4. Visualize, edite ou delete documentos

### Queries úteis

#### Ver total de inscrições

```javascript
db.waitlist_entries.countDocuments();
```

#### Ver inscrições por status

```javascript
db.waitlist_entries.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
]);
```

#### Ver últimas inscrições

```javascript
db.waitlist_entries.find().sort({ createdAt: -1 }).limit(10);
```

## 🆘 Troubleshooting

### Erro: "MONGODB_URI não pode estar vazio"

**Solução**: Verifique se o arquivo `.env.local` existe e contém a variável `MONGODB_URI`.

### Erro: "Authentication failed"

**Soluções**:

1. Verifique se a senha está correta na URI
2. Certifique-se de que o usuário foi criado corretamente
3. Verifique se o usuário tem permissões adequadas

### Erro: "IP not whitelisted"

**Solução**: Adicione o IP atual em **Network Access** no Atlas.

### Erro: "Connection timeout"

**Soluções**:

1. Verifique sua conexão de internet
2. Confirme que o cluster está rodando
3. Verifique se há firewall bloqueando a porta 27017

### Performance lenta

**Soluções**:

1. Verifique se os índices foram criados
2. Monitore queries lentas no Atlas
3. Considere upgrade do plano se necessário

## 📚 Recursos Adicionais

- [Documentação MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [Atlas Security](https://www.mongodb.com/docs/atlas/security/)

## 🎓 Próximos Passos

1. ✅ Configurar alertas de monitoramento
2. ✅ Configurar backup automático
3. ✅ Implementar autenticação para endpoints administrativos
4. ✅ Criar dashboard para visualização de dados
5. ✅ Configurar rate limiting mais robusto

---

**Última atualização**: 2025-01-22
**Versão**: 1.0.0
