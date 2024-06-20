import { Box, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // fetch kpi-manager
    fetch("/api/kpi-manager")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <Box>
      <Heading>Quotus Technical</Heading>
      <Text as="title">
        Welcome to the Quotus Technical test. This is a simple application that
        fetches data from an API and displays it on the screen. Modify the pages/index.tsx file to see the changes reflected on the screen.
        You must fetch the data from the API and distribute it to the components in the JSX. The components are waiting their options and setters. 
      </Text>
    </Box>
  );
};

export default Home;
