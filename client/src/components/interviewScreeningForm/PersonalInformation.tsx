import { Input, Radio, RadioGroup, Stack, Button, Box } from '@chakra-ui/react';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { InterviewScreeningFormProps } from './types';

const PersonalInformation: React.FC<InterviewScreeningFormProps> = ({ hidden }: InterviewScreeningFormProps) => {
  const { formData, setFormData } = useForm();
  const navigate = useNavigate();
  const params = useParams();
  type Language = 'english' | 'spanish';
  const language = ((params.language as string) === 'spanish' ? 'spanish' : 'english') as Language;
  const fields = {
    'english': {
      title: "Personal Information",
      firstName: "What is your first name?",
      lastName: "What is your last name?",
      dateOfBirth: "Date of birth?",
      age: "What is your age?",
      ethnicity: "What is your ethnicity?",
      phoneNumber: "Phone number",
      email: "Email",
      ssnLastFour: "What is the last four digits of your SSN?",
      city: "What city do you live in?",
      veteran: "Are you a U.S. Veteran?",
      disabled: "Do you have any disabilities?",
      currentAddress: "What is your current address?",
      lastPermAddress: "What was your previous address?",
      reasonForLeavingPermAddress: "What was the reason for leaving prior address?",
      whereResideLastNight: "Where did you reside last night?",
      currentlyHomeless: "Are you currently homeless?",
      prevAppliedToCch: "Have you applied to Colette's Children's Home before?",
      prevInCch: "Have you been in Colette's Children's Home shelter before?",
      fatherName: "What is your father's name?",
      numberOfChildren: "How many children do you have?",
      childName: "What is your child's name?",
      childDOB: "Child's date of birth",
      childrenAge: "Age",
      custodyOfChild: "Custody of Child",
      nextButton: "Next",
    },
    'spanish': {
      title: "Información Personal",
      nextButton: "Siguiente",
      firstName: "¿Cuál es tu nombre?",
      lastName: "¿Cuál es tu apellido?",
      dateOfBirth: "¿Fecha de nacimiento?",
      age: "¿Cuál es tu edad?",
      ethnicity: "¿Cuál es tu etnia?",
      phoneNumber: "Número de teléfono",
      email: "Correo electrónico",
      ssnLastFour: "¿Cuáles son los últimos cuatro dígitos de tu número de seguro social?",
      city: "¿En qué ciudad vives?",
      veteran: "¿Eres un veterano de EE. UU.?",
      disabled: "¿Tienes alguna discapacidad?",
      currentAddress: "¿Cuál es tu dirección actual?",
      lastPermAddress: "¿Cuál fue tu dirección anterior?",
      reasonForLeavingPermAddress: "¿Cuál fue la razón para dejar la dirección anterior?",
      whereResideLastNight: "¿Dónde residiste anoche?",
      currentlyHomeless: "¿Actualmente estás sin hogar?",
      prevAppliedToCch: "¿Has solicitado a Colette's Children's Home antes?",
      prevInCch: "¿Has estado en el refugio de Colette's Children's Home antes?",
      fatherName: "¿Cuál es el nombre de tu padre?",
      numberOfChildren: "¿Cuántos hijos tienes?",
      childName: "¿Cuál es el nombre de tu hijo?",
      childDOB: "Fecha de nacimiento del niño",
      childrenAge: "Edad",
      custodyOfChild: "Custodia del niño",
    }
  }

  const radioOptions = {
    'english': {
      yes: "Yes",
      no: "No",
      unsure: "Unsure"
    },
    'spanish': {
      yes: "Sí",
      no: "No",
      unsure: "No estoy seguro"
    }
  };
  return (
    <>
    <Box width={'70%'} margin={'auto'} marginTop={16} padding={4} borderRadius={8} boxShadow="0 0 10px 1px grey" backgroundColor="white">
      <Box width={'90%'} margin={'auto'} marginTop={4} padding={4} borderRadius={8}  backgroundColor="white">
        {!hidden && <StepperComponent step_index={1} />}
      <h1 style={{fontSize: "28px", color: "#3182CE"}}>Personal Information</h1>
      <div className="personal-information-form">
        {/* Personal Information Fields */}
        <div>
          <label>1. {fields[language].firstName}</label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label>2. {fields[language].lastName}</label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
        <div>
          <label>
            3. {fields[language].dateOfBirth}
          </label>
          <Input
            placeholder="mm/dd/yy"
            size="md"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
        <div>
          <label>
            4. {fields[language].age}
          </label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
        <div>
          <label>
            5. {fields[language].ethnicity}
          </label>
          <Input
            value={formData.ethnicity}
            onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
          />
        </div>
        <div>
          <label>
            6. {fields[language].phoneNumber}
          </label>
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label>
            7. {fields[language].email}
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label>
            8. {fields[language].ssnLastFour}
          </label>
          <Input
            type="number"
            maxLength={4}
            value={formData.ssnLastFour}
            onChange={(e) => setFormData({ ...formData, ssnLastFour: e.target.value })}
          />
        </div>
        <div>
          <label>
            9. {fields[language].city}
          </label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div>
          <label>
            10. {fields[language].veteran}
          </label>
          <RadioGroup
            value={formData.veteran}
            onChange={(value) => setFormData({ ...formData, veteran: value })}
          >
            <Stack direction="row">
              <Radio value="yes">{radioOptions[language].yes}</Radio>
              <Radio value="no">{radioOptions[language].no}</Radio>
              <Radio value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>
            11. {fields[language].disabled}
          </label>
          <RadioGroup
            value={formData.disabled}
            onChange={(value) => setFormData({ ...formData, disabled: value })}
          >
            <Stack direction="row">
              <Radio value="yes">{radioOptions[language].yes}</Radio>
              <Radio value="no">{radioOptions[language].no}</Radio>
              <Radio value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>
            12. {fields[language].currentAddress}
          </label>
          <Input
            value={formData.currentAddress}
            onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
          />
        </div>
        <div>
          <label>
            13. {fields[language].lastPermAddress}
          </label>
          <Input
            value={formData.lastPermAddress}
            onChange={(e) => setFormData({ ...formData, lastPermAddress: e.target.value })}
          />
        </div>
        <div>
          <label>
            14. {fields[language].reasonForLeavingPermAddress}
          </label>
          <Input
            value={formData.reasonForLeavingPermAddress}
            onChange={(e) => setFormData({ ...formData, reasonForLeavingPermAddress: e.target.value })}
          />
        </div>
        <div>
          <label>
            15. {fields[language].whereResideLastNight}
          </label>
          <Input
            value={formData.whereResideLastNight}
            onChange={(e) => setFormData({ ...formData, whereResideLastNight: e.target.value })}
          />
        </div>
        <div>
          <label>
            16. {fields[language].currentlyHomeless}
          </label>
          <RadioGroup
            value={formData.currentlyHomeless}
            onChange={(value) => setFormData({ ...formData, currentlyHomeless: value })}
          >
            <Stack direction="row">
              <Radio value="yes">{radioOptions[language].yes}</Radio>
              <Radio value="no">{radioOptions[language].no}</Radio>
              <Radio value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>
            17. {fields[language].prevAppliedToCch}
          </label>
          <RadioGroup
            value={formData.prevAppliedToCch}
            onChange={(value) => setFormData({ ...formData, prevAppliedToCch: value })}
          >
            <Stack direction="row">
              <Radio value="yes">{radioOptions[language].yes}</Radio>
              <Radio value="no">{radioOptions[language].no}</Radio>
              <Radio value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>
            18. {fields[language].prevInCch}
          </label>
          <RadioGroup
            value={formData.prevInCch}
            onChange={(value) => setFormData({ ...formData, prevInCch: value })}
          >
            <Stack direction="row">
              <Radio value="yes">{radioOptions[language].yes}</Radio>
              <Radio value="no">{radioOptions[language].no}</Radio>
              <Radio value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </div>
      </div>

      <h1 style={{fontSize: "28px", color: "#3182CE"}}>Family Information</h1>
      <div>
        <div>
          <label>
            1. {fields[language].fatherName}
          </label>
          <Input
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
          />
        </div>
        <div>
          <label>
            2. {fields[language].numberOfChildren}
          </label>
          <RadioGroup
            value={formData.numberOfChildren}
            onChange={(value) => setFormData({ ...formData, numberOfChildren: value })}
          >
            <Stack direction="row">
              <Radio value="0">0</Radio>
              <Radio value="1">1</Radio>
              <Radio value="2">2</Radio>
              <Radio value="3+">3+</Radio>
            </Stack>
          </RadioGroup>
        </div>

          <div>
            <label>
              {fields[language].childName}
            </label>
            <Input
              value={formData.childName}
              onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
            />
            <label>
              {fields[language].childDOB}
            </label>
            <Input
              type="date"
              value={formData.childDOB}
              onChange={(e) => setFormData({ ...formData, childDOB: e.target.value })}
            />
            <label>
              {fields[language].childrenAge}
            </label>
            <Input
              type="number"
              value={formData.childrenAge}
              onChange={(e) => setFormData({ ...formData, childrenAge: e.target.value })}
            />
            <label>
              {fields[language].custodyOfChild}
            </label>
            <Input
              value={formData.custodyOfChild}
              onChange={(e) => setFormData({ ...formData, custodyOfChild: e.target.value })}
            />
          </div>

      </div>
      {!hidden && <Button colorScheme="blue" onClick={() => {navigate(`/financial/${language}`)}}>Next</Button>}
      </Box>
    </Box>
    </>
  );
};

export default PersonalInformation;
