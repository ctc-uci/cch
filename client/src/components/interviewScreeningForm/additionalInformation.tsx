
import { Button, Textarea } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { InterviewScreeningFormProps } from './types';

const AdditionalInformation =  ({ hidden }: InterviewScreeningFormProps) => {
    const { formData, setFormData } = useForm();
    const navigate = useNavigate();

    const params = useParams();
    type Language = 'english' | 'spanish';
    const language = ((params.language as string) === 'spanish' ? 'spanish' : 'english') as Language;

    const fields = {
        english: {
            futurePlansGoals: "1. What are your future plans and goals?",
            lastPermanentResidentHouseholdComposition: "2. Last permanent resident household composition",
            whyNoLongerAtLastResidence: "3. Reason why you're not there",
            whatCouldPreventHomeless: "4. What could've prevented you from being homeless?"
        },
        spanish: {
            futurePlansGoals: "1. ¿Cuáles son sus planes y objetivos futuros?",
            lastPermanentResidentHouseholdComposition: "2. Composición del hogar residente permanente anterior",
            whyNoLongerAtLastResidence: "3. Razón por la que ya no está allí",
            whatCouldPreventHomeless: "4. ¿Qué podría haber evitado que estuviera sin hogar?"
        }
    };

    return (
        <>
        {!hidden && <StepperComponent step_index={4} />}
        <h1 style={{fontSize: "28px", color: "#3182CE"}}>Additional Information</h1>
        <div className="form-group">
            <div>
                <label >
                    {fields[language].futurePlansGoals}
                </label>
                <Textarea value={formData.futurePlansGoals}
            onChange={(e) => setFormData({ ...formData, futurePlansGoals: e.target.value })}/>
            </div>
            <div>
                <label >
                    {fields[language].lastPermanentResidentHouseholdComposition}
                </label>
                <Textarea value={formData.lastPermanentResidentHouseholdComposition}
            onChange={(e) => setFormData({ ...formData, lastPermanentResidentHouseholdComposition: e.target.value })}/>
            </div>
            <div>
                <label >
                    {fields[language].whyNoLongerAtLastResidence}
                </label>
                <Textarea value={formData.whyNoLongerAtLastResidence}
            onChange={(e) => setFormData({ ...formData, whyNoLongerAtLastResidence: e.target.value })}/>
            </div>
            <div>
                <label >
                    {fields[language].whatCouldPreventHomeless}
                </label>
                <Textarea value={formData.whatCouldPreventHomeless}
            onChange={(e) => setFormData({ ...formData, whatCouldPreventHomeless: e.target.value })}/>
            </div>

            {!hidden && <Button colorScheme="blue" onClick={() => {navigate(`/review/${language}`)}}>Next</Button>}
        </div>
        </>
    );
}

export default AdditionalInformation;
