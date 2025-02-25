import { Input } from '@chakra-ui/react'
import { Radio, RadioGroup, Stack, Button } from '@chakra-ui/react'
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';

const HealthSocialInformation = ({ hidden }: boolean) => {
    const { formData, setFormData } = useForm();
    const navigate = useNavigate();

    return (
        <>
        {!hidden && <StepperComponent step_index={3} />}
        <h1 style={{fontSize: "28px", color: "#3182CE"}}>Health and Social Information</h1>
        <div className="healthSocial-information-form">
            <div>
                <label>1. Do you have any medical conditions?</label>
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
                <label>2. List your medical conditions</label>
                <Input  value={formData.medicalConditions} 
            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}/>
                <Button rightIcon={<MdAdd />} size='md' variant={'solid'}>add row</Button>
            </div>
            <div>
                <label>3. Do you take any medications?</label>
                <Input  value={formData.medications}
            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}/>
            </div>
            <div>
                <label>4. Do you have insurance?</label>
                <RadioGroup value={formData.medicalInsurance}
                onChange={(value) => setFormData({ ...formData, medicalInsurance: value })}>
                <Stack direction='row'>
                    <Radio value='yes'>Yes</Radio>
                    <Radio value='no'>No</Radio>
                    <Radio value='unsure'>Unsure</Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>5. Any history of domestic violence?</label>
                <RadioGroup value={formData.domesticViolenceHistory}
                onChange={(value) => setFormData({ ...formData, domesticViolenceHistory: value })}>
                <Stack direction='row'>
                    <Radio value='yes'>Yes</Radio>
                    <Radio value='no'>No</Radio>
                    <Radio value='unsure'>Unsure</Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>6. What's your social worker's name?</label>
                <Input  value={formData.socialWorker}
            onChange={(e) => setFormData({ ...formData, socialWorker: e.target.value })}/>
            </div>
            <div>
                <label>7. Contact information of social worker</label>
                <Input type='tel'  value={formData.socialWorkerTelephone}
            onChange={(e) => setFormData({ ...formData, socialWorkerTelephone: e.target.value })}/>
            </div>
            <div>
                <label>8. Office location of social worker?</label>
                <Input  value={formData.socialWorkerOfficeLocation}
            onChange={(e) => setFormData({ ...formData, socialWorkerOfficeLocation: e.target.value })}/>
            </div>
        
            {!hidden && <Button colorScheme="blue" onClick={() => {navigate("/additional")}}>Next</Button>}
        </div>

        </>
    );  
}

export default HealthSocialInformation;