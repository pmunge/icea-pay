export interface Branches {
    id?: number;
    name: string;
    code: string;
    location: string;
    phoneNumber?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/** URL-safe slug for a branch dashboard route, e.g. "Nakuru" -> "nakuru". */
export function slugify(name: string): string {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
