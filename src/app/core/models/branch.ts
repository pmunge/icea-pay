export interface Branches {
    id?: number;
    name: string;
    code: string;
    manager: string;
    county: string;
    town: string;
    phone: string;
    status: 'Active' | 'Inactive';
}
