import { useEffect, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import {
  MdOutlineAdd,
  MdOutlineDelete,
  MdOutlineFilterAlt,
} from "react-icons/md";

import type { TableType } from "../../../types/form.ts";

interface FilterProps {
  setFilterQuery: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FilterTemplate = ({
  setFilterQuery,
  type,
}: FilterProps & TableType) => {
  const toast = useToast();
  const [nextId, setNextId] = useState(2);

  let columns = [];

  if (type === "initialScreener") {
    columns = [
      { name: "Name", value: "initial_interview.name", type: "string" },
      { name: "Age", value: "initial_interview.age", type: "string" },
      {
        name: "Birthday",
        value: "initial_interview.date_of_birth",
        type: "date",
      },
      {
        name: "Marital Status",
        value: "initial_interview.marital_status",
        type: "string",
      },
      {
        name: "Client Telephone #",
        value: "initial_interview.phone_number",
        type: "number",
      },
      {
        name: "Client Email Address",
        value: "initial_interview.email",
        type: "string",
      },
      {
        name: "Last 4 SSID",
        value: "initial_interview.ssn_last_four",
        type: "number",
      },
      {
        name: "Ethnicity",
        value: "initial_interview.ethnicity",
        type: "string",
      },
      { name: "Veteran", value: "initial_interview.veteran", type: "boolean" },
      {
        name: "Disabled",
        value: "initial_interview.disabled",
        type: "boolean",
      },
      {
        name: "Current Address",
        value: "initial_interview.current_address",
        type: "string",
      },
      {
        name: "Reason for Leaving Perm Address",
        value: "initial_interview.last_perm_address",
        type: "string",
      },
      {
        name: "Location Last Night",
        value: "initial_interview.where_reside_last_night",
        type: "string",
      },
      {
        name: "Currently Homeless",
        value: "initial_interview.currently_homeless",
        type: "boolean",
      },
      {
        name: "Event Leading to Homelessness",
        value: "initial_interview.event_leading_to_homelessness",
        type: "string",
      },
      {
        name: "Length of Homelessness",
        value: "initial_interview.how_long_experiencing_homelessness",
        type: "string",
      },
      {
        name: "Previously Applied to CCH",
        value: "initial_interview.prev_applied_to_cch",
        type: "boolean",
      },
      {
        name: "If yes, when",
        value: "initial_interview.when_prev_applied_to_cch",
        type: "string",
      },
      {
        name: "Been in CCH before",
        value: "initial_interview.prev_in_cch",
        type: "boolean",
      },
      {
        name: "If yes, when",
        value: "initial_interview.when_prev_in_cch",
        type: "string",
      },
      {
        name: "Children",
        value: "initial_interview.custody_of_children",
        type: "boolean",
      },
      {
        name: "Children Schools",
        value: "initial_interview.name_school_children_attend",
        type: "string",
      },
      {
        name: "City of School",
        value: "initial_interview.city_of_school",
        type: "string",
      },
      {
        name: "How Hear About CCH",
        value: "initial_interview.how_hear_about_cch",
        type: "string",
      },
      {
        name: "Previous Programs",
        value: "initial_interview.programs_been_in_before",
        type: "string",
      },
      {
        name: "Monthly Income",
        value: "initial_interview.monthly_income",
        type: "number",
      },
      {
        name: "Sources of Income",
        value: "initial_interview.sources_of_income",
        type: "string",
      },
      {
        name: "Monthly Bills",
        value: "initial_interview.monthly_bills",
        type: "string",
      },
      {
        name: "Currently Employed",
        value: "initial_interview.currently_employed",
        type: "boolean",
      },
      {
        name: "Last Employer",
        value: "initial_interview.last_employer",
        type: "string",
      },
      {
        name: "Last Employed Date",
        value: "initial_interview.last_employed_date",
        type: "date",
      },
      {
        name: "Education History",
        value: "initial_interview.education_history",
        type: "string",
      },
      {
        name: "Transportation",
        value: "initial_interview.transportation",
        type: "string",
      },
      {
        name: "Legal US Resident",
        value: "initial_interview.legal_resident",
        type: "boolean",
      },
      {
        name: "Medical Insurance",
        value: "initial_interview.medical",
        type: "boolean",
      },
      {
        name: "City of Medical Insurance",
        value: "initial_interview.medical_city",
        type: "string",
      },
      {
        name: "Medical Insurance Provider",
        value: "initial_interview.medical_insurance",
        type: "string",
      },
      {
        name: "Medications",
        value: "initial_interview.medications",
        type: "string",
      },
      {
        name: "Domestic Violence History",
        value: "initial_interview.domestic_violence_history",
        type: "string",
      },
      {
        name: "Social Worker Name",
        value: "initial_interview.social_worker",
        type: "string",
      },
      {
        name: "Social Worker Telephone",
        value: "initial_interview.social_worker_telephone",
        type: "number",
      },
      {
        name: "Social Worker Office Location",
        value: "initial_interview.social_worker_office_location",
        type: "string",
      },
      {
        name: "Length Of Sobriety",
        value: "initial_interview.length_of_sobriety",
        type: "string",
      },
      {
        name: "Last Drug Use",
        value: "initial_interview.last_drug_use",
        type: "date",
      },
      {
        name: "Last Alcohol Use",
        value: "initial_interview.last_alcohol_use",
        type: "date",
      },
      {
        name: "Length of Drug/Alcohol Use",
        value: "initial_interview.time_using_drugs_alcohol",
        type: "string",
      },
      {
        name: "Convicted of a Crime",
        value: "initial_interview.been_convicted",
        type: "boolean",
      },
      {
        name: "Crime Reason",
        value: "initial_interview.convicted_reason_and_time",
        type: "string",
      },
      {
        name: "Present Warrant",
        value: "initial_interview.present_warrant_exist",
        type: "boolean",
      },
      {
        name: "Warrant of County",
        value: "initial_interview.warrant_county",
        type: "string",
      },
      {
        name: "Probation Parole Officer",
        value: "initial_interview.probation_parole_officer",
        type: "string",
      },
      {
        name: "Probation Parole Officer Telephone",
        value: "initial_interview.probation_parole_officer_telephone",
        type: "number",
      },
      {
        name: "Personal References",
        value: "initial_interview.personal_references",
        type: "string",
      },
      {
        name: "Personal Reference Telephone",
        value: "initial_interview.personal_reference_telephone",
        type: "number",
      },
      {
        name: "Plans/Goals",
        value: "initial_interview.future_plans_goals",
        type: "string",
      },
      {
        name: "Last Permanent Residence",
        value:
          "initial_interview.last_permanent_residence_household_composition",
        type: "string",
      },
      {
        name: "Reason why not at Permanent Residence",
        value: "initial_interview.why_no_longer_at_last_residence",
        type: "string",
      },
      {
        name: "What Could've Prevented Homelessness",
        value: "initial_interview.what_could_prevent_homeless",
        type: "string",
      },
    ];
  } else if (type === "successStory") {
    columns = [
      {
        name: "Case Manager First Name",
        value: "cm.first_name",
        type: "string",
      },
      { name: "Case Manager Last Name", value: "cm.last_name", type: "string" },
      { name: "Site", value: "l.name", type: "string" },
      { name: "Entrance Date", value: "ss.entrance_date", type: "date" },
      { name: "Exit Date", value: "ss.exit_date", type: "date" },
      {
        name: "Previous Situation",
        value: "ss.previous_situation",
        type: "string",
      },
      { name: "Current Situation", value: "ss.where_now", type: "string" },
      { name: "Tell Donors", value: "ss.tell_donors", type: "string" },
      { name: "Quote", value: "ss.quote", type: "string" },
    ];
  } else if (type === "exitSurvey") {
    columns = [
      { name: "Site", value: "l.name", type: "string" },
      {
        name: "Case Manager First Name",
        value: "cm.first_name",
        type: "string",
      },
      { name: "Case Manager Last Name", value: "cm.last_name", type: "string" },
      { name: "Program Completion Date", value: "es.program_date_completion", type: "date" },
      { name: "Overall Rating", value: "es.cch_rating", type: "string" },
      {
        name: "What Liked Most",
        value: "es.cch_like_most",
        type: "string",
      },
      { name: "What Improve CCH", value: "es.cch_could_be_improved", type: "string" },
      { name: "Life Skills Rating", value: "es.life_skills_rating", type: "string" },
      { name: "Life Skills Helpful Topics", value: "es.life_skills_helpful_topics", type: "string" },
      { name: "Life Skills Future Offers", value: "es.life_skills_offer_topics_in_the_future", type: "string" },
      { name: "Case Management Rating", value: "es.cm_rating", type: "string" },
      { name: "What Change Case Management", value: "es.cm_change_about", type: "string" },
      { name: "Most Beneficial Case Management", value: "es.cm_most_beneficial", type: "string" },
      { name: "CCH Impact on Future", value: "es.experience_takeaway", type: "string" },
      { name: "Accomplished at CCH", value: "es.experience_accomplished", type: "string" },
      { name: "Extra Notes", value: "es.experience_extra_notes", type: "string" },
    ];
  } else if (type === "randomSurvey") {
    columns = [
      {
        name: "Case Manager First Name",
        value: "cm.first_name",
        type: "string",
      },
      { name: "Case Manager Last Name", value: "cm.last_name", type: "string" },
      { name: "Date", value: "rs.date", type: "date" },
      { name: "CCH Quality", value: "rs.cch_qos", type: "integer" },
      {
        name: "Case Management Quality",
        value: "rs.cm_qos",
        type: "number",
      },
      { name: "CM: Corteous", value: "rs.courteous", type: "boolean" },
      { name: "CM: Informative", value: "rs.informative", type: "boolean" },
      { name: "CM: Prompt and Helpful", value: "rs.prompt_and_helpful", type: "boolean" },
      { name: "CCH Entrance Quality", value: "rs.entry_quality", type: "number" },
      { name: "Unit Quality", value: "rs.unit_quality", type: "number" },
      { name: "Site Cleanliness", value: "rs.clean", type: "number" },
      { name: "Overall Experience", value: "rs.overall_experience", type: "number" },
      { name: "Case Meeting Frequency", value: "rs.case_meeting_frequency", type: "string" },
      { name: "Life Skills Beneficial", value: "rs.lifeskills", type: "boolean" },
      { name: "Recommend CCH", value: "rs.recommend", type: "boolean" },
      { name: "Why Recommend CCH", value: "rs.recommend_reasoning", type: "string" },
      { name: "How Make CCH More Helpful", value: "rs.make_cch_more_helpful", type: "string" },
      { name: "Case Manager Feedback", value: "rs.cm_feedback", type: "string" },
      { name: "Additional Comments/Suggestions", value: "rs.other_comments", type: "string" },
    ];
  } else {
    columns = [
      { name: "Client First Name", value: "clients.first_name", type: "string" },
      { name: "Client Last Name", value: "clients.last_name", type: "string" },
      { name: "Date of Birth", value: "clients.date_of_birth", type: "date" },
      { name: "Case Manager First Name", value: "case_managers.first_name", type: "string" },
      { name: "Case Manager Last Name", value: "case_managers.last_name", type: "string" },
      { name: "Location", value: "locations.name", type: "string" },
      { name: "Unit ID", value: "clients.unit_id", type: "number" },
      { name: "Grant", value: "clients.grant", type: "string" },
      { name: "Status", value: "clients.status", type: "string" },
      { name: "Age", value: "clients.age", type: "number" },
      { name: "Phone Number", value: "clients.phone_number", type: "string" },
      { name: "Email", value: "clients.email", type: "string" },
      { name: "Emergency Contact Name", value: "clients.emergency_contact_name", type: "string" },
      { name: "Emergency Contact Phone", value: "clients.emergency_contact_phone_number", type: "string" },
      { name: "Medical", value: "clients.medical", type: "boolean" },
      { name: "Entrance Date", value: "clients.entrance_date", type: "date" },
      { name: "Estimated Exit Date", value: "clients.estimated_exit_date", type: "date" },
      { name: "Exit Date", value: "clients.exit_date", type: "date" },
      { name: "Bed Nights", value: "clients.bed_nights", type: "number" },
      { name: "Bed Nights for Children", value: "clients.bed_nights_children", type: "number" },
      { name: "Pregnant Upon Entry", value: "clients.pregnant_upon_entry", type: "boolean" },
      { name: "Disabled Children", value: "clients.disabled_children", type: "boolean" },
      { name: "Ethnicity", value: "clients.ethnicity", type: "string" },
      { name: "Race", value: "clients.race", type: "string" },
      { name: "City of Last Permanent Residence", value: "clients.city_of_last_permanent_residence", type: "string" },
      { name: "Prior Living", value: "clients.prior_living", type: "string" },
      { name: "Prior Living City", value: "clients.prior_living_city", type: "string" },
      { name: "Shelter in Last 5 Years", value: "clients.shelter_in_last_five_years", type: "boolean" },
      { name: "Homelessness Length", value: "clients.homelessness_length", type: "number" },
      { name: "Chronically Homeless", value: "clients.chronically_homeless", type: "boolean" },
      { name: "Attending School Upon Entry", value: "clients.attending_school_upon_entry", type: "boolean" },
      { name: "Employment Gained", value: "clients.employement_gained", type: "boolean" },
      { name: "Reason for Leaving", value: "clients.reason_for_leaving", type: "string" },
      { name: "Specific Reason for Leaving", value: "clients.specific_reason_for_leaving", type: "string" },
      { name: "Specific Destination", value: "clients.specific_destination", type: "string" },
      { name: "Savings Amount", value: "clients.savings_amount", type: "number" },
      { name: "Attending School Upon Exit", value: "clients.attending_school_upon_exit", type: "boolean" },
      { name: "Reunified", value: "clients.reunified", type: "boolean" },
      { name: "Successful Completion", value: "clients.successful_completion", type: "boolean" },
      { name: "Destination City", value: "clients.destination_city", type: "string" },
    ];
  }

  // const columns = [
  //   { name: "Name", value: "initial_interview.name", type: "string" },
  //   { name: "Age", value: "initial_interview.age", type: "string" },
  //   { name: "Birthday", value: "initial_interview.date_of_birth", type: "date" },
  //   { name: "Marital Status", value: "initial_interview.marital_status", type: "string" },
  //   { name: "Client Telephone #", value: "initial_interview.phone_number", type: "number" },
  //   { name: "Client Email Address", value: "initial_interview.email", type: "string" },
  //   { name: "Last 4 SSID", value: "initial_interview.ssn_last_four", type: "number" },
  //   { name: "Ethnicity", value: "initial_interview.ethnicity", type: "string" },
  //   { name: "Veteran", value: "initial_interview.veteran", type: "boolean" },
  //   { name: "Disabled", value: "initial_interview.disabled", type: "boolean" },
  //   { name: "Current Address", value: "initial_interview.current_address", type: "string" },
  //   { name: "Reason for Leaving Perm Address", value: "initial_interview.last_perm_address", type: "string" },
  //   { name: "Location Last Night", value: "initial_interview.where_reside_last_night", type: "string" },
  //   { name: "Currently Homeless", value: "initial_interview.currently_homeless", type: "boolean" },
  //   { name: "Event Leading to Homelessness", value: "initial_interview.event_leading_to_homelessness", type: "string" },
  //   { name: "Length of Homelessness", value: "initial_interview.how_long_experiencing_homelessness", type: "string" },
  //   { name: "Previously Applied to CCH", value: "initial_interview.prev_applied_to_cch", type: "boolean" },
  //   { name: "If yes, when", value: "initial_interview.when_prev_applied_to_cch", type: "string" },
  //   { name: "Been in CCH before", value: "initial_interview.prev_in_cch", type: "boolean" },
  //   { name: "If yes, when", value: "initial_interview.when_prev_in_cch", type: "string" },
  //   { name: "Children", value: "initial_interview.custody_of_children", type: "boolean" },
  //   { name: "Children Schools", value: "initial_interview.name_school_children_attend", type: "string" },
  //   { name: "City of School", value: "initial_interview.city_of_school", type: "string" },
  //   { name: "How Hear About CCH", value: "initial_interview.how_hear_about_cch", type: "string" },
  //   { name: "Previous Programs", value: "initial_interview.programs_been_in_before", type: "string" },
  //   { name: "Monthly Income", value: "initial_interview.monthly_income", type: "number" },
  //   { name: "Sources of Income", value: "initial_interview.sources_of_income", type: "string" },
  //   { name: "Monthly Bills", value: "initial_interview.monthly_bills", type: "string" },
  //   { name: "Currently Employed", value: "initial_interview.currently_employed", type: "boolean" },
  //   { name: "Last Employer", value: "initial_interview.last_employer", type: "string" },
  //   { name: "Last Employed Date", value: "initial_interview.last_employed_date", type: "date" },
  //   { name: "Education History", value: "initial_interview.education_history", type: "string" },
  //   { name: "Transportation", value: "initial_interview.transportation", type: "string" },
  //   { name: "Legal US Resident", value: "initial_interview.legal_resident", type: "boolean" },
  //   { name: "Medical Insurance", value: "initial_interview.medical", type: "boolean" },
  //   { name: "City of Medical Insurance", value: "initial_interview.medical_city", type: "string" },
  //   { name: "Medical Insurance Provider", value: "initial_interview.medical_insurance", type: "string" },
  //   { name: "Medications", value: "initial_interview.medications", type: "string" },
  //   { name: "Domestic Violence History", value: "initial_interview.domestic_violence_history", type: "string" },
  //   { name: "Social Worker Name", value: "initial_interview.social_worker", type: "string" },
  //   { name: "Social Worker Telephone", value: "initial_interview.social_worker_telephone", type: "number" },
  //   { name: "Social Worker Office Location", value: "initial_interview.social_worker_office_location", type: "string" },
  //   { name: "Length Of Sobriety", value: "initial_interview.length_of_sobriety", type: "string" },
  //   { name: "Last Drug Use", value: "initial_interview.last_drug_use", type: "date" },
  //   { name: "Last Alcohol Use", value: "initial_interview.last_alcohol_use", type: "date" },
  //   { name: "Length of Drug/Alcohol Use", value: "initial_interview.time_using_drugs_alcohol", type: "string" },
  //   { name: "Convicted of a Crime", value: "initial_interview.been_convicted", type: "boolean" },
  //   { name: "Crime Reason", value: "initial_interview.convicted_reason_and_time", type: "string" },
  //   { name: "Present Warrant", value: "initial_interview.present_warrant_exist", type: "boolean" },
  //   { name: "Warrant of County", value: "initial_interview.warrant_county", type: "string" },
  //   { name: "Probation Parole Officer", value: "initial_interview.probation_parole_officer", type: "string" },
  //   { name: "Probation Parole Officer Telephone", value: "initial_interview.probation_parole_officer_telephone", type: "number" },
  //   { name: "Personal References", value: "initial_interview.personal_references", type: "string" },
  //   { name: "Personal Reference Telephone", value: "initial_interview.personal_reference_telephone", type: "number" },
  //   { name: "Plans/Goals", value: "initial_interview.future_plans_goals", type: "string" },
  //   { name: "Last Permanent Residence", value: "initial_interview.last_permanent_residence_household_composition", type: "string" },
  //   { name: "Reason why not at Permanent Residence", value: "initial_interview.why_no_longer_at_last_residence", type: "string" },
  //   { name: "What Could've Prevented Homelessness", value: "initial_interview.what_could_prevent_homeless", type: "string" },
  // ];

  const [filterRows, setFilterRows] = useState([
    {
      id: 1,
      selector: "",
      field: "",
      operator: "",
      value: "",
    },
  ]);

  useEffect(() => {
    setFilterQuery([
      "",
      ...filterRows
        .map((row) => {
          if (row.field !== "" && row.operator !== "" && row.value !== "") {
            if (row.operator === "contains") {
              return `${row.selector} ${row.field} ILIKE '%${row.value}%'`;
            } else if (row.operator === "=") {
              return `${row.selector} ${row.field} ILIKE '%${row.value}%'`;
            }
            return `${row.selector} ${row.field} ${row.operator} '${row.value}'`;
          }
          return "";
        })
        .filter((query: string) => query !== ""),
    ]);
  }, [filterRows]);

  const addNewRow = () => {
    if (
      (filterRows.length > 0 &&
        filterRows[filterRows.length - 1]?.field === "") ||
      filterRows[filterRows.length - 1]?.value === "" ||
      filterRows[filterRows.length - 1]?.operator === ""
    ) {
      toast({
        title: "Incomplete Fields",
        description: "Please fill in all fields before adding a new filter",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setFilterRows([
      ...filterRows,
      {
        id: nextId,
        selector: "AND",
        field: "",
        operator: "",
        value: "",
      },
    ]);
    setNextId(nextId + 1);
  };

  const removeRow = (id: number) => {
    if (filterRows.length > 1) {
      setFilterRows((prevRows) => {
        const updatedRows = prevRows.filter((row) => row.id !== id);

        if (updatedRows.length === 0) {
          return [
            {
              id: 1,
              selector: "",
              field: "",
              operator: "",
              value: "",
            },
          ];
        }

        return updatedRows.map((row, index) => ({
          ...row,
          selector: index === 0 ? "" : row.selector,
        }));
      });
    } else {
      setFilterRows([
        {
          id: 1,
          selector: "",
          field: "",
          operator: "",
          value: "",
        },
      ]);
    }
  };

  const updateFilterValue = (id: number, selectType: string, value: string) => {
    setFilterRows(
      filterRows.map((row) => {
        if (row.id === id) {
          return { ...row, [selectType]: value };
        }
        return row;
      })
    );
  };

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button>
          <HStack>
            <Icon as={MdOutlineFilterAlt} />
            <h1>Filter</h1>
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="auto"
        p={2}
      >
        <PopoverArrow />
        <PopoverBody>
          <VStack
            spacing={4}
            align="stretch"
            w="100%"
          >
            <Text
              fontSize="14px"
              fontWeight="300"
            >
              In this view, show records
            </Text>
            {filterRows.map((row, index) => (
              <Box
                key={row.id}
                width="100%"
                overflow="visible"
              >
                <HStack
                  spacing={0}
                  align="center"
                >
                  {index === 0 ? (
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      marginRight={"47px"}
                    >
                      Where
                    </Text>
                  ) : (
                    <Select
                      value={row.selector}
                      marginRight={"14px"}
                      onChange={(e) =>
                        updateFilterValue(row.id, "selector", e.target.value)
                      }
                      maxWidth={"80px"}
                    >
                      <option value="AND">and</option>
                      <option value="OR">or</option>
                    </Select>
                  )}

                  <Select
                    placeholder="Select Field"
                    width="150px"
                    value={row.field}
                    onChange={(e) =>
                      updateFilterValue(row.id, "field", e.target.value)
                    }
                    borderRightRadius="0"
                  >
                    {columns.map((column) => {
                      return (
                        <option
                          key={column.name}
                          typeof={column.type}
                          value={column.value}
                        >
                          {column.name}
                        </option>
                      );
                    })}
                  </Select>

                  {(() => {
                    const selectedColumn = columns.find(
                      (col) => col.value === row.field
                    );
                    const fieldType: string = selectedColumn?.type || "string";
                    let operators: { value: string; label: string }[] = [];

                    if (fieldType === "number") {
                      operators = [
                        { value: "=", label: "equals" },
                        { value: "!=", label: "not equals" },
                        { value: ">", label: "greater than" },
                        { value: "<", label: "less than" },
                      ];
                    } else if (
                      fieldType === "boolean" ||
                      fieldType === "date"
                    ) {
                      operators = [
                        { value: "=", label: "is" },
                        { value: "!=", label: "is not" },
                      ];
                    } else if (fieldType === "string") {
                      operators = [
                        { value: "contains", label: "contains" },
                        { value: "=", label: "equals" },
                      ];
                    }

                    return (
                      <>
                        <Select
                          placeholder="Select Operator"
                          width="150px"
                          value={row.operator}
                          onChange={(e) =>
                            updateFilterValue(
                              row.id,
                              "operator",
                              e.target.value
                            )
                          }
                          borderRadius="0"
                        >
                          {operators.map((op) => (
                            <option
                              key={op.value}
                              value={op.value}
                            >
                              {op.label}
                            </option>
                          ))}
                        </Select>
                        {fieldType === "boolean" ? (
                          <Select
                            width="150px"
                            placeholder="Select Value"
                            value={row.value}
                            onChange={(e) =>
                              updateFilterValue(row.id, "value", e.target.value)
                            }
                            borderRadius="0"
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Select>
                        ) : fieldType === "date" ? (
                          <Input
                            type="date"
                            width="150px"
                            value={row.value}
                            onChange={(e) =>
                              updateFilterValue(row.id, "value", e.target.value)
                            }
                            borderRadius="0"
                          />
                        ) : (
                          <Input
                            placeholder="Enter a value"
                            width="150px"
                            value={row.value}
                            onChange={(e) =>
                              updateFilterValue(row.id, "value", e.target.value)
                            }
                            borderRadius="0"
                          />
                        )}
                      </>
                    );
                  })()}

                  <Button
                    onClick={() => removeRow(row.id)}
                    variant="outline"
                    borderLeftRadius="0"
                  >
                    <Icon as={MdOutlineDelete} />
                  </Button>
                </HStack>
              </Box>
            ))}
            <Button
              leftIcon={<MdOutlineAdd />}
              onClick={addNewRow}
              size="sm"
              variant="ghost"
            >
              Add Filter
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
