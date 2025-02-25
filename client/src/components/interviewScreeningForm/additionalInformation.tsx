
import { Button, Textarea } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { InterviewScreeningFormProps } from './types';

const AdditionalInformation =  ({ hidden }: InterviewScreeningFormProps) => {
    const { formData, setFormData } = useForm();
    const navigate = useNavigate();

    return (
        <>
        {!hidden && <StepperComponent step_index={4} />}
        <h1 style={{fontSize: "28px", color: "#3182CE"}}>Additional Information</h1>
        <div className="form-group">
            <div>
                <label >1. What are your future plans and goals</label>
                <Textarea value={formData.futurePlansGoals}
            onChange={(e) => setFormData({ ...formData, futurePlansGoals: e.target.value })}/>
            </div>
            <div>
                <label >2. Last permanent resident household composition</label>
                <Textarea value={formData.lastPermanentResidentHouseholdComposition}
            onChange={(e) => setFormData({ ...formData, lastPermanentResidentHouseholdComposition: e.target.value })}/>
            </div>
            <div>
                <label >3. Reason why you're not there</label>
                <Textarea value={formData.whyNoLongerAtLastResidence}
            onChange={(e) => setFormData({ ...formData, whyNoLongerAtLastResidence: e.target.value })}/>
            </div>
            <div>
                <label >4. What could've prevented you from being homeless?</label>
                <Textarea value={formData.whatCouldPreventHomeless}
            onChange={(e) => setFormData({ ...formData, whatCouldPreventHomeless: e.target.value })}/>
            </div>

            {!hidden && <Button colorScheme="blue" onClick={() => {navigate("/review")}}>Next</Button>}
        </div>
        </>
    );
}

export default AdditionalInformation;
