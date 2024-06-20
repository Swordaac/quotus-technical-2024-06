import {
  Box,
  Heading,
  Text,
  TableContainer,
  Table,
  Th,
  Td,
  Thead,
  Tab,
  Tbody,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import type { Dealership, Kpi, Kpidata, Option } from "@/typescript/interfaces";
import type { KpiManagerResponse } from "@pages/api/kpi-manager";
import Select from "react-select";
import {
  getReactSelectOptionsFromDealerships,
  getReactSelectOptionsFromKpis,
} from "@utils/helper";
import { useTable } from "react-table";

const Home = () => {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [kpiData, setKpiData] = useState<Kpidata[]>([]);
  const [selectedDealerships, setSelectedDealerships] = useState<Dealership[]>(
    [],
  );
  const [selectedKpis, setSelectedKpis] = useState<Kpi[]>([]);

  const kpiManagerApi = "/api/kpi-manager";

  useEffect(() => {
    // fetch kpi-manager
    fetch(kpiManagerApi)
      .then((response) => response.json())
      .then((data: KpiManagerResponse) => {
        const { dealerships, kpis, kpiData } = data;
        const allKpis = kpis.totals.concat(
          kpis.customerPay,
          kpis.internal,
          kpis.warranty,
          kpis.expense,
          kpis.sublet,
          kpis.other,
        );
        setDealerships(dealerships);
        setKpis(allKpis);
        setKpiData(kpiData);
      });
  }, []);

  const handleDealerChange = (selectedOptions: Option[]) => {
    const selectedDealerships = selectedOptions.map((option) =>
      dealerships.find((dealership) => dealership.dealerCode === option.value),
    ) as Dealership[];
    setSelectedDealerships(selectedDealerships);
  };

  const handleKpiChange = (selectedOptions: Option[]) => {
    const selectedKpis = selectedOptions.map((option) =>
      kpis.find((kpi) => kpi.id === option.value),
    ) as Kpi[];
    setSelectedKpis(selectedKpis);
  };

  const columns = useMemo(() => {
    const columns = [
      {
        Header: "Kpi",
        accessor: "kpiId",
      },
      // Every selected dealership will have a column
      ...selectedDealerships.map((dealership) => {
        return {
          Header: dealership.name,
          accessor: dealership.dealerCode,
        };
      }),
    ];
    return columns;
  }, [selectedDealerships, selectedKpis, kpiData]);

  const data = useMemo(() => {
    // Create a row for each kpi
    return selectedKpis.map((kpi) => {
      const rowData: Record<string, number> = {};

      // Add the value for each dealership
      selectedDealerships.forEach((dealership) => {
        const kpiDataForDealer = kpiData.find(
          (data) =>
            data.dealerCode === dealership.dealerCode && data.kpiId === kpi.id,
        );
        rowData[dealership.dealerCode] = kpiDataForDealer?.value ?? 0;
      });
      return rowData;
    });
  }, [selectedDealerships, selectedKpis, kpiData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Box>
      <Heading>Quotus Technical</Heading>
      <Text as="b">{introductionMessage}</Text>
      {/* Dealership Selector */}
      {dealerships.length > 0 && (
        <Select
          isMulti
          isClearable
          options={getReactSelectOptionsFromDealerships(dealerships)}
          onChange={() => handleDealerChange}
        />
      )}
      {/* Kpi Selector */}
      {kpis.length > 0 && (
        <Select
          isMulti
          isClearable
          options={getReactSelectOptionsFromKpis(kpis)}
          onChange={() => handleKpiChange}
        />
      )}
      {/* Table */}
      <TableContainer>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tab {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
                ))}
              </Tab>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  ))}
                </tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
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
