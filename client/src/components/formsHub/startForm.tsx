import { Box, Flex, Link, Text } from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";

export const StartForms = () => {
  const cards = [
    {
      route: "/initial-screener-table",
      label: "Initial Screeners Comment Form",
    },
    {
      route: "/intakeStats",
      label: "Intake Statistics Form",
    },
    {
      route: "/frontDesk",
      label: "Front Desk Monthly Stats Form",
    },
    {
      route: "/casemanager",
      label: "Case Manager Monthly Statistics Form",
    },
  ];

  return (
    <Flex
      h="16rem"
      w="100vw"
      backgroundColor="#EDF2F7"
    >
      <Flex
        mx="auto"
        w="70%"
        justifyContent={"center"}
        alignItems="center"
        p={4}
        gap="6rem"
      >
        {cards.map((card, index) => (
          <Link
            key={index}
            as={RouterLink}
            to={card.route}
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
            flex="1"
            h="90%"
            minW="200px"
            display="flex"
          >
            <Box
              flex="1"
              display="flex"
              backgroundColor="white"
              borderWidth="1px"
              borderRadius="lg"
              flexDirection="column"
              justifyContent="center"
              p={6}
              textAlign="center"
              cursor="pointer"
              _hover={{
                backgroundColor: "gray.50",
                boxShadow: "md",
              }}
              transition="all 0.2s"
            >
              <Text
                fontWeight="medium"
                fontSize="md"
              >
                <span style={{ color: "#3182CE" }}>Start</span> {card.label}
              </Text>
            </Box>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};
