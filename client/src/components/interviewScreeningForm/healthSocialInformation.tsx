import { Box, Input, Radio, RadioGroup, Stack, Button, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { InterviewScreeningFormProps } from './types';

const HealthSocialInformation = ({ hidden }: InterviewScreeningFormProps) => {
    const { formData, setFormData } = useForm();
    const navigate = useNavigate();

    return (
        <Box margin={40} marginTop={10} position="relative">
            {!hidden && (
                <IconButton
                    aria-label="Back to financial"
                    icon={<ChevronLeftIcon boxSize={8} />}
                    onClick={() => navigate("/financial")}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    position="absolute"
                    left={0}
                    top={0}
                />
            )}
            <Box maxW="75%" mx="auto" px={4}>
                {!hidden && <StepperComponent step_index={3} />}
            </Box>
            <Box marginTop={5}>
                <h1 style={{fontSize: "28px", color: "#3182CE"}}>Health and Social Information</h1>
                <Stack className="healthSocial-information-form" spacing={4} paddingTop={5}>
                    <Stack spacing={4} maxW={"50%"}>
                        <Stack direction="row" align="center" justify="space-between">
                            <label>Do you have any medical conditions?</label>
                            <RadioGroup 
                                value={formData.medical}
                                onChange={(value) => setFormData({ ...formData, medical: value })}
                                colorScheme="blue"
                            >
                                <Stack direction="row" spacing={6}>
                                    <Radio size="md" value="yes">Yes</Radio>
                                    <Radio size="md" value="no">No</Radio>
                                    <Radio size="md" value="unsure">Unsure</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>

                        <Stack direction="row" align="center" justify="space-between">
                            <label>Do you have insurance?</label>
                            <RadioGroup
                                value={formData.medicalInsurance}
                                onChange={(value) => setFormData({ ...formData, medicalInsurance: value })}
                                colorScheme="blue"
                            >
                                <Stack direction="row" spacing={6}>
                                    <Radio size="md" value="yes">Yes</Radio>
                                    <Radio size="md" value="no">No</Radio>
                                    <Radio size="md" value="unsure">Unsure</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>

                        <Stack direction="row" align="center" justify="space-between">
                            <label>Any history of domestic violence?</label>
                            <RadioGroup
                                value={formData.domesticViolenceHistory}
                                onChange={(value) => setFormData({ ...formData, domesticViolenceHistory: value })}
                                colorScheme="blue"
                            >
                                <Stack direction="row" spacing={6}>
                                    <Radio size="md" value="yes">Yes</Radio>
                                    <Radio size="md" value="no">No</Radio>
                                    <Radio size="md" value="unsure">Unsure</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>
                    </Stack>

                    <Stack spacing={4}>
                        <label><strong>2.</strong> List your medical conditions</label>
                        <Input
                            value={formData.medicalConditions}
                            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label><strong>3.</strong> Do you take any medications?</label>
                        <Input
                            value={formData.medications}
                            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label><strong>4.</strong> What's your social worker's name?</label>
                        <Input
                            value={formData.socialWorker}
                            onChange={(e) => setFormData({ ...formData, socialWorker: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label><strong>5.</strong> Contact information of social worker</label>
                        <Input
                            type="tel"
                            value={formData.socialWorkerTelephone}
                            onChange={(e) => setFormData({ ...formData, socialWorkerTelephone: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label><strong>6.</strong> Office location of social worker?</label>
                        <Input
                            value={formData.socialWorkerOfficeLocation}
                            onChange={(e) => setFormData({ ...formData, socialWorkerOfficeLocation: e.target.value })}
                        />
                    </Stack>
                </Stack>
            </Box>
            <Box marginTop={5} display="flex" justifyContent="flex-end">
                {!hidden && <Button colorScheme="blue" onClick={() => {navigate("/additional")}}>Next</Button>}
            </Box>
        </Box>
    );
}

export default HealthSocialInformation;
