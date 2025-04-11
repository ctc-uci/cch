import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Grid,
    Text,
    Button,
    Select,
    Input,
    useToast,
  } from '@chakra-ui/react';
import React from 'react';
import Client from "../../types/client";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";


export const AddClientForm = () => {
    const [formData, setFormData] = React.useState({
        created_by: "",
        unit_id: "",
        first_name: "",
        last_name: "",
        site: "",
        case_managers: "",
        grant: "",
        status: "",
        date_of_birth: "",
        age: "",
        phone_number: "",
        email: "",
        emergency_contact_name: "",
        emergency_contact_phone_number: "",
        medical: "",
        entrance_date: "",
        estimated_exit_date: "",
        exit_date: "",
        bed_nights: "",
        bed_nights_children: "",
        pregnant_upon_entry: "",
        disabled_children: "",
        ethnicity: "",
        race: "",
        city_of_last_permanent_residence: "",
        prior_living: "",
        prior_living_city: "",
        shelter_in_last_five_years: "",
        homelessness_length: "",
        chronically_homeless: "",
        attending_school_upon_entry: "",
        employment_gained: "",
        reason_for_leaving: "",
        specific_reason_for_leaving: "",
        specific_destination: "",
        savings_amount: "",
        attending_school_upon_exit: "",
        reunified: "",
        successful_completion: "",
        destination_city: "",
        comments: ""
    });
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const {backend} = useBackendContext()
    const toast = useToast()
    
    const handleSubmit = async (event: React.FormEvent) => {

      try {

        const clientData = {
          created_by: formData.created_by,
          unit_id: formData.unit_id,  
          first_name: formData.first_name,
          last_name: formData.last_name,
          site: formData.site,
          // case_managers: formData.case_managers,
          grant: formData.grant,
          status: formData.status,
          date_of_birth: formData.date_of_birth,
          age: parseInt(formData.age || "0", 10),
          phone_number: formData.phone_number,
          email: formData.email,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone_number: formData.emergency_contact_phone_number,
          medical: formData.medical,
          entrance_date: formData.entrance_date,
          estimated_exit_date: formData.estimated_exit_date,
          exit_date: formData.exit_date,
          bed_nights: parseInt(formData.bed_nights || "0", 10),
          bed_nights_children: parseInt(formData.bed_nights_children || "0", 10),
          pregnant_upon_entry: formData.pregnant_upon_entry,
          disabled_children: formData.disabled_children,
          ethnicity: formData.ethnicity,
          race: formData.race,
          city_of_last_permanent_residence: formData.city_of_last_permanent_residence,
          prior_living: formData.prior_living,
          prior_living_city: formData.prior_living_city,
          shelter_in_last_five_years: formData.shelter_in_last_five_years,
          homelessness_length: parseInt(formData.homelessness_length || "0", 10),
          chronically_homeless: formData.chronically_homeless,
          attending_school_upon_entry: formData.attending_school_upon_entry,
          employment_gained: formData.employment_gained,
          reason_for_leaving: formData.reason_for_leaving,
          specific_reason_for_leaving: formData.specific_reason_for_leaving,
          specific_destination: formData.specific_destination,
          savings_amount: formData.savings_amount,
          attending_school_upon_exit: formData.attending_school_upon_exit,
          reunified: formData.reunified,
          successful_completion: formData.successful_completion,
          destination_city: formData.destination_city,
          comments: formData.comments
      };
        console.log(clientData)
        await backend.post("/clients", clientData);
        toast({
          title: "Form submitted",
          description: `Thanks for your feedback!`,
          status: "success",
        });
      } catch (e) {
        console.log(e)
        toast({
          title: "An error occurred",
          description: `Exit survey response was not created: ${e.message}`,
          status: "error",
        });
      }
    }
  
    return (
      <>
        <Button ref={btnRef} colorScheme='blue' onClick={onOpen}>
          Add New Client
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          finalFocusRef={btnRef}
          size="lg"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Add Client</DrawerHeader>
  
            <DrawerBody>
                <Grid templateColumns="1fr 2fr" gap={5}>
                    <Text fontWeight="medium">First Name</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />

                    <Text fontWeight="medium">Last Name</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />

                    <Text fontWeight="medium">Status</Text>
                    <Select placeholder="Select option" 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Exited">Exited</option>
                    </Select>

                    <Text fontWeight="medium">Site</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                    />

                    <Text fontWeight="medium">Unit ID</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                    />

                    <Text fontWeight="medium">Case Manager ID</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, created_by: e.target.value })} />

                    <Text fontWeight="medium">Grant</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, grant: e.target.value })} />

                    <Text fontWeight="medium">Birthday</Text>
                    <Input type="date"
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} />

                    <Text fontWeight="medium">Age</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}/>

                    <Text fontWeight="medium">Phone Number</Text>
                    <Input placeholder="Enter phone number" maxLength={10} 
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    />
                    
                    <Text fontWeight="medium">Email</Text>
                    <Input type="email" placeholder="Enter email" maxLength={32} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Text fontWeight="medium">Emergency Contact Name</Text>
                    <Input placeholder="Enter name" maxLength={32} 
                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    />

                    <Text fontWeight="medium">Emergency Contact Phone</Text>
                    <Input placeholder="Enter phone number" maxLength={10} 
                    onChange={(e) => setFormData({ ...formData, emergency_contact_phone_number: e.target.value })}
                    />

                    <Text fontWeight="medium">Medical</Text>
                    <Select placeholder="Select option" 
                    onChange={(e) => setFormData({ ...formData, medical: e.target.value })}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Entry Date</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, entrance_date: e.target.value })}
                    />

                    <Text fontWeight="medium">Estimated Exit Date</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, estimated_exit_date: e.target.value })}
                    />

                    <Text fontWeight="medium">Exit Date</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, exit_date: e.target.value })}
                    />

                    <Text fontWeight="medium">Bed Nights</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, bed_nights: e.target.value })}
                    />

                    <Text fontWeight="medium">Bed Nights with Children</Text>
                    <Input placeholder="Short Answer" 
                    onChange={(e) => setFormData({ ...formData, bed_nights_children: e.target.value })}
                    />

                    <Text fontWeight="medium">Pregnant Upon Entry?</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, pregnant_upon_entry: e.target.value })}
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Disabled Children</Text>
                    <Select placeholder="Select option" 
                    onChange={(e) => setFormData({ ...formData, disabled_children: e.target.value })}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Ethnicity</Text>
                    <Select placeholder="Select option" 
                    onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Non-Hispanic">Non-Hispanic</option>
                        <option value="Refused">Refused</option>
                    </Select>

                    <Text fontWeight="medium">Race</Text>
                    <Select placeholder="Select option" 
                    onChange={(e) => setFormData({ ...formData, race: e.target.value })}>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Caucasian">Caucasian</option>
                        <option value="African American">African American</option>
                        <option value="Asian">Asian</option>
                        <option value="Native American">Native American</option>
                        <option value="Pacific Islander/Hawaiian">Pacific Islander/Hawaiian</option>
                        <option value="Multi/Other">Multi/Other</option>
                    </Select>

                    <Text fontWeight="medium">City of Last Permanent Residence</Text>
                    <Input placeholder="Enter city" 
                    onChange={(e) => setFormData({ ...formData, city_of_last_permanent_residence: e.target.value })}
                    />

                    <Text fontWeight="medium">Prior Living</Text>
                    <Input placeholder="Enter prior living situation" 
                    onChange={(e) => setFormData({ ...formData, prior_living: e.target.value })}
                    />

                    <Text fontWeight="medium">Prior Living City</Text>
                    <Input placeholder="Enter city" onChange={(e) => setFormData({ ...formData, prior_living_city: e.target.value })}
                    />

                    <Text fontWeight="medium">Shelter in Last 5 Years</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, shelter_in_last_five_years: e.target.value })}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Length of Homelessness (months)</Text>
                    <Input type="number" placeholder="Enter number" 
                    onChange={(e) => setFormData({ ...formData, homelessness_length: e.target.value })}
                    />

                    <Text fontWeight="medium">Chronically Homeless</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, chronically_homeless: e.target.value })}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Attending School Upon Entry</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, attending_school_upon_entry: e.target.value })}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Employment Gained</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, employment_gained: e.target.value })}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Reason for Leaving</Text>
                    <Input placeholder="Enter reason" 
                    onChange={(e) => setFormData({ ...formData, reason_for_leaving: e.target.value })}/>

                    <Text fontWeight="medium">Specific Reason for Leaving</Text>
                    <Input placeholder="Enter specific reason"
                    onChange={(e) => setFormData({ ...formData, specific_reason_for_leaving: e.target.value })}
                    />

                    <Text fontWeight="medium">Specific Destination</Text>
                    <Input placeholder="Enter destination"
                    onChange={(e) => setFormData({ ...formData, specific_destination: e.target.value })}
                    />

                    <Text fontWeight="medium">Savings Amount ($)</Text>
                    <Input type="number" step="0.01" placeholder="Enter amount"
                    onChange={(e) => setFormData({ ...formData, savings_amount: e.target.value })}
                    />

                    <Text fontWeight="medium">Attending School Upon Exit</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, attending_school_upon_exit: e.target.value })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Reunified</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, reunified: e.target.value })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Successful Completion</Text>
                    <Select placeholder="Select option"
                    onChange={(e) => setFormData({ ...formData, successful_completion: e.target.value })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Destination City</Text>
                    <Input placeholder="Enter city"
                    onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                    />

                    <Text fontWeight="medium">Comments</Text>
                    <Input placeholder="Enter comments"
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                </Grid>

            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme='blue' onClick={handleSubmit}>Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

