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
  HStack,
  IconButton,
  Link, Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip as TooltipCha,
  Avatar, Button
} from "@chakra-ui/react";
import NoSSR from "react-no-ssr";
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import type { Dealership, Kpi, KpiData, Option } from "@/typescript/interfaces";
import type { KpiManagerResponse } from "@pages/api/kpi-manager";
import Select from "react-select";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import {
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
  BarElement,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useTableConfig } from "@hooks/useKpiTableConfig";
import { useKpiByFormatBarChart } from "@/hooks/useKpiByFormatBarChart";
import { useKpiByFormatAndFirstWordLineChart } from "@/hooks/useKpiByFormatAndFirstWordLineChart";
import {FaChartBar, FaCog, FaEnvelope, FaStar, FaTachometerAlt} from "react-icons/fa";
import {ChatIcon, ChevronLeftIcon, ChevronRightIcon, InfoOutlineIcon} from "@chakra-ui/icons";
import EmptyState from "@components/EmptyState";
import { GrTooltip } from "react-icons/gr";



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

const stylesOption = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' ,borderColor:'rgba(9,143,136,0.5)'}),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
          ? undefined
          : isSelected
              ? '#4cb0a6'
              : isFocused
                  ? '#D0FFFC'
                  : undefined,
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
            ? isSelected
                ? '#7fb7e7'
                : '#D0FFFC'
            : undefined,
      },

    }
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: 'rgba(9,143,136,0.1)',
    };
  },

  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: '#098f88',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: '#397a76',
    ':hover': {
      backgroundColor: '#397a76',
      color: 'white',
    },
  }),
}

