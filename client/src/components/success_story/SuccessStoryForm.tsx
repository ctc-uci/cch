import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { CaseManager, Location } from "./SuccessStory";

export const SuccessStoryForm = ({
  onSubmit,
  onReview,
  spanish
}: {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onReview: boolean;
  spanish: boolean;
}) => {
  const [locations, setLocations] = useState([]);
  const [caseManagers, setCaseManagers] = useState([]);

  const { backend } = useBackendContext();
  const toast = useToast();
  const language = spanish ? "spanish" : "english"
  const fields = {
    english: {
              title:"Success Story",
              subtitle: "We are committed to providing you the best help possible, so we welcome your comments. Please fill out the questionnaire. Thank you!",
              first_name: "What is your first name?",
              site: "What was your site?",
              cm: "Who is your case manager?",
              entrance_date: "Entrance Date to CCH",
              exit_date:"Exit Date from CCH",
              date:"Today's Date",
              program_title: "Overall Program",
              previous_situation: "Please tell us your situation before entering Colette's Children's Home. Please give as many details as you are comfortable with about your story, how long you were homeless, what led to homelessness, etc. We want to help people understand what being homeless is like.",
              cch_impact : "Tell us about your time in CCH and how CCH was part of the solution to your situation and the impact it had on you and and/or your children. What was most helpful, what you learned, etc.",
              where_now : "Tell us where you are now. If you are graduating where are you moving, are you working, how are your children doing, etc. Tell us a finish to your story.",
              tell_donors: "If you had the opportunity to tell one of our donors what it meant to you to be at CCH or how important it is to provide our services to other women, what would you say?",
              quote: "Please give a 1 to 2 sentence quote of what the CCH experience meant to you?",
              consent: "By checking the box, I consent to letting Colette's Children's Home use all or part of my story in their marketing materials, such as website, newsletter, brochures, videos, etc.",
              type_here: "Enter your response...",
              date_placeholder: "Date",
              site_placeholder: "Select your site",
              cm_placeholder: "Select your case manager",
    },
    spanish: {
              title:"Encuesta de Éxito",
              subtitle: "Estamos comprometidos a brindarle la mejor ayuda posible, por lo que agradecemos sus comentarios. Por favor, rellene el cuestionario. ¡Gracias!",
              first_name: "¿Cuál es tu primer nombre?",
              site: "¿Cuál fue su sitio?",
              cm: "¿Quién es su administrador de casos?",
              entrance_date: "fecha de entrada a CCH",
              exit_date:"Fecha de salida de CCH",
              date:"Fecha de hoy",
              program_title: "Programa General",
              previous_situation: "Por favor, díganos su situación antes de entrar en el Hogar Infantil de Colette. Por favor, dé tantos detalles como se sienta cómodo con acerca de su historia, cuánto tiempo estuvo sin hogar, qué llevó a la falta de vivienda, etc. Queremos ayudar a la gente a entender cómo es estar sin hogar",
              cch_impact : "Cuéntanos sobre tu tiempo en CCH y cómo CCH fue parte de la solución a tu situación y el impacto que tuvo en ti y/o tus hijos. Lo que fue más útil, lo que aprendiste, etc.",
              where_now : "Dinos dónde estás ahora. Si te estás graduando, ¿dónde te mudas, estás trabajando, cómo te van tus hijos, etc. Cuéntanos un final para tu historia.",
              tell_donors: "Si tuviera la oportunidad de decirle a uno de nuestros donantes lo que significa para usted estar en CCH o lo importante que es proporcionar nuestros servicios a otras mujeres, ¿qué diría?",
              quote: "Por favor, dé una cita de 1 a 2 frases de lo que significó para usted la experiencia de CCH?",
              consent: "Al marcar la casilla, doy mi consentimiento para permitir que Colette's Children's Home use todo o parte de mi historia en sus materiales de marketing, tales como sitio web, boletín informativo, folletos, videos, etc.",
              type_here: "Escribe su respuesta aquí...",
              date_placeholder: "Fecha",
              site_placeholder: "Seleccione su sitio",
              cm_placeholder: "Seleccione su administrador de casos",
    }
  }

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await backend.get("/locations");
        setLocations(response.data);
      } catch (e) {
        toast({
          title: "An error occurred",
          description: `Locations were not fetched: ${e.message}`,
          status: "error",
        });
      }
    };

    const getCaseManagers = async () => {
      try {
        const response = await backend.get("/caseManagers");
        setCaseManagers(response.data);
      } catch (e) {
        toast({
          title: "An error occurred",
          description: `Case Managers were not fetched: ${e.message}`,
          status: "error",
        });
      }
    };
    getLocations();
    getCaseManagers();
  }, [backend, toast]);
  return (
    <Box
      maxW="800px"
      mx="auto"
      p={6}
    >
      <form onSubmit={onSubmit}>
        <VStack
          align="start"
          spacing={6}
        >
            <Text
              fontSize="3xl"
              color="#3182CE"
            >
              {fields[language]["title"]}
            </Text>
          <Text>
              {fields[language]["subtitle"]}
          </Text>

          <Divider />

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>1.{fields[language]["first_name"]}</FormLabel>
              <Input name="name" isDisabled={onReview} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>2. {fields[language]["site"]} </FormLabel>
              <Select
                name="site"
                placeholder={fields[language]["site_placeholder"]}
                isDisabled={onReview}
              >
                {locations.map((location: Location) => (
                  <option
                    key={location.id}
                    value={location.id}
                  >
                    {location.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>3. {fields[language]["cm"]}</FormLabel>
              <Select
                name="cm_id"
                placeholder={fields[language]["cm_placeholder"]}
                maxW="530px"
                isDisabled={onReview}
              >
                {caseManagers.map((manager: CaseManager) => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.firstName} {manager.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>4. {fields[language]["entrance_date"]} </FormLabel>
              <Input
                name="entrance_date"
                type="date"
                placeholder={fields[language]["date_placeholder"]}
                isDisabled={onReview}
              />
            </FormControl>
          </Stack>

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>5. {fields[language]["exit_date"]} </FormLabel>
              <Input
                name="exit_date"
                type="date"
                placeholder={fields[language]["date_placeholder"]}
                isDisabled={onReview}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>6. {fields[language]["date"]} </FormLabel>
              <Input
                name="date"
                type="date"
                placeholder={fields[language]["date_placeholder"]}
                isDisabled={onReview}
              />
            </FormControl>
          </Stack>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            {fields[language]["program_title"]}
          </Text>

          <FormControl isRequired>
            <FormLabel>
              1. {fields[language]["previous_situation"]}
            </FormLabel>
            <Textarea
              name="previous_situation"
              placeholder={fields[language]["type_here"]}
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              2. {fields[language]["cch_impact"]}
            </FormLabel>
            <Textarea
              name="cch_impact"
              placeholder={fields[language]["type_here"]}
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              3. {fields[language]["where_now"]}
            </FormLabel>
            <Textarea
              name="where_now"
              placeholder={fields[language]["type_here"]}
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              4. {fields[language]["tell_donors"]}
            </FormLabel>
            <Textarea
              name="tell_donors"
              placeholder={fields[language]["type_here"]}
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              5. {fields[language]["quote"]}
            </FormLabel>
            <Textarea
              name="quote"
              placeholder={fields[language]["type_here"]}
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl>
            <HStack
              spacing={2}
              alignItems="center"
            >
              <Checkbox
                name="consent"
                mt={1}
                isDisabled={onReview}
              />
              <FormLabel>
                {fields[language]["consent"]}
              </FormLabel>
            </HStack>
          </FormControl>

          {!onReview && (
            <Flex
              justifyContent="flex-end"
              width="100%"
            >
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
              >
                Next
              </Button>
            </Flex>
          )}
        </VStack>
      </form>
    </Box>
  );
};
