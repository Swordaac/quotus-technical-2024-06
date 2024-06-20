import { Box, Heading } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Home() {
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
    </Box>
  )
}
