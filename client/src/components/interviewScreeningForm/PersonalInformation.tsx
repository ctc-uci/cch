import { Input, Radio, RadioGroup, Stack, Button, Box } from '@chakra-ui/react';
import { useForm } from '../../contexts/formContext';
import StepperComponent from './stepperComponent';
import { useNavigate } from 'react-router-dom';
import { InterviewScreeningFormProps } from './types';
const PersonalInformation: React.FC<InterviewScreeningFormProps> = ({ hidden }: InterviewScreeningFormProps) => {
  const { formData, setFormData } = useForm();
  const navigate = useNavigate();

  return (
    <>
    <Box width={'70%'} margin={'auto'} marginTop={16} padding={4} borderRadius={8} boxShadow="0 0 10px 1px grey" backgroundColor="white">
      <Box width={'90%'} margin={'auto'} marginTop={4} padding={4} borderRadius={8}  backgroundColor="white">
        {!hidden && <StepperComponent step_index={1} />}
      <h1 style={{fontSize: "28px", color: "#3182CE"}}>Personal Information</h1>
      <div className="personal-information-form">
        {/* Personal Information Fields */}
        <div>
          <label>1. What is your first name?</label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label>2. What is your last name?</label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
        <div>
          <label>3. Date of birth?</label>
          <Input
            placeholder="mm/dd/yy"
            size="md"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
        <div>
          <label>4. What is your age?</label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
        <div>
          <label>5. What is your ethnicity?</label>
          <Input
            value={formData.ethnicity}
            onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
          />
        </div>
        <div>
          <label>6. Phone number</label>
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label>7. Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label>8. What is the last four digits of your SSN?</label>
          <Input
            type="number"
            maxLength={4}
            value={formData.ssnLastFour}
            onChange={(e) => setFormData({ ...formData, ssnLastFour: e.target.value })}
          />
        </div>
        <div>
          <label>9. What city do you live in?</label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div>
          <label>10. Are you a U.S. Veteran?</label>
          <RadioGroup
            value={formData.veteran}
            onChange={(value) => setFormData({ ...formData, veteran: value })}
          >
            <Stack direction="row">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="unsure">Unsure</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>11. Do you have any disabilities?</label>
          <RadioGroup
            value={formData.disabled}
            onChange={(value) => setFormData({ ...formData, disabled: value })}
          >
            <Stack direction="row">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="unsure">Unsure</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>12. What is your current address?</label>
          <Input
            value={formData.currentAddress}
            onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
          />
        </div>
        <div>
          <label>13. What was your previous address?</label>
          <Input
            value={formData.lastPermAddress}
            onChange={(e) => setFormData({ ...formData, lastPermAddress: e.target.value })}
          />
        </div>
        <div>
          <label>14. What was the reason for leaving prior address?</label>
          <Input
            value={formData.reasonForLeavingPermAddress}
            onChange={(e) => setFormData({ ...formData, reasonForLeavingPermAddress: e.target.value })}
          />
        </div>
        <div>
          <label>15. Where did you reside last night?</label>
          <Input
            value={formData.whereResideLastNight}
            onChange={(e) => setFormData({ ...formData, whereResideLastNight: e.target.value })}
          />
        </div>
        <div>
          <label>16. Are you currently homeless?</label>
          <RadioGroup
            value={formData.currentlyHomeless}
            onChange={(value) => setFormData({ ...formData, currentlyHomeless: value })}
          >
            <Stack direction="row">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="unsure">Unsure</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>17. Have you applied to Colette's Children's Home before?</label>
          <RadioGroup
            value={formData.prevAppliedToCch}
            onChange={(value) => setFormData({ ...formData, prevAppliedToCch: value })}
          >
            <Stack direction="row">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="unsure">Unsure</Radio>
            </Stack>
          </RadioGroup>
        </div>
        <div>
          <label>18. Have you been in Colette's Children's Home shelter before?</label>
          <RadioGroup
            value={formData.prevInCch}
            onChange={(value) => setFormData({ ...formData, prevInCch: value })}
          >
            <Stack direction="row">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="unsure">Unsure</Radio>
            </Stack>
          </RadioGroup>
        </div>
      </div>

      <h1 style={{fontSize: "28px", color: "#3182CE"}}>Family Information</h1>
      <div>
        <div>
          <label>1. What is your father's name?</label>
          <Input
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
          />
        </div>
        <div>
          <label>2. How many children do you have?</label>
          <RadioGroup
            value={formData.numberOfChildren}
            onChange={(value) => setFormData({ ...formData, numberOfChildren: value })}
          >
            <Stack direction="row">
              <Radio value="0">None</Radio>
              <Radio value="1">1</Radio>
              <Radio value="2">2</Radio>
              <Radio value="3+">3+</Radio>
            </Stack>
          </RadioGroup>
        </div>

          <div>
            <label>3. What is your child's name?</label>
            <Input
              value={formData.childName}
              onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
            />
            <label>Child's date of birth</label>
            <Input
              type="date"
              value={formData.childDOB}
              onChange={(e) => setFormData({ ...formData, childDOB: e.target.value })}
            />
            <label>Age</label>
            <Input
              type="number"
              value={formData.childrenAge}
              onChange={(e) => setFormData({ ...formData, childrenAge: e.target.value })}
            />
            <label>Custody of Child</label>
            <Input
              value={formData.custodyOfChild}
              onChange={(e) => setFormData({ ...formData, custodyOfChild: e.target.value })}
            />
          </div>

      </div>
      {!hidden && <Button colorScheme="blue" onClick={() => {navigate("/financial")}}>Next</Button>}
      </Box>
    </Box>
    </>
  );
};

export default PersonalInformation;
