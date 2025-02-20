import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
  Box,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper
} from "@chakra-ui/react";



import { useBackendContext } from "../../contexts/hooks/useBackendContext";



export const IntakeStatsPg1 = ({formData, setFormData}) => {
    const [numChildren, setNumChildren] = useState(formData.numChildren || 0);

    const { backend } = useBackendContext();

    const [cms, setCms] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await backend.get("/casemanagers");
            console.log(response);
            setCms(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        };
        fetchData();
    }, [backend]);

    const handleChange = (e) => {
        if (e.target) {
            const { name, value, type } = e.target;
    
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                age: typeof e === "number" ? e : prev.age,
                medical: typeof e === "string" ? e : prev.medical,
                disabled: typeof e === "string" ? e : prev.disabled,
                caloptimaFunded: typeof e === "string" ? e : prev.caloptimaFunded,
            }));
        }
    };
    
    // Handles child fields separately
    const handleChildChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedChildren = [...(prev.children ?? [])]; 
    
            updatedChildren[index] = {
                ...(updatedChildren[index] || {}),
                [field]: 
                    field === "age" ? (value === "" ? "" : Number(value)) :
                    field === "birthday" ? value :
                    field === "ethnicity" ? value : 
                    value,
            };
    
            return { ...prev, children: updatedChildren };
        });
    };
    

    const outputChildPrompts = (val) => {
        const childCount = Number(val);
        setNumChildren(childCount);
        setFormData((prev) => ({
            ...prev,
            numChildren: childCount,
            children: Array.from({length: childCount}, (_, i) => prev.children?.[i] || {})
        }));
    };

    return(
    <>
        <VStack>
            <HStack w = "70%" justifyContent="space-between">
                <FormControl w = "24%">
                    <HStack>
                        <FormLabel w="30%">Month</FormLabel>
                        <Select 
                            placeholder="Select month"
                            w="100%"
                            name="month"
                            value={formData.month || ""}
                            onChange={handleChange}
                        >
                            <option value="january">January</option>
                            <option value="february">February</option>
                            <option value="march">March</option>
                            <option value="april">April</option>
                            <option value="may">May</option>
                            <option value="june">June</option>
                            <option value="july">July</option>
                            <option value="august">August</option>
                            <option value="september">September</option>
                            <option value="october">October</option>
                            <option value="november">November</option>
                            <option value="december">December</option>
                        </Select>
                    </HStack>
                </FormControl>

                <FormControl w = "20%">
                    <FormLabel>Case Manager</FormLabel>
                    <Select 
                    placeholder='Select option'
                    name="caseManager"
                    value={formData.caseManager || ""}
                    onChange={handleChange}
                    >
                        {cms.filter(user => user.role === 'case manager').map(user => (
                            <option key={user.id} value={user.firstName + ' ' + user.lastName}>
                                {user.firstName + ' ' + user.lastName}
                            </option>
                        ))}
                    </Select>
                </FormControl>
            </HStack>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">First Name</FormLabel>
                    <Input 
                    w = "30%"
                    name = "firstName"
                    value = {formData.firstName || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Last Name</FormLabel>
                    <Input 
                    w = "30%"
                    name = "lastName"
                    value = {formData.lastName || ""}
                    onChange={handleChange}
                    placeholder=''
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Ethnicity</FormLabel>
                    <Select 
                    placeholder='Select option'
                    w = "30%"
                    name = "ethnicity"
                    value = {formData.ethnicity || ""}
                    onChange={handleChange}
                    >
                        <option value="caucasian">Caucasian</option>
                        <option value="hispanic">Hispanic</option>
                        <option value="african_american">African American</option>
                        <option value="asian">Asian</option>
                        <option value="pacific_islander_hawaiian">Pacific Islander/Hawaiian</option>
                        <option value="native_american">Native American</option>
                        <option value="multi_other">Multi/Other</option>
                    </Select>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Birthday</FormLabel>
                    <Input
                    name="dateOfBirth"
                    type="date"
                    placeholder="Date"
                    w = "30%"
                    value = {formData.dateOfBirth || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Age</FormLabel>
                    <NumberInput 
                    max={125} 
                    min={0} 
                    w = "30%"
                    name = "age"
                    value = {formData.age || ""}
                    onChange={(valueAsString, valueAsNumber) => handleChange(valueAsNumber)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Phone Number</FormLabel>
                    <Input 
                    w = "30%"
                    placeholder=''
                    name = "phoneNumber"
                    value = {formData.phoneNumber || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Email</FormLabel>
                    <Input 
                    type="email"
                    w = "30%"
                    placeholder='Type here'
                    name = "email"
                    value = {formData.email || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Emergency Contact Name</FormLabel>
                    <Input
                    w = "30%"
                    placeholder=''
                    name = "emergencyContactName"
                    value = {formData.emergencyContactName || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Emergency Contact Phone Number</FormLabel>
                    <Input
                    w = "30%"
                    placeholder=''
                    name = "emergencyContactPhoneNumber"
                    value = {formData.emergencyContactPhoneNumber || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Prior Living Situation</FormLabel>
                    <Select 
                    placeholder='Select option' 
                    w = "30%"
                    name = "priorLiving"
                    value = {formData.priorLiving || ""}
                    onChange={handleChange}
                    >
                        <option value='couch'>Couch</option>
                        <option value='dv_shelter'>DV Shelter</option>
                        <option value='other_shelter'>Other Shelter</option>
                        <option value='car'>Car</option>
                        <option value='hotel'>Hotel</option>
                        <option value='motel'>Motel</option>
                        <option value='streets'>Streets</option>
                        <option value='family'>Family</option>
                        <option value='friends'>Friends</option>
                        <option value='prison'>Prison/Jail</option>
                        <option value='treatment_center'>Treatment Center</option>
                    </Select>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Entry Date</FormLabel>
                    <Input
                    name="entranceDate"
                    type="date"
                    placeholder="Date"
                    w = "30%"
                    value = {formData.entranceDate || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Medical</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name = "medical"
                    value = {formData.medical || ""}
                    onChange={(value) => handleChange({ target: { name: "medical", value } })}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Assigned Case Manager</FormLabel>
                    <Input
                    w = "30%"
                    placeholder=''
                    name = "createdBy"
                    value = {formData.createdBy || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%" >
                <HStack>
                    <FormLabel w = "30%">Site</FormLabel>
                    <Select 
                    placeholder='Select option' 
                    w = "30%"
                    name = "locationId"
                    value = {formData.locationId || ""}
                    onChange={handleChange}
                    >
                        <option value='cypress'>Cypress</option>
                        <option value='glencoe'>Glencoe</option>
                        <option value='dairyview'>Dairyview</option>
                        <option value='bridge'>Bridge</option>
                        <option value='placentia38'>Placentia 38</option>
                    </Select>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Grant</FormLabel>
                    <Select 
                    placeholder='Select option' 
                    w = "30%"
                    name = "grant"
                    value = {formData.grant || ""}
                    onChange={handleChange}
                    >
                        <option value='bridge'>Bridge</option>
                        <option value='non_funded'>Non funded</option>
                    </Select>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Cal- Optima Funded</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name = "caloptimaFunded"
                    value = {formData.caloptimaFunded || ""}
                    onChange={(value) => handleChange({ target: { name: "caloptimaFunded", value } })}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Unique ID #</FormLabel>
                    <Input
                    w = "30%"
                    placeholder='Type here'
                    name = "id"
                    value = {formData.id || ""}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w="30%">Disabling Condition</FormLabel>
                    <RadioGroup 
                    defaultValue='No'
                    name = "disabled"
                    w = "30%"
                    value = {formData.disabled || ""}
                    onChange={(value) => handleChange({ target: { name: "disabled", value } })}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Number of Children</FormLabel>
                    <NumberInput 
                    max={6} 
                    min={0} 
                    w = "30%" 
                    onChange={outputChildPrompts}
                    name = "numChildren"
                    value = {numChildren}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </HStack>
            </FormControl>
            {Array.from({length: numChildren}, (_, index) => (
                <Box key={index} w = "70%" marginTop = "60px">
                    <FormControl>
                    <HStack>
                        <FormLabel w = "30%">Child #{index + 1} First Name</FormLabel>
                        <Input
                        w = "30%"
                        placeholder='Type here'
                        value = {formData.children?.[index]?.firstName || ""}
                        onChange={(e) => handleChildChange(index, "firstName", e.target.value)}
                        />
                    </HStack>
                    </FormControl>
                    <FormControl>
                    <HStack>
                        <FormLabel w = "30%">Child #{index + 1} Last Name</FormLabel>
                        <Input
                        w = "30%"
                        placeholder='Type here'
                        value={formData.children?.[index]?.lastName || ""}
                        onChange={(e) => handleChildChange(index, "lastName", e.target.value)}
                        />
                    </HStack>
                    </FormControl>
                    <FormControl>
                    <HStack>
                        <FormLabel w = "30%">Child #{index + 1} Birthday</FormLabel>
                        <Input
                        name="date"
                        type="date"
                        placeholder="Date"
                        w = "30%"
                        value={formData.children?.[index]?.birthday || ""}
                        onChange={(e) => handleChildChange(index, "birthday", e.target.value)}
                        />
                    </HStack>
                    </FormControl>
                    <FormControl>
                    <HStack>
                        <FormLabel w = "30%">Child #{index + 1} Age</FormLabel>
                        {/* <Input 
                        w = "30%"
                        value={formData.children?.[index]?.age || ""}
                        onChange={(e) => handleChildChange(index, "age", e.target.value)}
                        /> */}
                        <NumberInput 
                            max={17} 
                            min={0} 
                            w = "30%"
                            value = {formData.children?.[index]?.age || ""}
                            onChange={(value) => handleChildChange(index, "age", value)}
                        >
                        <NumberInputField />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                        </NumberInput>
                    </HStack>
                    </FormControl>
                    <FormControl>
                    <HStack>
                        <FormLabel w = "30%">Child #{index + 1} Ethnicity</FormLabel>
                        <Select 
                        placeholder='Select option' 
                        w = "30%"
                        value={formData.children?.[index]?.ethnicity || ""}
                        onChange={(e) => handleChildChange(index, "ethnicity", e.target.value)}
                        >
                            <option value="caucasian">Caucasian</option>
                            <option value="hispanic">Hispanic</option>
                            <option value="african_american">African American</option>
                            <option value="asian">Asian</option>
                            <option value="pacific_islander_hawaiian">Pacific Islander/Hawaiian</option>
                            <option value="native_american">Native American</option>
                            <option value="multi_other">Multi/Other</option>
                        </Select>
                    </HStack>
                    </FormControl>
                </Box>
            ))}
            <Box w="70%" marginTop="60px"/>
        </VStack>
    </>
)};

export const IntakeStatsPg2 = ({formData, setFormData}) => {

    const handleChange = (input) => {
        if (typeof input === "object" && input.target) {
            // Handles regular inputs (text, number, etc.)
            const { name, value, type } = input.target;
            setFormData(prev => ({
                ...prev,
                [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
            }));
        } else {
            // Handles RadioGroup and NumberInput
            const [name, value] = input;
            setFormData(prev => ({
                ...prev,
                [name]: value === "" ? "" : (typeof value === "number" ? value : String(value)),
            }));
        }
    };
    

    return(
    <>
        <VStack>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">City of Last Permanent Residence</FormLabel>
                    <Input
                    type='last_city'
                    w = "30%"
                    placeholder='Type here'
                    name = 'cityOfLastPermanentResidence'
                    value={formData.cityOfLastPermanentResidence || ''}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Where did the client sleep last night?</FormLabel>
                    <Input
                    type='last_sleep'
                    w = "30%"
                    placeholder='Type here'
                    name = 'lastSlept'
                    value={formData.lastSlept || ''}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Last City of Residence</FormLabel>
                    <Input
                    type='last_residence'
                    w = "30%"
                    placeholder='Type here'
                    name = 'priorLivingCity'
                    value={formData.priorLivingCity || ''}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Last City Homeless In</FormLabel>
                    <Input
                    type='last_homeless'
                    w = "30%"
                    placeholder='Type here'
                    name = 'priorHomelessCity'
                    value={formData.priorHomelessCity || ''}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Has the client been in a shelter in the last 5 years?</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="shelterLastFiveYears"
                    value={formData.shelterLastFiveYears || ""}
                    onChange={(value) => handleChange(["shelterLastFiveYears", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Which shelters has the client been over the last 5 years?</FormLabel>
                    <Input 
                    type='shelters'
                    w = "30%"
                    placeholder='Type here'
                    name = 'shelterInLastFiveYears'
                    value={formData.shelterInLastFiveYears || ''}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">How many years has the client been homeless for?</FormLabel>
                    <NumberInput 
                    max={100} 
                    min={0} 
                    w = "30%"
                    name="homelessnessLength"
                    value={formData.homelessnessLength || ''}
                    onChange={(value) => handleChange(["homelessnessLength", value])}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Chronically homeless</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="chronicallyHomeless"
                    value={formData.chronicallyHomeless || ''}
                    onChange={(value) => handleChange(["chronicallyHomeless", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Employed upon entry</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="employedUponEntry"
                    value={formData.employedUponEntry || ''}
                    onChange={(value) => handleChange(["employedUponEntry", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Attending school upon entry</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="attendingSchoolUponEntry"
                    value={formData.attendingSchoolUponEntry || ''}
                    onChange={(value) => handleChange(["attendingSchoolUponEntry", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Photo release signed?</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="photoReleaseSigned"
                    value={formData.photoReleaseSigned || ''}
                    onChange={(value) => handleChange(["photoReleaseSigned", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Currently Employed</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="employed"
                    value={formData.employed || ''}
                    onChange={(value) => handleChange(["employed", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Date of last employment</FormLabel>
                    <Input 
                    type='date' 
                    placeholder='Select a date' 
                    w = "30%"
                    name="lastEmployment"
                    value={formData.lastEmployment || ''}
                    onChange={handleChange}
                    />
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">History of domestic violence</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="domesticeViolenceHistory"
                    value={formData.domesticeViolenceHistory || ''}
                    onChange={(value) => handleChange(["domesticeViolenceHistory", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">History of Substance Abuse</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="substanceHistory"
                    value={formData.substanceHistory || ''}
                    onChange={(value) => handleChange(["substanceHistory", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                {/* Support system in place */}
                <FormHelperText>Do not include government programs/services(Ex. Church).</FormHelperText>
                <HStack>
                    <FormLabel w = "30%">Support System in Place?</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="supportSystem"
                    value={formData.supportSystem || ''}
                    onChange={(value) => handleChange(["supportSystem", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
                {formData.supportSystem === "Yes" && (
                    <>
                        <HStack marginLeft = {"60px"} marginTop={"30px"} marginBottom={"10px"}>
                            <FormLabel w="30%">Housing</FormLabel>
                            <Input
                                type="housing"
                                w="30%"
                                placeholder="Type here"
                                name="housing"
                                value={formData.housing || ''}
                                onChange={handleChange}
                            />
                        </HStack>
                        <HStack marginLeft = {"60px"} marginBottom={"10px"}>
                            <FormLabel w="30%">Paying for/buying food on a regular basis</FormLabel>
                            <Input
                                type="homeless_years"
                                w="30%"
                                placeholder="Type here"
                                name="foodPurchase"
                                value={formData.foodPurchase || ''}
                                onChange={handleChange}
                            />
                        </HStack>
                        <HStack marginLeft = {"60px"} marginBottom={"30px"}>
                            <FormLabel w="30%">Assistance with childcare</FormLabel>
                            <Input
                                type="homeless_years"
                                w="30%"
                                placeholder="Type here"
                                name="childcareAssistance"
                                value={formData.childcareAssistance || ''}
                                onChange={handleChange}
                            />
                        </HStack>
                    </>
                )}
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Diagnosed Mental Health Condition</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="mentalHealth"
                    value={formData.mentalHealth || ''}
                    onChange={(value) => handleChange(["mentalHealth", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Does Case Manager believe there is an undiagnosed Mental Health Condition?</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="mentalHealthUndiagnosed"
                    value={formData.mentalHealthUndiagnosed || ''}
                    onChange={(value) => handleChange(["mentalHealthUndiagnosed", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%">
                <HStack>
                    <FormLabel w = "30%">Form of Transportation</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="transportation"
                    value={formData.transportation || ''}
                    onChange={(value) => handleChange(["transportation", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
            <FormControl w = "70%" marginBottom={"60px"}>
                <HStack>
                    <FormLabel w = "30%">Convicted of a Crime</FormLabel>
                    <RadioGroup 
                    defaultValue='No' 
                    w = "30%"
                    name="beenConvicted"
                    value={formData.beenConvicted || ''}
                    onChange={(value) => handleChange(["beenConvicted", value])}
                    >
                        <HStack spacing='24px'>
                            <Radio value='Yes'>Yes</Radio>
                            <Radio value='No'>No</Radio>
                        </HStack>
                    </RadioGroup>
                </HStack>
            </FormControl>
        </VStack>
    </>    
)};