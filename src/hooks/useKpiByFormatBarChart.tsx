import { useMemo } from 'react';
import { ChartData } from 'chart.js';
import { Option, KpiData, GroupedKpi } from '@/typescript/interfaces';
import { generateRandomColor } from '@utils/helper';

interface BarChartDataProps {
  groupedByFormat: GroupedKpi;
  kpiData: KpiData[];
  selectedKpiFormatGroup: Option | null | undefined;
  selectedDealerships: Option[];
}

export const useKpiByFormatBarChart = ({
  groupedByFormat,
  kpiData,
  selectedKpiFormatGroup,
  selectedDealerships,
}: BarChartDataProps): ChartData<'bar'> => {
  return useMemo<ChartData<'bar'>>(() => {
    if (!selectedKpiFormatGroup || !selectedKpiFormatGroup.value) {
      return { labels: [], datasets: [] };
    }

    // Get the KPIs for the selected group
    const groupKpis = groupedByFormat[selectedKpiFormatGroup.value];

    // Labels are the names of the KPIs
    const labels = groupKpis.map((kpi) => kpi.name);

    const datasets = selectedDealerships.map((dealership) => {
      const data = groupKpis.map((kpi) => {
        const kpiDataForDealer = kpiData.find(
          (data) =>
            data.dealerCode === dealership.value && data.kpiId === kpi.id,
        );
        return kpiDataForDealer?.value ?? 0;
      });
      return {
        label: dealership.label,
        data,
        fill: true,
        backgroundColor: generateRandomColor(),
      };
    });

    return {
      labels,
      datasets,
    };
  }, [groupedByFormat, kpiData, selectedKpiFormatGroup, selectedDealerships]);
};
