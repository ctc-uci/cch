import { Input } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { formData } from '../types/screenFormData';
import { useForm } from '../contexts/formContext';

const AdditionalInformation = () => {
    const [legal, setLegal] = useState('');


    return (
        <>
        <h1>Additional Information</h1>
        <div className="form-group">
            <div>
                <label >1. What are your future plans and goals</label>
                <Textarea />
            </div>
            <div>
                <label >2. Last permanent resident household composition</label>
                <Textarea />
            </div>
            <div>
                <label >3. Reason why you're not there</label>
                <Textarea />
            </div>
            <div>
                <label >4. What could've prevented you from being homeless?</label>
                <Textarea />
            </div>

        </div>
        </>
    );  
}

export default AdditionalInformation;