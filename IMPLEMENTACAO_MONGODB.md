# Implementação MongoDB Atlas - Zenith Waitlist

Este documento descreve a arquitetura e implementação da integração com MongoDB Atlas.

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   ├── mongodb.ts              # Cliente MongoDB com singleton pattern
│   ├── mongodb-service.ts      # Serviço de negócios para waitlist
│   ├── rate-limit.ts           # Rate limiting (não modificado)
│   └── validations/
│       └── waitlist.ts         # Validação Zod (não modificado)
├── types/
│   └── mongodb.ts              # Tipos TypeScript para MongoDB
├── app/
│   └── api/
│       └── waitlist/
│           └── route.ts        # Endpoints da API
└── components/
    └── waitlist-modal.tsx      # Modal atualizado
```

## 🏗️ Arquitetura

### 1. Cliente MongoDB (`src/lib/mongodb.ts`)

**Padrão**: Singleton Pattern

**Responsabilidade**: Gerenciar a conexão com o MongoDB Atlas de forma eficiente.

**Características**:

- ✅ Uma única instância do cliente em toda a aplicação
- ✅ Preserva conexão durante hot-reload no desenvolvimento
- ✅ Suporte à MongoDB Server API v1
- ✅ Tratamento de erros de configuração

```typescript
import clientPromise from "@/lib/mongodb";

const client = await clientPromise;
const db = client.db("zenith_waitlist");
```

### 2. Serviço de Waitlist (`src/lib/mongodb-service.ts`)

**Padrão**: Service Layer Pattern

**Responsabilidade**: Encapsular toda a lógica de negócios relacionada à waitlist.

**Métodos principais**:

#### `createEntry(data)`

Cria uma nova entrada na waitlist.

```typescript
const id = await waitlistService.createEntry({
  name: "João Silva",
  email: "joao@example.com",
  company: "Empresa XYZ",
  position: "CEO",
  metadata: {
    ip: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
  },
});
```

**Features**:

- Valida email duplicado (índice único)
- Adiciona tags automáticas
- Define status inicial como "pending"
- Armazena metadados da requisição

#### `findByEmail(email)`

Busca entrada por email.

```typescript
const entry = await waitlistService.findByEmail("joao@example.com");
```

#### `updateStatus(id, status)`

Atualiza o status de uma entrada.

```typescript
await waitlistService.updateStatus(entryId, "contacted");
```

Status disponíveis:

- `pending`: Aguardando contato
- `contacted`: Já foi contatado
- `converted`: Se tornou cliente
- `declined`: Declinado/removido

#### `listEntries(options)`

Lista entradas com paginação e filtros.

```typescript
const result = await waitlistService.listEntries({
  page: 1,
  limit: 50,
  status: "pending",
});

// Retorna:
// {
//   entries: WaitlistDocument[],
//   total: number,
//   page: number,
//   totalPages: number
// }
```

#### `getStats()`

Obtém estatísticas da waitlist.

```typescript
const stats = await waitlistService.getStats();

// Retorna:
// {
//   total: 150,
//   pending: 100,
//   contacted: 30,
//   converted: 15,
//   declined: 5
// }
```

#### `emailExists(email)`

Verifica se email já existe.

```typescript
const exists = await waitlistService.emailExists("joao@example.com");
```

### 3. Tipos TypeScript (`src/types/mongodb.ts`)

**Responsabilidade**: Definir tipos seguros para todo o sistema.

#### `WaitlistDocument`

Representa um documento no MongoDB.

```typescript
interface WaitlistDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  company: string;
  position: string;
  tags?: string[];
  source: string;
  status: "pending" | "contacted" | "converted" | "declined";
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    language?: string;
  };
}
```

#### `WaitlistCreationResponse`

Resposta da API ao criar entrada.

```typescript
interface WaitlistCreationResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}
```

### 4. API Routes (`src/app/api/waitlist/route.ts`)

**Responsabilidade**: Expor endpoints HTTP para interação com a waitlist.

#### `POST /api/waitlist`

Cria uma nova entrada na waitlist.

**Request Body**:

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "company": "Empresa XYZ",
  "position": "CEO"
}
```

**Success Response** (201):

```json
{
  "success": true,
  "message": "Inscrição realizada com sucesso!",
  "id": "507f1f77bcf86cd799439011"
}
```

**Error Responses**:

- **400** - Dados inválidos:

```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": {
    "email": ["Email inválido"]
  }
}
```

- **409** - Email duplicado:

```json
{
  "success": false,
  "message": "Este email já está cadastrado na lista de espera",
  "errors": {
    "email": ["Este email já está cadastrado na lista de espera"]
  }
}
```

- **429** - Rate limit:

```json
{
  "success": false,
  "message": "Muitas requisições. Por favor, tente novamente mais tarde.",
  "rateLimitInfo": {
    "limit": 5,
    "remaining": 0,
    "resetAt": "2025-01-22T12:00:00.000Z"
  }
}
```

#### `GET /api/waitlist`

Lista entradas da waitlist (para uso administrativo).

**Query Parameters**:

- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 50)
- `status` (opcional): Filtrar por status

**Exemplo**:

```
GET /api/waitlist?page=1&limit=20&status=pending
```

**Response** (200):

