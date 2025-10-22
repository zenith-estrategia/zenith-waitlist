export const logger = {
  info: (message: string, data?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      console.log(message, data);
    }
    // Em produção, enviar para serviço de logs (Datadog, Sentry, etc.)
  },
  error: (message: string, error?: unknown) => {
    console.error(message, error);
    // Em produção, enviar para Sentry ou similar
  },
};
