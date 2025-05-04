import { Td, Tr } from "@chakra-ui/react";

import {
  NumberInputComponent,
  SelectInputComponent,
  TextInputComponent,
  TrueFalseComponent
} from "../intakeStatsForm/formComponents";

export const InitialScreenerTableBody = ({
  formData,
  handleChange,
}: {
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <>
      <Tr>
        <Td fontSize="medium">Applicant Type</Td>
        <Td>
          <TextInputComponent
            name="applicantType"
            value={formData.applicantType}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Name</Td>
        <Td>
          <TextInputComponent
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
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
            max={125}
            width="100%"
          />
        </Td>
      </Tr>
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
        <Td fontSize="medium">Marital Status</Td>
        <Td>
          <SelectInputComponent
            name="maritalStatus"
            value={formData.maritalStatus || ""}
            onChange={handleChange}
            placeholder="Select Marital Status"
            options={[
              { label: "single", value: "single" },
              { label: "married", value: "married" },
              { label: "divorced", value: "divorced" },
              { label: "widowed", value: "widowed" },
            ]}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Date of Birth</Td>
        <Td>
          <TextInputComponent
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            type="date"
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
        <Td fontSize="medium">SSN (Last Four Digits)</Td>
        <Td>
          <NumberInputComponent
            name="ssnLastFour"
            value={formData.ssnLastFour}
            onChange={handleChange}
            min={0}
            max={9999}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Ethnicity</Td>
        <Td>
          <SelectInputComponent
            name="ethnicity"
            value={formData.ethnicity || ""}
            onChange={handleChange}
            placeholder="Select Ethnicity"
            options={[
              { label: "Non-Hispanic", value: "Non-Hispanic" },
              { label: "Hispanic", value: "Hispanic" },
              { label: "Refused", value: "Refused" },
            ]}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Veteran</Td>
        <Td>
          <TrueFalseComponent
            name="veteran"
            value={formData.veteran}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Disabled</Td>
        <Td>
          <TrueFalseComponent
            name="disabled"
            value={formData.disabled}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Current Address</Td>
        <Td>
          <TextInputComponent
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Last Permanent Address</Td>
        <Td>
          <TextInputComponent
            name="lastPermAddress"
            value={formData.lastPermAddress}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Reason for Leaving Permanent Address</Td>
        <Td>
          <TextInputComponent
            name="reasonForLeavingPermAddress"
            value={formData.reasonForLeavingPermAddress}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Where Did You Reside Last Night</Td>
        <Td>
          <TextInputComponent
            name="whereResideLastNight"
            value={formData.whereResideLastNight}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Currently Homeless</Td>
        <Td>
          <TrueFalseComponent
            name="currentlyHomeless"
            value={formData.currentlyHomeless}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Event Leading to Homelessness</Td>
        <Td>
          <TextInputComponent
            name="eventLeadingToHomelessness"
            value={formData.eventLeadingToHomelessness}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Duration of Homelessness</Td>
        <Td>
          <TextInputComponent
            name="howLongExperiencingHomelessness"
            value={formData.howLongExperiencingHomelessness}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Previously Applied to CCH</Td>
        <Td>
          <TrueFalseComponent
            name="prevAppliedToCch"
            value={formData.prevAppliedToCch}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">When Previously Applied to CCH</Td>
        <Td>
          <TextInputComponent
            name="whenPrevAppliedToCch"
            value={formData.whenPrevAppliedToCch}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Previously in CCH</Td>
        <Td>
          <TrueFalseComponent
            name="prevInCch"
            value={formData.prevInCch}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">When Previously in CCH</Td>
        <Td>
          <TextInputComponent
            name="whenPrevInCch"
            value={formData.whenPrevInCch}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Child's Name</Td>
        <Td>
          <TextInputComponent
            name="childName"
            value={formData.childName}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Child's Date of Birth</Td>
        <Td>
          <TextInputComponent
            name="childDob"
            value={formData.childDob}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Custody of Child</Td>
        <Td>
          <TrueFalseComponent
            name="custodyOfChild"
            value={formData.custodyOfChild}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Father's Name</Td>
        <Td>
          <TextInputComponent
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Name of School Attended by Child(ren)</Td>
        <Td>
          <TextInputComponent
            name="nameSchoolChildrenAttend"
            value={formData.nameSchoolChildrenAttend}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">City of School</Td>
        <Td>
          <TextInputComponent
            name="cityOfSchool"
            value={formData.cityOfSchool}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">How Did You Hear About CCH</Td>
        <Td>
          <TextInputComponent
            name="howHearAboutCch"
            value={formData.howHearAboutCch}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Programs Participated In Previously</Td>
        <Td>
          <TextInputComponent
            name="programsBeenInBefore"
            value={formData.programsBeenInBefore}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Monthly Income</Td>
        <Td>
          <NumberInputComponent
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Sources of Income</Td>
        <Td>
          <TextInputComponent
            name="sourcesOfIncome"
            value={formData.sourcesOfIncome}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Monthly Bills</Td>
        <Td>
          <TextInputComponent
            name="monthlyBills"
            value={formData.monthlyBills}
            onChange={handleChange}
            type="text"
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
        <Td fontSize="medium">Last Employer</Td>
        <Td>
          <TextInputComponent
            name="lastEmployer"
            value={formData.lastEmployer}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Last Employment Date</Td>
        <Td>
          <TextInputComponent
            name="lastEmployedDate"
            value={formData.lastEmployedDate}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Education History</Td>
        <Td>
          <TextInputComponent
            name="educationHistory"
            value={formData.educationHistory}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Transportation</Td>
        <Td>
          <TextInputComponent
            name="transportation"
            value={formData.transportation}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Legal Resident</Td>
        <Td>
          <TrueFalseComponent
            name="legalResident"
            value={formData.legalResident}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Medical Coverage</Td>
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
        <Td fontSize="medium">City of Medical Coverage</Td>
        <Td>
          <TextInputComponent
            name="medicalCity"
            value={formData.medicalCity}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Medical Insurance Provider</Td>
        <Td>
          <TextInputComponent
            name="medicalInsurance"
            value={formData.medicalInsurance}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Medications</Td>
        <Td>
          <TextInputComponent
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Domestic Violence History</Td>
        <Td>
          <TextInputComponent
            name="domesticViolenceHistory"
            value={formData.domesticViolenceHistory}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Social Worker</Td>
        <Td>
          <TextInputComponent
            name="socialWorker"
            value={formData.socialWorker}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Social Worker Telephone</Td>
        <Td>
          <TextInputComponent
            name="socialWorkerTelephone"
            value={formData.socialWorkerTelephone}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Social Worker Office Location</Td>
        <Td>
          <TextInputComponent
            name="socialWorkerOfficeLocation"
            value={formData.socialWorkerOfficeLocation}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Length of Sobriety</Td>
        <Td>
          <TextInputComponent
            name="lengthOfSobriety"
            value={formData.lengthOfSobriety}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Last Drug Use</Td>
        <Td>
          <TextInputComponent
            name="lastDrugUse"
            value={formData.lastDrugUse}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Last Alcohol Use</Td>
        <Td>
          <TextInputComponent
            name="lastAlcoholUse"
            value={formData.lastAlcoholUse}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Time Using Drugs/Alcohol</Td>
        <Td>
          <TextInputComponent
            name="timeUsingDrugsAlcohol"
            value={formData.timeUsingDrugsAlcohol}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Been Convicted</Td>
        <Td>
          <TrueFalseComponent
            name="beenConvicted"
            value={formData.beenConvicted}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Conviction Reason and Time</Td>
        <Td>
          <TextInputComponent
            name="convictedReasonAndTime"
            value={formData.convictedReasonAndTime}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Present Warrant Exists</Td>
        <Td>
          <TrueFalseComponent
            name="presentWarrantExist"
            value={formData.presentWarrantExist}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Warrant County</Td>
        <Td>
          <TextInputComponent
            name="warrantCounty"
            value={formData.warrantCounty}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Probation/Parole Officer</Td>
        <Td>
          <TextInputComponent
            name="probationParoleOfficer"
            value={formData.probationParoleOfficer}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Probation/Parole Officer Telephone</Td>
        <Td>
          <TextInputComponent
            name="probationParoleOfficerTelephone"
            value={formData.probationParoleOfficerTelephone}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Personal Reference Name</Td>
        <Td>
          <TextInputComponent
            name="personalReferences"
            value={formData.personalReferences}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Personal Reference Telephone</Td>
        <Td>
          <TextInputComponent
            name="personalReferenceTelephone"
            value={formData.personalReferenceTelephone}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Future Plans and Goals</Td>
        <Td>
          <TextInputComponent
            name="futurePlansGoals"
            value={formData.futurePlansGoals}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Previous Household Composition</Td>
        <Td>
          <TextInputComponent
            name="lastPermanentResidenceHouseholdComposition"
            value={formData.lastPermanentResidenceHouseholdComposition}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Reason for Leaving Last Residence</Td>
        <Td>
          <TextInputComponent
            name="whyNoLongerAtLastResidence"
            value={formData.whyNoLongerAtLastResidence}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">What Could Prevent Homelessness</Td>
        <Td>
          <TextInputComponent
            name="whatCouldPreventHomeless"
            value={formData.whatCouldPreventHomeless}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
