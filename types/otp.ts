export type OtpRequestDto = {
    phone: string;
};

export type OtpVerifyDto = {
    phone: string;
    code: string;
};
