function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return value;
}

export const otpConfig = {
    accessToken: requireEnv("WHATSAPP_ACCESS_TOKEN"),
    phoneNumberId: requireEnv("WHATSAPP_PHONE_NUMBER_ID"),
    templateName: requireEnv("WHATSAPP_TEMPLATE_NAME"),
    templateLanguage: requireEnv("WHATSAPP_TEMPLATE_LANGUAGE"),
    graphVersion: requireEnv("WHATSAPP_GRAPH_VERSION"),
} as const;