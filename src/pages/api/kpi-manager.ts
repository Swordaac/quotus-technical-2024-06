// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { kpis } from '@/data/kpis'
import { dealerships } from '@/data/dealerships'
import type { Dealership, KpiData, Kpi, GroupedKpi } from '@/typescript/interfaces';
import { generateKpiData, groupKpisByFormat, groupKpisByFormatAndThePresenceOfTheSameFirstWordInTheNameAndTheSameFormat } from '@utils/helper';

export type KpiManagerResponse = {
    dealerships: Dealership[];
    allKpis: Kpi[];
    groupedByFormatKpis: GroupedKpi;
    groupedByFormatAndFirstWordKpis: GroupedKpi;
    kpiData: KpiData[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiManagerResponse>
) {

  const kpiData = generateKpiData(dealerships, kpis);
  const groupedByFormatKpis = groupKpisByFormat(kpis);
  const groupedByFormatAndFirstWordKpis = groupKpisByFormatAndThePresenceOfTheSameFirstWordInTheNameAndTheSameFormat(kpis);

  res.status(200).json({ dealerships, kpiData, allKpis: kpis, groupedByFormatKpis, groupedByFormatAndFirstWordKpis })
}
