export interface Permissions {
    id?: string;
    permission: string;
    roleId: string;
    /** Role name, when returned directly by the API for display. */
    role?: string;
}
