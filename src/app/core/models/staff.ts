export interface StaffRegisterRequest {
    username: string;
    firstName: string;
    middleName?: string;
    surName: string;
    email: string;
    role: string;
    phoneNumber?: string;
    idNumber?: string;
    county?: string;
    branchId?: number;
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
