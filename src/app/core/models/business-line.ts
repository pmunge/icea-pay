/** A business line, as returned by GET /business-lines. */
export interface BusinessLine {
    id: number;
    code: string;
    name: string;
    description?: string;
    displayOrder?: number;
    createdAt?: string;
    updatedAt?: string;
}
