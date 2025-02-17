import React from "react";
import { Flex, Box, Text, Link } from "@chakra-ui/react";
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
    <Flex h="16rem" w="100%" backgroundColor="#EDF2F7">
      <Flex
        // background="red"
        mx="auto"
        w="70%"
        justifyContent={"center"}
        alignItems="center"
        p={4}
        gap="6rem" // using Chakra's spacing scale (roughly 1rem)
      >
        {cards.map((card, index) => (
          <Box
            key={index}
            flex="1"        // each card takes an equal share of the available width
            h="90%"
            minW="150px"        // allows the card to shrink beyond its content's intrinsic size
            display="flex"
            backgroundColor="white"
            borderWidth="1px"
            borderRadius="lg"
            // minHeight="15rem" // using rem for relative sizing
            flexDirection="column"
            justifyContent="flex-end" // pushes text to the bottom of the box
            p={6}
            textAlign="center"
          >
            <Text fontWeight="bold" fontSize="md">
              <Link as={RouterLink} to={card.route} color="#3182CE">
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
