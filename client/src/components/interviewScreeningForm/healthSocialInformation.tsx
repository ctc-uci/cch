import { useNavigate, useParams } from 'react-router-dom';
import { Box, Input, Radio, RadioGroup, Stack, Button, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { InterviewScreeningFormProps } from './types';

const HealthSocialInformation = ({ hidden }: InterviewScreeningFormProps) => {
    const { formData, setFormData } = useForm();
    const navigate = useNavigate();

    const params = useParams();
    type Language = 'english' | 'spanish';
    const language = ((params.language as string) === 'spanish' ? 'spanish' : 'english') as Language;

    const fields = {
        english: {
            medical: "1. Do you have any medical conditions?",
            medicalConditions: "2. List your medical conditions",
            medications: "3. Do you take any medications?",
            medicalInsurance: "4. Do you have insurance?",
            domesticViolenceHistory: "5. Any history of domestic violence?",
            socialWorker: "6. What's your social worker's name?",
            socialWorkerTelephone: "7. Contact information of social worker",
            socialWorkerOfficeLocation: "8. Office location of social worker?"
        },
        spanish: {
            medical: "1. ¿Tiene alguna condición médica?",
            medicalConditions: "2. Enumere sus condiciones médicas",
            medications: "3. ¿Toma algún medicamento?",
            medicalInsurance: "4. ¿Tiene seguro médico?",
            domesticViolenceHistory: "5. ¿Tiene antecedentes de violencia doméstica?",
            socialWorker: "6. ¿Cuál es el nombre de su trabajador social?",
            socialWorkerTelephone: "7. Información de contacto del trabajador social",
            socialWorkerOfficeLocation: "8. ¿Dónde está la oficina del trabajador social?"
        }
    };

    const options = {
        english: ['Yes', 'No', 'Unsure'],
        spanish: ['Sí', 'No', 'No estoy seguro']
    };

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
                            <label>{fields[language].medical}</label>
                            <RadioGroup
                                value={formData.medical}
                                onChange={(value) => setFormData({ ...formData, medical: value })}
                                colorScheme="blue"
                            >
                                <Stack direction="row" spacing={6}>
                                    <Radio size="md" value="yes">{options[language][0]}</Radio>
                                    <Radio size="md" value="no">{options[language][1]}</Radio>
                                    <Radio size="md" value="unsure">{options[language][2]}</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>

                        <Stack direction="row" align="center" justify="space-between">
                            <label>{fields[language].medicalInsurance}</label>
                            <RadioGroup
                                value={formData.medicalInsurance}
                                onChange={(value) => setFormData({ ...formData, medicalInsurance: value })}
                                colorScheme="blue"
                            >
                                <Stack direction="row" spacing={6}>
                                    <Radio size="md" value="yes">{options[language][0]}</Radio>
                                    <Radio size="md" value="no">{options[language][1]}</Radio>
                                    <Radio size="md" value="unsure">{options[language][2]}</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>

                        <Stack direction="row" align="center" justify="space-between">
                            <label>{fields[language].domesticViolenceHistory}</label>
                            <RadioGroup
                                value={formData.domesticViolenceHistory}
                                onChange={(value) => setFormData({ ...formData, domesticViolenceHistory: value })}
                                colorScheme="blue"
                            >
                                <Stack direction="row" spacing={6}>
                                    <Radio size="md" value="yes">{options[language][0]}</Radio>
                                    <Radio size="md" value="no">{options[language][1]}</Radio>
                                    <Radio size="md" value="unsure">{options[language][2]}</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>
                    </Stack>

                    <Stack spacing={4}>
                        <label>{fields[language].medicalConditions}</label>
                        <Input
                            value={formData.medicalConditions}
                            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label>{fields[language].medications}</label>
                        <Input
                            value={formData.medications}
                            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label>{fields[language].socialWorker}</label>
                        <Input
                            value={formData.socialWorker}
                            onChange={(e) => setFormData({ ...formData, socialWorker: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label>{fields[language].socialWorkerTelephone}</label>
                        <Input
                            type="tel"
                            value={formData.socialWorkerTelephone}
                            onChange={(e) => setFormData({ ...formData, socialWorkerTelephone: e.target.value })}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <label>{fields[language].socialWorkerOfficeLocation}</label>
                        <Input
                            value={formData.socialWorkerOfficeLocation}
                            onChange={(e) => setFormData({ ...formData, socialWorkerOfficeLocation: e.target.value })}
                        />
                    </Stack>
                </Stack>
            </Box>
            <Box marginTop={5} display="flex" justifyContent="flex-end">
                {!hidden && <Button colorScheme="blue" onClick={() => {navigate(`/additional/${language}`)}}>Next</Button>}
            </Box>
        </Box>
    );
}

export default HealthSocialInformation;
