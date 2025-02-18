import { Input } from '@chakra-ui/react'
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
    Select,
    Radio,
    RadioGroup,
    Stack
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formData } from '../types/screenFormData';
import { useForm } from '../contexts/formContext';

const FinancialInformation = () => {
    const [legal, setLegal] = useState('');


    return (
        <>
        <h1>Financial Information</h1>
        <div className="form-group">
            <div>
                <label >1. What is your estimate monthly income?</label>
                <Input />
            </div>
            <div>
                <label >2. What are your sources of income?</label>
                <Input />
            </div>
            <div>
                <label >3. What are your monthly bills</label>
                <Input />
            </div>
            <div>
                <label >Estimated amount</label>
                <Input type='number'/>
            </div>
            <div>
                <Button rightIcon={<AddIcon />} size='md' variant={'solid'}>add row</Button>
            </div>
            <div>
                <label >4. Are you currently employed?</label>
                <Select placeholder='Select Option'>
                    <option value={'Yes'}>Yes</option>
                    <option value={'No'}>No</option>
                </Select>
            </div>
            <div>
                <label >5. Last employer</label>
                <Input/>
            </div>
            <div>
                <label >6. Education History</label>
                <Input type='email'/>
            </div>
            <div>
                <label >7. Date of Education</label>
                <Input placeholder='mm/dd/yyyy' type='date'/>
            </div>
            <div>
                <label >8. Are you a legal U.S. resident?</label>
                <RadioGroup onChange={setLegal} value={legal}>
                    <Stack spacing={5} direction={'row'}>
                        <Radio value='Yes'>
                            Yes
                        </Radio>
                        <Radio value='No'>
                            No
                        </Radio>
                        <Radio value='Unsure'>
                            Unsure
                        </Radio>
                    </Stack>
                </RadioGroup>
                
            </div>
           
            <Button colorScheme="blue" onClick={() => {console.log(formData)}}>Next</Button>
        </div>
        </>
    );  
}

export default FinancialInformation;