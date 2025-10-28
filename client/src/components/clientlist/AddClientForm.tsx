import React, { useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  Input,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

interface AddClientFormProps {
  onClientAdded: () => void;
  setShowUnfinishedAlert: (e: boolean) => void;
}

export const AddClientForm = ({
  onClientAdded,
  setShowUnfinishedAlert,
}: AddClientFormProps) => {
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const cancelRef = useRef();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const resetForm = () => {
    setFormData({
      created_by: "",
      unit_id: "",
      first_name: "",
      last_name: "",
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
      employement_gained: "",
      reason_for_leaving: "",
      specific_reason_for_leaving: "",
      specific_destination: "",
      savings_amount: "",
      attending_school_upon_exit: "",
      reunified: "",
      successful_completion: "",
      destination_city: "",
      comments: "",
    });
    setErrors({}); // Clear error states when resetting
  };

  useEffect(() => {
    if (hasSubmitted) {
      onClientAdded();
      setHasSubmitted(false);
      resetForm();
    }
  }, [hasSubmitted]);

  const handleCloseAndSave = () => {
    onClose();
    toast({
      title: "New Client Data Saved",
      description: "Successfully saved unfinished client data.",
      status: "info",
      position: "bottom-right",
      isClosable: true,
    });
  };

  const handleConfirmCancel = () => {
    onClose(); // Close the drawer
    closeAlert(); // Close the alert
    resetForm();
    setFormInProgress(false);
    setShowUnfinishedAlert(false);
  };

  const [formData, setFormData] = React.useState({
    created_by: "",
    unit_id: "",
    first_name: "",
    last_name: "",
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
    employement_gained: "",
    reason_for_leaving: "",
    specific_reason_for_leaving: "",
    specific_destination: "",
    savings_amount: "",
    attending_school_upon_exit: "",
    reunified: "",
    successful_completion: "",
    destination_city: "",
    comments: "",
  });
  const [formInProgress, setFormInProgress] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { backend } = useBackendContext();
  const toast = useToast();

  // Helper function to check if a field is empty
  const isFieldEmpty = (value: any): boolean => {
    return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
  };

  const handleSubmit = async () => {
    // Validate all fields and track which ones have errors
    const newErrors: Record<string, boolean> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (isFieldEmpty(value)) {
        newErrors[key] = true;
      }
    });

    // If there are errors, set the error state and show a toast
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Missing information.",
        description: "There is a missing or incorrect field.",
        status: "warning",
        position: "bottom",
        isClosable: true,
      });
      return; // prevent submission
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      const clientData = {
        created_by: parseInt(formData.created_by || "0", 10),
        unit_id: parseInt(formData.unit_id || "0", 10),
        first_name: formData.first_name,
        last_name: formData.last_name,
        grant: formData.grant,
        status: formData.status,
        date_of_birth: formData.date_of_birth,
        age: parseInt(formData.age || "0", 10),
        phone_number: formData.phone_number,
        email: formData.email,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone_number: formData.emergency_contact_phone_number,
        medical: formData.medical === "Yes" ? true : false,
        entrance_date: formData.entrance_date,
        estimated_exit_date: formData.estimated_exit_date,
        exit_date: formData.exit_date,
        bed_nights: parseInt(formData.bed_nights || "0", 10),
        bed_nights_children: parseInt(formData.bed_nights_children || "0", 10),
        pregnant_upon_entry:
          formData.pregnant_upon_entry === "Yes" ? true : false,
        disabled_children: formData.disabled_children === "Yes" ? true : false,
        ethnicity: formData.ethnicity,
        race: formData.race,
        city_of_last_permanent_residence:
          formData.city_of_last_permanent_residence,
        prior_living: formData.prior_living,
        prior_living_city: formData.prior_living_city,
        shelter_in_last_five_years:
          formData.shelter_in_last_five_years === "Yes" ? true : false,
        homelessness_length: parseInt(formData.homelessness_length || "0", 10),
        chronically_homeless:
          formData.chronically_homeless === "Yes" ? true : false,
        attending_school_upon_entry:
          formData.attending_school_upon_entry === "Yes" ? true : false,
        employement_gained: formData.employement_gained,
        reason_for_leaving: formData.reason_for_leaving,
        specific_reason_for_leaving: formData.specific_reason_for_leaving,
        specific_destination: formData.specific_destination,
        savings_amount: parseFloat(formData.savings_amount || "0"),
        attending_school_upon_exit:
          formData.attending_school_upon_exit === "Yes" ? true : false,
        reunified: formData.reunified === "Yes" ? true : false,
        successful_completion:
          formData.successful_completion === "Yes" ? true : false,
        destination_city: formData.destination_city,
        comments: formData.comments,
      };
      await backend.post("/clients", clientData);
      toast({
        title: "Client Added",
        description: `Client Name has been added!`,
        position: "bottom-right",
        status: "success",
      });
      setHasSubmitted(true);
      setFormInProgress(false);
      setShowUnfinishedAlert(false);
      setErrors({}); // Clear errors on successful submission
      resetForm();
      onClose();
      } catch (e) {
        console.log(e);
        toast({
          title: "Client Not Added",
          description: `An error occurred and the client was not added.`,
          status: "error",
        });
      }
    };
  
    return (
      <>
        <Button ref={btnRef} colorScheme='blue' onClick={onOpen}>
          {!formInProgress && <Text>Add</Text>}
          {formInProgress && <Text>Edit New Client</Text>}
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={handleCloseAndSave}
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
                    <Input 
                    placeholder="Short Answer" 
                    value={formData.first_name}
                    isInvalid={errors.first_name}
                    errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, first_name: e.target.value }); setFormInProgress(true); setShowUnfinishedAlert(true); setErrors({...errors, first_name: false})}}
                    />

                    <Text fontWeight="medium">Last Name</Text>
                    <Input 
                    placeholder="Short Answer" 
                    value={formData.last_name}
                    isInvalid={errors.last_name}
                    errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, last_name: e.target.value }); setFormInProgress(true); setErrors({...errors, last_name: false})}}
                    />

                    <Text fontWeight="medium">Status</Text>
                    <Select 
                    placeholder="Select option" 
                    value={formData.status}
                    isInvalid={errors.status}
                    errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, status: e.target.value }); setFormInProgress(true); setErrors({...errors, status: false})}}>
                        <option value="Active">Active</option>
                        <option value="Exited">Exited</option>
                    </Select>

                    <Text fontWeight="medium">Unit ID</Text>
                    <Input placeholder="Short Answer" value={formData.unit_id}
                    isInvalid={errors.unit_id} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, unit_id: e.target.value }); setFormInProgress(true); setErrors({...errors, unit_id: false})}}
                    />

                    <Text fontWeight="medium">Case Manager ID</Text>
                    <Input placeholder="Short Answer"
                    isInvalid={errors.created_by} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, created_by: e.target.value }); setFormInProgress(true); setErrors({...errors, created_by: false})}} />

                    <Text fontWeight="medium">Grant</Text>
                    <Input placeholder="Short Answer" value={formData.grant}
                    isInvalid={errors.grant} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, grant: e.target.value }); setFormInProgress(true); setErrors({...errors, grant: false})}} />

                    <Text fontWeight="medium">Birthday</Text>
                    <Input type="date" value={formData.date_of_birth}
                    isInvalid={errors.date_of_birth} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, date_of_birth: e.target.value }); setFormInProgress(true); setErrors({...errors, date_of_birth: false})}} />

                    <Text fontWeight="medium">Age</Text>
                    <Input placeholder="Short Answer" value={formData.age}
                    isInvalid={errors.age} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, age: e.target.value }); setFormInProgress(true); setErrors({...errors, age: false})}}/>

                    <Text fontWeight="medium">Phone Number</Text>
                    <Input placeholder="Enter phone number" maxLength={10}  value={formData.phone_number}
                    isInvalid={errors.phone_number} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, phone_number: e.target.value }); setFormInProgress(true); setErrors({...errors, phone_number: false})}}
                    />
                    
                    <Text fontWeight="medium">Email</Text>
                    <Input type="email" placeholder="Enter email" maxLength={32} value={formData.email}
                    isInvalid={errors.email} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, email: e.target.value }); setFormInProgress(true); setErrors({...errors, email: false})}}
                    />

                    <Text fontWeight="medium">Emergency Contact Name</Text>
                    <Input placeholder="Enter name" maxLength={32} value={formData.emergency_contact_name}
                    isInvalid={errors.emergency_contact_name} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, emergency_contact_name: e.target.value }); setFormInProgress(true); setErrors({...errors, emergency_contact_name: false})}}
                    />

                    <Text fontWeight="medium">Emergency Contact Phone</Text>
                    <Input placeholder="Enter phone number" maxLength={10} value={formData.emergency_contact_phone_number}
                    isInvalid={errors.emergency_contact_phone_number} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, emergency_contact_phone_number: e.target.value }); setFormInProgress(true); setErrors({...errors, emergency_contact_phone_number: false})}}
                    />

                    <Text fontWeight="medium">Medical</Text>
                    <Select placeholder="Select option" value={formData.medical}
                    isInvalid={errors.medical} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, medical: e.target.value}); setFormInProgress(true); setErrors({...errors, medical: false})}}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Entry Date</Text>
                    <Input type="date" value={formData.entrance_date}
                    isInvalid={errors.entrance_date} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, entrance_date: e.target.value }); setFormInProgress(true); setErrors({...errors, entrance_date: false})}}
                    />

                    <Text fontWeight="medium">Estimated Exit Date</Text>
                    <Input type="date" value={formData.estimated_exit_date}
                    isInvalid={errors.estimated_exit_date} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, estimated_exit_date: e.target.value }); setFormInProgress(true); setErrors({...errors, estimated_exit_date: false})}}
                    />

                    <Text fontWeight="medium">Exit Date</Text>
                    <Input type="date" value={formData.exit_date}
                    isInvalid={errors.exit_date} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, exit_date: e.target.value }); setFormInProgress(true); setErrors({...errors, exit_date: false})}}
                    />

                    <Text fontWeight="medium">Bed Nights</Text>
                    <Input placeholder="Short Answer" value={formData.bed_nights}
                    isInvalid={errors.bed_nights} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, bed_nights: e.target.value }); setFormInProgress(true); setErrors({...errors, bed_nights: false})}}
                    />

                    <Text fontWeight="medium">Bed Nights with Children</Text>
                    <Input placeholder="Short Answer" value={formData.bed_nights_children}
                    isInvalid={errors.bed_nights_children} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, bed_nights_children: e.target.value }); setFormInProgress(true); setErrors({...errors, bed_nights_children: false})}}
                    />

                    <Text fontWeight="medium">Pregnant Upon Entry?</Text>
                    <Select placeholder="Select option" value={formData.pregnant_upon_entry}
                    isInvalid={errors.pregnant_upon_entry} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, pregnant_upon_entry: e.target.value }); setFormInProgress(true); setErrors({...errors, pregnant_upon_entry: false})}}
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Disabled Children</Text>
                    <Select placeholder="Select option" value={formData.disabled_children}
                    isInvalid={errors.disabled_children} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, disabled_children: e.target.value }); setFormInProgress(true); setErrors({...errors, disabled_children: false})}}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Ethnicity</Text>
                    <Select placeholder="Select option" value={formData.ethnicity}
                    isInvalid={errors.ethnicity} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, ethnicity: e.target.value }); setFormInProgress(true); setErrors({...errors, ethnicity: false})}}>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Non-Hispanic">Non-Hispanic</option>
                        <option value="Refused">Refused</option>
                    </Select>

                    <Text fontWeight="medium">Race</Text>
                    <Select placeholder="Select option" value={formData.race}
                    isInvalid={errors.race} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, race: e.target.value }); setFormInProgress(true); setErrors({...errors, race: false})}}>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Caucasian">Caucasian</option>
                        <option value="African American">African American</option>
                        <option value="Asian">Asian</option>
                        <option value="Native American">Native American</option>
                        <option value="Pacific Islander/Hawaiian">Pacific Islander/Hawaiian</option>
                        <option value="Multi/Other">Multi/Other</option>
                    </Select>

                    <Text fontWeight="medium">City of Last Permanent Residence</Text>
                    <Input placeholder="Enter city" value={formData.city_of_last_permanent_residence}
                    isInvalid={errors.city_of_last_permanent_residence} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, city_of_last_permanent_residence: e.target.value }); setFormInProgress(true); setErrors({...errors, city_of_last_permanent_residence: false})}}
                    />

                    <Text fontWeight="medium">Prior Living</Text>
                    <Input placeholder="Enter prior living situation" value={formData.prior_living}
                    isInvalid={errors.prior_living} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, prior_living: e.target.value }); setFormInProgress(true); setErrors({...errors, prior_living: false})}}
                    />

                    <Text fontWeight="medium">Prior Living City</Text>
                    <Input placeholder="Enter city" value={formData.prior_living_city}
                    isInvalid={errors.prior_living_city} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, prior_living_city: e.target.value }); setFormInProgress(true); setErrors({...errors, prior_living_city: false})}}
                    />

                    <Text fontWeight="medium">Shelter in Last 5 Years</Text>
                    <Select placeholder="Select option" value={formData.shelter_in_last_five_years}
                    isInvalid={errors.shelter_in_last_five_years} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, shelter_in_last_five_years: e.target.value }); setFormInProgress(true); setErrors({...errors, shelter_in_last_five_years: false})}}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Length of Homelessness (months)</Text>
                    <Input type="number" placeholder="Enter number" value={formData.homelessness_length}
                    isInvalid={errors.homelessness_length} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, homelessness_length: e.target.value }); setFormInProgress(true); setErrors({...errors, homelessness_length: false})}}
                    />

                    <Text fontWeight="medium">Chronically Homeless</Text>
                    <Select placeholder="Select option" value={formData.chronically_homeless}
                    isInvalid={errors.chronically_homeless} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, chronically_homeless: e.target.value }); setFormInProgress(true); setErrors({...errors, chronically_homeless: false})}}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Attending School Upon Entry</Text>
                    <Select placeholder="Select option" value={formData.attending_school_upon_entry}
                    isInvalid={errors.attending_school_upon_entry} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, attending_school_upon_entry: e.target.value }); setFormInProgress(true); setErrors({...errors, attending_school_upon_entry: false})}}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Employment Gained</Text>
                    <Select placeholder="Select option" value={formData.employement_gained}
                    isInvalid={errors.employement_gained} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, employement_gained: e.target.value }); setFormInProgress(true); setErrors({...errors, employement_gained: false})}}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Reason for Leaving</Text>
                    <Input placeholder="Enter reason" value={formData.reason_for_leaving}
                    isInvalid={errors.reason_for_leaving} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, reason_for_leaving: e.target.value }); setFormInProgress(true); setErrors({...errors, reason_for_leaving: false})}}/>

                    <Text fontWeight="medium">Specific Reason for Leaving</Text>
                    <Input placeholder="Enter specific reason" value={formData.specific_reason_for_leaving}
                    isInvalid={errors.specific_reason_for_leaving} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, specific_reason_for_leaving: e.target.value }); setFormInProgress(true); setErrors({...errors, specific_reason_for_leaving: false})}}
                    />

                    <Text fontWeight="medium">Specific Destination</Text>
                    <Input placeholder="Enter destination" value={formData.specific_destination}
                    isInvalid={errors.specific_destination} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, specific_destination: e.target.value }); setFormInProgress(true); setErrors({...errors, specific_destination: false})}}
                    />

                    <Text fontWeight="medium">Savings Amount ($)</Text>
                    <Input type="number" step="0.01" placeholder="Enter amount" value={formData.savings_amount}
                    isInvalid={errors.savings_amount} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, savings_amount: e.target.value }); setFormInProgress(true); setErrors({...errors, savings_amount: false})}}
                    />

                    <Text fontWeight="medium">Attending School Upon Exit</Text>
                    <Select placeholder="Select option" value={formData.attending_school_upon_exit}
                    isInvalid={errors.attending_school_upon_exit} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, attending_school_upon_exit: e.target.value }); setFormInProgress(true); setErrors({...errors, attending_school_upon_exit: false})}}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Reunified</Text>
                    <Select placeholder="Select option" value={formData.reunified}
                    isInvalid={errors.reunified} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, reunified: e.target.value }); setFormInProgress(true); setErrors({...errors, reunified: false})}}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Successful Completion</Text>
                    <Select placeholder="Select option" value={formData.successful_completion}
                    isInvalid={errors.successful_completion} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, successful_completion: e.target.value }); setFormInProgress(true); setErrors({...errors, successful_completion: false})}}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                    </Select>

                    <Text fontWeight="medium">Destination City</Text>
                    <Input placeholder="Enter city" value={formData.destination_city}
                    isInvalid={errors.destination_city} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, destination_city: e.target.value }); setFormInProgress(true); setErrors({...errors, destination_city: false})}}
                    />

                    <Text fontWeight="medium">Comments</Text>
                    <Input placeholder="Enter comments" value={formData.comments}
                    isInvalid={errors.comments} errorBorderColor="red.500"
                    onChange={(e) => {setFormData({ ...formData, comments: e.target.value }); setFormInProgress(true); setErrors({...errors, comments: false})}}
                    />
                </Grid>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={openAlert}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
            >
              Are you sure?
            </AlertDialogHeader>

            <AlertDialogBody>
              You can't undo this action afterward.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={closeAlert}
              >
                No
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleConfirmCancel}
                ml={3}
              >
                Yes, Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
