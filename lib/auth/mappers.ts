export const mapOtpRequest = (dto: { phone: string }) => ({
    phone: dto.phone.trim(),
});

export const mapOtpVerify = (dto: { phone: string; code: string }) => ({
    phone: dto.phone.trim(),
    code: dto.code.trim(),
});
