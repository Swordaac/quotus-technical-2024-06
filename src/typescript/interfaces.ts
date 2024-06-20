export interface Dealership {
    name: string;
    dealerCode: string;
    brand: string | null;
    province: string;
    country: string;
}

export interface Kpi {
    id: string;
    name: string;
    format: string;
}