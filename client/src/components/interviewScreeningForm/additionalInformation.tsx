import { Box, Button, Textarea, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { InterviewScreeningFormProps } from './types';

const AdditionalInformation = ({ hidden }: InterviewScreeningFormProps) => {
    const { formData, setFormData } = useForm();
    const navigate = useNavigate();

    return (
        <Box margin={40} marginTop={10} position="relative">
            {!hidden && (
                <IconButton
                    aria-label="Back to health"
                    icon={<ChevronLeftIcon boxSize={8} />}
                    onClick={() => navigate("/health")}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    position="absolute"
                    left={0}
                    top={0}
                />
            )}
            <Box maxW="75%" mx="auto" px={4}>
                {!hidden && <StepperComponent step_index={4} />}
            </Box>
            <Box marginTop={5}>
                <h1 style={{fontSize: "28px", color: "#3182CE"}}>Additional Information</h1>
                <Box className="additional-information-form" paddingTop={5}>
                    <Box marginBottom={6}>
                        <label><strong>1.</strong> What are your future plans and goals</label>
                        <Textarea
                            marginTop={2}
                            value={formData.futurePlansGoals}
                            onChange={(e) => setFormData({ ...formData, futurePlansGoals: e.target.value })}
                        />
                    </Box>
                    <Box marginBottom={6}>
                        <label><strong>2.</strong> Last permanent resident household composition</label>
                        <Textarea
                            marginTop={2}
                            value={formData.lastPermanentResidentHouseholdComposition}
                            onChange={(e) => setFormData({ ...formData, lastPermanentResidentHouseholdComposition: e.target.value })}
                        />
                    </Box>
                    <Box marginBottom={6}>
                        <label><strong>3.</strong> Reason why you're not there</label>
                        <Textarea
                            marginTop={2}
                            value={formData.whyNoLongerAtLastResidence}
                            onChange={(e) => setFormData({ ...formData, whyNoLongerAtLastResidence: e.target.value })}
                        />
                    </Box>
                    <Box marginBottom={6}>
                        <label><strong>4.</strong> What could've prevented you from being homeless?</label>
                        <Textarea
                            marginTop={2}
                            value={formData.whatCouldPreventHomeless}
                            onChange={(e) => setFormData({ ...formData, whatCouldPreventHomeless: e.target.value })}
                        />
                    </Box>
                </Box>
            </Box>
            <Box marginTop={5} display="flex" justifyContent="flex-end">
                {!hidden && <Button colorScheme="blue" onClick={() => {navigate("/review")}}>Next</Button>}
            </Box>
        </Box>
    );
}

export default AdditionalInformation;
