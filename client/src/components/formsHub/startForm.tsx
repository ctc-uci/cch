import { Box, Button, Flex, Text } from "@chakra-ui/react";

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
        {cards.map((card) => (
          <Button
            as={RouterLink}
            to={card.route}
            display={"flex"}
            flexDirection={"column"}
            width={"200px"}
            height={"200px"}
            padding={"12px"}
            justifyContent={"center"}
            alignItems={"center"}
            flexShrink={"0"}
            backgroundColor={"white"}
            borderRadius={"8px"}
            // boxShadow={"0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06"}
            boxShadow="0px 1px 4px rgba(0, 0, 0, 0.1)"
          >
            <Text whiteSpace={"normal"} textAlign={"center"}>
              <Box as={"span"} color={"blue.500"}>
                Start
              </Box>
              {" "}
              {card.label}
            </Text>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};
