import { useEffect, useState } from "react";

import { HStack, VStack } from "@chakra-ui/react";

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
  const [numberOfChildren, setNumberOfChildren] = useState(
    formData.numberOfChildren || 0
  );

  const { backend } = useBackendContext();

  const [cms, setCms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/casemanagers");
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
              : field === "race"
                ? value
                : value,
      };

      return { ...prev, children: updatedChildren };
    });
  };

  const outputChildPrompts = (val) => {
    const childCount = Number(val);
    setNumberOfChildren(childCount);
    setFormData((prev) => ({
      ...prev,
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
          onChange={(e) => {
            const selectedCaseManager = cms.find(
              (user) => `${user.firstName} ${user.lastName}` === e.target.value
            );
            setFormData((prev) => ({
              ...prev,
              caseManager: e.target.value, // Set the case manager's name
              cmId: selectedCaseManager?.id || null, // Set the case manager's ID
            }));
          }}
          options={cms
            .filter((user) => user.role === "case manager")
            .map((user) => ({
              key: user.id,
              label: `${user.firstName} ${user.lastName}`,
              value: `${user.firstName} ${user.lastName}`,
            }))}
          placeholder="Select Case Manager"
          width="70%"
        />
      </HStack>

      <VStack
        w="100%"
        marginBottom={"30px"}
      >
        {/* <TextInputComponent
          label="Date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          type="date"
        /> */}
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
            { label: "Non Funded", value: "Non-Funded" },
          ]}
          placeholder="Select Grant"
          width="30%"
        />
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
        <SelectInputComponent
          label="Ethnicity"
          name="ethnicity"
          value={formData.ethnicity || ""}
          onChange={handleChange}
          options={[
            { label: "Non-Hispanic", value: "Non-Hispanic" },
            { label: "Hispanic", value: "Hispanic" },
            { label: "Refused", value: "Refused" },
          ]}
          placeholder="Select Ethnicity"
          width="30%"
        />
        <SelectInputComponent
          label="Race"
          name="race"
          value={formData.race || ""}
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
          placeholder="Select Race"
          width="30%"
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
        <TextInputComponent
          label="Entry Date"
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
          type="date"
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
        <TrueFalseComponent
          label="Cal-Optima Funded Site"
          name="calOptimaFundedSite"
          value={formData.calOptimaFundedSite}
          onChange={(value) =>
            handleChange({
              target: { name: "calOptimaFundedSite", value },
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
          label="Family Size"
          name="familySize"
          value={formData.familySize}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, familySize: value }))
          }
          min={0}
          max={50}
        />
        <NumberInputComponent
          label="Number of Children"
          name="numberOfChildren"
          value={formData.numberOfChildren}
          onChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              numberOfChildren: value,
            }));
            outputChildPrompts(value);
          }}
          min={0}
          max={12}
        />
        <NumberInputComponent
          label="Number of Children with Disability"
          name="numberOfChildrenWithDisability"
          value={formData.numberOfChildrenWithDisability}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              numberOfChildrenWithDisability: value,
            }))
          }
          min={0}
          max={12}
        />
      </VStack>
      {Array.from({ length: numberOfChildren }, (_, index) => (
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
          <SelectInputComponent
            label={`Child #${index + 1} Race`}
            name={`child[${index}].race`}
            value={formData.children?.[index]?.race}
            onChange={(value) => handleChildChange(index, "race", value)}
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
            placeholder="Select Race"
            width="30%"
          />
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
    <VStack
      align="start"
      paddingX="10%"
      w="100%"
    >
      <TrueFalseComponent
        label="Pregnant"
        name="pregnant"
        value={formData.pregnant}
        onChange={(value) =>
          handleChange({
            target: { name: "pregnant", value },
          })
        }
      />
      <TextInputComponent
        label="City of Last Permanent Residence"
        name="cityLastPermanentAddress"
        value={formData.cityLastPermanentAddress}
        onChange={handleChange}
        type="text"
      />
      <TextInputComponent
        label="Where did the client sleep last night?"
        name="whereClientSleptLastNight"
        value={formData.whereClientSleptLastNight}
        onChange={handleChange}
        type="text"
      />
      <TextInputComponent
        label="Last City of Residence"
        name="lastCityResided"
        value={formData.lastCityResided}
        onChange={handleChange}
        type="text"
      />
      <TextInputComponent
        label="Last City Homeless In"
        name="lastCityHomeless"
        value={formData.lastCityHomeless}
        onChange={handleChange}
        type="text"
      />
      <TrueFalseComponent
        label="Has the client been in a shelter in the last 5 years?"
        name="beenInShelterLast5Years"
        value={formData.beenInShelterLast5Years}
        onChange={(value) =>
          handleChange({
            target: { name: "beenInShelterLast5Years", value },
          })
        }
      />
      <NumberInputComponent
        label="How many shelters has the client been in in the last 5 years?"
        name="numberofSheltersLast5Years"
        value={formData.numberofSheltersLast5Years}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            numberofSheltersLast5Years: value,
          }))
        }
        min={0}
        max={1000}
      />
      <TextInputComponent
        label="How long has the client been homeless for?"
        name="durationHomeless"
        value={formData.durationHomeless}
        onChange={handleChange}
        type="text"
      />
      <TrueFalseComponent
        label="Chronically homeless"
        name="chronicallyHomeless"
        value={formData.chronicallyHomeless}
        onChange={(value) =>
          handleChange({
            target: { name: "chronicallyHomeless", value },
          })
        }
      />
      <TrueFalseComponent
        label="Employed upon entry"
        name="employedUponEntry"
        value={formData.employedUponEntry}
        onChange={(value) =>
          handleChange({
            target: { name: "employedUponEntry", value },
          })
        }
      />
      <TrueFalseComponent
        label="Attending school upon entry"
        name="attendingSchoolUponEntry"
        value={formData.attendingSchoolUponEntry}
        onChange={(value) =>
          handleChange({
            target: { name: "attendingSchoolUponEntry", value },
          })
        }
      />
      <TrueFalseComponent
        label="Photo release signed?"
        name="signedPhotoRelease"
        value={formData.signedPhotoRelease}
        onChange={(value) =>
          handleChange({
            target: { name: "signedPhotoRelease", value },
          })
        }
      />
      <TrueFalseComponent
        label="High Risk"
        name="highRisk"
        value={formData.highRisk}
        onChange={(value) =>
          handleChange({
            target: { name: "highRisk", value },
          })
        }
      />
      <TrueFalseComponent
        label="Currently Employed"
        name="currentlyEmployed"
        value={formData.currentlyEmployed}
        onChange={(value) =>
          handleChange({
            target: { name: "currentlyEmployed", value },
          })
        }
      />
      <TextInputComponent
        label="Date of last employment"
        name="dateLastEmployment"
        value={formData.dateLastEmployment}
        onChange={handleChange}
        type="date"
      />
      <TrueFalseComponent
        label="History of domestic violence"
        name="historyDomesticViolence"
        value={formData.historyDomesticViolence}
        onChange={(value) =>
          handleChange({
            target: { name: "historyDomesticViolence", value },
          })
        }
      />
      <TrueFalseComponent
        label="History of Substance Abuse"
        name="historySubstanceAbuse"
        value={formData.historySubstanceAbuse}
        onChange={(value) =>
          handleChange({
            target: { name: "historySubstanceAbuse", value },
          })
        }
      />
      <TrueFalseComponent
        label="Support System in Place?"
        helperText="Do not include government programs/services(Ex. Church)"
        name="historySubstanceAbuse"
        value={formData.supportSystem}
        onChange={(value) =>
          handleChange({
            target: { name: "supportSystem", value },
          })
        }
      />
      {formData.supportSystem === true && (
        <VStack marginLeft={"5%"} w={"100%"}>
          <TrueFalseComponent
            label="Housing"
            name="supportHousing"
            value={formData.supportHousing}
            onChange={(value) =>
              handleChange({
                target: { name: "supportHousing", value },
              })
            }
          />
          <TrueFalseComponent
            label="Support Food"
            name="supportFood"
            value={formData.supportFood}
            onChange={(value) =>
              handleChange({
                target: { name: "supportFood", value },
              })
            }
          />
          <TrueFalseComponent
            label="Assistance with childcare"
            name="supportChildcare"
            value={formData.supportChildcare}
            onChange={(value) =>
              handleChange({
                target: { name: "supportChildcare", value },
              })
            }
          />
        </VStack>
      )}
      <TrueFalseComponent
        label="Diagnosed Mental Health Condition"
        name="diagnosedMentalHealth"
        value={formData.diagnosedMentalHealth}
        onChange={(value) =>
          handleChange({
            target: { name: "diagnosedMentalHealth", value },
          })
        }
      />
      <TrueFalseComponent
        label="Does Case Manager believe there is an undiagnosed Mental Health Condition?"
        name="undiagnosedMentalHealth"
        value={formData.undiagnosedMentalHealth}
        onChange={(value) =>
          handleChange({
            target: { name: "undiagnosedMentalHealth", value },
          })
        }
      />
      <TrueFalseComponent
        label="Form of Transportation"
        name="transportation"
        value={formData.transportation}
        onChange={(value) =>
          handleChange({
            target: { name: "transportation", value },
          })
        }
      />
      <TrueFalseComponent
        label="Convicted of a Crime"
        name="convictedCrime"
        value={formData.convictedCrime}
        onChange={(value) =>
          handleChange({
            target: { name: "convictedCrime", value },
          })
        }
      />
    </VStack>
  );
};
