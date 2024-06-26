import { VStack, Text, Icon } from "@chakra-ui/react";
import { FaInbox } from "react-icons/fa";

// @ts-ignore
const EmptyState = ({ message }) => {
    return (
        <VStack spacing={4} mt={8} mb={8}>
            <Icon as={FaInbox} w={12} h={12} color="gray.500" />
            <Text fontSize="xl" color="gray.500">{message}</Text>
        </VStack>
    );
};

export default EmptyState;
