import { z } from "zod";

/**
 * Schema de validação do formulário de waitlist
 * Usado tanto no cliente quanto no servidor
 */
export const waitlistFormSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  email: z
    .string({ message: "Email é obrigatório" })
    .email("Email inválido")
    .min(1, "Email não pode estar vazio")
    .max(255, "Email muito longo")
    .trim()
    .toLowerCase(),
  company: z
    .string({ message: "Empresa é obrigatória" })
    .min(1, "Nome da empresa não pode estar vazio")
    .max(100, "Nome da empresa deve ter no máximo 100 caracteres")
    .trim(),
  position: z
    .string({ message: "Cargo é obrigatório" })
    .min(1, "Cargo não pode estar vazio")
    .max(100, "Cargo deve ter no máximo 100 caracteres")
    .trim(),
});

/**
 * Tipo inferido do schema de validação
 */
export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;
