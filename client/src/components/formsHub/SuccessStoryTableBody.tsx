import { Td, Tr } from "@chakra-ui/react";
import {
  NumberInputComponent,
  TextInputComponent,
  TrueFalseComponent,
} from "../intakeStatsForm/formComponents";

export const SuccessStoryTableBody = (formData, handleChange) => {
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
            value={formData.client_id}
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
            value={formData.cm_id}
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
            value={formData.previous_situation}
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
            value={formData.cch_impact}
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
            value={formData.where_now}
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
            value={formData.tell_donors}
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
