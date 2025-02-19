import { Input } from '@chakra-ui/react'
import {
  
    Button,
 
    Select,
    Radio,
    RadioGroup,
    Stack, 

  } from '@chakra-ui/react'
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';

const FinancialInformation = ({ hidden }: boolean) => {

    const { formData, setFormData } = useForm();
    const navigate = useNavigate();

    return (
        <>
        {!hidden && <StepperComponent step_index={2} />}
        <h1 style={{fontSize: "28px", color: "#3182CE"}}>Financial Information</h1>
        <div className="form-group">
            <div>
                <label >1. What is your estimate monthly income?</label>
                <Input value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}/>
            </div>
            <div>
                <label >2. What are your sources of income?</label>
                <Input value={formData.sourcesOfIncome}
            onChange={(e) => setFormData({ ...formData, sourcesOfIncome: e.target.value })}/>
            </div>
            <div>
                <label >3. What are your monthly bills</label>
                <Input value={formData.monthlyBills}
            onChange={(e) => setFormData({ ...formData, monthlyBills: e.target.value })}/>
            </div>
            <div>
                <label >Estimated amount</label>
                <Input type='number' value={formData.estimateAmountBills}
            onChange={(e) => setFormData({ ...formData, estimateAmountBills: e.target.value })}/>
            </div>
            <div>
                <Button rightIcon={<MdAdd />} size='md' variant={'solid'}>add row</Button>
                
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
                <Input value={formData.lastEmployer}
            onChange={(e) => setFormData({ ...formData, lastEmployer: e.target.value })}/>
            </div>
            <div>
                <label >6. Education History</label>
                <Input type='email' value={formData.educationHistory}
            onChange={(e) => setFormData({ ...formData, educationHistory: e.target.value })}/>
            </div>
            <div>
                <label >7. Date of Education</label>
                <Input placeholder='mm/dd/yyyy' type='date' value={formData.educationHistory}
            onChange={(e) => setFormData({ ...formData, dateOfEducation: e.target.value })}/>
            </div>
            <div>
                <label >8. Are you a legal U.S. resident?</label>
                <RadioGroup  value={formData.legalResident}
                onChange={(value) => setFormData({ ...formData, legalResident: value })}>
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
           
            {!hidden && <Button colorScheme="blue" onClick={() => {navigate("/health")}}>Next</Button>}
        </div>
        </>
    );  
}

export default FinancialInformation;