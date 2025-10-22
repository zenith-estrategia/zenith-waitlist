import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getClientIp,
  isRateLimitConfigured,
  waitlistRateLimit,
} from "@/lib/rate-limit";
import { waitlistFormSchema } from "@/lib/validations/waitlist";
import { waitlistService } from "@/lib/mongodb-service";
import type { WaitlistCreationResponse } from "@/types/mongodb";

/**
 * Schema de validação das variáveis de ambiente
 */
const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI não pode estar vazio"),
  MONGODB_DB_NAME: z.string().optional(),
});

/**
 * POST /api/waitlist
 * Endpoint para criar entradas na waitlist usando MongoDB Atlas
 * Inclui rate limiting e validação com Zod
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting (se configurado)
    if (isRateLimitConfigured() && waitlistRateLimit) {
      const ip = getClientIp(request);
      const { success, limit, reset, remaining } =
        await waitlistRateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Muitas requisições. Por favor, tente novamente mais tarde.",
            rateLimitInfo: {
              limit,
              remaining,
              resetAt: new Date(reset).toISOString(),
            },
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    // 2. Validação das variáveis de ambiente
    const envValidation = envSchema.safeParse({
      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    });

    if (!envValidation.success) {
      console.error(
        "Erro de configuração MongoDB:",
        envValidation.error.format()
      );
      return NextResponse.json(
        {
          success: false,
          message: "Erro de configuração do servidor",
          errors: envValidation.error.flatten().fieldErrors,
        },
        { status: 500 }
      );
    }

    // 3. Validação dos dados do formulário
    const body = await request.json();
    const validation = waitlistFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados inválidos",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, name, company, position } = validation.data;

    // 4. Coletar metadados da requisição (opcional)
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;
    const referrer = request.headers.get("referer") || undefined;
    const acceptLanguage = request.headers.get("accept-language") || undefined;

    // 5. Criar entrada na waitlist
    try {
      const entryId = await waitlistService.createEntry({
        name,
        email,
        company,
        position,
        metadata: {
          ip,
          userAgent,
          referrer,
          language: acceptLanguage,
        },
      });

      // 6. Retornar sucesso
      const response: WaitlistCreationResponse = {
        success: true,
        message: "Inscrição realizada com sucesso!",
        id: entryId.toString(),
      };

      console.log(
        `✅ Entrada criada na waitlist - ID: ${entryId}, Email: ${email}`
      );

      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      // Tratamento de erro específico para email duplicado
      if (
        error instanceof Error &&
        error.message.includes("já está cadastrado")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
            errors: {
              email: ["Este email já está cadastrado na lista de espera"],
            },
          },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    // Tratamento de erros
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Corpo da requisição inválido",
          error: "JSON malformado",
        },
        { status: 400 }
      );
    }

    console.error("Erro ao criar entrada na waitlist:", error);

    // Retorna erro mais amigável ao usuário
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar sua inscrição. Tente novamente.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist
 * Endpoint para listar entradas da waitlist (opcional - para admin)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Adicionar autenticação para proteger este endpoint
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const status = searchParams.get("status") as
      | "pending"
      | "contacted"
      | "converted"
      | "declined"
      | null;

    const result = await waitlistService.listEntries({
      page,
      limit,
      status: status || undefined,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar entradas da waitlist:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar entradas da waitlist",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
