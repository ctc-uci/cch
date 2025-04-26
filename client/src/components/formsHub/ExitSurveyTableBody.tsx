import { Td, Tr } from "@chakra-ui/react";
import {
  NumberInputComponent,
  SelectInputComponent,
  TextInputComponent,
} from "../intakeStatsForm/formComponents";

export const ExitSurveyTableBody = ({
                                      formData,
                                      handleChange,
                                    }: {
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <>
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
        <Td fontSize="medium">Site</Td>
        <Td>
          <NumberInputComponent
            name="site"
            value={formData.site}
            onChange={handleChange}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Program Date Completion</Td>
        <Td>
          <TextInputComponent
            name="program_date_completion"
            value={formData.program_date_completion}
            onChange={handleChange}
            type="date"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">CCH Rating</Td>
        <Td>
          <SelectInputComponent
            name="cch_rating"
            value={formData.cch_rating || ""}
            onChange={handleChange}
            placeholder="Select Rating"
            options={[
              { label: "Excellent", value: "Excellent" },
              { label: "Good", value: "Good" },
              { label: "Fair", value: "Fair" },
              { label: "Unsatisfactory", value: "Unsatisfactory" },
            ]}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">What You Liked Most About CCH</Td>
        <Td>
          <TextInputComponent
            name="cch_like_most"
            value={formData.cch_like_most}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Life Skills Rating</Td>
        <Td>
          <SelectInputComponent
            name="life_skills_rating"
            value={formData.life_skills_rating || ""}
            onChange={handleChange}
            placeholder="Select Helpfulness"
            options={[
              { label: "very helpful", value: "very helpful" },
              { label: "helpful", value: "helpful" },
              { label: "not very helpful", value: "not very helpful" },
              { label: "not helpful at all", value: "not helpful at all" },
            ]}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Helpful Topics in Life Skills</Td>
        <Td>
          <TextInputComponent
            name="life_skills_helpful_topics"
            value={formData.life_skills_helpful_topics}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Topics You Would Like Offered in the Future</Td>
        <Td>
          <TextInputComponent
            name="life_skills_offer_topics_in_the_future"
            value={formData.life_skills_offer_topics_in_the_future}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Case Manager Rating</Td>
        <Td>
          <SelectInputComponent
            name="cm_rating"
            value={formData.cm_rating || ""}
            onChange={handleChange}
            placeholder="Select Helpfulness"
            options={[
              { label: "very helpful", value: "very helpful" },
              { label: "helpful", value: "helpful" },
              { label: "not very helpful", value: "not very helpful" },
              { label: "not helpful at all", value: "not helpful at all" },
            ]}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">What Could Your Case Manager Improve?</Td>
        <Td>
          <TextInputComponent
            name="cm_change_about"
            value={formData.cm_change_about}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Most Beneficial About Case Manager</Td>
        <Td>
          <TextInputComponent
            name="cm_most_beneficial"
            value={formData.cm_most_beneficial}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">How Could CCH Improve?</Td>
        <Td>
          <TextInputComponent
            name="cch_could_be_improved"
            value={formData.cch_could_be_improved}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Takeaway from Experience</Td>
        <Td>
          <TextInputComponent
            name="experience_takeaway"
            value={formData.experience_takeaway}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Accomplishments During Program</Td>
        <Td>
          <TextInputComponent
            name="experience_accomplished"
            value={formData.experience_accomplished}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Extra Notes</Td>
        <Td>
          <TextInputComponent
            name="experience_extra_notes"
            value={formData.experience_extra_notes}
            onChange={handleChange}
            type="text"
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
