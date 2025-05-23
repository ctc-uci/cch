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
import Client from "../../types/client";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { backend } = useBackendContext();
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    if (
      Object.values(formData).some(
        (value) =>
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "")
      )
    ) {
      toast({
        title: "Missing information.",
        description: "There is a missing or incorrect field.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
      return; // prevent submission
    }

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
      <Button
        ref={btnRef}
        colorScheme="blue"
        onClick={onOpen}
      >
        {!formInProgress && <Text>Add</Text>}
        {formInProgress && <Text>Edit</Text>}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={handleCloseAndSave}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Client</DrawerHeader>

          <DrawerBody>
            <Grid
              templateColumns="1fr 2fr"
              gap={5}
            >
              <Text fontWeight="medium">
                First Name<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) => {
                  setFormData({ ...formData, first_name: e.target.value });
                  setFormInProgress(true);
                  setShowUnfinishedAlert(true);
                }}
              />

              <Text fontWeight="medium">
                Last Name<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) => {
                  setFormData({ ...formData, last_name: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Status<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.status}
                onChange={(e) => {
                  setFormData({ ...formData, status: e.target.value });
                  setFormInProgress(true);
                }}
              >
                <option value="Active">Active</option>
                <option value="Exited">Exited</option>
              </Select>

              <Text fontWeight="medium">
                Site<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter site"
                onChange={(e) => {
                  setFormData({ ...formData, site: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Unit ID<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter Unit ID"
                value={formData.unit_id}
                type="number"
                onChange={(e) => {
                  setFormData({ ...formData, unit_id: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Case Manager ID<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Input Case Manager ID"
                type="number"
                onChange={(e) => {
                  setFormData({ ...formData, created_by: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Grant<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter grant"
                value={formData.grant}
                onChange={(e) => {
                  setFormData({ ...formData, grant: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Birthday<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => {
                  setFormData({ ...formData, date_of_birth: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Age<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter age"
                value={formData.age}
                type="number"
                onChange={(e) => {
                  setFormData({ ...formData, age: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Phone Number<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter phone number"
                maxLength={10}
                value={formData.phone_number}
                onChange={(e) => {
                  setFormData({ ...formData, phone_number: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Email<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                type="email"
                placeholder="Enter email"
                maxLength={32}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text
                fontWeight="medium"
                mr={5}
              >
                Emergency Contact Name<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter name"
                maxLength={32}
                value={formData.emergency_contact_name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    emergency_contact_name: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text
                fontWeight="medium"
                mr={5}
              >
                Emergency Contact Phone<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter phone number"
                maxLength={10}
                value={formData.emergency_contact_phone_number}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    emergency_contact_phone_number: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Medical<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.medical}
                onChange={(e) => {
                  setFormData({ ...formData, medical: e.target.value });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Entry Date<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                type="date"
                value={formData.entrance_date}
                onChange={(e) => {
                  setFormData({ ...formData, entrance_date: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Estimated Exit Date<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                type="date"
                value={formData.estimated_exit_date}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    estimated_exit_date: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Exit Date<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                type="date"
                value={formData.exit_date}
                onChange={(e) => {
                  setFormData({ ...formData, exit_date: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Bed Nights<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter number"
                value={formData.bed_nights}
                type="number"
                onChange={(e) => {
                  setFormData({ ...formData, bed_nights: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Bed Nights with Children<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter number"
                value={formData.bed_nights_children}
                type="number"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    bed_nights_children: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Pregnant Upon Entry?<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.pregnant_upon_entry}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    pregnant_upon_entry: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Disabled Children<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.disabled_children}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    disabled_children: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Ethnicity<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.ethnicity}
                onChange={(e) => {
                  setFormData({ ...formData, ethnicity: e.target.value });
                  setFormInProgress(true);
                }}
              >
                <option value="Hispanic">Hispanic</option>
                <option value="Non-Hispanic">Non-Hispanic</option>
                <option value="Refused">Refused</option>
              </Select>

              <Text fontWeight="medium">
                Race<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.race}
                onChange={(e) => {
                  setFormData({ ...formData, race: e.target.value });
                  setFormInProgress(true);
                }}
              >
                <option value="Hispanic">Hispanic</option>
                <option value="Caucasian">Caucasian</option>
                <option value="African American">African American</option>
                <option value="Asian">Asian</option>
                <option value="Native American">Native American</option>
                <option value="Pacific Islander/Hawaiian">
                  Pacific Islander/Hawaiian
                </option>
                <option value="Multi/Other">Multi/Other</option>
              </Select>

              <Text fontWeight="medium">
                City of Last Permanent Residence
                <span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter city"
                value={formData.city_of_last_permanent_residence}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    city_of_last_permanent_residence: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Prior Living<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter prior living situation"
                value={formData.prior_living}
                onChange={(e) => {
                  setFormData({ ...formData, prior_living: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Prior Living City<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter city"
                value={formData.prior_living_city}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    prior_living_city: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Shelter in Last 5 Years<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.shelter_in_last_five_years}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    shelter_in_last_five_years: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Length of Homelessness (months)
                <span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                type="number"
                placeholder="Enter number"
                value={formData.homelessness_length}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    homelessness_length: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Chronically Homeless<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.chronically_homeless}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    chronically_homeless: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Attending School Upon Entry
                <span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.attending_school_upon_entry}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    attending_school_upon_entry: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Employment Gained<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.employement_gained}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    employement_gained: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Reason for Leaving<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter reason"
                value={formData.reason_for_leaving}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    reason_for_leaving: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text
                fontWeight="medium"
                mr={5}
              >
                Specific Reason for Leaving
                <span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter specific reason"
                value={formData.specific_reason_for_leaving}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    specific_reason_for_leaving: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Specific Destination<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter destination"
                value={formData.specific_destination}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    specific_destination: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Savings Amount ($)<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={formData.savings_amount}
                onChange={(e) => {
                  setFormData({ ...formData, savings_amount: e.target.value });
                  setFormInProgress(true);
                }}
              />

              <Text
                fontWeight="medium"
                mr={5}
              >
                Attending School Upon Exit
                <span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.attending_school_upon_exit}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    attending_school_upon_exit: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Reunified<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.reunified}
                onChange={(e) => {
                  setFormData({ ...formData, reunified: e.target.value });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Successful Completion<span style={{ color: "red" }}> *</span>
              </Text>
              <Select
                placeholder="Select option"
                value={formData.successful_completion}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    successful_completion: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <Text fontWeight="medium">
                Destination City<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter city"
                value={formData.destination_city}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    destination_city: e.target.value,
                  });
                  setFormInProgress(true);
                }}
              />

              <Text fontWeight="medium">
                Comments<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                placeholder="Enter comments"
                value={formData.comments}
                onChange={(e) => {
                  setFormData({ ...formData, comments: e.target.value });
                  setFormInProgress(true);
                }}
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
