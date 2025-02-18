import { useForm } from "../context/FormContext";
import { useNavigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { formData } from '../types/screenFormData';
import { useForm } from '../contexts/formContext';

const ReviewInformation: React.FC = () => {
    const { formData } = useForm();
    const navigate = useNavigate();
  
    const handleSubmit = async () => {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Form submitted successfully!");
        navigate("/success");
      } else {
        alert("Submission failed. Try again.");
      }
    };
  
    return (
      <div>
        <h2>Review Your Information</h2>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Age:</strong> {formData.age}</p>
        <p><strong>Address:</strong> {formData.address}</p>
        
        <button onClick={() => navigate("/step2")}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  };
  
  export default ReviewInformation;