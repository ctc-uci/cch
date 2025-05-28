import { Box, Input, Radio, RadioGroup, Stack, Button, Select } from '@chakra-ui/react';
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
    <Box width={'70%'} margin={'auto'} marginTop={16} padding={4} borderRadius={8} boxShadow="0 0 10px 1px grey" backgroundColor="white">
      <Box width={'90%'} margin={'auto'} marginTop={4} padding={4} borderRadius={8}  backgroundColor="white">
        {!hidden && <StepperComponent step_index={1} />}
      </Box>
    <Box marginTop={5}>
      <h1 style={{fontSize: "28px", color: "#3182CE"}}>{fields[language].title}</h1>
      <Stack className="personal-information-form" spacing={4} paddingTop={5}>

        <Stack direction="row" spacing={8}>
          <Stack spacing={4} flex={1}>
            <label><strong>1.</strong> {fields[language].firstName}</label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </Stack>
          <Stack spacing={4} flex={1}>
            <label><strong>2.</strong> {fields[language].lastName}</label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={8}>
          <Stack spacing={4} flex={1}>
            <label><strong>3.</strong> {fields[language].dateOfBirth}</label>
            <Input
              placeholder="mm/dd/yy"
              size="md"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </Stack >
          <Stack spacing={4} flex={1}>
            <label><strong>4.</strong> {fields[language].age}</label>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </Stack>
          <Stack spacing={4} flex={1}>
            <label><strong>5.</strong> {fields[language].ethnicity}</label>
            <Input
              value={formData.ethnicity}
              onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={8}>
          <Stack spacing={4} flex={1}>
            <label><strong>6.</strong> {fields[language].phoneNumber}</label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Stack>
          <Stack spacing={4} flex={1}>
            <label><strong>7.</strong> {fields[language].email}</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={8}>
          <Stack spacing={4} flex={1}>
            <label><strong>8.</strong> {fields[language].ssnLastFour}</label>
            <Input
              type="number"
              maxLength={4}
              value={formData.ssnLastFour}
              onChange={(e) => setFormData({ ...formData, ssnLastFour: e.target.value })}
            />
          </Stack>
          <Stack spacing={4} flex={1}>
            <label><strong>9.</strong> {fields[language].city}</label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={8}>
          <Stack spacing={4} flex={1}>
            <label><strong>10.</strong> {fields[language].veteran}</label>
            <RadioGroup
              value={formData.veteran}
              onChange={(value) => setFormData({ ...formData, veteran: value })}
              colorScheme="blue"
            >
              <Stack direction="row" spacing={6} justify="start">
                <Radio size="md" value="yes">{radioOptions[language].yes}</Radio>
                <Radio size="md" value="no">{radioOptions[language].no}</Radio>
                <Radio size="md" value="unsure">{radioOptions[language].unsure}</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          <Stack spacing={4} flex={1}>
            <label><strong>11.</strong> {fields[language].disabled}</label>
            <RadioGroup
              value={formData.disabled}
              onChange={(value) => setFormData({ ...formData, disabled: value })}
              colorScheme="blue"
            >
              <Stack direction="row" spacing={6} justify="start">
                <Radio size="md" value="yes">{radioOptions[language].yes}</Radio>
                <Radio size="md" value="no">{radioOptions[language].no}</Radio>
                <Radio size="md" value="unsure">{radioOptions[language].unsure}</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
        </Stack>
        <Stack spacing={4}>
          <label><strong>12.</strong> {fields[language].currentAddress}</label>
          <Input
            value={formData.currentAddress}
            onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
          />
        </Stack>
        <Stack spacing={4}>
          <label><strong>13.</strong> {fields[language].lastPermAddress}</label>
          <Input
            value={formData.lastPermAddress}
            onChange={(e) => setFormData({ ...formData, lastPermAddress: e.target.value })}
          />
        </Stack>
        <Stack spacing={4}>
          <label><strong>14.</strong> {fields[language].reasonForLeavingPermAddress}</label>
          <Input
            value={formData.reasonForLeavingPermAddress}
            onChange={(e) => setFormData({ ...formData, reasonForLeavingPermAddress: e.target.value })}
          />
        </Stack>
        <Stack spacing={4}>
          <label><strong>15.</strong> {fields[language].whereResideLastNight}</label>
          <Input
            value={formData.whereResideLastNight}
            onChange={(e) => setFormData({ ...formData, whereResideLastNight: e.target.value })}
          />
        </Stack>
        <Stack spacing={4}>
          <label><strong>16.</strong> {fields[language].currentlyHomeless}</label>
          <RadioGroup
            value={formData.currentlyHomeless}
            onChange={(value) => setFormData({ ...formData, currentlyHomeless: value })}
            colorScheme="blue"
          >
            <Stack direction="row" spacing={6} justify="start">
              <Radio size="md" value="yes">{radioOptions[language].yes}</Radio>
              <Radio size="md" value="no">{radioOptions[language].no}</Radio>
              <Radio size="md" value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </Stack>
        <Stack spacing={4}>
          <label><strong>17.</strong> {fields[language].prevAppliedToCch}</label>
          <RadioGroup
            value={formData.prevAppliedToCch}
            onChange={(value) => setFormData({ ...formData, prevAppliedToCch: value })}
            colorScheme="blue"
          >
            <Stack direction="row" spacing={6} justify="start">
              <Radio size="md" value="yes">{radioOptions[language].yes}</Radio>
              <Radio size="md" value="no">{radioOptions[language].no}</Radio>
              <Radio size="md" value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </Stack>
        <Stack spacing={4}>
          <label><strong>18.</strong> {fields[language].prevInCch}</label>
          <RadioGroup
            value={formData.prevInCch}
            onChange={(value) => setFormData({ ...formData, prevInCch: value })}
            colorScheme="blue"
          >
            <Stack direction="row" spacing={6} justify="start">
              <Radio size="md" value="yes">{radioOptions[language].yes}</Radio>
              <Radio size="md" value="no">{radioOptions[language].no}</Radio>
              <Radio size="md" value="unsure">{radioOptions[language].unsure}</Radio>
            </Stack>
          </RadioGroup>
        </Stack>
      </Stack>
      <Box marginTop={5}>
        <h1 style={{fontSize: "28px", color: "#3182CE"}}>Family Information</h1>
      </Box>

      <Stack spacing={4} paddingTop={5}>
        <Stack spacing={4}>
          <label><strong>1.</strong> {fields[language].fatherName}</label>
          <Input
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
          />
        </Stack>
        <Stack spacing={4}>
          <label><strong>2.</strong> {fields[language].numberOfChildren}</label>
          <RadioGroup
            value={formData.numberOfChildren}
            onChange={(value) => setFormData({ ...formData, numberOfChildren: value })}
            colorScheme="blue"
          >
            <Stack direction="row" spacing={6} justify="start">
              <Radio size="md" value="0">{language === 'spanish' ? 'Ninguno' : 'None'}</Radio>
              <Radio size="md" value="1">1</Radio>
              <Radio size="md" value="2">2</Radio>
              <Radio size="md" value="3+">3+</Radio>
            </Stack>
          </RadioGroup>
        </Stack>

        <Stack spacing={4}>

          <Stack direction="row" spacing={8}>
            <Stack spacing={4} flex={1}>
            <label><strong>3.</strong> {fields[language].childName}</label>
              <Input

                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
              />
            </Stack>
            <Stack spacing={4} flex={1}>
              <label>{fields[language].childDOB}</label>
              <Input
                type="date"
                placeholder={fields[language].childDOB}
                value={formData.childDOB}
                onChange={(e) => setFormData({ ...formData, childDOB: e.target.value })}
              />
            </Stack>
            <Stack spacing={4} flex={1}>
              <label>{fields[language].childrenAge}</label>
              <Input
                type="number"

                value={formData.childrenAge}
                onChange={(e) => setFormData({ ...formData, childrenAge: e.target.value })}
              />
            </Stack>
          </Stack>
          <label>{fields[language].custodyOfChild}</label>
          <Select
            placeholder={language === 'spanish' ? 'Selecciona el estado de custodia' : 'Select custody status'}
            value={formData.custodyOfChild}
            onChange={(e) => setFormData({ ...formData, custodyOfChild: e.target.value })}
          >
            <option value="yes">{radioOptions[language].yes}</option>
            <option value="no">{radioOptions[language].no}</option>
          </Select>
        </Stack>
      </Stack>
      </Box>
      <Box marginTop={5} display="flex" justifyContent="flex-end">

      {!hidden && <Button colorScheme="blue" onClick={() => {navigate(`/financial/${language}`)}}>{fields[language].nextButton}</Button>}
      </Box>
    </Box>
  );
};

export default PersonalInformation;
