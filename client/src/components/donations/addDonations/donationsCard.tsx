import React, {useState, useEffect} from 'react'
import { Card, CardHeader, CardBody, CardFooter, Text, Icon, Button, HStack, CloseButton, Flex } from '@chakra-ui/react'
import { useBackendContext } from '../../../contexts/hooks/useBackendContext.ts';
import DonationInputs, { DonationSub } from "./donationInputs";
import {DonationFilter} from "../DonationFilter.tsx"
import { FaMinus, FaPlus } from 'react-icons/fa';
export interface Donation {
    donor: string,
    sub: DonationSub[];
}

function DonationCard({ donationToEdit, onSubmit, handleDeleteDonation }: { donationToEdit?: Donation, onSubmit: (donation: Donation) => void, handleDeleteDonation: () => void }) {
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

    const currentSub = { ...newSubDonations[index] } as DonationSub;

    if (name === 'date') {
      currentSub.date = typeof value === 'object' ? value as Date : new Date(value as string);
    } else if (name === 'weight' || name === 'value') {
      currentSub[name] = parseFloat(value as string) || -1;
    } else if (name === 'category') {
      currentSub.category = value as string;
    }

    newSubDonations[index] = currentSub;

    const updatedDonation = { ...prevDonation, sub: newSubDonations };
    onSubmit(updatedDonation);
    return updatedDonation;
  });
};

const handleAddDonation = () => {
    setDonation((prevDonation) => {
      // Get current UTC datetime
      const now = new Date();
      const utcDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      ));
      
      const newSubDonation: DonationSub = {
        date: utcDate,
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

const handleDeleteLastDonation = () => {
  setDonation((prevDonation) => {
    const newSubDonations = [...prevDonation.sub];
    newSubDonations.splice(newSubDonations.length - 1, 1);
    return { ...prevDonation, sub: newSubDonations };
  });
};

return (
  <Card>
    <CardBody>
    <Flex justifyContent="space-between" alignItems="center">
        <Text>Donor</Text>
        <CloseButton aria-label="Delete Donation" onClick={handleDeleteDonation} h="10px" w="10px" />
      </Flex>
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
    <CardFooter color="blue.500" fontWeight="bold">
      <HStack w="100%" >
        <Button size="sm" colorScheme="blue" variant="ghost" onClick={handleAddDonation} leftIcon={<FaPlus />}>
          Add Donation
        </Button>
        <Button size="sm" colorScheme="blue" variant="ghost" onClick={handleDeleteLastDonation} leftIcon={<FaMinus />}>
          Delete Last Donation
        </Button>
      </HStack>
    </CardFooter>
  </Card>
);
}

export default DonationCard;