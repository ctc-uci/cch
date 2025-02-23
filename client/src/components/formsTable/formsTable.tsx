import { useEffect, useState } from "react";

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PrintForm from '../PrintForm.jsx'

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

type SuccessStory = {
  id: number;
  date: string;
  client_id: number | null;
  name: string;
  cm_id: number;
  previous_situation: string;
  cch_impact: string;
  where_now: string;
  tell_donors: string;
  quote: string;
  consent: boolean;
};

type RandomSurvey = {
  id: number;
  date: string;
  cch_qos: number;
  cm_qos: number;
  courteous: boolean;
  informative: boolean;
  prompt_and_helpful: boolean;
  entry_quality: number;
  unit_quality: number;
  clean: number;
  overall_experience: number;
  case_meeting_frequency: string;
  lifeskills: boolean;
  recommend: boolean;
  recommend_reasoning: string;
  make_cch_more_helpful: string;
  cm_id: number;
  cm_feedback: string;
  other_comments?: string;
};

type ExitSurvey = {
  id: number;
  cm_id: number;
  name: string;
  client_id: number;
  site: number;
  program_date_completion: string;
  cch_rating: number;
  cch_like_most: string;
  life_skills_rating: number;
  life_skills_helpful_topics: string;
  life_skills_offer_topics_in_the_future: string;
  cm_rating: number;
  cm_change_about: string;
  cm_most_beneficial: string;
  cch_could_be_improved: string;
  experience_takeaway: string;
  experience_accomplished: string;
  experience_extra_notes: string;
};

type FormItem = {
  id: number;
  date: string;
  name: string;
  title: "Success Story" | "Random Survey" | "Exit Survey";
};

export const FormTable = () => {
  const { backend } = useBackendContext();
  const [items, setItems] = useState<FormItem[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const successStoryResponse = await backend.get(`/successStory`);

        const randomSurveyResponse = await backend.get(`/randomSurvey`);

        const exitSurveyResponse = await backend.get(`/exitSurvey`); 

        const successStories: FormItem[] = successStoryResponse.data.map(
          (item: SuccessStory) => ({
            id: item.id,
            date: item.date,
            name: item.name,
            title: "Success Story",
          })
        );

        const randomSurveys: FormItem[] = randomSurveyResponse.data.map(
          (item: RandomSurvey) => ({
            id: item.id,
            date: item.date,
            name: "Not Available",
            title: "Random Survey",
          })
        );

        const exitSurveys: FormItem[] = exitSurveyResponse.data.data.map(
          (item: ExitSurvey) => ({
            id: item.id,
            date: item.program_date_completion,
            name: item.name,
            title: "Exit Survey",
          })
        );

        setItems([...successStories, ...randomSurveys, ...exitSurveys]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  return <div>
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>index</Th>
            <Th>date</Th>
            <Th>name</Th>
            <Th>title</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item: FormItem, index: number) => (
            <Tr key={index}>
              <Td>{index}</Td>
              <Td>{item.date}</Td>
              <Td>{item.name}</Td>
              <Td>{item.title}</Td>
              <Td>
                <PrintForm formId={item.id} formType={item.title} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </div>;
};
