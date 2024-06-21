import { useMemo } from 'react';
import { useTable, Column } from 'react-table';
import { Option, KpiData } from '@/typescript/interfaces';

interface TableConfigProps {
  selectedDealerships: Option[];
  selectedKpis: Option[];
  kpiData: KpiData[];
}

export const useTableConfig = ({ selectedDealerships, selectedKpis, kpiData }: TableConfigProps) => {
  const tableColumns = useMemo<Column<Record<string, string | number>>[]>(() => {
    const columns: Column<Record<string, string | number>>[] = [
      {
        Header: "Kpi",
        accessor: "kpiId",
      },
      // Every selected dealership will have a column
      ...selectedDealerships.map((dealership) => {
        return {
          Header: dealership?.label,
          accessor: dealership?.value,
        };
      }),
    ];
    return columns;
  }, [selectedDealerships]);

  const tableData = useMemo(() => {
    // Create a row for each kpi
    return selectedKpis.map((kpi) => {
      const rowData: Record<string, string | number> = {
        kpiId: kpi?.label,
      };

      // Add the value for each dealership
      selectedDealerships.forEach((dealership) => {
        const kpiDataForDealer = kpiData.find(
          (data) =>
            data.dealerCode === dealership.value && data.kpiId === kpi.value,
        );
        rowData[dealership.value] = kpiDataForDealer?.value ?? 0;
      });
      return rowData;
    });
  }, [selectedDealerships, selectedKpis, kpiData]);

  return useTable({ columns: tableColumns, data: tableData });
};
