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
  VStack,
  useDisclosure,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import Image from "next/image";
import type { Dealership, Kpi, Kpidata, Option } from "@/typescript/interfaces";
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
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

Chart.register(
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Filler,
);

const Home = () => {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [kpiData, setKpiData] = useState<Kpidata[]>([]);
  const [groupedKpis, setGroupedKpis] = useState<Record<string, Kpi[]>>({});
  const [selectedDealerships, setSelectedDealerships] = useState<Option[]>([]);
  const [selectedKpis, setSelectedKpis] = useState<Option[]>([]);
  const [selectedKpiFormatGroup, setSelectedKpiFormatGroup] =
    useState<Option>();

  const { isOpen, onToggle } = useDisclosure();

  const kpiManagerApi = "/api/kpi-manager";

  useEffect(() => {
    // fetch kpi-manager
    fetch(kpiManagerApi)
      .then((response) => response.json())
      .then((data: KpiManagerResponse) => {
        const {
          dealerships,
          groupedByFormatKpis: groupedKpis,
          kpiData,
          allKpis,
        } = data;
        setDealerships(dealerships);
        setKpis(allKpis);
        setKpiData(kpiData);
        setGroupedKpis(groupedKpis);
      });
  }, []);

  const tableColumns = useMemo(() => {
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: tableColumns, data: tableData });

  const chartData = useMemo<ChartData<"bar">>(() => {
    if (!selectedKpiFormatGroup) {
      return { labels: [], datasets: [] };
    }

    // Get the KPIs for the selected group
    const selectedKpis = groupedKpis[selectedKpiFormatGroup.value];
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
  }, [groupedKpis, kpiData, selectedKpiFormatGroup, selectedDealerships]);

  const sidenavWidth = isOpen ? "250px" : "0";
  const sidenavTransition = "width 0.3s";
  return (
    <Box display="flex" height="100vh">
      {/* Sidenav */}
      <Box
        width={sidenavWidth}
        transition={sidenavTransition}
        overflow="hidden"
      >
        <Box p="4" bg="gray.100" height="100%">
          <Heading size="md" mb="4">
            Menu
          </Heading>
          <VStack align="start">
            <Link href="/">Home</Link>
          </VStack>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flex="1" p="4">
        <HStack>
          <IconButton
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            onClick={onToggle}
            aria-label="Toggle Sidebar"
          />
          <Heading>Quotus Technical</Heading>
        </HStack>
        <Text as="b">{introductionMessage}</Text>

        {/* KPI Selector */}

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

        {/* Dealership Selector */}

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

        {/* Table */}

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

        {/* Kpi Group Selector */}
        <Select
          options={getReactSelectOptionsFromGroupedKpis(groupedKpis)}
          onChange={(selectedOption) => {
            setSelectedKpiFormatGroup(selectedOption as Option);
          }}
          placeholder="Select Kpi Group"
          value={selectedKpiFormatGroup}
        />

        {/* Chart */}
        <Box
          h="300px"
          w={`calc(100vw - ${sidenavWidth})`}
          transition={"width 0.3s"}
        >
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
      </Box>
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
