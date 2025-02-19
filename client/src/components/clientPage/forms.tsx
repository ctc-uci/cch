import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useParams } from "react-router-dom";

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface InitialInterview {
    id: number;
    applicant_type: string;
    name: string;
    age: number;
    date: string;
    phone_number: string;
    marital_status: 'single' | 'married' | 'divorced' | 'widowed';
    date_of_birth: string;
    email: string;
    ssn_last_four: number;
    ethnicity: 'Non-Hispanic' | 'Hispanic' | 'Refused';
    veteran: boolean;
    disabled: boolean;
    current_address: string;
    last_perm_address: string;
    reason_for_leaving_perm_address: string;
    where_reside_last_night: string;
    currently_homeless: boolean;
    event_leading_to_homelessness?: string;
    how_long_experiencing_homelessness: string;
    prev_applied_to_cch: boolean;
    when_prev_applied_to_cch?: string;
    prev_in_cch: boolean;
    when_prev_in_cch?: string;
    child_name: string;
    child_dob: string;
    custody_of_child: boolean;
    father_name: string;
    name_school_children_attend: string;
    city_of_school: string;
    how_hear_about_cch: string;
    programs_been_in_before: string;
    monthly_income: number;
    sources_of_income: string;
    monthly_bills: string;
    currently_employed: boolean;
    last_employer: string;
    last_employed_date: string;
    education_history: string;
    transportation: string;
    legal_resident: boolean;
    medical: boolean;
    medical_city?: string;
    medical_insurance?: string;
    medications: string;
    domestic_violence_history: string;
    social_worker: string;
    social_worker_telephone: string;
    social_worker_office_location: string;
    length_of_sobriety: string;
    last_drug_use: string;
    last_alcohol_use: string;
    time_using_drugs_alcohol: string;
    been_convicted: boolean;
    convicted_reason_and_time?: string;
    present_warrant_exist: boolean;
    warrant_county: string;
    probation_parole_officer: string;
    probation_parole_officer_telephone: string;
    personal_references: string;
    personal_reference_telephone: string;
    future_plans_goals: string;
    last_permanent_residence_household_composition: string;
    why_no_longer_at_last_residence: string;
    what_could_prevent_homeless: string;
}
interface SuccessStory {
    id: number;
    date: string;
    client_id?: number;
    name: string;
    cm_id: number;
    previous_situation: string;
    cch_impact: string;
    where_now: string;
    tell_donors: string;
    quote: string;
    consent: boolean;
  }
interface ExitSurvey {
    id: number;
    cm_id: number;
    name: string;
    client_id: number;
    site: number;
    program_date_completion: string;
    cch_rating: 'Excellent' | 'Good' | 'Fair' | 'Unsatisfactory';
    cch_like_most: string;
    life_skills_rating: 'very helpful' | 'helpful' | 'not very helpful' | 'not helpful at all';
    life_skills_helpful_topics: string;
    life_skills_offer_topics_in_the_future: string;
    cm_rating: 'very helpful' | 'helpful' | 'not very helpful' | 'not helpful at all';
    cm_change_about: string;
    cm_most_beneficial: string;
    cch_could_be_improved: string;
    experience_takeaway: string;
    experience_accomplished: string;
    experience_extra_notes: string;
}
interface FormItems {
    date: string | null;
    type: string | null;
}

function Forms() {
    const { backend } = useBackendContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams<{ id: string }>();
    const [formItems, setFormItems] = useState<FormItems[]>([]);
    //tempArray
    const addNewForm = (newForm: FormItems) => {
        setFormItems(prevFormItems => [...prevFormItems, newForm]);
    };
    
    //fetch all forms
    const fetchFormsExit = async (id: number) => {
        try {
            //{{obj1}, {obj2}};
            const responseExit = await backend.get(`/exitSurvey/${id}`);
            const exitSurveys: ExitSurvey[] = Array.isArray(responseExit.data)
            ? responseExit.data
            : responseExit.data ? [responseExit.data] : [];

            for (const item of exitSurveys) {
                //Does not have a date attribute currently
                // if (item.date) {  // Check if date exists and is not null or undefined
                    // const updatedFormExit = {
                    //     date: item.date,
                    //     type: "Exit Survey"
                    // };
                    // addNewForm(updatedFormExit);
                // } else {
                //     console.log("No date available for this item");
                // }
                const updatedFormExit = {
                    date: null,
                    type: "Exit Survey"
                };
                addNewForm(updatedFormExit);
              }
            
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchFormsSuccess = async (id: number) => {
        try {
            const responseSuccess = await backend.get(`/successStory/${id}`);
            const successStories: SuccessStory[] = Array.isArray(responseSuccess.data)
            ? responseSuccess.data
            : responseSuccess.data ? [responseSuccess.data] : [];
            for (const item of successStories) {
                if (item.date) {  // Check if date exists and is not null or undefined
                    const updatedFormSuccess = {
                        date: item.date,
                        type: "Success Stories"
                    };
                    addNewForm(updatedFormSuccess);
                } else {
                    console.log("No date available for this item");
                }
            }
        } catch (err) {
            setError(err.message);
        }
    }  
    
    const fetchFormsInitialInterview = async () => {
        try {
            //Problem doesnt use an id
            const responseIntial = await backend.get(`/initialInterview`);
            const InitialInterview: InitialInterview[] = Array.isArray(responseIntial.data)
            ? responseIntial.data
            : responseIntial.data ? [responseIntial.data] : [];
            for (const item of InitialInterview) {
                if (item.date) {  // Check if date exists and is not null or undefined
                    const updatedFormInitial = {
                        date: item.date,
                        type: "Initial Interview"
                    };
                    addNewForm(updatedFormInitial);
                } else {
                    console.log("No date available for this item");
                }
            }
        } catch (err) {
            setError(err.message);
        }
    }   

    useEffect(() => {
        const fetchForms = async () => {
            setLoading(true);
            try {
                if (params.id) {
                    setFormItems([]);  // Clear the formItems state before fetching new data
                    await fetchFormsExit(Number(params.id));
                    await fetchFormsSuccess(Number(params.id));
                    await fetchFormsInitialInterview();
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchForms();
    }, [params.id]);  // Only run the effect when params.id changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <TableContainer>
            <Table variant="simple">
                <Thead>
                <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {formItems.map((form) => (
                        <Tr key={form.type}>
                            <Td>{form.date ? form.date : ""}</Td>
                            <Td>{form.type}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
};
export default Forms;