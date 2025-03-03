import React, {useState} from 'react'
import { Select } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Text,  Input, InputGroup, InputRightAddon, InputLeftAddon} from '@chakra-ui/react'

export interface Donation {
    donor: string,
    date: Date,
    category: string,
    weight: number,
    value: number,
}
function DonationCard({ donationToEdit, onSubmit }: { donationToEdit?: Donation, onSubmit: (donation: Donation) => void }) {
    const [donation, setDonation] = useState<Donation>(
      donationToEdit || {
        donor: '',
        date: new Date(),
        category: '',
        weight: 0,
        value: 0,
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
        </CardBody>
  
        <CardBody>
          <Text>Date Donated</Text>
          <Input
            name="date"
            type="date"
            value={donation.date.toISOString().split('T')[0]} // Format the date as YYYY-MM-DD
            onChange={handleInputChange}
          />
        </CardBody>
  
        <CardBody>
          <Text>Category</Text>
          <Select
            name="category"
            value={donation.category}
            placeholder='Select Category'
            onChange={handleInputChange}>
                <option value="food">Food</option>
                <option value="client">Client</option>
          </Select>

        </CardBody>
  
        <CardBody>
          <Text>Total Weight</Text>
          <InputGroup>
            <Input
              name="weight"
              type="number"
              placeholder="XX"
              value={donation.weight}
              onChange={handleInputChange}
            />
            <InputRightAddon children="lbs" />
          </InputGroup>
        </CardBody>
  
        <CardBody>
          <Text>Value per lbs</Text>
          <InputGroup>
            <InputLeftAddon children="$" />
            <Input
              name="value"
              type="number"
              placeholder="0.00"
              value={donation.value}
              onChange={handleInputChange}
            />
          </InputGroup>
        </CardBody>
  
        <CardFooter color="blue.500" fontWeight="bold">
          + Add Donation
        </CardFooter>
      </Card>
    );
  }

  export default DonationCard;