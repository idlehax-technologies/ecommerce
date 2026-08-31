export type OtpCode = {
    phone: string;
    code: string;
};

export type OtpRequestDto = {
    phone: string;
};

export type OtpVerifyDto = OtpCode;