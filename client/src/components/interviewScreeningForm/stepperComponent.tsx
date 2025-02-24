import {
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Box,
    useSteps,
  } from '@chakra-ui/react'

  const steps = [
    { title: 'Personal & Family' },
    { title: 'Finances' },
    { title: 'Health & Social' },
    { title: 'Additional' },
    { title: 'Review' },
  ]
  
const StepperComponent = ({ step_index }: number) => {

    const { activeStep } = useSteps({
      index: step_index,
      count: steps.length,
    })
  
    return (
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
  
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
            </Box>
  
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    )
  };
  
export default StepperComponent;