import { type NextRequest, NextResponse } from "next/server";
import type {
  RDStationEventRequest,
  RDStationEventResponse,
} from "@/types/rdstation";
import { z } from "zod";

const formDataSchema = z.object({
  email: z
    .string({ message: "Email deve ser uma string" })
    .email("Email inválido")
    .min(1, "Email não pode estar vazio"),
  name: z
    .string({ message: "Nome deve ser uma string" })
    .min(1, "Nome não pode estar vazio")
    .optional(),
  phone: z
    .string({ message: "Telefone deve ser uma string" })
    .min(1, "Telefone não pode estar vazio")
    .optional(),
});

const envSchema = z.object({
  RDSTATION_ACCESS_TOKEN: z
    .string({ message: "RDSTATION_ACCESS_TOKEN não configurado" })
    .min(1, "RDSTATION_ACCESS_TOKEN não pode estar vazio"),
  RDSTATION_CONVERSION_IDENTIFIER: z
    .string()
    .default("waitlist-56d72e81421d39240aa9"),
});

export async function POST(request: NextRequest) {
  try {
    const envValidation = envSchema.safeParse({
      RDSTATION_ACCESS_TOKEN: process.env.RDSTATION_ACCESS_TOKEN,
      RDSTATION_CONVERSION_IDENTIFIER:
        process.env.RDSTATION_CONVERSION_IDENTIFIER,
    });

    if (!envValidation.success) {
      console.error("Erro de configuração:", envValidation.error.format());
      return NextResponse.json(
        {
          message: "Erro de configuração do servidor",
          errors: envValidation.error.flatten().fieldErrors,
        },
        { status: 500 }
      );
    }

    const { RDSTATION_ACCESS_TOKEN, RDSTATION_CONVERSION_IDENTIFIER } =
      envValidation.data;

    const body = await request.json();
    const validation = formDataSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, name, phone } = validation.data;

    const rdstationPayload: RDStationEventRequest = {
      event_type: "CONVERSION",
      event_family: "CDP",
      payload: {
        conversion_identifier: RDSTATION_CONVERSION_IDENTIFIER,
        email: email,
        ...(name && { name }),
        ...(phone && { personal_phone: phone }),
      },
    };

    const response = await fetch(
      "https://api.rd.services/platform/events?event_type=conversion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RDSTATION_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(rdstationPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao enviar para RD Station:", errorData);

      return NextResponse.json(
        {
          message: "Erro ao enviar dados para RD Station",
          error: errorData,
        },
        { status: response.status }
      );
    }

    const data: RDStationEventResponse = await response.json();

    return NextResponse.json(
      {
        message: "Conversão enviada com sucesso",
        event_uuid: data.event_uuid,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: "Corpo da requisição inválido",
          error: "JSON malformado",
        },
        { status: 400 }
      );
    }

    console.error("Erro interno:", error);

    return NextResponse.json(
      {
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
