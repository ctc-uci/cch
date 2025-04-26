import { Td, Tr } from "@chakra-ui/react";

import {
  NumberInputComponent,
  TextInputComponent,
} from "../intakeStatsForm/formComponents";

export const CaseManagerMonthlyTableBody = ({
  formData,
  handleChange,
}: {
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
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
        <Td fontSize="medium">Total Number of Contacts</Td>
        <Td>
          <NumberInputComponent
            name="totalNumberOfContacts"
            value={formData.totalNumberOfContacts}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Women's Birthdays</Td>
        <Td>
          <NumberInputComponent
            name="womenBirthdays"
            value={formData.womenBirthdays}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Kid's Birthdays</Td>
        <Td>
          <NumberInputComponent
            name="kidBirthdays"
            value={formData.kidBirthdays}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Birthday Cards Given</Td>
        <Td>
          <NumberInputComponent
            name="birthdayCards"
            value={formData.birthdayCards}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Value of Birthday Cards</Td>
        <Td>
          <NumberInputComponent
            name="birthdayCardsValue"
            value={formData.birthdayCardsValue}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Food Cards Given</Td>
        <Td>
          <NumberInputComponent
            name="foodCards"
            value={formData.foodCards}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Value of Food Cards</Td>
        <Td>
          <NumberInputComponent
            name="foodCardsValue"
            value={formData.foodCardsValue}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Bus Passes Given</Td>
        <Td>
          <NumberInputComponent
            name="busPasses"
            value={formData.busPasses}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Value of Bus Passes</Td>
        <Td>
          <NumberInputComponent
            name="busPassesValue"
            value={formData.busPassesValue}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Gas Cards Given</Td>
        <Td>
          <NumberInputComponent
            name="gasCards"
            value={formData.gasCards}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Value of Gas Cards</Td>
        <Td>
          <NumberInputComponent
            name="gasCardsValue"
            value={formData.gasCardsValue}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Women's Healthcare Referrals</Td>
        <Td>
          <NumberInputComponent
            name="womenHealthcareReferrals"
            value={formData.womenHealthcareReferrals}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Kid's Healthcare Referrals</Td>
        <Td>
          <NumberInputComponent
            name="kidHealthcareReferrals"
            value={formData.kidHealthcareReferrals}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Women's Counseling Referrals</Td>
        <Td>
          <NumberInputComponent
            name="womenCounselingReferrals"
            value={formData.womenCounselingReferrals}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Kid's Counseling Referrals</Td>
        <Td>
          <NumberInputComponent
            name="kidCounselingReferrals"
            value={formData.kidCounselingReferrals}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Babies Born</Td>
        <Td>
          <NumberInputComponent
            name="babiesBorn"
            value={formData.babiesBorn}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Degrees Earned by Women</Td>
        <Td>
          <NumberInputComponent
            name="womenDegreesEarned"
            value={formData.womenDegreesEarned}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Women Enrolled in School</Td>
        <Td>
          <NumberInputComponent
            name="womenEnrolledInSchool"
            value={formData.womenEnrolledInSchool}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Licenses Earned by Women</Td>
        <Td>
          <NumberInputComponent
            name="womenLicensesEarned"
            value={formData.womenLicensesEarned}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Family Reunifications</Td>
        <Td>
          <NumberInputComponent
            name="reunifications"
            value={formData.reunifications}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Interviews Conducted</Td>
        <Td>
          <NumberInputComponent
            name="numberOfInterviewsConducted"
            value={formData.numberOfInterviewsConducted}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Positive Tests</Td>
        <Td>
          <NumberInputComponent
            name="numberOfPositiveTests"
            value={formData.numberOfPositiveTests}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">NCNs</Td>
        <Td>
          <NumberInputComponent
            name="numberOfNcns"
            value={formData.numberOfNcns}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Other</Td>
        <Td>
          <NumberInputComponent
            name="numberOfOthers"
            value={formData.numberOfOthers}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Interviews Accepted</Td>
        <Td>
          <NumberInputComponent
            name="numberOfInterviewsAccpeted"
            value={formData.numberOfInterviewsAccpeted}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
