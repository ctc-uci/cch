import { useNavigate, useParams } from 'react-router-dom';
import { Box, Input, Radio, RadioGroup, Stack, Button, Select, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { InterviewScreeningFormProps } from './types';

const FinancialInformation = ({ hidden }: InterviewScreeningFormProps) => {
    const { formData, setFormData } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    type Language = 'english' | 'spanish';
    const language = ((params.language as string) === 'spanish' ? 'spanish' : 'english') as Language;
    const fields = {
        english: {
            monthlyIncome: "1. What is your estimate monthly income?",
            sourcesOfIncome: "2. What are your sources of income?",
            monthlyBills: "3. What are your monthly bills",
            estimateAmountBills: "Estimated amount",
            currentlyEmployed: "4. Are you currently employed?",
            lastEmployer: "5. Last employer",
            educationHistory: "6. Education History",
            dateOfEducation: "7. Date of Education",
            legalResident: "8. Are you a legal U.S. resident?",
        },
        spanish: {
            monthlyIncome: "1. ¿Cuál es su ingreso mensual estimado?",
            sourcesOfIncome: "2. ¿Cuáles son sus fuentes de ingresos?",
            monthlyBills: "3. ¿Cuáles son sus facturas mensuales?",
            estimateAmountBills: "Monto estimado",
            currentlyEmployed: "4. ¿Está actualmente empleado?",
            lastEmployer: "5. Último empleador",
            educationHistory: "6. Historial educativo",
            dateOfEducation: "7. Fecha de educación",
            legalResident: "8. ¿Es usted residente legal de EE.UU.?",
        }
    }

    const options = {
        english: ['Yes', 'No', 'Unsure'],
        spanish: ['Sí', 'No', 'No estoy seguro']
    }

    return (
        <Box margin={40} marginTop={10} position="relative">
            {!hidden && (
                <IconButton
                    aria-label="Back to personal"
                    icon={<ChevronLeftIcon boxSize={8} />}
                    onClick={() => navigate("/personal")}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    position="absolute"
                    left={0}
                    top={0}
                />
            )}
            <Box maxW="75%" mx="auto" px={4}>
                {!hidden && <StepperComponent step_index={2} />}
            </Box>
            <Box marginTop={5}>
                <h1 style={{fontSize: "28px", color: "#3182CE"}}>Financial Information</h1>
                <Stack className="financial-information-form" spacing={4} paddingTop={5}>
                    <Stack direction="row" spacing={8}>
                        <Stack spacing={4} flex={1}>
                            <label><strong>1.</strong> What is your estimate monthly income?</label>
                            <Input
                                value={formData.monthlyIncome}
                                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                            />
                        </Stack>
                        <Stack spacing={4} flex={1}>
                            <label><strong>2.</strong> What are your sources of income?</label>
                            <Input
                                value={formData.sourcesOfIncome}
                                onChange={(e) => setFormData({ ...formData, sourcesOfIncome: e.target.value })}
                            />
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={8}>
                        <Stack spacing={4} flex={1}>
                            <label><strong>3.</strong> What are your monthly bills</label>
                            <Input
                                value={formData.monthlyBills}
                                onChange={(e) => setFormData({ ...formData, monthlyBills: e.target.value })}
                            />
                        </Stack>
                        <Stack spacing={4} flex={1}>
                            <label>Estimated amount</label>
                            <Input
                                type='number'
                                value={formData.estimateAmountBills}
                                onChange={(e) => setFormData({ ...formData, estimateAmountBills: e.target.value })}
                            />
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={8}>
                        <Stack spacing={4} flex={1}>
                            <label><strong>4.</strong> Are you currently employed?</label>
                            <Select
                                value={formData.currentlyEmployed}
                                onChange={(e) => setFormData({ ...formData, currentlyEmployed: e.target.value })}
                                placeholder='Select Option'
                            >
                                <option value='yes'>Yes</option>
                                <option value='no'>No</option>
                            </Select>
                        </Stack>
                        <Stack spacing={4} flex={2}>
                            <label><strong>5.</strong> Last employer</label>
                            <Input
                                value={formData.lastEmployer}
                                onChange={(e) => setFormData({ ...formData, lastEmployer: e.target.value })}
                            />
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={8}>
                        <Stack spacing={4} flex={1}>
                            <label><strong>6.</strong> Education History</label>
                            <Input
                                value={formData.educationHistory}
                                onChange={(e) => setFormData({ ...formData, educationHistory: e.target.value })}
                            />
                        </Stack>
                        <Stack spacing={4} flex={1}>
                            <label><strong>7.</strong> Date of Education</label>
                            <Input
                                placeholder='mm/dd/yyyy'
                                type='date'
                                value={formData.dateOfEducation}
                                onChange={(e) => setFormData({ ...formData, dateOfEducation: e.target.value })}
                            />
                        </Stack>
                    </Stack>

                    <Stack spacing={4}>
                        <label><strong>8.</strong> Are you a legal U.S. resident?</label>
                        <RadioGroup
                            value={formData.legalResident}
                            onChange={(value) => setFormData({ ...formData, legalResident: value })}
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
            </Box>
            <Box marginTop={5} display="flex" justifyContent="flex-end">
                {!hidden && <Button colorScheme="blue" onClick={() => {navigate("/health")}}>Next</Button>}
            </Box>
        </Box>
    );
}

export default FinancialInformation;
