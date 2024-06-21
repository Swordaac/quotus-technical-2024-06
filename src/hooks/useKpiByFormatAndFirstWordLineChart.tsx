import { useMemo } from 'react';
import { ChartData } from 'chart.js';
import { Option, KpiData, GroupedKpi } from '@/typescript/interfaces'; 
import { generateRandomColor } from '@utils/helper'; 

interface LineChartDataProps {
  groupedByFormatAndFirstWord: GroupedKpi;
  kpiData: KpiData[];
  selectedKpiFormatAndFirstWordGroup: Option | null | undefined;
  selectedDealerships: Option[];
}

export const useKpiByFormatAndFirstWordLineChart = ({
  groupedByFormatAndFirstWord,
  kpiData,
  selectedKpiFormatAndFirstWordGroup,
  selectedDealerships,
}: LineChartDataProps): ChartData<'line'> => {
  return useMemo<ChartData<'line'>>(() => {
    if (!selectedKpiFormatAndFirstWordGroup || !selectedKpiFormatAndFirstWordGroup.value) {
      return { labels: [], datasets: [] };
    }

    // Get the KPIs for the selected group
    const groupKpis =
      groupedByFormatAndFirstWord[selectedKpiFormatAndFirstWordGroup.value];

    // The labels are the names of the dealerships
    const labels = selectedDealerships.map((dealership) => dealership.label);

    const datasets = groupKpis.map((kpi) => {
      const data = selectedDealerships.map((dealership) => {
        const kpiDataForDealer = kpiData.find(
          (data) =>
            data.dealerCode === dealership.value && data.kpiId === kpi.id,
        );
        return kpiDataForDealer?.value ?? 0;
      });

      return {
        label: kpi.name,
        data,
        fill: true,
        backgroundColor: generateRandomColor(),
        showLine: false,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [
    groupedByFormatAndFirstWord,
    kpiData,
    selectedKpiFormatAndFirstWordGroup,
    selectedDealerships,
  ]);
};
