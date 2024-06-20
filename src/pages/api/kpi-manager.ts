// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { kpis } from '@/data/kpis'
import { dealerships } from '@/data/dealerships'
import type { Dealership, GroupedKpi, Kpidata, Kpi } from '@/typescript/interfaces';
import { generateKpiData } from '@utils/helper';

export type KpiManagerResponse = {
    dealerships: Dealership[];
    allKpis: Kpi[];
    groupedKpis: GroupedKpi;
    kpiData: Kpidata[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiManagerResponse>
) {

  const allKpis = kpis.totals.concat(kpis.customerPay, kpis.internal, kpis.warranty, kpis.expense, kpis.sublet, kpis.other);

  const kpiData = generateKpiData(dealerships, allKpis);

  res.status(200).json({ dealerships, groupedKpis: kpis, kpiData, allKpis })
}
