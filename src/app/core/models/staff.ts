export interface StaffRegisterRequest {
    username: string;
    firstName: string;
    middleName?: string;
    surName: string;
    email: string;
    /** ID of the access profile to assign. The API resolves its roles and permissions. */
    profileId: number;
    phoneNumber?: string;
    idNumber?: string;
    county?: string;
    branchId?: number;
    businessLineId?: number;
    countryCode?: string;
}

export interface Staff {
    id: string;
    username: string;
    firstName: string;
    surName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    status: string;
    emailVerified: boolean;
    mustChangePassword: boolean;
    branchId?: number;
    createdAt: string;
}
