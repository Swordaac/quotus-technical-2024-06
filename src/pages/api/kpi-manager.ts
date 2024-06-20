// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { kpis } from '@/data/kpis'
import { dealerships } from '@/data/dealerships'
import type { Kpi, Dealership, GroupedKpi } from '@/typescript/interfaces';

export type KpiManagerResponse = {
    dealerships: Dealership[];
    kpis: GroupedKpi;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<KpiManagerResponse>
) {
  res.status(200).json({ dealerships, kpis })
}