const Home = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(5);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [groupedByFormat, setGroupedbyFormatKpis] = useState<
      Record<string, Kpi[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
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
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const kpiManagerApi = "/api/kpi-manager";

  // FETCHES
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(kpiManagerApi);
      const data: KpiManagerResponse = await response.json();

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
      setLoading(false);
    };

    fetchData();
  }, []);

  // CUSTOM HOOKS
  // custom hook getting the react-table config
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTableConfig({ selectedDealerships, selectedKpis, kpiData });
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  // custom hook getting the data chartjs charts
  const barChartData = useKpiByFormatBarChart({
    groupedByFormat,
    kpiData,
    selectedKpiFormatGroup,
    selectedDealerships,
  });

  const lineChartData = useKpiByFormatAndFirstWordLineChart({
    groupedByFormatAndFirstWord,
    kpiData,
    selectedKpiFormatAndFirstWordGroup,
    selectedDealerships,
  });

  return (
      <Box display="flex" flexDirection="column" height="100vh" pt={14}>
        <Box
            bg="white"
            p="4"
            shadow="md"
            position="fixed"
            top="0"
            width="100%"
            zIndex="1000"
        >
          <HStack justify="space-between">
            <HStack spacing="10">
              <Box>
                <Heading size="md">
                  <Image src={'/favicon.ico'} alt={'favicon.ico'} width={30} height={30}/>
                </Heading>
              </Box>
              <Link href="/" display="flex" alignItems="center">
                <Icon as={FaTachometerAlt} mr="2" />
                Dashboard
              </Link>
              <Link href="/" display="flex" alignItems="center">
                <Icon as={FaEnvelope} mr="2" />
                Message
              </Link>
              <Link href="/" display="flex" alignItems="center">
                <Icon as={FaCog} mr="2" />
                Setting
              </Link>
            </HStack>

            {/* 用户头像和菜单 */}
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" minW={0}>
                <Avatar size="sm" name="Kendrick Lamar" src="https://bit.ly/kent-c-dodds" />
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaUser />}>Profile</MenuItem>
                <MenuItem icon={<FaCog />}>Settings</MenuItem>
                <MenuItem icon={<FaSignOutAlt />}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" p="4">
          <Box mb={4} bgGradient="linear(to-b, #EAFFFF, #E2F2FF)" p={4} shadow="md" borderRadius="lg" position={'relative'} overflow={'hidden'}>
            <Box w={100} height={100} borderRadius={'50%'} position={'absolute'} left={-5} top={-5} zIndex={0} backgroundColor={'pink'}></Box>
            <Box w={100} height={100} borderRadius={'50%'} position={'absolute'} right={-5} bottom={-5} zIndex={0} backgroundColor={'rgba(126,199,255,0.5)'}></Box>
            <Box w={5} height={5} borderRadius={'50%'} position={'absolute'} right={200} bottom={0} zIndex={0} backgroundColor={'rgba(126,199,255,0.5)'}></Box>
            <Box w={5} height={5} borderRadius={'50%'} position={'absolute'} right={200} bottom={0} zIndex={0} backgroundColor={'rgba(126,199,255,0.5)'}></Box>
            <Box w={5} height={5} borderRadius={'50%'} position={'absolute'} left={200} bottom={0} zIndex={0} backgroundColor={'rgba(126,199,255,0.5)'}></Box>
            <Box w={5} height={5} borderRadius={'50%'} position={'absolute'} right={500} bottom={30} zIndex={0} backgroundColor={'rgb(234,140,47)'}></Box>
            <Box w={5} height={5} borderRadius={'50%'} position={'absolute'} left={500} bottom={30} zIndex={0} backgroundColor={'rgb(234,140,47)'}></Box>
           <Box position={'relative'}>
             <HStack spacing={3} mb={2}>
               <Icon as={FaStar} color="blue.500" />
               <Text as="b">introduce</Text>
             </HStack>
             <Text fontSize={12} as="b">{introductionMessage}</Text>
           </Box>
          </Box>

          {/* Dealership Selector */}
          {/*<NoSSR>*/}
          {/*  <Select*/}
          {/*      isMulti*/}
          {/*      isClearable*/}
          {/*      options={getReactSelectOptionsFromDealerships(dealerships)}*/}
          {/*      onChange={(selectedOptions) => {*/}
          {/*        setSelectedDealerships(selectedOptions as Option[]);*/}
          {/*      }}*/}
          {/*      value={selectedDealerships}*/}
          {/*      placeholder="First select at least one dealership"*/}
          {/*      id="dealership-selector"*/}
          {/*  />*/}
          {/*</NoSSR>*/}
          <Box mb={4} bgGradient="linear(to-b, #D0FFFC, #FFFFFF)" position={'relative'} p={4} shadow="lg" borderRadius="lg">
            <Image
                style={{position:'absolute',right:'10px',top:'10px'}}
                src="/Frame1.png"
                alt="描述图片的文字"
                width={150}
                height={150}
            />
            <VStack spacing={4} align="stretch">
              {/* 标题和图标 */}
              <HStack spacing={2}>
                <Icon as={FaChartBar} color="blue.500" />
                <Text as="b" fontSize="lg">Table</Text>

                <TooltipCha  hasArrow label={`the table`} bg='#479EDF'>
                  <InfoOutlineIcon/>
                </TooltipCha>
              </HStack>

              {/* 选择器在同一行 */}
              <HStack spacing={4}>
                <Box flex="1">
                  <NoSSR>
                    <Select
                        styles={stylesOption}
                        isMulti
                        isClearable
                        options={getReactSelectOptionsFromDealerships(dealerships)}
                        onChange={(selectedOptions) => {
                          setSelectedDealerships(selectedOptions as Option[]);
                        }}
                        value={selectedDealerships}
                        placeholder="First select at least one dealership"
                        id="dealership-selector"
                    />
                  </NoSSR>
                </Box>
                <Box flex="1">
                  <NoSSR>
                    <Select
                        styles={stylesOption}
                        isMulti
                        isClearable
                        options={getReactSelectOptionsFromKpis(kpis)}
                        onChange={(selectedOptions) => {
                          setSelectedKpis(selectedOptions as Option[]);
                        }}
                        value={selectedKpis}
                        placeholder="Then you can select KPIs for the table"
                    />
                  </NoSSR>
                </Box>
              </HStack>
              {
                selectedDealerships.length > 0 ?<TableContainer>
                  <Table {...getTableProps()}>
                    <Thead>
                      {headerGroups.map((headerGroup, index) => (
                          <Tr {...headerGroup.getHeaderGroupProps()} key={`${headerGroup.id}-${index}`}>
                            {headerGroup.headers.map((column) => (
                                <Th {...column.getHeaderProps()} key={column.id}>
                                  {column.render("Header")}
                                </Th>
                            ))}
                          </Tr>
                      ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                      {currentRows.map((row) => {
                        prepareRow(row);
                        return (
                            <Tr {...row.getRowProps()} key={row.id}>
                              {row.cells.map((cell) => (
                                  <Td {...cell.getCellProps()} key={cell.column.id} fontSize={12} paddingTop={2} paddingBottom={2}>
                                    {cell.render("Cell")}
                                  </Td>
                              ))}
                            </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer> : <EmptyState message={'No table data ...'}/>
              }
              {/* 表格 */}
            </VStack>
            {
                selectedDealerships.length > 0 ? <HStack justify="center" mt={4}>
                  <IconButton
                      icon={<ChevronLeftIcon />}
                      aria-label="Previous"
                      onClick={() => currentPage > 1 && handleClick(currentPage - 1)}
                      disabled={currentPage === 1}
                  >
                    Previous
                  </IconButton>
                  <Text fontSize={12}>Page {currentPage} of {totalPages}</Text>
                  <IconButton
                      icon={<ChevronRightIcon />}
                      aria-label="Next"
                      onClick={() => currentPage < totalPages && handleClick(currentPage + 1)}
                      disabled={currentPage === totalPages}
                  >
                    Next
                  </IconButton>
        </HStack> : null
            }

          </Box>

          {/* KPI Selector */}
          {/*{selectedDealerships.length > 0 && (*/}
              <>
                {/*<NoSSR>*/}
                {/*  <Select*/}
                {/*      isMulti*/}
                {/*      isClearable*/}
                {/*      options={getReactSelectOptionsFromKpis(kpis)}*/}
                {/*      onChange={(selectedOptions) => {*/}
                {/*        setSelectedKpis(selectedOptions as Option[]);*/}
                {/*      }}*/}
                {/*      value={selectedKpis}*/}
                {/*      placeholder="Then you can select KPIs for the table"*/}
                {/*  />*/}
                {/*</NoSSR>*/}
                {/* KPI Table */}
                {/*<TableContainer>*/}
                {/*  <Table {...getTableProps()}>*/}
                {/*    <Thead>*/}
                {/*      {headerGroups.map((headerGroup, index) => (*/}
                {/*          <Tr*/}
                {/*              {...headerGroup.getHeaderGroupProps()}*/}
                {/*              key={`${headerGroup.id}-${index}`}*/}
                {/*          >*/}
                {/*            {headerGroup.headers.map((column) => (*/}
                {/*                <Th {...column.getHeaderProps()} key={column.id}>*/}
                {/*                  {column.render("Header")}*/}
                {/*                </Th>*/}
                {/*            ))}*/}
                {/*          </Tr>*/}
                {/*      ))}*/}
                {/*    </Thead>*/}
                {/*    <Tbody {...getTableBodyProps()}>*/}
                {/*      {currentRows.map((row) => {*/}
                {/*        prepareRow(row);*/}
                {/*        return (*/}
                {/*            <Tr {...row.getRowProps()} key={row.id}>*/}
                {/*              {row.cells.map((cell) => (*/}
                {/*                  <Td {...cell.getCellProps()} key={cell.column.id}>*/}
                {/*                    {cell.render("Cell")}*/}
                {/*                  </Td>*/}
                {/*              ))}*/}
                {/*            </Tr>*/}
                {/*        );*/}
                {/*      })}*/}
                {/*    </Tbody>*/}
                {/*  </Table>*/}
                {/*</TableContainer>*/}
                <HStack spacing={2}>
                  <Box flex={1} position={'relative'}>
                    <Image
                        style={{position:'absolute',right:'20px',top:'20px'}}
                        src="/Frame1.png"
                        width={120}
                        alt="image9"
                        height={120}
                    />
                    <Box mb={4} bgGradient="linear(to-b, #D0FFFC, #FFFFFF)" p={4} shadow="lg" borderRadius="lg">
                      {/* 标题和图标 */}
                      <HStack spacing={2}>
                        <Box flex={1} display={'flex'} alignItems={'center'}>
                          <Icon as={FaChartBar} color="blue.500" />
                          <Text as="b" fontSize="lg" ml={2} mr={2}>Bar</Text>

                          <TooltipCha  hasArrow label={`the bar chart`} bg='#479EDF'>
                            <InfoOutlineIcon/>
                          </TooltipCha>
                        </Box>

                        {
                            selectedDealerships.length > 0 ?
                                <Box display={'flex'} flex={1}>
                                  <HStack spacing={2} flex={1}>
                                    <TooltipCha hasArrow label={`Select KPI by format group for the bar chart`} bg='#479EDF'>
                                      <InfoOutlineIcon/>
                                    </TooltipCha>
                                    <Box flex={1}>
                                      <NoSSR>
                                        <Select
                                            styles={stylesOption}
                                            options={getReactSelectOptionsFromGroupedKpis(groupedByFormat)}
                                            onChange={(selectedOption) => {
                                              setSelectedKpiFormatGroup(selectedOption as Option);
                                            }}
                                            // placeholder="Select KPI by format group for the bar chart"
                                            value={selectedKpiFormatGroup}
                                            id="kpi-by-format-group"
                                        />
                                      </NoSSR>
                                    </Box>
                                  </HStack>
                                </Box>
                                :
                                null
                        }

                      </HStack>
                      {/* KPI Group by format Selector */}
                      {/* Bar Chart */}
                      <Box h="260px" pt={4} position={'relative'}>

                        {
                          selectedDealerships.length > 0 ?
                              <Bar
                                  data={barChartData}
                                  options={{
                                    maintainAspectRatio: false,
                                    indexAxis: 'x', // 这一行是让条形图变成柱形图
                                    scales: {
                                      y: {
                                        beginAtZero: true,
                                      },
                                    },
                                    elements: {
                                      bar: {
                                        borderWidth: 1,
                                        borderRadius: 5, // 设置圆角柱形
                                      },
                                    },
                                  }}
                              />
                              :
                              <EmptyState message={'No more data ...'}/>
                        }

                      </Box>
                    </Box>
                  </Box>
                  <Box flex={1}>
                    {/* KPI by format and first word selector */}
                    <Box mb={4} bgGradient="linear(to-b, #EAFFFF, #FFFFFF)" p={4} shadow="lg" borderRadius="lg" position={'relative'}>
                      <Image
                          style={{position:'absolute',right:'20px',top:'30px'}}
                          src="/image9.png"
                          alt="描述图片的文字"
                          width={140}
                          height={140}
                      />
                      <HStack spacing={2}>
                        <Box flex={1} display={'flex' } alignItems={'center'}>
                          <Icon as={FaChartBar} color="blue.500" />
                          <Text as="b" fontSize="lg" ml={2} mr={2}>Line</Text>
                          <TooltipCha  hasArrow label={`the line chart`} bg='#479EDF'>
                            <InfoOutlineIcon/>
                          </TooltipCha>
                        </Box>
                        <Box flex={1}>
                          <NoSSR>
                            {
                              selectedDealerships.length > 0 ?
                                 <Box display={'flex'}>
                                   <HStack spacing={2} flex={1}>
                                     <TooltipCha hasArrow label={`Select KPI by format and first word group (it's just a way to classify, I know it's weird) for the line chart`} bg='#479EDF'>
                                       <InfoOutlineIcon/>
                                     </TooltipCha>
                                     <Box flex={1}>
                                       <Select
                                           styles={stylesOption}
                                           options={getReactSelectOptionsFromGroupedKpis(
                                               groupedByFormatAndFirstWord,
                                           )}
                                           onChange={(selectedOption) => {
                                             setSelectedKpiFormatAndFirstWordGroup(
                                                 selectedOption as Option,
                                             );
                                           }}
                                           // placeholder="Select KPI by format and first word group (it's just a way to classify, I know it's weird) for the line chart"
                                           value={selectedKpiFormatAndFirstWordGroup}
                                           id="kpi-by-format-and-first-word-group"
                                       />
                                     </Box>
                                   </HStack>
                                 </Box>
                                  :
                                  null
                            }

                          </NoSSR>
                        </Box>
                      </HStack>

                      {/* Line Chart */}
                      <Box h="260px" pt={4} >

                        {
                          selectedDealerships.length > 0 ?
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
                              :
                              <EmptyState message={'No more data ...'}/>
                        }

                      </Box>
                    </Box>
                  </Box>
                </HStack>
              </>
          {/*)}*/}
        </Box>
      </Box>
  );
};

export default Home;

const introductionMessage = `
I implemented a tooltip next to the select dropdowns in the Bar and Line charts. To maintain a consistent layout without uneven sizing, I used a left-right layout for the Bar and Line charts. This allows the entire data visualization to be viewed on one screen, making it more convenient than scrolling up and down.

The navigation bar is placed at the top instead of the left side, enabling a wider view of the page. This horizontal layout maximizes the usable space, and I fixed the navigation bar at the top so it remains accessible even when the page has a scrollbar, allowing for easy navigation switching at any time.

For cases when there is no data, I used an empty state component to ensure a smooth user experience, avoiding the abrupt appearance of a blank space which can be unfriendly. Additionally, I added pagination to facilitate page layout management. Otherwise, a single table would take up too much space, requiring excessive scrolling to view the content. Keeping everything visible on one screen makes data viewing more intuitive.
`;
