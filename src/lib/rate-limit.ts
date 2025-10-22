import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Configuração de rate limiting usando Upstash
 * Limita requisições por IP para prevenir abuso
 */

// Verifica se as variáveis de ambiente estão configuradas
const isRateLimitEnabled =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Cliente Redis (opcional se não configurado)
const redis = isRateLimitEnabled
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  : null;

/**
 * Rate limiter para o endpoint de waitlist
 * - 3 requisições por 60 segundos por IP
 * - Sliding window para distribuição mais justa
 */
export const waitlistRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      analytics: true,
      prefix: "ratelimit:waitlist",
    })
  : null;

/**
 * Verifica se o rate limiting está habilitado
 */
export const isRateLimitConfigured = (): boolean => {
  return !!isRateLimitEnabled;
};

/**
 * Extrai o IP do request
 * Suporta tanto Vercel quanto outros ambientes
 */
export const getClientIp = (request: Request): string => {
  // Tenta headers do Vercel primeiro
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // Fallback para outros headers
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Último fallback
  return "unknown";
};
