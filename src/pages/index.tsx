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
import type { Dealership, Kpi, KpiData, Option } from "@/typescript/interfaces";
import type { KpiManagerResponse } from "@pages/api/kpi-manager";
import Select from "react-select";
import {
  generateRandomColor,
  getReactSelectOptionsFromDealerships,
  getReactSelectOptionsFromKpis,
} from "@utils/helper";
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
import { useTableConfig } from "@hooks/useKpiTableConfig";
import { useKpiByFormatBarChart } from "@/hooks/useKpiByFormatBarChart";

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
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [groupedByFormat, setGroupedbyFormatKpis] = useState<
    Record<string, Kpi[]>
  >({});
  const [groupedByFormatAndFirstWord, setGroupedbyFormatAndFirstWordKpis] =
    useState<Record<string, Kpi[]>>({});
  const [selectedDealerships, setSelectedDealerships] = useState<Option[]>([]);
  const [selectedKpis, setSelectedKpis] = useState<Option[]>([]);
  const [selectedKpiFormatGroup, setSelectedKpiFormatGroup] =
    useState<Option>();
  const [
    selectedKpiFormatAndFirstWordGroup,
    setSelectedKpiFormatAndFirstWordGroup,
  ] = useState<Option>();

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
          groupedByFormatAndFirstWordKpis,
        } = data;
        setDealerships(dealerships);
        setKpis(allKpis);
        setKpiData(kpiData);
        setGroupedbyFormatKpis(groupedKpis);
        setGroupedbyFormatAndFirstWordKpis(groupedByFormatAndFirstWordKpis);
      });
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTableConfig({ selectedDealerships, selectedKpis, kpiData });

  const barChartData = useKpiByFormatBarChart({
    groupedByFormat,
    kpiData,
    selectedKpiFormatGroup,
    selectedDealerships,
  });

  const lineChartData = useMemo<ChartData<"line">>(() => {
    if (!selectedKpiFormatAndFirstWordGroup) {
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
            <Link href="/">Dashboard</Link>
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

        {/* Kpi Table */}
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

        {/* Kpi Group by format Selector */}
        <Select
          options={getReactSelectOptionsFromGroupedKpis(groupedByFormat)}
          onChange={(selectedOption) => {
            setSelectedKpiFormatGroup(selectedOption as Option);
          }}
          placeholder="Select Kpi By Format Group"
          value={selectedKpiFormatGroup}
        />

        {/* Bar Chart */}
        <Box
          h="300px"
          w={`calc(100vw - ${sidenavWidth})`}
          transition={sidenavTransition}
        >
          <Bar
            data={barChartData}
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

        {/* Kpi by format and first word selector */}
        <Select
          options={getReactSelectOptionsFromGroupedKpis(
            groupedByFormatAndFirstWord,
          )}
          onChange={(selectedOption) => {
            setSelectedKpiFormatAndFirstWordGroup(selectedOption as Option);
          }}
          placeholder="Select Kpi By Format And First Word Group (Its just a way to classify I know its weird)"
          value={selectedKpiFormatAndFirstWordGroup}
        />

        {/* Line Chart */}
        <Box
          h="300px"
          w={`calc(100vw - ${sidenavWidth})`}
          transition={sidenavTransition}
        >
          <Line
            data={lineChartData}
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
