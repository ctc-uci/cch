import { useNavigate } from "react-router-dom";
import { useForm } from '../../contexts/formContext';
import StepperComponent from "./stepperComponent";
import { Button } from "@chakra-ui/react";
import PersonalInformation from "./PersonalInformation";
import FinancialInformation from "./financialInformation";
import HealthSocialInformation from "./healthSocialInformation";
import AdditionalInformation from "./additionalInformation";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";


const ReviewInformation: React.FC = () => {
    const { formData } = useForm();
    const navigate = useNavigate();
    const { backend } = useBackendContext();

    // useEffect(() => {

    // },[])

    const handleSubmit = async () => {

      formData.name = formData.firstName + " " + formData.lastName;
      formData.educationHistory = formData.educationHistory + " " + formData.dateOfEducation;
    //   formData.medical = formData.medical + ": " + formData.medicalConditions;
      formData.monthlyBills = formData.monthlyBills + ": " + formData.estimateAmountBills;

      try{
        const response = await backend.post("/", {
          body: JSON.stringify(formData),
        });
        if(response.status === 200){
          navigate("/success");
        }

      }catch(err){
        alert("Submission failed. Try again. " + err.message);
      }

    };

    return (

      <div style={{padding: "20px", backgroundColor: "#E7F0F4"}}>
        <StepperComponent step_index={5} />
        <h2 style={{fontSize: "28px", color: "#3182CE"}}>Review Your Information</h2>
        {/* {Object.entries(formData).map(([key, value]) => (
            <p><strong>{key}:</strong> {value}</p>

        ))} */}
        <div style={{display: "flex", flexDirection:"row", gap:"20px", padding:"20px", overflowX:"auto"}}>
            <div style={{outlineWidth: "5px", outlineColor:"black", backgroundColor: "white", padding:"15px", borderRadius:"15px", minWidth:"82vw"}}>
                <PersonalInformation hidden={true}/>
            </div>
            <div style={{outlineWidth: "5px", outlineColor:"black", backgroundColor: "white", padding:"15px", borderRadius:"15px", minWidth:"82vw"}}>
                <FinancialInformation hidden={true}/>
            </div>
            <div style={{outlineWidth: "5px", outlineColor:"black", backgroundColor: "white", padding:"15px", borderRadius:"15px", minWidth:"82vw"}}>
                <HealthSocialInformation hidden={true}/>
            </div>
            <div style={{outlineWidth: "5px", outlineColor:"black", backgroundColor: "white", padding:"15px", borderRadius:"15px", minWidth:"82vw"}}>
                <AdditionalInformation hidden={true}/>
            </div>

        </div>


        <Button colorScheme={'blue'} onClick={handleSubmit}>Submit</Button>
      </div>
    );
  };

  export default ReviewInformation;
