import { Input } from '@chakra-ui/react'
import { Radio, RadioGroup, Stack, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { formData } from '../types/screenFormData';
import { useForm } from '../contexts/formContext';


const healthSocialInformation = () => {
    const [health, setHealth] = useState('')
    const [insurance, setInsurance] = useState('')
    const [violence, setViolence] = useState('')
    const [applied, setApplied] = useState('')
    const [been, setBeen] = useState('')
    return (
        <>
        <h1>Health and Social Information</h1>
        <div className="healthSocial-information-form">
            <div>
                <label>1. Do you have any medical conditions?</label>
                <RadioGroup onChange={setHealth} value={health}>
                <Stack direction='row'>
                    <Radio value='yes'>Yes</Radio>
                    <Radio value='no'>No</Radio>
                    <Radio value='unsure'>Unsure</Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>2. List your medical conditions</label>
                <Input />
                <Button rightIcon={<AddIcon />} size='md' variant={'solid'}>add row</Button>
            </div>
            <div>
                <label>3. Do you take any medications?</label>
                <Input />
            </div>
            <div>
                <label>4. Do you have insurance?</label>
                <RadioGroup onChange={setInsurance} value={insurance}>
                <Stack direction='row'>
                    <Radio value='yes'>Yes</Radio>
                    <Radio value='no'>No</Radio>
                    <Radio value='unsure'>Unsure</Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>5. Any history of domestic violence?</label>
                <RadioGroup onChange={setViolence} value={violence}>
                <Stack direction='row'>
                    <Radio value='yes'>Yes</Radio>
                    <Radio value='no'>No</Radio>
                    <Radio value='unsure'>Unsure</Radio>
                </Stack>
                </RadioGroup>
            </div>
            <div>
                <label>6. What's your social worker's name?</label>
                <Input type='tel'/>
            </div>
            <div>
                <label>7. Contact information of social worker</label>
                <Input type='email'/>
            </div>
            <div>
                <label>8. Office location of social worker?</label>
                <Input/>
            </div>
        

        </div>
        <div>
            
        </div>
        </>
    );  
}

export default healthSocialInformation;