export interface Roles {
    id? : string;
    role: string;
}

/** A role allowed in the system, as returned by GET /staff/roles. */
export interface RoleEntity {
    id: number;
    name: string;
    description?: string;
    rules?: string;
    resourceId?: number;
    status?: string;
}