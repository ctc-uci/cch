import { Box, Flex, Link, Text } from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";

export const StartForms = () => {
  const cards = [
    {
      route: "/",
      label: "Initial Screeners Comment Form",
    },
    {
      route: "/",
      label: "Intake Statistics Form",
    },
    {
      route: "/",
      label: "Front Desk Monthly Stats Form",
    },
    {
      route: "/",
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
          <Box
            key={index}
            flex="1"
            h="90%"
            minW="150px"
            display="flex"
            backgroundColor="white"
            borderWidth="1px"
            borderRadius="lg"
            flexDirection="column"
            justifyContent="flex-end"
            p={6}
            textAlign="center"
          >
            <Text
              fontWeight="bold"
              fontSize="md"
            >
              <Link
                as={RouterLink}
                to={card.route}
                color="#3182CE"
              >
                Start
              </Link>{" "}
              {card.label}
            </Text>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};
