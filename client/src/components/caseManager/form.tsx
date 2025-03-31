import { useState, useEffect } from "react";
import { Box, Button, Input, Select, Text, VStack, Heading, Divider, SimpleGrid } from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";

interface FormCMProps {
  onFormSubmitSuccess: () => void;
}


function FormCM({ onFormSubmitSuccess }: FormCMProps) {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const navigate = useNavigate();

  const userEmail = currentUser?.email
  const [cmId, setCmId] = useState({});
  const [formData, setFormData] = useState({
    date: "",
    // cm_id: "",
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

  const fields = [
    { name: "date", label: "Date" },
    //{ name: "cm_id", label: "CM ID" },
    { name: "total_number_of_contacts", label: "Total Number of Contacts" },
    { name: "women_birthdays", label: "Women's Birthdays" },
    { name: "kid_birthdays", label: "Kid's Birthdays" },
    { name: "birthday_cards", label: "Birthday Cards" },
    { name: "birthday_cards_value", label: "Birthday Cards Value" },
    { name: "food_cards", label: "Food Cards" },
    { name: "food_cards_value", label: "Food Cards Value" },
    { name: "bus_passes", label: "Bus Passes" },
    { name: "bus_passes_value", label: "Bus Passes Value" },
    { name: "gas_cards", label: "Gas Cards" },
    { name: "gas_cards_value", label: "Gas Cards Value" },
    { name: "women_healthcare_referrals", label: "Women Healthcare Referrals" },
    { name: "kid_healthcare_referrals", label: "Kid Healthcare Referrals" },
    { name: "women_counseling_referrals", label: "Women Counseling Referrals" },
    { name: "kid_counseling_referrals", label: "Kid Counseling Referrals" },
    { name: "babies_born", label: "Babies Born" },
    { name: "women_degrees_earned", label: "Women Degrees Earned" },
    { name: "women_enrolled_in_school", label: "Women Enrolled in School" },
    { name: "women_licenses_earned", label: "Women Licenses Earned" },
    { name: "reunifications", label: "Reunifications" },
    { name: "number_of_interviews_conducted", label: "Number of Interviews Conducted" },
    { name: "number_of_positive_tests", label: "Number of Positive Tests" },
    { name: "number_of_ncns", label: "Number of No Call No Shows (NCNs)" },
    { name: "number_of_others", label: "Number of Other" },
    { name: "number_of_interviews_accpeted", label: "Number of Interviews Accepted" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const idResponse = await backend.get(
          `/caseManagers/id-by-email/${userEmail}`
        );
        // console.log(monthlyStatsResponse.data);
        console.log(idResponse.data)
        setCmId(idResponse.data[0]["id"])
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
    
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const monthlyStatData = {
        date: formData.date,
        cm_id: cmId,
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
      console.log(monthlyStatData);
      await backend.post("/caseManagerMonthlyStats", monthlyStatData);
      onFormSubmitSuccess();
      navigate("/forms-hub"); // Redirect after success
    } catch (error) {
      console.error("Error creating monthly stat:", error);
    }
  };
  
  return (
    <VStack spacing={4} align="stretch" maxW="800px" mx="auto" py={6}>
      <Heading textAlign="center">Case Manager Monthly Statistics Form</Heading>

      {/* Month, Year, Case Manager */}
      <SimpleGrid columns={3} spacing={4}>
        <Box>
          <Text fontWeight="bold">Date</Text>
          <Input
            type = "date"
            width='100%'
            height="30px"
            name="date"
            // value={formData[name]}
            onChange={handleChange}
          />        
        </Box>
        <Box>
          {/* This is for the dropdown showing choices for case managers, 
          should this still be here even if we are automatically supplying cm id 
          from the logged in uesr? */}

          {/* <Text fontWeight="bold">Case Manager</Text>
          <Select name="case_manager" value={formData.case_manager} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Sarah">Sarah</option>
            <option value="John">John</option>
            <option value="Emily">Emily</option>
          </Select> */}
        </Box>
      </SimpleGrid>

      <Divider />

      {/* Contacts */}
      <Box>
        <Text fontSize="lg" fontWeight="bold">Contacts</Text>
        <Input type="number" name="total_number_of_contacts" value={formData.total_number_of_contacts} onChange={handleChange} />
      </Box>

      <Divider />

      {/* Interview Questions */}
      <Text fontSize="lg" fontWeight="bold">Interview Questions</Text>
      <SimpleGrid columns={1} spacing={4}>
        <Input placeholder="Interviews Conducted" type="number" name="number_of_interviews_conducted" value={formData.number_of_interviews_conducted} onChange={handleChange} />
        <Input placeholder="Positive Tests" type="number" name="number_of_positive_tests" value={formData.number_of_positive_tests} onChange={handleChange} />
        <Input placeholder="No Call No Shows" type="number" name="number_of_ncns" value={formData.number_of_ncns} onChange={handleChange} />
        <Input placeholder="Other" type="number" name="number_of_others" value={formData.number_of_others} onChange={handleChange} />
        <Input placeholder="Number of Interviews Conducted" type="number" name="number_of_interviews_conducted" value={formData.number_of_interviews_conducted} onChange={handleChange} />
        <Input placeholder="Number of Interviews Accepted" type="number" name="number_of_interviews_accpeted" value={formData.number_of_interviews_accpeted} onChange={handleChange} />
      </SimpleGrid>

      <Divider />

      {/* Birthdays */}
      <Text fontSize="lg" fontWeight="bold">Birthdays</Text>
      <SimpleGrid columns={1} spacing={4}>
        <Input placeholder="Women's Birthdays" type="number" name="women_birthdays" value={formData.women_birthdays} onChange={handleChange} />
        <Input placeholder="Kid's Birthdays" type="number" name="kid_birthdays" value={formData.kid_birthdays} onChange={handleChange} />
      </SimpleGrid>

      {/* Birthday Cards & Total Value in Same Row */}
      <Box display="flex" alignItems="center" gap={4}>
        <Input placeholder="Birthday Cards" type="number" name="birthday_cards" value={formData.birthday_cards} onChange={handleChange} />
        <Text fontWeight="bold">Total Value:</Text>
        <Input placeholder="Total Value" type="number" name="birthday_cards_value" value={formData.birthday_cards_value} onChange={handleChange} />
      </Box>

      <Divider />

      {/* Food and Bus */}
      <Text fontSize="lg" fontWeight="bold">E&TH Food and Bus</Text>
      {["food_cards", "bus_passes", "gas_cards"].map((field) => (
        <Box key={field} display="flex" alignItems="center" gap={4}>
          <Input placeholder={field.replace("_", " ")} type="number" name={field} value={formData[field]} onChange={handleChange} />
          <Text fontWeight="bold">Total Value:</Text>
          <Input placeholder="Total Value" type="number" name={`${field}_value`} value={formData[`${field}_value`]} onChange={handleChange} />
        </Box>
      ))}

      <Divider />

      {/* Referrals */}
      <Text fontSize="lg" fontWeight="bold">Referrals</Text>
      <SimpleGrid columns={1} spacing={4}>
        <Input placeholder="Healthcare Referrals for Women" type="number" name="women_healthcare_referrals" value={formData.women_healthcare_referrals} onChange={handleChange} />
        <Input placeholder="Counseling Referrals for Women" type="number" name="women_counseling_referrals" value={formData.women_counseling_referrals} onChange={handleChange} />
        <Input placeholder="Healthcare Referrals for Kids" type="number" name="kid_healthcare_referrals" value={formData.kid_healthcare_referrals} onChange={handleChange} />
        <Input placeholder="Counseling Referrals for Kids" type="number" name="kid_counseling_referrals" value={formData.kid_counseling_referrals} onChange={handleChange} />
      </SimpleGrid>
    
      <Divider />

      {/* Miscellaneous */}
      <Text fontSize="lg" fontWeight="bold">Miscellaneous</Text>
      <SimpleGrid columns = {1} spacing = {4}>
        <Input placeholder="Babies Born" type="number" name="babies_born" value={formData.babies_born} onChange={handleChange} />
        <Input placeholder="Women who earn a GED or Diploma while in CCH" type="number" name="women_degrees_earned" value={formData.women_degrees_earned} onChange={handleChange} />
        <Input placeholder="Women who enroll in School or a trade program while in CCH" type="number" name="women_enrolled_in_school" value={formData.women_enrolled_in_school} onChange={handleChange} />
        <Input placeholder="Women who get a drivers license while in the program" type="number" name="women_licenses_earned" value={formData.women_licenses_earned} onChange={handleChange} />
        <Input placeholder="Reunifications" type="number" name="reunifications" value={formData.reunifications} onChange={handleChange} />
      </SimpleGrid>

      {/* Submit/Cancel */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button colorScheme="red" onClick={() => navigate("/forms-hub")}>Cancel</Button>
        <Button colorScheme="blue" type="submit" onClick={handleSubmit}>Submit</Button>
      </Box>
    </VStack>
  );
}

export default FormCM;
