import { useState, useEffect } from "react";
import { Box, Button, Input, Select, Text, VStack, Heading, Divider, SimpleGrid, Stack, Flex, useToast } from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useNavigate } from "react-router-dom";
import { caseManagerForm, caseManagers } from "../../types/caseManagerForm";
interface FormCMProps {
  onFormSubmitSuccess: () => void;
  spanish: boolean
}


function FormCM({ onFormSubmitSuccess, spanish }: FormCMProps) {
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [empty, setEmpty] = useState(true);
  const [pos, setPos] = useState(false);
  const [formData, setFormData] = useState<caseManagerForm>({
    month: "",
    cm_id: "",
    year: "",
    total_number_of_contacts: "",
    women_birthdays: "",
    kid_birthdays: "",
    birthday_cards: "",
    birthday_cards_value: "",
    food_cards: "",
    food_cards_value: "",
    bus_passes: "",
    bus_passes_value: "",
    gas_cards: "",
    gas_cards_value: "",
    women_healthcare_referrals: "",
    kid_healthcare_referrals: "",
    women_counseling_referrals: "",
    kid_counseling_referrals: "",
    babies_born: "",
    women_degrees_earned: "",
    women_enrolled_in_school: "",
    women_licenses_earned: "",
    reunifications: "",
    number_of_interviews_conducted: "",
    number_of_positive_tests: "",
    number_of_ncns: "",
    number_of_others: "",
    number_of_interviews_accpeted: "",
  });
  const [cm, setCm] = useState<caseManagers[]>([]);
  const [selectedCm, setSelectedCm] = useState("");
  const fields = {
    english: {
      month: "Month",
      cm: "Case Manager",
      year: "Year",
      total_number_of_contacts: "Total Number of Contacts (Email, Phone, In-Person)",
      women_birthdays: "Women's Birthdays Celebrated",
      kid_birthdays: "Kid's Birthdays Celebrated",
      birthday_cards: "# of Birthday Cards Given Out",
      birthday_cards_value: "Total Value",
      food_cards: "# of Food Cards",
      food_cards_value: "Total Value",
      bus_passes: "# of Bus Passes",
      bus_passes_value: "Total Value",
      gas_cards: "# of Gas Giftcards",
      gas_cards_value: "Total Value",
      women_healthcare_referrals: "Healthcare Referrals for Women",
      kid_healthcare_referrals: "Healthcare Referrals for Kids",
      women_counseling_referrals: "Counseling Referrals for Women",
      kid_counseling_referrals: "Counseling Referrals for Kids",
      babies_born: "Babies Born",
      women_degrees_earned: "Women who earn a GED or Diploma while in CCH",
      women_enrolled_in_school: "Women who enroll in School or a trade program while in CCH",
      women_licenses_earned: "Women who get a driver’s license while in the program",
      reunifications: "Reunifications",
      number_of_interviews_conducted: "# Interviews Conducted",
      number_of_positive_tests: "# of Positive Tests",
      number_of_ncns: "# of No Call No Shows",
      number_of_others: "# of 'Other'",
      number_of_interviews_accpeted: "# of Interviewees Accepted",
      total_num_interviews: "Total Interviews Scheduled"
    },
    spanish:{
      month: "Mes",
      cm: "Administrador de Casos",
      year: "Año",
      total_number_of_contacts: "Número Total de Contactos (Correo, Teléfono, En Persona)",
      women_birthdays: "Cumpleaños de Mujeres Celebrados",
      kid_birthdays: "Cumpleaños de Niños Celebrados",
      birthday_cards: "Número de Tarjetas de Cumpleaños Entregadas",
      birthday_cards_value: "Valor Total",
      food_cards: "Número de Tarjetas de Alimentos",
      food_cards_value: "Valor Total",
      bus_passes: "Número de Pases de Autobús",
      bus_passes_value: "Valor Total",
      gas_cards: "Número de Tarjetas de Gasolina",
      gas_cards_value: "Valor Total",
      women_healthcare_referrals: "Referencias Médicas para Mujeres",
      kid_healthcare_referrals: "Referencias Médicas para Niños",
      women_counseling_referrals: "Referencias de Consejería para Mujeres",
      kid_counseling_referrals: "Referencias de Consejería para Niños",
      babies_born: "Bebés Nacidos",
      women_degrees_earned: "Mujeres que Obtuvieron un GED o Diploma mientras estaban en CCH",
      women_enrolled_in_school: "Mujeres Inscritas en Escuela o Programa Técnico mientras estaban en CCH",
      women_licenses_earned: "Mujeres que Obtenido una Licencia de Conducir mientras estaban en el programa",
      reunifications: "Reunificaciones",
      number_of_interviews_conducted: "Número de Entrevistas Realizadas",
      number_of_positive_tests: "Número de Pruebas Positivas",
      number_of_ncns: "Número de Ausencias sin Aviso",
      number_of_others: "Número de 'Otros'",
      number_of_interviews_accpeted: "Número de Entrevistados Aceptados",
      total_num_interviews: "Total de Entrevistas Programadas"
    }
  }

  const language = spanish ? "spanish" : "english"
  const handleCmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCm(event.target.value);
    setFormData((prevState) => ({ ...prevState, ['cm_id']: event.target.value }));
    
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    // Validate month input to only accept 1-12
    if (name === 'month') {
      const numValue = parseInt(value, 10);
      // Allow empty string, or numbers between 1 and 12
      if (value === '' || (!isNaN(numValue) && numValue >= 1 && numValue <= 12)) {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
      }
    } 
    // Validate year input to only accept up to 4 digits
    else if (name === 'year') {
      // Allow empty string, or numeric strings up to 4 digits
      if (value === '' || (/^\d{1,4}$/.test(value))) {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
      }
    } 
    else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await backend.get(
          `/caseManagers/names`
        );
        setCm(response.data);
        setFormData((prevState) => ({ ...prevState, ['cm_id']: response.data[0].id }));
        setSelectedCm(response.data[0]); //set default to first cm
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
    
  }, []);

  useEffect(() => {
    setEmpty(!(Object.values(formData).filter((val) => val !== "").length === 28));
    setPos(Object.values(formData).every((val) => parseInt(val) >= 0));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const month = parseInt(formData.month, 10);
      const year = parseInt(formData.year, 10);
      if (year > new Date().getFullYear()) {
        throw new Error("Year cannot be in the future");
      }
      if (month < 1 || month > 12) {
        throw new Error("Month must be between 1 and 12");
      }
      if (empty) {
        throw new Error("Please fill out all required information before submitting.");
      }
      if (!pos) {
        throw new Error("Please make sure all values are positive numbers.");
      }
      const monthlyStatData = {
        date: new Date( year, month - 1),  
        cm_id: parseInt(formData.cm_id, 10),
        total_number_of_contacts: parseInt(formData.total_number_of_contacts, 10),
        women_birthdays: parseInt(formData.women_birthdays, 10),
        kid_birthdays: parseInt(formData.kid_birthdays, 10),
        birthday_cards: parseInt(formData.birthday_cards, 10),
        birthday_cards_value: parseFloat(formData.birthday_cards_value),
        food_cards: parseInt(formData.food_cards, 10),
        food_cards_value: parseFloat(formData.food_cards_value),
        bus_passes: parseInt(formData.bus_passes, 10),
        bus_passes_value: parseFloat(formData.bus_passes_value),
        gas_cards: parseInt(formData.gas_cards, 10),
        gas_cards_value: parseFloat(formData.gas_cards_value),
        women_healthcare_referrals: parseInt(formData.women_healthcare_referrals, 10),
        kid_healthcare_referrals: parseInt(formData.kid_healthcare_referrals, 10),
        women_counseling_referrals: parseInt(formData.women_counseling_referrals, 10),
        kid_counseling_referrals: parseInt(formData.kid_counseling_referrals, 10),
        babies_born: parseInt(formData.babies_born, 10),
        women_degrees_earned: parseInt(formData.women_degrees_earned, 10),
        women_enrolled_in_school: parseInt(formData.women_enrolled_in_school, 10),
        women_licenses_earned: parseInt(formData.women_licenses_earned, 10),
        reunifications: parseInt(formData.reunifications, 10),
        number_of_interviews_conducted: parseInt(formData.number_of_interviews_conducted, 10),
        number_of_positive_tests: parseInt(formData.number_of_positive_tests, 10),
        number_of_ncns: parseInt(formData.number_of_ncns, 10),
        number_of_others: parseInt(formData.number_of_others, 10),
        number_of_interviews_accpeted: parseInt(formData.number_of_interviews_accpeted, 10),
      };
      
      await backend.post("/caseManagerMonthlyStats", monthlyStatData);
      onFormSubmitSuccess();
      toast({
        title: 'Successfully Submitted Form',
        position: 'bottom-right',
        description: 'Case Manager Monthly Statistics Form.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate("/forms-hub"); // Redirect after success
    } catch (error) {
      toast({
        title: 'Missing Information',
        position: 'bottom-right',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.error("Error creating monthly stat for case manager:", error);
    }
  };
  
  return (
    <VStack spacing={4} align="stretch" maxW="800px" mx="auto" py={6}>
      <Heading textAlign="center" mb={10}>Case Manager Monthly Statistics Form</Heading>

      {/* Month, Year, Case Manager */}
      <SimpleGrid columns={3} spacing={4} mb={6}>
        <Box>
          <Text fontWeight="bold" mb={2}>{fields[language]["month"] + " (1-12)"}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="month"
            min={1}
            value={formData.month}
            onChange={handleChange}
            size="md"
            width="150px"
            max={12}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            
          />    
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>{fields[language]["year"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            size="md"
            width="150px"
            maxLength={4}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />        
        </Box>
        <Box>
          

          <Text fontWeight="bold" mb={2}>{fields[language]["cm"]}</Text>
          <Select name="case_manager" value={selectedCm} onChange={handleCmChange}>
            {cm.map((data) => {
              return(
                <option key={data.id} value={data.id} >{data.firstName} {data.lastName}</option>
              )
            })}
            
          </Select>
        </Box>
      </SimpleGrid>

      <Divider />

      {/* Contacts */}
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>Contacts</Text>
        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["total_number_of_contacts"]}</Text>
          <Input
          placeholder="Type Here"
          type="number"
          name="total_number_of_contacts"
          value={formData.total_number_of_contacts}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          // isInvalid={formData.total_number_of_contacts === ""}
        />    
        </Flex>
      </Box>

      <Divider />

      {/* Interview Questions */}
      <Text fontSize="lg" fontWeight="bold" mb={2}>Interview Questions</Text>
      <Stack spacing={4}>
        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["number_of_interviews_conducted"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="number_of_interviews_conducted"
            value={formData.number_of_interviews_conducted}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>

        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["number_of_positive_tests"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="number_of_positive_tests"
            value={formData.number_of_positive_tests}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>

        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["number_of_ncns"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="number_of_ncns"
            value={formData.number_of_ncns}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>

        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["number_of_others"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="number_of_others"
            value={formData.number_of_others}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>

        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["total_num_interviews"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="number_of_interviews_scheduled"
            value={formData.number_of_interviews_conducted}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>

        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["number_of_interviews_accpeted"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="number_of_interviews_accpeted"
            value={formData.number_of_interviews_accpeted}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>
      </Stack>

      <Divider />

      {/* Birthdays */}
      <Text fontSize="lg" fontWeight="bold" mb={2}>Birthdays</Text>
      <Stack spacing={3}>
        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["women_birthdays"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="women_birthdays"
            value={formData.women_birthdays}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>

        <Flex align="center" gap={5}>
          <Text w="250px">{fields[language]["kid_birthdays"]}</Text>
          <Input
            placeholder="Type Here"
            type="number"
            name="kid_birthdays"
            value={formData.kid_birthdays}
            onChange={handleChange}
            width="150px"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Flex>
      </Stack>

      <Flex align="center" mt={4} gap={5}>
        <Text w="250px">{fields[language]["birthday_cards"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="birthday_cards"
          value={formData.birthday_cards}
          onChange={handleChange}
          width="150px"
          mr={8}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        <Text w="150px">{fields[language]["birthday_cards_value"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="birthday_cards_value"
          value={formData.birthday_cards_value}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>
   
      <Divider />

      {/* Food and Bus */}
      <Text fontSize="lg" fontWeight="bold"  mb={2}>E&TH Food and Bus</Text>

      {/* Food Cards */}
      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["food_cards"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="food_cards"
          value={formData.food_cards}
          onChange={handleChange}
          width="150px"
          mr={8}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        <Text w="150px">{fields[language]["food_cards_value"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="food_cards_value"
          value={formData.food_cards_value}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      {/* Bus Passes */}
      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["bus_passes"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="bus_passes"
          value={formData.bus_passes}
          onChange={handleChange}
          width="150px"
          mr={8}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        <Text w="150px">{fields[language]["bus_passes_value"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="bus_passes_value"
          value={formData.bus_passes_value}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      {/* Gas Cards */}
      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["gas_cards"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="gas_cards"
          value={formData.gas_cards}
          onChange={handleChange}
          width="150px"
          mr={8}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        <Text w="150px">{fields[language]["gas_cards_value"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="gas_cards_value"
          value={formData.gas_cards_value}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Divider />

      {/* Referrals */}
      <Text fontSize="lg" fontWeight="bold" mb={2}>Referrals</Text>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["women_healthcare_referrals"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="women_healthcare_referrals"
          value={formData.women_healthcare_referrals}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["women_counseling_referrals"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="women_counseling_referrals"
          value={formData.women_counseling_referrals}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["kid_healthcare_referrals"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="kid_healthcare_referrals"
          value={formData.kid_healthcare_referrals}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["kid_counseling_referrals"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="kid_counseling_referrals"
          value={formData.kid_counseling_referrals}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      {/* Miscellaneous */}
      <Text fontSize="lg" fontWeight="bold" mb={2}>Miscellaneous</Text>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["babies_born"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="babies_born"
          value={formData.babies_born}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["women_degrees_earned"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="women_degrees_earned"
          value={formData.women_degrees_earned}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["women_enrolled_in_school"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="women_enrolled_in_school"
          value={formData.women_enrolled_in_school}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["women_licenses_earned"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="women_licenses_earned"
          value={formData.women_licenses_earned}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      <Flex align="center" mb={3} gap={5}>
        <Text w="250px">{fields[language]["reunifications"]}</Text>
        <Input
          placeholder="Type Here"
          type="number"
          name="reunifications"
          value={formData.reunifications}
          onChange={handleChange}
          width="150px"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
      </Flex>

      {/* Submit/Cancel */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Box display="flex" gap={5}>
          <Button background="#EDF2F7" color="#2D3748" colorScheme="blue" variant="delete" onClick={() => navigate("/forms-hub")}>Cancel</Button>
          <Button colorScheme="blue" type="submit" onClick={handleSubmit}>Submit</Button>
        </Box>
      </Box>
    </VStack>
  );
}

export default FormCM;
