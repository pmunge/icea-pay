/** A profile bucket of roles, as returned by GET/POST /profiles. */
export interface Profile {
    id?: number;
    name: string;
    description: string;
    status: string;
    roles: string[];
}

/** Status values a profile can be created/edited with. */
export const PROFILE_STATUSES = ['Active', 'Inactive'] as const;
