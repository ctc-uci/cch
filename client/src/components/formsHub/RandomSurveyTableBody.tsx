import { Td, Tr } from "@chakra-ui/react";
import {
  NumberInputComponent,
  TextInputComponent,
  TrueFalseComponent,
} from "../intakeStatsForm/formComponents";

export const RandomSurveyTableBody = ({
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
            name="cchQos"
            value={formData.cchQos}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Manager Quality of Service</Td>
        <Td>
          <NumberInputComponent
            name="cmQos"
            value={formData.cmQos}
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
            name="promptAndHelpful"
            value={formData.promptAndHelpful}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Entry Quality</Td>
        <Td>
          <NumberInputComponent
            name="entryQuality"
            value={formData.entryQuality}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Unit Quality</Td>
        <Td>
          <NumberInputComponent
            name="unitQuality"
            value={formData.unitQuality}
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
            name="overallExperience"
            value={formData.overallExperience}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Meeting Frequency</Td>
        <Td>
          <TextInputComponent
            name="caseMeetingFrequency"
            value={formData.caseMeetingFrequency}
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
            name="recommendReasoning"
            value={formData.recommendReasoning}
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
            name="makeCchMoreHelpful"
            value={formData.makeCchMoreHelpful}
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
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Manager Feedback</Td>
        <Td>
          <TextInputComponent
            name="cmFeedback"
            value={formData.cmFeedback}
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
            name="otherComments"
            value={formData.otherComments}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
