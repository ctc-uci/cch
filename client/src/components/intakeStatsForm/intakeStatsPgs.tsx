import { useEffect, useState } from "react";

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { IntakeStatisticsFormPage1 } from "../../types/intakeStatisticsForm.ts";
import {
  NumberInputComponent,
  SelectInputComponent,
  TextInputComponent,
  TrueFalseComponent,
} from "./formComponents.tsx";

export const IntakeStatsPg1 = ({
  formData,
  setFormData,
}: {
  formData: IntakeStatisticsFormPage1;
  setFormData: React.Dispatch<React.SetStateAction<IntakeStatisticsFormPage1>>;
}) => {
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
        caloptimaFundedSite:
          typeof e === "string" ? e : prev.caloptimaFundedSite,
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
          field === "age"
            ? value === ""
              ? ""
              : Number(value)
            : field === "birthday"
              ? value
              : field === "ethnicity"
                ? value
                : value,
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
      children: Array.from(
        { length: childCount },
        (_, i) => prev.children?.[i] || {}
      ),
    }));
  };

  return (
    <VStack
      align="start"
      paddingX="10%"
      w="100%"
    >
      <HStack
        w="100%"
        justifyContent="space-between"
      >
        <SelectInputComponent
          label="Month"
          name="month"
          value={formData.month || ""}
          onChange={handleChange}
          placeholder="Select Month"
          options={[
            { label: "January", value: "January" },
            { label: "February", value: "February" },
            { label: "March", value: "March" },
            { label: "April", value: "April" },
            { label: "May", value: "May" },
            { label: "June", value: "June" },
            { label: "July", value: "July" },
            { label: "August", value: "August" },
            { label: "September", value: "September" },
            { label: "October", value: "October" },
            { label: "November", value: "November" },
            { label: "December", value: "December" },
          ]}
          width="50%"
        />
        <SelectInputComponent
          label="Case Manager"
          name="caseManager"
          value={formData.caseManager || ""}
          onChange={handleChange}
          options={cms
            .filter((user) => user.role === "case manager")
            .map((user) => ({
              label: `${user.firstName} ${user.lastName}`,
              value: `${user.firstName} ${user.lastName}`,
            }))}
          placeholder="Select Case Manager"
          width="70%"
        />
      </HStack>

      <VStack w="100%" marginBottom={"30px"}>
        <TextInputComponent
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          type="text"
        />
        <TextInputComponent
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          type="text"
        />
        <SelectInputComponent
          label="Ethnicity"
          name="ethnicity"
          value={formData.ethnicity || ""}
          onChange={handleChange}
          options={[
            { label: "Caucasian", value: "Caucasian" },
            { label: "Hispanic", value: "Hispanic" },
            { label: "African American", value: "African American" },
            { label: "Asian", value: "Asian" },
            {
              label: "Pacific Islander/Hawaiian",
              value: "Pacific Islander/Hawaiian",
            },
            { label: "Native American", value: "Native American" },
            { label: "Multi/Other", value: "Multi/Other" },
          ]}
          placeholder="Select Ethnicity"
          width="30%"
        />
        <TextInputComponent
          label="Birthday"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          type="date"
        />
        <NumberInputComponent
          label="Age"
          name="age"
          value={formData.age}
          onChange={(value) => setFormData((prev) => ({ ...prev, age: value }))}
          min={0}
          max={125}
        />
        <TextInputComponent
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          type="number"
        />
        <TextInputComponent
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <TextInputComponent
          label="Emergency Contact Name"
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
          type="text"
        />
        <TextInputComponent
          label="Emergency Contact Phone Number"
          name="emergencyContactPhoneNumber"
          value={formData.emergencyContactPhoneNumber}
          onChange={handleChange}
          type="number"
        />
        <SelectInputComponent
          label="Prior Living Situation"
          name="priorLivingSituation"
          value={formData.priorLivingSituation || ""}
          onChange={handleChange}
          options={[
            { label: "Couch", value: "Couch" },
            { label: "DV Shelter", value: "DV Shelter" },
            { label: "Other Shelter", value: "Other Shelter" },
            { label: "Car", value: "Car" },
            { label: "Hotel", value: "Hotel" },
            { label: "Motel", value: "Motel" },
            { label: "Streets", value: "Streets" },
            { label: "Family", value: "Family" },
            { label: "Friends", value: "Friends" },
            { label: "Prison/Jail", value: "Prison/Jail" },
            { label: "Treatment Center", value: "Treatment Center" },
          ]}
          placeholder="Select Prior Living Situation"
          width="30%"
        />
        <TextInputComponent
          label="Entry Date"
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
          type="date"
        />
        <TrueFalseComponent
          label="Medical"
          name="medical"
          value={formData.medical}
          onChange={(value) =>
            handleChange({
              target: { name: "medical", value },
            })
          }
          width="30%"
        />
        <TextInputComponent
          label="Assigned Case Manager"
          name="assignedCaseManager"
          value={formData.assignedCaseManager}
          onChange={handleChange}
          type="text"
        />
        <SelectInputComponent
          label="Site"
          name="site"
          value={formData.site || ""}
          onChange={handleChange}
          options={[
            { label: "Cypress", value: "Cypress" },
            { label: "Glencoe", value: "Glencoe" },
            { label: "Dairyview", value: "Dairyview" },
            { label: "Bridge", value: "Bridge" },
            { label: "Placentia 38", value: "Placentia 38" },
          ]}
          placeholder="Select Site"
          width="30%"
        />
        <SelectInputComponent
          label="Grant"
          name="clientGrant"
          value={formData.clientGrant || ""}
          onChange={handleChange}
          options={[
            { label: "Bridge", value: "Bridge" },
            { label: "Non Funded", value: "Non Funded" },
          ]}
          placeholder="Select Grant"
          width="30%"
        />
        <TrueFalseComponent
          label="Cal-Optima Funded Site"
          name="caloptimaFundedSite"
          value={formData.caloptimaFundedSite}
          onChange={(value) =>
            handleChange({
              target: { name: "caloptimaFundedSite", value },
            })
          }
          width="30%"
        />
        <TextInputComponent
          label="Unique ID #"
          name="uniqueId"
          value={formData.uniqueId}
          onChange={handleChange}
          type="text"
        />
        <TrueFalseComponent
          label="Disabling Condition"
          name="disablingConditionForm"
          value={formData.disablingConditionForm}
          onChange={(value) =>
            handleChange({
              target: { name: "disablingConditionForm", value },
            })
          }
          width="30%"
        />
        <NumberInputComponent
          label="Number of Children"
          name="numberOfChildren"
          value={numChildren || 0}
          onChange={outputChildPrompts}
          min={0}
          max={12}
        />
      </VStack>
      {Array.from({ length: numChildren }, (_, index) => (
        <VStack
          key={index}
          w="70%"
          align="start"
          marginBottom="40px"
          marginLeft="9%"
        >
          <TextInputComponent
            label={`Child #${index + 1} First Name`}
            name={`child[${index}].firstName`}
            value={formData.children?.[index]?.firstName || ""}
            onChange={(e) =>
              handleChildChange(index, "firstName", e.target.value)
            }
            type="text"
          />
          <TextInputComponent
            label={`Child #${index + 1} Last Name`}
            name={`child[${index}].lastName`}
            value={formData.children?.[index]?.lastName || ""}
            onChange={(e) =>
              handleChildChange(index, "lastName", e.target.value)
            }
            type="text"
          />
          <TextInputComponent
            label={`Child #${index + 1} Birthday`}
            name={`child[${index}].birthday`}
            value={formData.children?.[index]?.birthday || ""}
            onChange={(e) =>
              handleChildChange(index, "birthday", e.target.value)
            }
            type="date"
          />
          <NumberInputComponent
            label={`Child #${index + 1} Age`}
            name={`child[${index}].age`}
            value={formData.children?.[index]?.age || 0}
            onChange={(value) => handleChildChange(index, "age", value)}
            min={0}
            max={17}
          />
          <FormControl>
            <HStack>
              <FormLabel w="30%">Child #{index + 1} Ethnicity</FormLabel>
              <Select
                placeholder="Select option"
                w="30%"
                value={formData.children?.[index]?.ethnicity || ""}
                onChange={(e) =>
                  handleChildChange(index, "ethnicity", e.target.value)
                }
              >
                <option value="caucasian">Caucasian</option>
                <option value="hispanic">Hispanic</option>
                <option value="african_american">African American</option>
                <option value="asian">Asian</option>
                <option value="pacific_islander_hawaiian">
                  Pacific Islander/Hawaiian
                </option>
                <option value="native_american">Native American</option>
                <option value="multi_other">Multi/Other</option>
              </Select>
            </HStack>
          </FormControl>
        </VStack>
      ))}
    </VStack>
  );
};

