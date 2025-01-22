import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useBackendContext } from "../../contexts/hooks/useBackendContext";

  function FormCM() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { backend } = useBackendContext();
    
    // const {id, setId} = useState(0);
    // const {date, setDate} = useState("");
    // const {cmId, setCmId} = useState(0);
    // const {babiesBorn, setBabiesBorn} = useState(0);
    // const {enrolledInSchool, setEnrolledInSchool} = useState(0);
    // const {earnedDegree, setEarnedDegree} = useState(0);
    // const {earnedDriversLicense, setEarnedDriversLicense} = useState(0);
    // const {reunifiedWithChildren, setReunifiedWithChildren} = useState(0);
    // const {womensBirthdays, setWomensBirthdays} = useState(0);
    // const {childrensBirthdays, setChildrensBirthdays} = useState(0);
    // const {birthdayGiftCardValues, setBirthdayGiftCardValues} = useState(0);
    // const {foodCardValues, setFoodCardValues} = useState(0);
    // const {busPasses, setBusPasses} = useState(0);
    // const {gasCardsValue, setGasCardsValue} = useState(0);
    // const {phoneContacts, setPhoneContacts} = useState(0);
    // const {inpersonContacts, setInpersonContacts} = useState(0);
    // const {emailContacts, setEmailContacts} = useState(0);
    // const {interviewsScheduled, setInterviewsScheduled} = useState(0);
    // const {interviewsConducted, setInterviewsConducted} = useState(0);
    // const {positiveTests, setPositiveTests} = useState(0);
    // const {noCallNoShows, setNoCallNoShows} = useState(0);
    // const {other, setOther} = useState(0);

    const [formData, setFormData] = useState({
    date: '',
    cm_id: '234023',
    babies_born: '',
    enrolled_in_school: '',
    earned_degree: '',
    earned_drivers_license: '',
    reunified_with_children: '',
    womens_birthdays: '',
    birthday_gift_card_values: '',
    childrens_birthdays: '',
    food_card_values: '',
    bus_passes: '',
    gas_cards_value: '',
    phone_contacts: '',
    inperson_contacts: '',
    email_contacts: '',
    interviews_scheduled: '',
    interviews_conducted: '',
    positive_tests: '',
    no_call_no_shows: '',
    other: '',
  });
  
    const handleChange = (event: any) => {
      const name = event.target.name;
      var value = event.target.value;
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    // const handleSubmit = async (e) => {
    //   e.preventDefault();
  
    //   const DUMMY_STRING = '';
    //   const PENDING_STATUS = 'Pending';
    //   const DUMMY_DATE = new Date().toISOString().split('T')[0];
    //   const DUMMY_BOOL = false;
    //   const formattedPhoneNumber = formData['phoneNumber'].replace(/-/g, '');
  
    //   const businessData = {
    //     name: formData['businessName'],
    //     contactName: formData['personFirstName'] + ' ' + formData['personLastName'],
    //     street: formData['businessAddress1'] + ' ' + formData['businessAddress2'],
    //     zipCode: formData['postalCode'],
    //     state: formData['state'],
    //     city: formData['city'],
    //     website: formData['website'],
    //     businessHours: JSON.stringify(formData['businessHours']),
    //     primaryPhone: formattedPhoneNumber,
    //     primaryEmail: formData['personEmail'],
    //     findOut: formData['heardAbout'],
    //     type: DUMMY_STRING,
    //     qbVendorName: DUMMY_STRING,
    //     qbCityStateZip: DUMMY_STRING,
    //     backupPhone: DUMMY_STRING,
    //     comments: DUMMY_STRING,
    //     faxPhone: DUMMY_STRING,
    //     onboardingStatus: PENDING_STATUS,
    //     joinDate: DUMMY_DATE,
    //     inputTypeStatus: DUMMY_STRING,
    //     vendorType: DUMMY_STRING,
    //     status: PENDING_STATUS,
    //     petsOfTheHomelessDiscount: DUMMY_BOOL,
    //     updatedBy: formData['personFirstName'] + ' ' + formData['personLastName'],
    //     updatedDateTime: new Date(),
    //     syncToQb: DUMMY_BOOL,
    //     veterinary: DUMMY_BOOL,
    //     resource: DUMMY_BOOL,
    //     food: DUMMY_BOOL,
    //     donation: DUMMY_BOOL,
    //     familyShelter: DUMMY_BOOL,
    //     wellness: DUMMY_BOOL,
    //     spayNeuter: DUMMY_BOOL,
    //     financial: DUMMY_BOOL,
    //     reHome: DUMMY_BOOL,
    //     erBoarding: DUMMY_BOOL,
    //     senior: DUMMY_BOOL,
    //     cancer: DUMMY_BOOL,
    //     dog: DUMMY_BOOL,
    //     cat: DUMMY_BOOL,
    //     fphPhone: DUMMY_STRING,
    //     contactPhone: DUMMY_STRING,
    //     webNotes: DUMMY_STRING,
    //     internalNotes: DUMMY_STRING,
    //     published: DUMMY_BOOL,
    //     shelter: DUMMY_BOOL,
    //     domesticViolence: DUMMY_BOOL,
    //     webDateInit: DUMMY_DATE,
    //     entQb: DUMMY_BOOL,
    //     serviceRequest: DUMMY_BOOL,
    //     inactive: DUMMY_BOOL,
    //     finalCheck: DUMMY_BOOL,
    //     createdBy: formData['personFirstName'] + ' ' + formData['personLastName'],
    //     createdDate: new Date(),
    //   };
  
    //   try {
    //     if (formData['termsAndConditionsAccepted'] === true) {
    //       const businessResponse = await backend.post('/business', businessData);
    //       const businessId = businessResponse.data[0].id;
    //       const businessName = businessResponse.data[0].name;
    //       const notification_data = {
    //         businessId: 0,
    //         message: `New Donation Site Application from ${formData['businessName']}`,
    //         timestamp: new Date().toLocaleString('en-US', {
    //           timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //         }),
    //         type: 'New Application',
    //         senderId: businessId,
    //         businessName: businessName,
    //         beenDismissed: false,
    //       };
    //       await backend.post('/notification', notification_data);
    //       nextStep();
    //     }
    //   } catch (error) {
    //     console.error('Error in business registration:', error);
    //   }
    // };

    
    // <Input
    //               name="personLastName"
    //               type="text"
    //               value={formData['personLastName']}
    //               onChange={(e) => {
    //                 handleChange(e);
    //               }}
    // />
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); // avoid page reload
      
      try {
        // Convert string fields to integers where appropriate
        // (If date is also an integer or special format, parse accordingly)
        const monthlyStatData = {
          date: formData.date, // or new Date(formData.date).toISOString() if needed
          cm_id: parseInt(formData.cm_id, 10),
          babies_born: parseInt(formData.babies_born, 10),
          enrolled_in_school: parseInt(formData.enrolled_in_school, 10),
          earned_degree: parseInt(formData.earned_degree, 10),
          earned_drivers_license: parseInt(formData.earned_drivers_license, 10),
          reunified_with_children: parseInt(formData.reunified_with_children, 10),
          womens_birthdays: parseInt(formData.womens_birthdays, 10),
          childrens_birthdays: parseInt(formData.childrens_birthdays, 10),
          birthday_gift_card_values: parseInt(formData.birthday_gift_card_values, 10),
          food_card_values: parseInt(formData.food_card_values, 10),
          bus_passes: parseInt(formData.bus_passes, 10),
          gas_cards_value: parseInt(formData.gas_cards_value, 10),
          phone_contacts: parseInt(formData.phone_contacts, 10),
          inperson_contacts: parseInt(formData.inperson_contacts, 10),
          email_contacts: parseInt(formData.email_contacts, 10),
          interviews_scheduled: parseInt(formData.interviews_scheduled, 10),
          interviews_conducted: parseInt(formData.interviews_conducted, 10),
          positive_tests: parseInt(formData.positive_tests, 10),
          no_call_no_shows: parseInt(formData.no_call_no_shows, 10),
          other: parseInt(formData.other, 10)
        };
  
        await backend.post("/caseManagerMonthlyStats", monthlyStatData);
        // Do we need to clear monthlyStatData?
        
  
      } catch (error) {
        console.error("Error creating monthly stat:", error);
      } finally {
        onClose();

      }
      
    };
    
    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Case Manager Form</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box display="flex" flexDirection="row" gap="100px">
              <Text>cm id</Text>
              <Input width="100%" height="25px"
                name="cm_id"
                onChange={(e) => {
                handleChange(e);
              }}/> 
              </Box>
              <Text>Babies Born</Text>
                <Input 
                  name="babies_born"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Enrolled in School</Text>
                <Input 
                  name="enrolled_in_school"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Earned Degree</Text>
                <Input 
                  name="earned_degree"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Earned Drivers License</Text>
                <Input 
                  name="earned_drivers_license"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Reunified with Children</Text>
                <Input 
                  name="reunified_with_children"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Womens Birthdays</Text>
                <Input 
                  name="womens_birthdays"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Childrens Birthdays</Text>
                <Input 
                  name="childrens_birthdays"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Birthday Gift Card Values</Text>
                <Input 
                  name="birthday_gift_card_values"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Food Card Values</Text>
                <Input 
                  name="food_card_values"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Bus Passes</Text>
                <Input 
                  name="bus_passes"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Gas Cards Value</Text>
                <Input 
                  name="gas_cards_value"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Phone Contacts</Text>
                <Input 
                  name="phone_contacts"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Inperson Contacts</Text>
                <Input 
                  name="inperson_contacts"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Email Contacts</Text>
                <Input 
                  name="email_contacts"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Interviews Scheduled</Text>
                <Input 
                  name="interviews_scheduled"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Interviews Conducted</Text>
                <Input 
                  name="interviews_conducted"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Positive Tests</Text>
                <Input 
                  name="positive_tests"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>No Call No Shows</Text>
                <Input 
                  name="no_call_no_shows"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text>Other</Text>
                <Input 
                  name="other"
                  onChange={(e) => {
                  
                  handleChange(e);
                }}/>
              <Text/>
              
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Submit
              </Button>
              <Button colorScheme='red' mr={3} onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
        

    )
  }

export default FormCM;