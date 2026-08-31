import { otpConfig } from "./config";

export function buildOtpTemplate(
    code: string
) {
    return {
        messaging_product: "whatsapp",
        type: "template",
        template: {
            name: otpConfig.templateName,
            language: {
                code: otpConfig.templateLanguage,
            },
            components: [
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: code,
                        },
                        {
                            type: "text",
                            text: "everyShop Login",
                        },
                    ],
                },
                {
                    type: "button",
                    sub_type: "url",
                    index: "0",
                    parameters: [
                        {
                            type: "text",
                            text: code,
                        },
                    ],
                },
            ],
        },
    };
}