export const IntakeStatsPg2 = ({ formData, setFormData }) => {
  const handleChange = (input) => {
    if (typeof input === "object" && input.target) {
      // Handles regular inputs (text, number, etc.)
      const { name, value, type } = input.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    } else {
      // Handles RadioGroup and NumberInput
      const [name, value] = input;
      setFormData((prev) => ({
        ...prev,
        [name]:
          value === "" ? "" : typeof value === "number" ? value : String(value),
      }));
    }
  };

  return (
    <>
      <VStack>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">City of Last Permanent Residence</FormLabel>
            <Input
              type="last_city"
              w="30%"
              placeholder="Type here"
              name="cityLastPermanentResidence"
              value={formData.cityLastPermanentResidence || ""}
              onChange={handleChange}
            />
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">
              Where did the client sleep last night?
            </FormLabel>
            <Input
              type="last_sleep"
              w="30%"
              placeholder="Type here"
              name="whereClientSleptLastNight"
              value={formData.whereClientSleptLastNight || ""}
              onChange={handleChange}
            />
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Last City of Residence</FormLabel>
            <Input
              type="last_residence"
              w="30%"
              placeholder="Type here"
              name="priorLivingSituation"
              value={formData.priorLivingSituation || ""}
              onChange={handleChange}
            />
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Last City Homeless In</FormLabel>
            <Input
              type="last_homeless"
              w="30%"
              placeholder="Type here"
              name="lastCityHomeless"
              value={formData.lastCityHomeless || ""}
              onChange={handleChange}
            />
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">
              Has the client been in a shelter in the last 5 years?
            </FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="beenInShelterLast5Years"
              value={formData.beenInShelterLast5Years || ""}
              onChange={(value) =>
                handleChange(["beenInShelterLast5Years", value])
              }
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">
              How many shelters has the client been in in the last 5 years?
            </FormLabel>
            <Input
              type="shelters"
              w="30%"
              placeholder="Type here"
              name="numberofSheltersLast5Years"
              value={formData.shelterInLastFiveYears || ""}
              onChange={handleChange}
            />
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">
              How many years has the client been homeless for?
            </FormLabel>
            <NumberInput
              max={100}
              min={0}
              w="30%"
              name="durationHomeless"
              value={formData.durationHomeless || ""}
              onChange={(value) => handleChange(["durationHomeless", value])}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Chronically homeless</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="chronicallyHomeless"
              value={formData.chronicallyHomeless || ""}
              onChange={(value) => handleChange(["chronicallyHomeless", value])}
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Employed upon entry</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="employedUponEntry"
              value={formData.employedUponEntry || ""}
              onChange={(value) => handleChange(["employedUponEntry", value])}
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Attending school upon entry</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="attendingSchoolUponEntry"
              value={formData.attendingSchoolUponEntry || ""}
              onChange={(value) =>
                handleChange(["attendingSchoolUponEntry", value])
              }
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Photo release signed?</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="signedPhotoRelease"
              value={formData.signedPhotoRelease || ""}
              onChange={(value) => handleChange(["signedPhotoRelease", value])}
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Currently Employed</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="currentlyEmployed"
              value={formData.currentlyEmployed || ""}
              onChange={(value) => handleChange(["currentlyEmployed", value])}
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Date of last employment</FormLabel>
            <Input
              type="date"
              placeholder="Select a date"
              w="30%"
              name="dateLastEmployment"
              value={formData.lastEmployment || ""}
              onChange={handleChange}
            />
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">History of domestic violence</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="historyDomesticViolence"
              value={formData.historyDomesticViolence || ""}
              onChange={(value) =>
                handleChange(["historyDomesticViolence", value])
              }
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">History of Substance Abuse</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="historySubstanceAbuse"
              value={formData.historySubstanceAbuse || ""}
              onChange={(value) =>
                handleChange(["historySubstanceAbuse", value])
              }
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          {/* Support system in place */}
          <FormHelperText>
            Do not include government programs/services(Ex. Church).
          </FormHelperText>
          <HStack>
            <FormLabel w="30%">Support System in Place?</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="supportSystem"
              value={formData.supportSystem || ""}
              onChange={(value) => handleChange(["supportSystem", value])}
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
          {formData.supportSystem === "Yes" && (
            <>
              <HStack
                marginLeft={"60px"}
                marginTop={"30px"}
                marginBottom={"10px"}
              >
                <FormLabel w="30%">Housing</FormLabel>
                <Input
                  type="supportHousing"
                  w="30%"
                  placeholder="Type here"
                  name="supportHousing"
                  value={formData.supportHousing || ""}
                  onChange={handleChange}
                />
              </HStack>
              <HStack
                marginLeft={"60px"}
                marginBottom={"10px"}
              >
                <FormLabel w="30%">Support Food</FormLabel>
                <Input
                  type="homeless_years"
                  w="30%"
                  placeholder="Type here"
                  name="supportFood"
                  value={formData.supportFood || ""}
                  onChange={handleChange}
                />
              </HStack>
              <HStack
                marginLeft={"60px"}
                marginBottom={"30px"}
              >
                <FormLabel w="30%">Assistance with childcare</FormLabel>
                <Input
                  type="homeless_years"
                  w="30%"
                  placeholder="Type here"
                  name="supportChildcare"
                  value={formData.supportChildcare || ""}
                  onChange={handleChange}
                />
              </HStack>
            </>
          )}
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Diagnosed Mental Health Condition</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="diagnosedMentalhHealth"
              value={formData.diagnosedMentalhHealth || ""}
              onChange={(value) =>
                handleChange(["diagnosedMentalhHealth", value])
              }
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">
              Does Case Manager believe there is an undiagnosed Mental Health
              Condition?
            </FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="undiagnosedMentalHealth"
              value={formData.undiagnosedMentalHealth || ""}
              onChange={(value) =>
                handleChange(["mentalHealthUndiagnosed", value])
              }
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Form of Transportation</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="transportation"
              value={formData.transportation || ""}
              onChange={(value) => handleChange(["transportation", value])}
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
        <FormControl w="70%">
          <HStack>
            <FormLabel w="30%">Convicted of a Crime</FormLabel>
            <RadioGroup
              defaultValue="No"
              w="30%"
              name="convictedCrime"
              value={formData.convictedCrime || ""}
              onChange={(value) => handleChange(["convictedCrime", value])}
            >
              <HStack spacing="24px">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>
      </VStack>
    </>
  );
};
