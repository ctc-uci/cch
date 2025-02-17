import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Text,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
// import { ArrowUpIcon } from "@chakra-ui/icons";
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
  // Zoom state: 1 = 100%, 0.75 = 75%, etc.
  const [zoom, setZoom] = useState(1);

  const formatDate = (x: string) => {
    const date = new Date(x);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

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
  }, [backend]);

  // Zoom in/out handlers adjusting the zoom state by 10%
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2)); // max 200%
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5)); // min 50%

  // Adjust internal font size based on a base size (16px)
  const baseFontSize = 16; // in pixels
  const computedFontSize = `${baseFontSize * zoom}px`;

  return (
    // Outermost container remains fixed with a black background
    // <Box p="4" bg="black">
      <Box p="4">
      {/* Toolbar */}
      <Flex mb="4" gap="2" alignItems="center">
        <Button variant="outline" onClick={() => alert("Filter clicked!")}>
          Filter
        </Button>
        <Text>Zoom</Text>
        <Box border="1px solid" p={1} borderRadius="md">{Math.round(zoom * 100)}%</Box>
        <Button variant="ghost" onClick={handleZoomOut}>
          -
        </Button>
        <Button variant="ghost" onClick={handleZoomIn}>
          +
        </Button>
      </Flex>

      {/* Table container that stays within the bounds of the outer Box */}
      <Box maxW="100%" overflow="auto" bg="white" p="4">
        <TableContainer fontSize={computedFontSize}>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Index</Th>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th minW="200px">Form Title</Th>
                <Th w="50px" textAlign="right">
                  Export
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => (
                <Tr key={index} _hover={{ bg: "gray.200" }}>
                  <Td>{index + 1}</Td>
                  <Td>{formatDate(item.date)}</Td>
                  <Td>{item.name}</Td>
                  <Td minW="200px">{item.title}</Td>
                  <Td w="50px" textAlign="right">
                    {/* <Icon></Icon> */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
