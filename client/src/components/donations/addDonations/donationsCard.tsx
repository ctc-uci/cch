import React, {useState, useEffect} from 'react'
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'
import { useBackendContext } from '../../../contexts/hooks/useBackendContext.ts';
import DonationInputs, { DonationSub } from "./donationInputs";
import {DonationFilter} from "../DonationFilter.tsx"
export interface Donation {
    donor: string,
    sub: DonationSub[];
}

function DonationCard({ donationToEdit, onSubmit }: { donationToEdit?: Donation, onSubmit: (donation: Donation) => void }) {
    const [donation, setDonation] = useState<Donation>(
      donationToEdit || {
        donor: '',
        sub: [],
      }
    );

    const { backend } = useBackendContext();
    const [donor, setDonor] = useState<string>(donation.donor);

    const [donors, setDonors] = useState<string[]>([]);
    const [newDonor, setNewDonor] = useState<string>("");

    // Fetch donors when component mounts
    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await backend.get('/donations/donors');
                if (response.data && Array.isArray(response.data)) {
                    // Extract donor names from the response
                    const donorNames = response.data.map(donor => donor.name);
                    setDonors(donorNames);
                }
            } catch (error) {
                console.error('Error fetching donors:', error);
            }
        };
        
        fetchDonors();
    }, [backend]);

    // Update donor when it changes
    useEffect(() => {
      if (donor !== donation.donor) {
        setDonation(prev => {
          const updatedDonation = { ...prev, donor };
          onSubmit(updatedDonation);
          return updatedDonation;
        });
      }
    }, [donor, donation.donor, onSubmit]);

  const handleAddDonor = async () => {
    try {
      await backend.post("/donations/donors", {
        name: newDonor,
      });
      setDonors((prev) => [...prev, newDonor]);
      setNewDonor("");
    } catch (error) {
      console.error("Error adding donor:", error);
    }
  }

const handleSubDonationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setDonation((prevDonation) => {
    const newSubDonations = [...prevDonation.sub];
    
    // Make a copy of the current sub donation to modify
    const currentSub = { ...newSubDonations[index] };
    
    // Handle different field types appropriately
    if (name === 'date') {
      // Handle date specifically
      currentSub.date = typeof value === 'object' ? value as Date : new Date(value as string);
    } else if (name === 'weight' || name === 'value') {
      // Handle numeric fields
      currentSub[name] = parseFloat(value as string) || -1;
    } else if (name === 'category') {
      // Handle category field
      currentSub.category = value as string;
    }
    
    // Update the sub donation at the specified index
    newSubDonations[index] = currentSub;
    
    const updatedDonation = { ...prevDonation, sub: newSubDonations };
    onSubmit(updatedDonation);
    return updatedDonation;
  });
};

const handleAddDonation = () => {
    setDonation((prevDonation) => {
      // Create a new sub donation with all required fields initialized
      const newSubDonation: DonationSub = { 
        date: new Date(), 
        category: '', 
        weight: -1, 
        value: -1 
      };
      
      return {
        ...prevDonation,
        sub: [...prevDonation.sub, newSubDonation],
      };
    });
};

return (
  <Card>
    <CardHeader>Donation Form</CardHeader>
    <CardBody>
      <Text>Donor</Text>
      <DonationFilter
        donors={donors}
        donor={donor}
        setDonor={setDonor}
        newDonor={newDonor}
        setNewDonor={setNewDonor}
        handleAddDonor={handleAddDonor}
      />
      {donation.sub.map((sub, index) => (
        <DonationInputs
            key={index}
            subDonation={sub}
            index={index}
            onChange={handleSubDonationChange}/>
        ))}
      </CardBody>
    <CardFooter color="blue.500" fontWeight="bold" onClick={handleAddDonation} width="200px">
      + Add Donation
    </CardFooter>
  </Card>
);
}

export default DonationCard;