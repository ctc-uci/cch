import React, {useState} from 'react'
import { Select } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'

import DonationInputs, { DonationSub } from "./donationInputs";
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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
      
        setDonation((prevDonation) => {
          const updatedDonation = {
            ...prevDonation,
            [name]: name === 'date' ? new Date(value) : (name === 'weight' || name === 'value' ? parseFloat(value) : value),
          };
      
          onSubmit(updatedDonation);
          return updatedDonation;
        });
      };

    const handleSubDonationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setDonation((prevDonation) => {
        const newSubDonations = [...prevDonation.sub];
        newSubDonations[index] = {
            ...newSubDonations[index],
            [name]: name === 'weight' || name === 'value' ? parseFloat(value) || -1 : value,
        };
        const updatedDonation = { ...prevDonation, sub: newSubDonations };
        onSubmit(updatedDonation);
        return updatedDonation;
    });
    };
    const handleAddDonation = () => {
        setDonation((prevDonation) => ({
            ...prevDonation,
            sub: [...prevDonation.sub, { date: new Date(), category: '', weight: -1, value: -1 }],
        }));
    };
    
    return (
      <Card>
        <CardHeader>Donation Form</CardHeader>
        <CardBody>
          <Text>Donor</Text>
          <Select
            name="donor"
            placeholder="Select Donor"
            value={donation.donor}
            onChange={handleInputChange}
          >
            <option value="costco">Costco</option>
            <option value="panera">Panera</option>
            <option value="sprouts">Sprouts</option>
            <option value="copia">Copia</option>
            <option value="mcdonalds">McDonald's</option>
            <option value="pantry">Pantry</option>
            <option value="grand theater">Grand Theater</option>
          </Select>
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