import posthog from "posthog-js";

export const logger = {
  info: (message: string, data?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      posthog.capture("logger_info", { message, data });
    }
  },
  error: (message: string, error?: unknown) => {
    posthog.capture("logger_error", { message, error });
  },
};
