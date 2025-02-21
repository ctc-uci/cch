import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button } from '@chakra-ui/react';
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {toSnakeCase } from "../../utils/toSnakeCase";
interface Client {
    age: number;
    attendingSchoolUponEntry: boolean;
    attendingSchoolUponExit: boolean;
    bedNights: number;
    bedNightsChildren: number;
    chronicallyHomeless: boolean;
    cityOfLastPermanentResidence: string;
    createdBy: number;
    dateOfBirth: string;
    destinationcity: string;
    disabledChildren: boolean;
    email: string;
    emergencyContactName: string;
    emergencyContactPhoneNumber: string;
    employmentGained: boolean;
    entranceDate: string;
    estimatedExitdate: string;
    ethnicity: string;
    exitDate: string;
    firstName: string;
    grant: string;
    homelessnessLength: number;
    id: number;
    lastName: string;
    medical: boolean;
    phoneNumber: string;
    pregnantUponEntry: boolean;
    priorLiving: string;
    priorLivingCity: string;
    race: string;
    reasonForLeaving: string;
    reunified: boolean;
    savingsAmount: string;
    shelterInLastFiveYears: boolean;
    specificDestination: string;
    specificReasonForLeaving: string;
    status: string;
    successfulCompletion: boolean;
    unitId: number;
    comments: string;
};

const emptyClient: Client = {
    age: 0,
    attendingSchoolUponEntry: false,
    attendingSchoolUponExit: false,
    bedNights: 0,
    bedNightsChildren: 0,
    chronicallyHomeless: false,
    cityOfLastPermanentResidence: "",
    createdBy: 0,
    dateOfBirth: "",
    destinationcity: "",
    disabledChildren: false,
    email: "",
    emergencyContactName: "",
    emergencyContactPhoneNumber: "",
    employmentGained: false,
    entranceDate: "",
    estimatedExitdate: "",
    ethnicity: "",
    exitDate: "",
    firstName: "",
    grant: "",
    homelessnessLength: 0,
    id: 0,
    lastName: "",
    medical: false,
    phoneNumber: "",
    pregnantUponEntry: false,
    priorLiving: "",
    priorLivingCity: "",
    race: "",
    reasonForLeaving: "",
    reunified: false,
    savingsAmount: "",
    shelterInLastFiveYears: false,
    specificDestination: "",
    specificReasonForLeaving: "",
    status: "",
    successfulCompletion: false,
    unitId: 0,
    comments: "",
};

//Do all the fetches and updates
function Comments() {
    const { backend } = useBackendContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams<{ id: string }>();
    const [client, setClient] = useState<Client>(emptyClient);

    //fetches the database for clients
    const fetchClient = async (id: number) => {
        try {
        const response = await backend.get(`/clients/${id}`);
        setClient(response.data[0]);
        } catch (err) {
        setError(err.message);
        }
    };

    //fetches the info from Client
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (params.id) {
                const intId = parseInt(params.id);
                await Promise.all([fetchClient(intId)]); 
            }
            setLoading(false);
        };
        fetchData();
    }, []); // Fetch data once when the component mounts

      
    const handleSaveChanges = async () => {
        try {
            if (!client) {
                console.error("Client data is undefined!");
                return; // Exit early if `client` is undefined
            }
            const clientData = toSnakeCase(client);
            await backend.put(`/clients/${client.id}`, clientData);
        } catch (error) {
            console.error("Error updating client information:", error.message);
        }
    };

    return (
        <div>
            <Input 
            placeholder={client.comments}
            defaultValue={client.comments}
            onChange={(e) =>
                setClient({ ...client, comments: e.target.value})
            }
            />
            <Button  colorScheme="green" onClick={handleSaveChanges}>
                Save
            </Button>
        </div>
    );
}
export default Comments