import { useNavigate } from "react-router-dom";
import { useForm } from '../../contexts/formContext';
import StepperComponent from "./stepperComponent";
import { Button, Text } from "@chakra-ui/react";
import { useEffect } from "react";
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        navigate("/success");
      }catch(err){
        alert("Submission failed. Try again.");
      }
      
    };
  
    return (
        
      <div style={{padding: "20px"}}>
        <StepperComponent step_index={5} />
        <h2 style={{fontSize: "28px", color: "#3182CE"}}>Review Your Information</h2>
        {/* {Object.entries(formData).map(([key, value]) => (
            <p><strong>{key}:</strong> {value}</p>
        
        ))} */}
        <div style={{display: "flex", flexDirection:"row", gap:"20px", padding:"20px"}}> 
            <div style={{outlineWidth: "5px"}}>
                <PersonalInformation hidden={true}/>
            </div>
            <div style={{outlineColor:"black"}}>
                <FinancialInformation hidden={true}/>
            </div>
            <div>
                <HealthSocialInformation hidden={true}/>
            </div>
            <div>
                <AdditionalInformation hidden={true}/>
            </div>
          
        </div>
       
        
        <Button colorScheme={'blue'} onClick={handleSubmit}>Submit</Button>
      </div>
    );
  };
  
  export default ReviewInformation;