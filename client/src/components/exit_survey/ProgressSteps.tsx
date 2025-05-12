import React from 'react';
import { Box, Flex, Text, Circle, Divider } from '@chakra-ui/react';

export const ProgressSteps = ({ onReview = false, steps = [
  { number: 1, label: 'Edit' },
  { number: 2, label: 'Review' }
] }) => {
  // Calculate current step based on onReview flag
  const currentStep = onReview ? 2 : 1;
  
  return (
    <Flex w="100%" justify="center" align="center" mt={4} mb={8}>
      {steps.map((step, index) => {
        const isActive = step.number <= currentStep;
        const isLastStep = index === steps.length - 1;
        
        return (
          <Flex key={step.number} align="center">
            {/* Step Circle and Label */}
            <Flex direction="column" align="center">
              <Circle 
                size="30px" 
                bg={isActive ? "blue.500" : "gray.200"}
                color="white"
                fontWeight="bold"
              >
                {step.number}
              </Circle>
              <Text 
                mt={2} 
                fontSize="sm" 
                fontWeight="medium" 
                textAlign="center"
                color={isActive ? "gray.700" : "gray.500"}
              >
                {step.label}
              </Text>
            </Flex>
            
            {/* Connector Line (only between steps) */}
            {!isLastStep && (
              <Divider 
                w="80px" 
                borderStyle="dashed" 
                borderWidth="1px"
                borderColor="gray.300"
                mx={2}
                orientation="horizontal" 
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};