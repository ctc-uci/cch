import { Td, Tr } from "@chakra-ui/react";
import {
  NumberInputComponent,
  TextInputComponent,
  TrueFalseComponent,
} from "../intakeStatsForm/formComponents";

export const SuccessStoryTableBody = ({
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
        <Td fontSize="medium">Client ID</Td>
        <Td>
          <NumberInputComponent
            name="client_id"
            value={formData.clientId}
            onChange={handleChange}
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
        <Td fontSize="medium">Case Manager ID</Td>
        <Td>
          <NumberInputComponent
            name="cm_id"
            value={formData.cmId}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Previous Situation</Td>
        <Td>
          <TextInputComponent
            name="previous_situation"
            value={formData.previousSituation}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Impact of CCH</Td>
        <Td>
          <TextInputComponent
            name="cch_impact"
            value={formData.cchImpact}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Where Are They Now</Td>
        <Td>
          <TextInputComponent
            name="where_now"
            value={formData.whereNow}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">What Would You Tell Donors</Td>
        <Td>
          <TextInputComponent
            name="tell_donors"
            value={formData.tellDonors}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Quote</Td>
        <Td>
          <TextInputComponent
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Consent Given</Td>
        <Td>
          <TrueFalseComponent
            name="consent"
            value={formData.consent}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
