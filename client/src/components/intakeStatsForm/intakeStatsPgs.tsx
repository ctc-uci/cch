import { useEffect, useState } from "react";

import { HStack, VStack } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type {
  ChildData,
  IntakeStatisticsForm,
} from "../../types/intakeStatisticsForm.ts";
import {
  NumberInputComponent,
  SelectInputComponent,
  TextInputComponent,
  TrueFalseComponent,
} from "./formComponents.tsx";

// Default child object
const DEFAULT_CHILD: ChildData = {
  firstName: "",
  lastName: "",
  birthday: "",
  age: 0,
  race: "",
};

export const IntakeStatsPg1 = ({
  formData,
  setFormData,
}: {
  formData: IntakeStatisticsForm;
  setFormData: React.Dispatch<React.SetStateAction<IntakeStatisticsForm>>;
}) => {

  const { backend } = useBackendContext();

  const [cms, setCms] = useState<
    { id: string; firstName: string; lastName: string; role: string }[]
  >([]);

  useEffect(() => {
    const fetchCaseManagers = async () => {
      try {
        const response = await backend.get("/casemanagers");
        setCms(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchCaseManagers();
  }, [backend]);

  // const handleCaseManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   const selectedCaseManager = cms.find(
  //     (user) => `${user.firstName} ${user.lastName}` === value
  //   );

  //   setFormData(prev => ({
  //     ...prev,
  //     caseManager: value,
  //     cmId: selectedCaseManager.id
  //   }));
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles child fields separately
  const handleChildChange = (
    index: number,
    field: keyof ChildData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedChildren = [...(prev.children ?? [])];

      updatedChildren[index] = {
        ...(updatedChildren[index] || DEFAULT_CHILD),
        [field]: field === "age" ? (value === "" ? 0 : Number(value)) : value,
      };

      return { ...prev, children: updatedChildren };
    });
  };

  const createChildrenArray = (val: string | number) => {
    const childCount = Number(val);
    setFormData((prev) => ({
      ...prev,
      children: Array.from(
        { length: childCount },
        (_, i) => prev.children?.[i] || DEFAULT_CHILD
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
          width="30%"
        />
        <NumberInputComponent
          label="Family Size"
          name="familySize"
          value={formData.familySize}
          onChange={handleChange}
          min={0}
          max={50}
        />
        <NumberInputComponent
          label="Number of Children"
          name="numberOfChildren"
          value={formData.numberOfChildren}
          onChange={(e) => {
            handleChange(e);
            createChildrenArray(formData.numberOfChildren);
          }}
          min={0}
          max={12}
        />
        <NumberInputComponent
          label="Number of Children with Disability"
          name="numberOfChildrenWithDisability"
          value={formData.numberOfChildrenWithDisability}
          onChange={handleChange}
          min={0}
          max={12}
        />
      </VStack>
      {Array.from({ length: formData.numberOfChildren }, (_, index) => (
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
            onChange={(e) => {
              handleChildChange(index, "age", Number(e.target.value));
            }}
            min={0}
            max={17}
          />
          <SelectInputComponent
            label={`Child #${index + 1} Race`}
            name={`child[${index}].race`}
            value={formData.children?.[index]?.race}
            onChange={(e) => handleChildChange(index, "race", e.target.value)}
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

export const IntakeStatsPg2 = ({
  formData,
  setFormData,
}: {
  formData: IntakeStatisticsForm;
  setFormData: React.Dispatch<React.SetStateAction<IntakeStatisticsForm>>;
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        onChange={handleChange}
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
        onChange={handleChange}
      />
      <NumberInputComponent
        label="How many shelters has the client been in in the last 5 years?"
        name="numberofSheltersLast5Years"
        value={formData.numberofSheltersLast5Years}
        onChange={handleChange}
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
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Employed upon entry"
        name="employedUponEntry"
        value={formData.employedUponEntry}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Attending school upon entry"
        name="attendingSchoolUponEntry"
        value={formData.attendingSchoolUponEntry}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Photo release signed?"
        name="signedPhotoRelease"
        value={formData.signedPhotoRelease}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="High Risk"
        name="highRisk"
        value={formData.highRisk}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Currently Employed"
        name="currentlyEmployed"
        value={formData.currentlyEmployed}
        onChange={handleChange}
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
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="History of Substance Abuse"
        name="historySubstanceAbuse"
        value={formData.historySubstanceAbuse}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Support System in Place?"
        helperText="Do not include government programs/services(Ex. Church)"
        name="supportSystem"
        value={formData.supportSystem}
        onChange={handleChange}
      />
      {formData.supportSystem === true && (
        <VStack
          marginLeft={"5%"}
          w={"100%"}
        >
          <TrueFalseComponent
            label="Housing"
            name="supportHousing"
            value={formData.supportHousing}
            onChange={handleChange}
          />
          <TrueFalseComponent
            label="Support Food"
            name="supportFood"
            value={formData.supportFood}
            onChange={handleChange}
          />
          <TrueFalseComponent
            label="Assistance with childcare"
            name="supportChildcare"
            value={formData.supportChildcare}
            onChange={handleChange}
          />
        </VStack>
      )}
      <TrueFalseComponent
        label="Diagnosed Mental Health Condition"
        name="diagnosedMentalHealth"
        value={formData.diagnosedMentalHealth}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Does Case Manager believe there is an undiagnosed Mental Health Condition?"
        name="undiagnosedMentalHealth"
        value={formData.undiagnosedMentalHealth}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Form of Transportation"
        name="transportation"
        value={formData.transportation}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label="Convicted of a Crime"
        name="convictedCrime"
        value={formData.convictedCrime}
        onChange={handleChange}
      />
    </VStack>
  );
};
