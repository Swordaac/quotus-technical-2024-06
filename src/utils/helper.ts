import type { Kpidata, Dealership, Kpi } from "@/typescript/interfaces";

export const generateKpiData = (dealerships: Dealership[], kpis: Kpi[]): Kpidata[] => {
    const kpiData: Kpidata[] = [];
    dealerships.forEach((dealer) => {
        kpis.forEach((kpi) => {
            let value: number = 0;
            switch (kpi.format) {
                case "currency":
                    value = Math.floor(Math.random() * 100000);
                    break;
                case "percentage":
                    value = Math.random();
                    break;
                case "number":
                    value = Math.floor(Math.random() * 100);
                    break;
            }
            kpiData.push({ dealerCode: dealer.dealerCode, kpiId: kpi.id, value });
        });
    });
    return kpiData;
}

export const getReactSelectOptionsFromDealerships = (dealerships: Dealership[]) => {
    return dealerships.map((dealer) => {
        return { value: dealer.dealerCode, label: dealer.name }
    });
}

export const getReactSelectOptionsFromKpis = (kpis: Kpi[]) => {
    return kpis.map((kpi) => {
        return { value: kpi.id, label: kpi.name }
    });
}