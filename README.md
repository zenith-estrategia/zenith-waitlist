This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎯 Zenith Waitlist

Aplicação de waitlist moderna com MongoDB Atlas para captura e gerenciamento de leads.

### ✨ Funcionalidades

- ✅ Formulário de waitlist validado com Zod
- ✅ Armazenamento em MongoDB Atlas
- ✅ Rate limiting (proteção contra spam)
- ✅ Interface moderna e responsiva
- ✅ Suporte a múltiplos idiomas (PT/EN)
- ✅ Validação de emails duplicados
- ✅ Sistema de tags e categorização
- ✅ Índices otimizados para performance
- ✅ API RESTful para gerenciamento de leads

### ⚠️ Configuração Necessária

Antes de começar, configure o MongoDB Atlas:

1. **Configure as variáveis de ambiente:**

   ```bash
   # Copie o arquivo .env.example para .env.local
   cp .env.example .env.local

   # Edite .env.local com suas credenciais
   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=zenith_waitlist
   ```

2. **Consulte o guia completo:** [MONGODB_SETUP.md](./MONGODB_SETUP.md)

## Getting Started

First, configure your environment variables (see `MONGODB_SETUP.md`), then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