```json
{
  "entries": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "João Silva",
      "email": "joao@example.com",
      "company": "Empresa XYZ",
      "position": "CEO",
      "status": "pending",
      "createdAt": "2025-01-22T10:00:00.000Z",
      "updatedAt": "2025-01-22T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

**⚠️ Nota**: Este endpoint deve ser protegido com autenticação em produção.

### 5. Frontend (`src/components/waitlist-modal.tsx`)

**Mudanças principais**:

1. **Endpoint atualizado**: `/api/odoo` → `/api/waitlist`
2. **Tratamento de erro 409**: Email duplicado
3. **Mensagens de sucesso atualizadas**

```typescript
// Antes (Odoo)
const response = await fetch("/api/odoo", { ... });
console.log("Lead criado no Odoo:", data.lead_id);

// Depois (MongoDB)
const response = await fetch("/api/waitlist", { ... });
console.log("Entrada criada na waitlist:", data.id);
```

## 🗄️ Schema do Banco de Dados

### Collection: `waitlist_entries`

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "João Silva",
  email: "joao@example.com",  // lowercase, único
  company: "Empresa XYZ",
  position: "CEO",
  tags: ["Waitlist", "Zenith Votuporanga", "Cliente Fundador"],
  source: "website",
  status: "pending",
  createdAt: ISODate("2025-01-22T10:00:00.000Z"),
  updatedAt: ISODate("2025-01-22T10:00:00.000Z"),
  metadata: {
    ip: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    referrer: "https://google.com",
    language: "pt-BR,pt;q=0.9,en-US;q=0.8"
  }
}
```

### Índices

Criados automaticamente na primeira operação:

1. **Email único**: `{ email: 1 }` (unique)

   - Previne duplicatas
   - Otimiza busca por email

2. **Status**: `{ status: 1 }`

   - Otimiza filtros por status

3. **Data de criação**: `{ createdAt: -1 }`

   - Otimiza ordenação cronológica

4. **Composto**: `{ status: 1, createdAt: -1 }`
   - Otimiza queries de analytics

## 🔄 Fluxo de Dados

### Criação de Entrada

```
1. Usuário preenche formulário
   └─> waitlist-modal.tsx
       └─> Validação client-side (Zod)
           └─> POST /api/waitlist
               ├─> Rate limiting (opcional)
               ├─> Validação server-side (Zod)
               └─> waitlistService.createEntry()
                   ├─> Verifica duplicata
                   ├─> Cria documento
                   ├─> Garante índices
                   └─> Retorna ID
```

### Listagem de Entradas

```
GET /api/waitlist?page=1&status=pending
└─> waitlistService.listEntries()
    ├─> Aplica filtros
    ├─> Pagina resultados
    ├─> Ordena por data
    └─> Retorna entries + metadata
```

## 🎯 Boas Práticas Implementadas

### 1. Singleton Pattern

- Uma única conexão MongoDB por aplicação
- Evita múltiplas conexões e memory leaks
- Otimiza performance

### 2. Service Layer Pattern

- Separa lógica de negócios da API
- Facilita testes unitários
- Permite reutilização de código

### 3. Type Safety

- TypeScript em 100% do código
- Tipos bem definidos
- IntelliSense completo

### 4. Error Handling

- Tratamento específico de erros
- Mensagens amigáveis ao usuário
- Logs detalhados para debug

### 5. Validação em Camadas

- **Client-side**: Feedback instantâneo
- **Server-side**: Segurança adicional
- **Database**: Constraints (índices únicos)

### 6. Índices Otimizados

- Email único para integridade
- Índices compostos para queries complexas
- Criação automática na inicialização

### 7. Rate Limiting

- Proteção contra spam
- Configurável via Upstash Redis
- Funciona sem Redis (fallback)

### 8. Metadados Ricos

- IP, User Agent, Referrer
- Útil para analytics
- Rastreabilidade completa

## 🔒 Segurança

### Implementado

- ✅ Validação de entrada com Zod
- ✅ Rate limiting
- ✅ Sanitização de email (lowercase)
- ✅ Índice único (previne duplicatas)
- ✅ Variáveis de ambiente para credenciais
- ✅ Error handling robusto

### Recomendações para Produção

- 🔐 Adicionar autenticação no endpoint GET
- 🔐 Implementar CORS adequado
- 🔐 Configurar IP whitelist no Atlas
- 🔐 Habilitar audit logs
- 🔐 Implementar webhooks para notificações
- 🔐 Adicionar captcha no formulário

## 📊 Monitoramento

### Métricas Importantes

1. **Taxa de conversão**: `converted / total`
2. **Tempo médio de resposta**: Latência da API
3. **Emails duplicados**: Tentativas rejeitadas
4. **Rate limit hits**: Requisições bloqueadas

### Queries Úteis

#### Ver emails duplicados tentados

```javascript
// Verificar logs do servidor
// Erro: "Este email já está cadastrado"
```

#### Top 10 empresas

```javascript
db.waitlist_entries.aggregate([
  { $group: { _id: "$company", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
]);
```

#### Inscrições por dia

```javascript
db.waitlist_entries.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: -1 } },
]);
```

## 🚀 Próximos Passos

### Curto Prazo

- [ ] Adicionar autenticação no endpoint GET
- [ ] Implementar dashboard administrativo
- [ ] Configurar alertas de monitoramento
- [ ] Adicionar testes automatizados

### Médio Prazo

- [ ] Sistema de notificações (email)
- [ ] Exportação de dados (CSV/Excel)
- [ ] Webhooks para integrações
- [ ] Analytics avançado

### Longo Prazo

- [ ] Sistema de CRM completo
- [ ] Automação de marketing
- [ ] Segmentação avançada
- [ ] Machine Learning para scoring

## 📚 Referências

- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Versão**: 1.0.0  
**Data**: 2025-01-22  
**Autor**: Zenith Team
