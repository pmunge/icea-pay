export interface Members {
    id?: number;
    memberNo: string;
    firstName: string;
    otherNames?: string;
    nationalId?: string;
    phoneNumber?: string;
    email?: string;
    photoUrl?: string;
    role?: string;
    branchId?: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

/** Members belonging to a specific branch. */
export function membersInBranch(members: Members[], branchId: number | null): Members[] {
    return branchId == null ? [] : members.filter(member => member.branchId === branchId);
}
