import { Td, Tr } from "@chakra-ui/react";

import {
  NumberInputComponent,
  SelectInputComponent,
  TextInputComponent,
  TrueFalseComponent,
} from "../intakeStatsForm/formComponents";

const ethnicityOptions = [
  { label: "Non-Hispanic", value: "Non-Hispanic" },
  { label: "Hispanic", value: "Hispanic" },
  { label: "Refused", value: "Refused" },
];

const raceOptions = [
  { label: "White", value: "White" },
  { label: "Black or African American", value: "Black or African American" },
  { label: "Asian", value: "Asian" },
  { label: "Native Hawaiian or Other Pacific Islander", value: "Native Hawaiian or Other Pacific Islander" },
  { label: "American Indian or Alaska Native", value: "American Indian or Alaska Native" },
  { label: "Other", value: "Other" },
];

const priorLivingOptions = [
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
];

const siteOptions = [
  { label: "Cypress", value: "Cypress" },
  { label: "Glencoe", value: "Glencoe" },
  { label: "Dairyview", value: "Dairyview" },
  { label: "Bridge", value: "Bridge" },
  { label: "Placentia 38", value: "Placentia 38" },
];

const clientGrantOptions = [
  { label: "Bridge", value: "Bridge" },
  { label: "Non-Funded", value: "Non-Funded" },
];

