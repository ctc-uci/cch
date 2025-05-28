import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import type { ExitSurveyForm as ExitSurveyFormType } from "../../types/exitSurvey.ts";

type ExitSurveyFormProps = {
  formData: ExitSurveyFormType;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<ExitSurveyFormType>>;
  onReview: boolean;
  spanish: boolean;
};


export const ExitSurveyForm = ({
  formData,
  handleSubmit,
  setFormData,
  onReview,
  spanish
}: ExitSurveyFormProps) => {
  type CaseManager = {
    id: number;
    role: string;
    firstName: string;
    lastName: string;
    phone_number: string;
    email: string;
  };

  type Location = {
    id: number;
    cm_id: number;
    name: string;
    date: Date;
    caloptima_funded: boolean;
  };

  const [locations, setLocations] = useState<Location[]>([]);
  const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);
  const { backend } = useBackendContext();
  const toast = useToast();
  const language = spanish ? "spanish" : "english";

  const fields = {
    english: {
      title: "Exit Survey",
      subtitle: "We are committed to providing you with the best help possible, so we welcome your comments. Please fill out this questionnaire. Thank you!",
      name: "1. What is your name?",
      site: "2. What was your site?",
      cm: "3. Who is your case manager?",
      overallProgram: "Overall Program",
      lifeSkills: "Life Skills",
      caseManagement: "Case Management",
      outcome: "Outcome",
      overallRating: "1. How would you rate Colette's Children's Home overall?",
      overallLikeMost: "2. What did you like most about Colette’s Children’s Home?",
      overallCouldBeImproved: "3. What would make Colette’s Children’s home better?",
      lifeSkillsRating: "1. How helpful were the Life Skills Meetings?",
      lifeSkillsHelpfulTopics: "2. What topics were the most helpful for you?",
      lifeSkillsOfferTopicsInTheFuture: "3. What topics would you like CCH to offer in the future?",
      cmRating: "1. How helpful was case management?",
      cmChangeAbout: "2. What would you change about your case management?",
      cmMostBeneficial: "3. What was the most beneficial part of your case management?",
      outcomeFutureChange: "1. How do you think that your experience at CCH will change your future?",
      outcomeAccomplished: "2. What have you learned/accomplished while during your stay?",
      outcomeExtraNotes: "3. What else would you like us to know?",
      submit: "Next",
      namePlaceholder: "Enter your name",
      sitePlaceholder: "Select Location",
      cmPlaceholder: "Select case manager",
      enterResponse: "Enter your response...",
      unsatisfactory: "Unsatisfactory",
      fair: "Fair",
      good: "Good",
      excellent: "Excellent",
      notVeryHelpfulAtAll: "Not Very Helpful At All",
      notVeryHelful: "Not Very Helpful",
      helpful: "Helpful",
      veryHelpful: "Very Helpful",
    },
    spanish: {
      title: "Encuesta de Salida",
      subtitle: "Estamos comprometidos a brindarle la mejor ayuda posible, por lo que agradecemos sus comentarios. Por favor, complete este cuestionario. ¡Gracias!",
      name: "1. ¿Cuál es tu nombre?",
      site: "2. ¿Cuál fue tu sitio?",
      cm: "3. ¿Quién es tu administrador de casos?",
      overallProgram: "Programa General",
      lifeSkills: "Habilidades para la Vida",
      caseManagement: "Gestión de Casos",
      outcome: "Resultado",
      overallRating: "1. ¿Cómo calificarías el Hogar Infantil Colette en general?",
      overallLikeMost: "2. ¿Qué te gustó más del Hogar Infantil Colette?",
      overallCouldBeImproved: "3. ¿Qué podría mejorar el Hogar Infantil Colette?",
      lifeSkillsRating: "1. ¿Qué tan útiles fueron las Reuniones de Habilidades para la Vida?",
      lifeSkillsHelpfulTopics: "2. ¿Qué temas fueron los más útiles para ti?",
      lifeSkillsOfferTopicsInTheFuture: "3. ¿Qué temas te gustaría que CCH ofreciera en el futuro?",
      cmRating: "1. ¿Qué tan útil fue la gestión de casos?",
      cmChangeAbout: "2. ¿Qué cambiarías sobre tu gestión de casos?",
      cmMostBeneficial: "3. ¿Cuál fue la parte más beneficiosa de tu gestión de casos?",
      outcomeFutureChange: "1. ¿Cómo crees que tu experiencia en CCH cambiará tu futuro?",
      outcomeAccomplished: "2. ¿Qué has aprendido/logrado durante tu estancia?",
      outcomeExtraNotes: "3. ¿Qué más te gustaría que supiéramos?",
      submit: "Siguiente",
      namePlaceholder: "Escribe su nombre",
      sitePlaceholder: "Selecciona el sitio",
      cmPlaceholder: "Selecciona el administrador de casos",
      enterResponse: "Escribe su respuesta...",
      unsatisfactory: "Insatisfactorio",
      fair: "Regular",
      good: "Bueno",
      excellent: "Excelente",
      notVeryHelpfulAtAll: "No Muy Útil en Absoluto",
      notVeryHelful: "No Muy Útil",
      helpful: "Útil",
      veryHelpful: "Muy Útil",
    },
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

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number | Date } }
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name: string) => (value: string) => {
    handleChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Box
      maxW="800px"
      mx="auto"
      p={6}
    >
      <form onSubmit={handleSubmit}>
        <VStack
          align="start"
          spacing={6}
        >
          <Text
            fontSize="3xl"
            color="#3182CE"
          >
            {fields[language].title}
          </Text>
          <Text>
            {fields[language].subtitle}
          </Text>

          <Divider />

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>{fields[language].name}</FormLabel>
              <Input
                name="name"
                placeholder={fields[language].namePlaceholder}
                onChange={handleChange}
                value={formData.name}
                isDisabled={onReview}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{fields[language].site}</FormLabel>
              <Select
                name="site"
                placeholder={fields[language].sitePlaceholder}
                onChange={handleChange}
                value={formData.site}
                isDisabled={onReview}
              >
                {locations.map((loc) => (
                  <option
                    key={loc.id}
                    value={loc.id}
                  >
                    {loc.name}
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
              <FormLabel>{fields[language].cm}</FormLabel>
              <Select
                name="cmId"
                placeholder={fields[language].cmPlaceholder}
                onChange={handleChange}
                value={formData.cmId}
                isDisabled={onReview}
              >
                {caseManagers.map((cm) => (
                  <option
                    key={cm.id}
                    value={cm.id.toString()}
                  >
                    {cm.firstName} {cm.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            {fields[language].overallProgram}
          </Text>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].overallRating}
            </FormLabel>
            <RadioGroup
              name="cchRating"
              value={formData.cchRating}
              onChange={handleRadioChange("cchRating")}
              isDisabled={onReview}
            >
              <HStack spacing={6}>
                <Radio value="Unsatisfactory">{fields[language].unsatisfactory}</Radio>
                <Radio value="Fair">{fields[language].fair}</Radio>
                <Radio value="Good">{fields[language].good}</Radio>
                <Radio value="Excellent">{fields[language].excellent}</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].overallLikeMost}
            </FormLabel>
            <Textarea
              name="cchLikeMost"
              placeholder={fields[language].enterResponse}
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cchLikeMost}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].overallCouldBeImproved}
            </FormLabel>
            <Textarea
              placeholder={fields[language].enterResponse}
              name="cchCouldBeImproved"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cchCouldBeImproved}
            />
          </FormControl>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            Life Skills
          </Text>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].lifeSkillsRating}
            </FormLabel>
            <RadioGroup
              name="lifeSkillsRating"
              onChange={handleRadioChange("lifeSkillsRating")}
              isDisabled={onReview}
              value={formData.lifeSkillsRating}
            >
              <HStack spacing={6}>
                <Radio value="not very helpful at all">
                  Not Very Helpful At All
                </Radio>
                <Radio value="not very helpful">Not Very Helpful</Radio>
                <Radio value="helpful">Helpful</Radio>
                <Radio value="very helpful">Very Helpful</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].lifeSkillsHelpfulTopics}
            </FormLabel>
            <Textarea
              placeholder={fields[language].enterResponse}
              name="lifeSkillsHelpfulTopics"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.lifeSkillsHelpfulTopics}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].lifeSkillsOfferTopicsInTheFuture}
            </FormLabel>
            <Textarea
              name="lifeSkillsOfferTopicsInTheFuture"
              placeholder={fields[language].enterResponse}
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.lifeSkillsOfferTopicsInTheFuture}
            />
          </FormControl>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            {fields[language].caseManagement}
          </Text>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].cmRating}
            </FormLabel>
            <RadioGroup
              name="cmRating"
              onChange={handleRadioChange("cmRating")}
              isDisabled={onReview}
              value={formData.cmRating}
            >
              <HStack spacing={6}>
                <Radio value="not very helpful at all">
                  {fields[language].notVeryHelpfulAtAll}
                </Radio>
                <Radio value="not very helpful">{fields[language].notVeryHelpfulAtAll}</Radio>
                <Radio value="helpful">{fields[language].notVeryHelpfulAtAll}</Radio>
                <Radio value="very helpful">{fields[language].notVeryHelpfulAtAll}</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].cmChangeAbout}
            </FormLabel>
            <Textarea
              placeholder={fields[language].enterResponse}
              name="cmChangeAbout"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cmChangeAbout}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].cmMostBeneficial}
            </FormLabel>
            <Textarea
              placeholder={fields[language].enterResponse}
              name="cmMostBeneficial"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cmMostBeneficial}
            />
          </FormControl>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            {fields[language].outcome}
          </Text>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].outcomeFutureChange}
            </FormLabel>
            <Textarea
              placeholder={fields[language].enterResponse}
              name="experienceTakeaway"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.experienceTakeaway}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].outcomeAccomplished}
            </FormLabel>
            <Textarea
              placeholder={fields[language].enterResponse}
              name="experienceAccomplished"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.experienceAccomplished}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              {fields[language].outcomeExtraNotes}
            </FormLabel>
            <Textarea
              placeholder={fields[language].enterResponse}
              name="experienceExtraNotes"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.experienceExtraNotes}
            />
          </FormControl>

          <Spacer />

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
                {fields[language].submit}
              </Button>
            </Flex>
          )}
        </VStack>
      </form>
    </Box>
  );
};
