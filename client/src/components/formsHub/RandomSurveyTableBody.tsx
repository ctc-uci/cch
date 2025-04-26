import { Td, Tr } from "@chakra-ui/react";
import {
  NumberInputComponent,
  TextInputComponent,
  TrueFalseComponent,
} from "../intakeStatsForm/formComponents";

export const RandomSurveyTableBody =  ({
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
        <Td fontSize="medium">CCH Quality of Service</Td>
        <Td>
          <NumberInputComponent
            name="cch_qos"
            value={formData.cch_qos}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Manager Quality of Service</Td>
        <Td>
          <NumberInputComponent
            name="cm_qos"
            value={formData.cm_qos}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Staff Courteous</Td>
        <Td>
          <TrueFalseComponent
            name="courteous"
            value={formData.courteous}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Staff Informative</Td>
        <Td>
          <TrueFalseComponent
            name="informative"
            value={formData.informative}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Staff Prompt and Helpful</Td>
        <Td>
          <TrueFalseComponent
            name="prompt_and_helpful"
            value={formData.prompt_and_helpful}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Entry Quality</Td>
        <Td>
          <NumberInputComponent
            name="entry_quality"
            value={formData.entry_quality}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Unit Quality</Td>
        <Td>
          <NumberInputComponent
            name="unit_quality"
            value={formData.unit_quality}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Cleanliness</Td>
        <Td>
          <NumberInputComponent
            name="clean"
            value={formData.clean}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Overall Experience</Td>
        <Td>
          <NumberInputComponent
            name="overall_experience"
            value={formData.overall_experience}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Meeting Frequency</Td>
        <Td>
          <TextInputComponent
            name="case_meeting_frequency"
            value={formData.case_meeting_frequency}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Life Skills Offered</Td>
        <Td>
          <TrueFalseComponent
            name="lifeskills"
            value={formData.lifeskills}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Recommend Program</Td>
        <Td>
          <TrueFalseComponent
            name="recommend"
            value={formData.recommend}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Recommend Reasoning</Td>
        <Td>
          <TextInputComponent
            name="recommend_reasoning"
            value={formData.recommend_reasoning}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">How to Make CCH More Helpful</Td>
        <Td>
          <TextInputComponent
            name="make_cch_more_helpful"
            value={formData.make_cch_more_helpful}
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
        <Td fontSize="medium">Case Manager Feedback</Td>
        <Td>
          <TextInputComponent
            name="cm_feedback"
            value={formData.cm_feedback}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Other Comments</Td>
        <Td>
          <TextInputComponent
            name="other_comments"
            value={formData.other_comments}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
