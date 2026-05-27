export type UserProfile = {
    userId: string;
    fullName: string;
    phone: string;
    email: string;
    addressText: string;
    createdAt: string;
    updatedAt: string;
};

export type ProfileDTO = {
    fullName: string;
    email: string;
    addressText: string;
};