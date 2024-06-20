import { Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { Dealership, Kpi, Kpidata } from "@/typescript/interfaces";
import type { KpiManagerResponse } from "@pages/api/kpi-manager";
import Select from "react-select";
import { getReactSelectOptionsFromDealerships, getReactSelectOptionsFromKpis } from "@/utils/helper";

const Home = () => {

  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [kpiData, setKpiData] = useState<Kpidata[]>([]);

  const kpiManagerApi = "/api/kpi-manager";

  useEffect(() => {
    // fetch kpi-manager
    fetch(kpiManagerApi)
      .then((response) => response.json())
      .then((data: KpiManagerResponse) => {
        const { dealerships, kpis, kpiData } = data;
        const allKpis = kpis.totals.concat(kpis.customerPay, kpis.internal, kpis.warranty, kpis.expense, kpis.sublet, kpis.other);
        setDealerships(dealerships);
        setKpis(allKpis);
        setKpiData(kpiData);
      });
  }, []);

  return (
    <Box>
      <Heading>Quotus Technical</Heading>
      <Text as="b">{introductionMessage}</Text>
      {dealerships.length > 0 && (
        <Select isMulti isClearable options={getReactSelectOptionsFromDealerships(dealerships)} />
      )}
      {kpis.length > 0 && (
        <Select isMulti isClearable options={getReactSelectOptionsFromKpis(kpis)} />
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