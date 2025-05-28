import { Input } from '@chakra-ui/react'
import {
    Button,
    Select,
    Radio,
    RadioGroup,
    Stack,
  } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
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
        <>
        {!hidden && <StepperComponent step_index={2} />}
        <h1 style={{fontSize: "28px", color: "#3182CE"}}>Financial Information</h1>
        <div className="form-group">
            <div>
                <label >
                    {fields[language].monthlyIncome}
                </label>
                <Input value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}/>
            </div>
            <div>
                <label >
                    {fields[language].sourcesOfIncome}
                </label>
                <Input value={formData.sourcesOfIncome}
            onChange={(e) => setFormData({ ...formData, sourcesOfIncome: e.target.value })}/>
            </div>
            <div>
                <label>
                    {fields[language].monthlyBills}
                </label>
                <Input value={formData.monthlyBills}
            onChange={(e) => setFormData({ ...formData, monthlyBills: e.target.value })}/>
            </div>
            <div>
                <label>
                    {fields[language].estimateAmountBills}
                </label>
                <Input type='number' value={formData.estimateAmountBills}
            onChange={(e) => setFormData({ ...formData, estimateAmountBills: e.target.value })}/>
            </div>
            <div>
                <label>
                    {fields[language].currentlyEmployed}
                </label>
                <Select placeholder='Select Option'>
                    <option value={'Yes'}>
                        {options[language][0]}
                    </option>
                    <option value={'No'}>
                        {options[language][1]}
                    </option>
                </Select>
            </div>
            <div>
                <label >
                    {fields[language].lastEmployer}
                </label>
                <Input value={formData.lastEmployer}
            onChange={(e) => setFormData({ ...formData, lastEmployer: e.target.value })}/>
            </div>
            <div>
                <label >
                    {fields[language].educationHistory}
                </label>
                <Input type='email' value={formData.educationHistory}
            onChange={(e) => setFormData({ ...formData, educationHistory: e.target.value })}/>
            </div>
            <div>
                <label >
                    {fields[language].dateOfEducation}
                </label>
                <Input placeholder='mm/dd/yyyy' type='date' value={formData.educationHistory}
            onChange={(e) => setFormData({ ...formData, dateOfEducation: e.target.value })}/>
            </div>
            <div>
                <label >
                    {fields[language].legalResident}
                </label>
                <RadioGroup  value={formData.legalResident}
                onChange={(value) => setFormData({ ...formData, legalResident: value })}>
                    <Stack spacing={5} direction={'row'}>
                        <Radio value='Yes'>
                            {options[language][0]}
                        </Radio>
                        <Radio value='No'>
                            {options[language][1]}
                        </Radio>
                        <Radio value='Unsure'>
                            {options[language][2]}
                        </Radio>
                    </Stack>
                </RadioGroup>

            </div>

            {!hidden && <Button colorScheme="blue" onClick={() => {navigate(`/health/${language}`)}}>Next</Button>}
        </div>
        </>
    );
}

export default FinancialInformation;