export const IntakeStatisticsTableBody = (formData, handleChange) => {
  return (
    <>
      <Tr>
        <Td fontSize="medium">Date</Td>
        <Td>
          <TextInputComponent
            name="date"
            value={formData.date}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Month</Td>
        <Td>
          <TextInputComponent
            name="month"
            value={formData.month}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Manager</Td>
        <Td>
          <TextInputComponent
            name="caseManager"
            value={formData.caseManager}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Manager ID</Td>
        <Td>
          <NumberInputComponent
            name="cmId"
            value={formData.cmId}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">First Name</Td>
        <Td>
          <TextInputComponent
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Last Name</Td>
        <Td>
          <TextInputComponent
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Ethnicity</Td>
        <Td>
          <SelectInputComponent
            name="ethnicity"
            value={formData.ethnicity}
            onChange={handleChange}
            placeholder="Select Ethnicity"
            options={ethnicityOptions}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Race</Td>
        <Td>
          <SelectInputComponent
            name="race"
            value={formData.race}
            onChange={handleChange}
            placeholder="Select Race"
            options={raceOptions}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Birthday</Td>
        <Td>
          <TextInputComponent
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Age</Td>
        <Td>
          <NumberInputComponent
            name="age"
            value={formData.age}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Phone Number</Td>
        <Td>
          <TextInputComponent
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Email</Td>
        <Td>
          <TextInputComponent
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Emergency Contact Name</Td>
        <Td>
          <TextInputComponent
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Emergency Contact Phone Number</Td>
        <Td>
          <TextInputComponent
            name="emergencyContactPhoneNumber"
            value={formData.emergencyContactPhoneNumber}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Prior Living Situation</Td>
        <Td>
          <SelectInputComponent
            name="priorLivingSituation"
            value={formData.priorLivingSituation}
            onChange={handleChange}
            placeholder="Select Prior Living"
            options={priorLivingOptions}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Entry Date</Td>
        <Td>
          <TextInputComponent
            name="entryDate"
            value={formData.entryDate}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Medical</Td>
        <Td>
          <TrueFalseComponent
            name="medical"
            value={formData.medical}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Assigned Case Manager</Td>
        <Td>
          <TextInputComponent
            name="assignedCaseManager"
            value={formData.assignedCaseManager}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Site</Td>
        <Td>
          <SelectInputComponent
            name="site"
            value={formData.site}
            onChange={handleChange}
            placeholder="Select Site"
            options={siteOptions}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Client Grant</Td>
        <Td>
          <SelectInputComponent
            name="clientGrant"
            value={formData.clientGrant}
            onChange={handleChange}
            placeholder="Select Grant"
            options={clientGrantOptions}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">CalOptima Funded Site</Td>
        <Td>
          <TrueFalseComponent
            name="calOptimaFundedSite"
            value={formData.calOptimaFundedSite}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Unique ID</Td>
        <Td>
          <TextInputComponent
            name="uniqueId"
            value={formData.uniqueId}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Disabling Condition Form</Td>
        <Td>
          <TrueFalseComponent
            name="disablingConditionForm"
            value={formData.disablingConditionForm}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Family Size</Td>
        <Td>
          <NumberInputComponent
            name="familySize"
            value={formData.familySize}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Number of Children</Td>
        <Td>
          <NumberInputComponent
            name="numberOfChildren"
            value={formData.numberOfChildren}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Number of Children with Disability</Td>
        <Td>
          <NumberInputComponent
            name="numberOfChildrenWithDisability"
            value={formData.numberOfChildrenWithDisability}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Pregnant</Td>
        <Td>
          <TrueFalseComponent
            name="pregnant"
            value={formData.pregnant}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">City of Last Permanent Address</Td>
        <Td>
          <TextInputComponent
            name="cityLastPermanentAddress"
            value={formData.cityLastPermanentAddress}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Where Client Slept Last Night</Td>
        <Td>
          <TextInputComponent
            name="whereClientSleptLastNight"
            value={formData.whereClientSleptLastNight}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Last City Resided</Td>
        <Td>
          <TextInputComponent
            name="lastCityResided"
            value={formData.lastCityResided}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Last City Homeless</Td>
        <Td>
          <TextInputComponent
            name="lastCityHomeless"
            value={formData.lastCityHomeless}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Been in Shelter Last 5 Years</Td>
        <Td>
          <TrueFalseComponent
            name="beenInShelterLast5Years"
            value={formData.beenInShelterLast5Years}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Number of Shelters Last 5 Years</Td>
        <Td>
          <TextInputComponent
            name="numberOfSheltersLast5Years"
            value={formData.numberOfSheltersLast5Years}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Duration Homeless</Td>
        <Td>
          <TextInputComponent
            name="durationHomeless"
            value={formData.durationHomeless}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Chronically Homeless</Td>
        <Td>
          <TrueFalseComponent
            name="chronicallyHomeless"
            value={formData.chronicallyHomeless}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Employed Upon Entry</Td>
        <Td>
          <TrueFalseComponent
            name="employedUponEntry"
            value={formData.employedUponEntry}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Attending School Upon Entry</Td>
        <Td>
          <TrueFalseComponent
            name="attendingSchoolUponEntry"
            value={formData.attendingSchoolUponEntry}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Signed Photo Release</Td>
        <Td>
          <TrueFalseComponent
            name="signedPhotoRelease"
            value={formData.signedPhotoRelease}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">High Risk</Td>
        <Td>
          <TrueFalseComponent
            name="highRisk"
            value={formData.highRisk}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Currently Employed</Td>
        <Td>
          <TrueFalseComponent
            name="currentlyEmployed"
            value={formData.currentlyEmployed}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Date Last Employment</Td>
        <Td>
          <TextInputComponent
            name="dateLastEmployment"
            value={formData.dateLastEmployment}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">History of Domestic Violence</Td>
        <Td>
          <TrueFalseComponent
            name="historyDomesticViolence"
            value={formData.historyDomesticViolence}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">History of Substance Abuse</Td>
        <Td>
          <TrueFalseComponent
            name="historySubstanceAbuse"
            value={formData.historySubstanceAbuse}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Support System</Td>
        <Td>
          <TrueFalseComponent
            name="supportSystem"
            value={formData.supportSystem}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Support Housing</Td>
        <Td>
          <TrueFalseComponent
            name="supportHousing"
            value={formData.supportHousing}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Support Food</Td>
        <Td>
          <TrueFalseComponent
            name="supportFood"
            value={formData.supportFood}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Support Childcare</Td>
        <Td>
          <TrueFalseComponent
            name="supportChildcare"
            value={formData.supportChildcare}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Diagnosed Mental Health</Td>
        <Td>
          <TrueFalseComponent
            name="diagnosedMentalHealth"
            value={formData.diagnosedMentalHealth}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Undiagnosed Mental Health</Td>
        <Td>
          <TrueFalseComponent
            name="undiagnosedMentalHealth"
            value={formData.undiagnosedMentalHealth}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Transportation</Td>
        <Td>
          <TrueFalseComponent
            name="transportation"
            value={formData.transportation}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Convicted of a Crime</Td>
        <Td>
          <TrueFalseComponent
            name="convictedCrime"
            value={formData.convictedCrime}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
