import React, {useState} from 'react'
import { Select } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Text,  Input, InputGroup, InputRightAddon, InputLeftAddon} from '@chakra-ui/react'

export interface Donation {
    donor: string,
    sub: DonationSub[];
}

interface DonationSub {
    date: Date, 
    category: string, 
    weight: number,
    value: number,
}

function DonationInputs({ subDonation, index, onChange }: { 
    subDonation: DonationSub; 
    index: number; 
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  }) {
      return (
          <CardBody display="flex" >
            <CardBody>
              <Text>Date Donated</Text>
              <Input
                  name="date"
                  type="date"
                  value={subDonation.date instanceof Date ? subDonation.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => onChange(index, e)}
              />
            </CardBody>
              
            <CardBody>
              <Text>Category</Text>
              <Select
                  name="category"
                  value={subDonation.category}
                  placeholder="Select Category"
                  onChange={(e) => onChange(index, e)}
              >
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
                      value={isNaN(subDonation.weight) ? "" : subDonation.weight}
                      onChange={(e) => onChange(index, e)}
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
                      value={isNaN(subDonation.value) ? "" : subDonation.value}
                      onChange={(e) => onChange(index, e)}
                  />
              </InputGroup>
              </CardBody>
          </CardBody>
      );
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
            [name]: name === 'weight' || name === 'value' ? parseFloat(value) || 0 : value,
        };
        const updatedDonation = { ...prevDonation, sub: newSubDonations };
        onSubmit(updatedDonation);
        return updatedDonation;
    });
    };
    const handleAddDonation = () => {
        setDonation((prevDonation) => ({
            ...prevDonation,
            sub: [...prevDonation.sub, { date: new Date(), category: '', weight: 0, value: 0 }],
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
        <CardFooter color="blue.500" fontWeight="bold" onClick={handleAddDonation}>
          + Add Donation
        </CardFooter>
      </Card>
    );
  }

  export default DonationCard;