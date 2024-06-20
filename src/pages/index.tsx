import {
  Box,
  Heading,
  Text,
  TableContainer,
  Table,
  Th,
  Td,
  Thead,
  Tbody,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import type {
  Dealership,
  Kpi,
  Kpidata,
  Option,
  GroupedKpi,
} from "@/typescript/interfaces";
import type { KpiManagerResponse } from "@pages/api/kpi-manager";
import Select from "react-select";
import {
  generateRandomColor,
  getReactSelectOptionsFromDealerships,
  getReactSelectOptionsFromKpis,
} from "@utils/helper";
import { useTable } from "react-table";
import { getReactSelectOptionsFromGroupedKpis } from "@utils/helper";
import {
  Chart,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  PointElement,
  ChartData,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { kpis } from "../data/kpis";

Chart.register(
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
);

const Home = () => {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [kpiData, setKpiData] = useState<Kpidata[]>([]);
  const [groupedKpis, setGroupedKpis] = useState<GroupedKpi>({
    totals: [],
    customerPay: [],
    internal: [],
    warranty: [],
    expense: [],
    sublet: [],
    other: [],
  });
  const [selectedDealerships, setSelectedDealerships] = useState<Option[]>([]);
  const [selectedKpis, setSelectedKpis] = useState<Option[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Option>();

  const kpiManagerApi = "/api/kpi-manager";

  useEffect(() => {
    // fetch kpi-manager
    fetch(kpiManagerApi)
      .then((response) => response.json())
      .then((data: KpiManagerResponse) => {
        const { dealerships, groupedKpis, kpiData, allKpis } = data;

        setDealerships(dealerships);
        setKpis(allKpis);
        setKpiData(kpiData);
        setGroupedKpis(groupedKpis);
      });
  }, []);

  const columns = useMemo(() => {
    const columns = [
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
  }, [selectedDealerships, selectedKpis, kpiData]);

  const data = useMemo(() => {
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  useEffect(() => {
    console.log("selected group", selectedGroup);
    console.log("grouped kpis", groupedKpis);
  }, [selectedGroup]);

  const chartData = useMemo<ChartData<"bar">>(() => {
    if (!selectedGroup) {
      return { labels: [], datasets: [] };
    }

    // Get the KPIs for the selected group
    const selectedKpis = groupedKpis[selectedGroup.value as keyof GroupedKpi];
    console.log("selected kpis", selectedKpis);

    // Labels are the names of the KPIs
    const labels = selectedKpis.map((kpi) => kpi.name);

    const datasets = selectedDealerships.map((dealership) => {
      const data = selectedKpis.map((kpi) => {
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
        borderColor: generateRandomColor(),
      };
    });

    return {
      labels,
      datasets,
    };
  }, [groupedKpis, kpiData, selectedGroup, selectedDealerships]);

  return (
    <Box>
      <Heading>Quotus Technical</Heading>
      <Text as="b">{introductionMessage}</Text>
      {/* Dealership Selector */}
      {/* Kpi Selector */}
      {kpis.length > 0 && (
        <Select
          isMulti
          isClearable
          options={getReactSelectOptionsFromKpis(kpis)}
          onChange={(selectedOptions) => {
            setSelectedKpis(selectedOptions as Option[]);
          }}
          value={selectedKpis}
          placeholder="Select KPIs"
        />
      )}
      {dealerships.length > 0 && (
        <Select
          isMulti
          isClearable
          options={getReactSelectOptionsFromDealerships(dealerships)}
          onChange={(selectedOptions) => {
            setSelectedDealerships(selectedOptions as Option[]);
          }}
          value={selectedDealerships}
          placeholder="Select Dealerships"
        />
      )}
      {/* Table */}
      {data.length > 0 && columns.length > 0 && (
        <TableContainer>
          <Table {...getTableProps()}>
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={`${headerGroup.id}-${index}`}
                >
                  {headerGroup.headers.map((column) => (
                    <Th {...column.getHeaderProps()} key={column.id}>
                      {column.render("Header")}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render("Cell")}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {data.length > 0 && columns.length > 0 && (
        <Select
          options={getReactSelectOptionsFromGroupedKpis(groupedKpis)}
          onChange={(selectedOption) => {
            setSelectedGroup(selectedOption as Option);
          }}
          placeholder="Select Kpi Group"
          value={selectedGroup}
        />
      )}
      {selectedGroup && (
        <Box h="300px">
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Home;

const introductionMessage = `
Welcome to the Quotus Technical test. This is a simple application that fetches data from an API and displays it on the screen. 
Modify the pages/index.tsx file to see the changes reflected on the screen. You must fetch the data from the API and distribute it to the components in the JSX. The components are waiting for their options and setters.
Once you have provided the data to the components, you will see the data displayed on the screen. You can now style the page as you see fit. You have total freedom over the styling of the page. You can also use the Chakra UI components that are already installed in the project.
Other than fetching and basic coding style, creativity is the main focus of this test. Good luck!
`;
