import { Input } from '@chakra-ui/react'
import { Radio, RadioGroup, Stack, Button } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
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
        <>
        {!hidden && <StepperComponent step_index={3} />}
        <h1 style={{fontSize: "28px", color: "#3182CE"}}>Health and Social Information</h1>
        <div className="healthSocial-information-form">
            <div>
                <label>
                    {fields[language].medical}
                </label>
                <RadioGroup value={formData.medical}
                onChange={(value) => setFormData({ ...formData, medical: value })}>
                <Stack direction='row'>
                    <Radio value='yes'>Yes</Radio>
                    <Radio value='no'>No</Radio>
                    <Radio value='unsure'>Unsure</Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>
                    {fields[language].medicalConditions}
                </label>
                <Input  value={formData.medicalConditions}
            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}/>
            </div>
            <div>
                <label>
                    {fields[language].medications}
                </label>
                <Input  value={formData.medications}
            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}/>
            </div>
            <div>
                <label>
                    {fields[language].medicalInsurance}
                </label>
                <RadioGroup value={formData.medicalInsurance}
                onChange={(value) => setFormData({ ...formData, medicalInsurance: value })}>
                <Stack direction='row'>
                    <Radio value='yes'>
                      {options[language][0]}
                    </Radio>
                    <Radio value='no'>
                      {options[language][1]}
                    </Radio>
                    <Radio value='unsure'>
                      {options[language][2]}
                    </Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>
                    {fields[language].domesticViolenceHistory}
                </label>
                <RadioGroup value={formData.domesticViolenceHistory}
                onChange={(value) => setFormData({ ...formData, domesticViolenceHistory: value })}>
                <Stack direction='row'>
                    <Radio value='yes'>
                      {options[language][0]}
                    </Radio>
                    <Radio value='no'>
                      {options[language][1]}
                    </Radio>
                    <Radio value='unsure'>
                      {options[language][2]}
                    </Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>
                    {fields[language].socialWorker}
                </label>
                <Input  value={formData.socialWorker}
            onChange={(e) => setFormData({ ...formData, socialWorker: e.target.value })}/>
            </div>
            <div>
                <label>
                    {fields[language].socialWorkerTelephone}
                </label>
                <Input type='tel'  value={formData.socialWorkerTelephone}
            onChange={(e) => setFormData({ ...formData, socialWorkerTelephone: e.target.value })}/>
            </div>
            <div>
                <label>
                    {fields[language].socialWorkerOfficeLocation}
                </label>
                <Input  value={formData.socialWorkerOfficeLocation}
            onChange={(e) => setFormData({ ...formData, socialWorkerOfficeLocation: e.target.value })}/>
            </div>

            {!hidden && <Button colorScheme="blue" onClick={() => {navigate(`/additional/${language}`)}}>Next</Button>}
        </div>

        </>
    );
}

export default HealthSocialInformation;
