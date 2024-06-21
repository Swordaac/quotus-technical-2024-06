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

export interface GroupedKpi {
    [key: string]: Kpi[];
}

export interface KpiData {
    dealerCode: string;
    kpiId: string;
    value: number;
}

export interface Option {
    value: string;
    label: string;
}