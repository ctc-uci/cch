import {WarningIcon, ArrowForwardIcon} from "@chakra-ui/icons"
import { Flex, Box, Text, Button, Icon } from "@chakra-ui/react";
import { AddClientForm } from "./AddClientForm";
export const UnfinishedClientAlert = () => {
    return(
        <Flex
        align="center"
        justify="space-between"
        bg="orange.100"
        border="1px solid"
        borderColor="orange.300"
        borderRadius="md"
        p={3}
        gap={4}
        width="full"
      >
        <Flex align="center" gap={3}>
          <Icon as={WarningIcon} color="orange.500" boxSize={6} />
          <Box>
            <Text fontWeight="bold">New Client Unfinished</Text>
            <Text fontSize="sm" color="gray.700">
              Please finish editing the current client before adding another.
            </Text>
          </Box>
        </Flex>
      </Flex>
    )
}