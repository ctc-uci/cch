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
import { m } from "framer-motion";

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
  spanish
}: {
  formData: IntakeStatisticsForm;
  setFormData: React.Dispatch<React.SetStateAction<IntakeStatisticsForm>>;
  spanish:boolean
}) => {

  const { backend } = useBackendContext();
  const language = spanish ? "spanish" : "english"

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

  const fields = {
    english: {
      month:"Month",
      cm:"Case Manager",
      site:"Site",
      grant:"Grant",
      first_name:"First Name",
      last_name: "Last Name",
      birthday:"Birthday",
      age:"Age",
      ethnicity:"Ethnicity",
      race:"Race",
      phone_number:"Phone Number",
      email: "Email",
      emergency_contact_name: "Emergency Contact Name",
      emergency_contact_phone: "Emergency Contact Phone",
      entry_date: "Entry Date",
      prior_living_situation: "Prior Living Situation",
      medical: "Medical",
      assigned_case_manager: "Assigned Case Manager",
      cal_optima_funded_site: "Cal-Optima Funded Site",
      unique_id: "Unique ID #",
      disabling_condition: "Disabling Condition",
      family_size: "Family Size",
      num_children: "Number of Children",
      num_disabled_children: "Number of Children with Disability",

    },
    spanish: {
      month: "Mes",
      cm: "Administrador de Casos",
      site: "Sitio",
      grant: "Subvención",
      first_name: "Nombre",
      last_name: "Apellido",
      birthday: "Fecha de Nacimiento",
      age: "Edad",
      ethnicity: "Etnicidad",
      race: "Raza",
      phone_number: "Número de Teléfono",
      email: "Correo Electrónico",
      emergency_contact_name: "Nombre del Contacto de Emergencia",
      emergency_contact_phone: "Teléfono del Contacto de Emergencia",
      entry_date: "Fecha de Ingreso",
      prior_living_situation: "Situación de Vivienda Anterior",
      medical: "Médico",
      assigned_case_manager: "Administrador de Casos Asignado",
      cal_optima_funded_site: "Sitio Financiado por Cal-Optima",
      unique_id: "ID Único #",
      disabling_condition: "Condición Discapacitante",
      family_size: "Tamaño de la Familia",
      num_children: "Número de Niños",
      num_disabled_children: "Número de Niños con Discapacidad",
    }
  }

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
          label={fields[language]["month"]}
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
          label={fields[language]["cm"]}
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
          label={fields[language]["site"]}
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
          label={fields[language]["grant"]}
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
          label={fields[language]["first_name"]}
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          type="text"
        />
        <TextInputComponent
          label={fields[language]["last_name"]}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          type="text"
        />
        <TextInputComponent
          label={fields[language]["birthday"]}
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          type="date"
        />
        <NumberInputComponent
          label={fields[language]["age"]}
          name="age"
          value={formData.age}
          onChange={handleChange}
          min={0}
          max={125}
        />
        <SelectInputComponent
          label={fields[language]["ethnicity"]}
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
          label={fields[language]["race"]}
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
          label={fields[language]["phone_number"]}
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          type="number"
        />
        <TextInputComponent
          label={fields[language]["email"]}
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <TextInputComponent
          label={fields[language]["emergency_contact_name"]}
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
          type="text"
        />
        <TextInputComponent
          label={fields[language]["emergency_contact_phone"]}
          name="emergencyContactPhoneNumber"
          value={formData.emergencyContactPhoneNumber}
          onChange={handleChange}
          type="number"
        />
        <TextInputComponent
          label={fields[language]["entry_date"]}
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
          type="date"
        />
        <SelectInputComponent
          label={fields[language]["prior_living_situation"]}
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
          label={fields[language]["medical"]}
          name="medical"
          value={formData.medical}
          onChange={handleChange}
          width="30%"
        />
        <TextInputComponent
          label={fields[language]["assigned_case_manager"]}
          name="assignedCaseManager"
          value={formData.assignedCaseManager}
          onChange={handleChange}
          type="text"
        />
        <TrueFalseComponent
          label={fields[language]["cal_optima_funded_site"]}
          name="calOptimaFundedSite"
          value={formData.calOptimaFundedSite}
          onChange={handleChange}
          width="30%"
        />
        <TextInputComponent
          label={fields[language]["unique_id"]}
          name="uniqueId"
          value={formData.uniqueId}
          onChange={handleChange}
          type="text"
        />
        <TrueFalseComponent
          label={fields[language]["disabling_condition"]}
          name="disablingConditionForm"
          value={formData.disablingConditionForm}
          onChange={handleChange}
          width="30%"
        />
        <NumberInputComponent
          label={fields[language]["family_size"]}
          name="familySize"
          value={formData.familySize}
          onChange={handleChange}
          min={0}
          max={50}
        />
        <NumberInputComponent
          label={fields[language]["num_children"]}
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
          label={fields[language]["num_disabled_children"]}
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
  spanish
}: {
  formData: IntakeStatisticsForm;
  setFormData: React.Dispatch<React.SetStateAction<IntakeStatisticsForm>>;
  spanish: boolean
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

  const language = spanish ? "spanish" : "english"

  const fields = {
    english: {
      pregnant: "Pregnant",
      last_permanent_residence: "City of Last Permanent Residence",
      sleep_last_night: "Where did the client sleep last night?",
      last_city_residence: "Last City of Residence",
      last_city_homeless_in: "Last City Homeless In",
      shelter_last_5_years: "Has the client been in a shelter in the last 5 years?",
      num_shelters_last_5_years: "How many shelters has the client been in in the last 5 years?",
      homeless_length: "How long has the client been homeless for?",
      chronically_homeless: "Chronically homeless",
      employed_upon_entry: "Employed upon entry",
      attending_school: "Attending school upon entry",
      photo_release: "Photo release signed?",
      risk: "High Risk",
      employed: "Currently employed?",
      date_last_employment: "Date of last employement",
      domestic_violence: "History of domestic violence",
      substance_abuse: "History of Substance Abuse",
      support_system: "Support System in Place?",
      diagnosed_mental_health_condition: "Diagnosed Mental Health Condition",
      undiagnosed_mental_health_condition: "Does Case Manager believe there is an undiagnosed Mental Health Condition?",
      transportation: "Form of Transportation",
      convicted: "Convicted of a Crime"

    },
    spanish: {
      pregnant: "Embarazada",
      last_permanent_residence: "Ciudad de Última Residencia Permanente",
      sleep_last_night: "¿Dónde durmió el cliente anoche?",
      last_city_residence: "Última Ciudad de Residencia",
      last_city_homeless_in: "Última Ciudad en Situación de Calle",
      shelter_last_5_years: "¿Ha estado el cliente en un refugio en los últimos 5 años?",
      num_shelters_last_5_years: "¿En cuántos refugios ha estado el cliente en los últimos 5 años?",
      homeless_length: "¿Cuánto tiempo ha estado el cliente sin hogar?",
      chronically_homeless: "Crónicamente sin hogar",
      employed_upon_entry: "¿Empleado al ingresar?",
      attending_school: "¿Asiste a la escuela al ingresar?",
      photo_release: "¿Formulario de autorización de fotos firmado?",
      risk: "Alto Riesgo",
      employed: "¿Actualmente empleado?",
      date_last_employment: "Fecha del Último Empleo",
      domestic_violence: "Historial de Violencia Doméstica",
      substance_abuse: "Historial de Abuso de Sustancias",
      support_system: "¿Cuenta con un Sistema de Apoyo?",
      diagnosed_mental_health_condition: "Condición de Salud Mental Diagnosticada",
      undiagnosed_mental_health_condition: "¿Cree el administrador de casos que hay una condición de salud mental no diagnosticada?",
      transportation: "Medio de Transporte",
      convicted: "Condenado por un Delito"
    }
  }

  return (
    <VStack
      align="start"
      paddingX="10%"
      w="100%"
    >
      <TrueFalseComponent
        label={fields[language]["pregnant"]}
        name="pregnant"
        value={formData.pregnant}
        onChange={handleChange}
      />
      <TextInputComponent
        label={fields[language]["last_permanent_residence"]}
        name="cityLastPermanentAddress"
        value={formData.cityLastPermanentAddress}
        onChange={handleChange}
        type="text"
      />
      <TextInputComponent
        label={fields[language]["sleep_last_night"]}
        name="whereClientSleptLastNight"
        value={formData.whereClientSleptLastNight}
        onChange={handleChange}
        type="text"
      />
      <TextInputComponent
        label={fields[language]["last_city_residence"]}
        name="lastCityResided"
        value={formData.lastCityResided}
        onChange={handleChange}
        type="text"
      />
      <TextInputComponent
        label={fields[language]["last_city_homeless_in"]}
        name="lastCityHomeless"
        value={formData.lastCityHomeless}
        onChange={handleChange}
        type="text"
      />
      <TrueFalseComponent
        label={fields[language]["shelter_last_5_years"]}
        name="beenInShelterLast5Years"
        value={formData.beenInShelterLast5Years}
        onChange={handleChange}
      />
      <NumberInputComponent
        label={fields[language]["num_shelters_last_5_years"]}
        name="numberofSheltersLast5Years"
        value={formData.numberofSheltersLast5Years}
        onChange={handleChange}
        min={0}
        max={1000}
      />
      <TextInputComponent
        label={fields[language]["homeless_length"]}
        name="durationHomeless"
        value={formData.durationHomeless}
        onChange={handleChange}
        type="text"
      />
      <TrueFalseComponent
        label={fields[language]["chronically_homeless"]}
        name="chronicallyHomeless"
        value={formData.chronicallyHomeless}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["employed_upon_entry"]}
        name="employedUponEntry"
        value={formData.employedUponEntry}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["attending_school"]}
        name="attendingSchoolUponEntry"
        value={formData.attendingSchoolUponEntry}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["photo_release"]}
        name="signedPhotoRelease"
        value={formData.signedPhotoRelease}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["risk"]}
        name="highRisk"
        value={formData.highRisk}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["employed"]}
        name="currentlyEmployed"
        value={formData.currentlyEmployed}
        onChange={handleChange}
      />
      <TextInputComponent
        label={fields[language]["date_last_employment"]}
        name="dateLastEmployment"
        value={formData.dateLastEmployment}
        onChange={handleChange}
        type="date"
      />
      <TrueFalseComponent
        label={fields[language]["domestic_violence"]}
        name="historyDomesticViolence"
        value={formData.historyDomesticViolence}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["substance_abuse"]}
        name="historySubstanceAbuse"
        value={formData.historySubstanceAbuse}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["support_system"]}
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
        label={fields[language]["diagnosed_mental_health_condition"]}
        name="diagnosedMentalHealth"
        value={formData.diagnosedMentalHealth}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["undiagnosed_mental_health_condition"]}
        name="undiagnosedMentalHealth"
        value={formData.undiagnosedMentalHealth}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["transportation"]}
        name="transportation"
        value={formData.transportation}
        onChange={handleChange}
      />
      <TrueFalseComponent
        label={fields[language]["convicted"]}
        name="convictedCrime"
        value={formData.convictedCrime}
        onChange={handleChange}
      />
    </VStack>
  );
};
