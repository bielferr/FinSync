import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["user", "admin"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
