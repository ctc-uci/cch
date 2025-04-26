import React, {useEffect, useState} from 'react'
import { Select } from '@chakra-ui/react'
import { CardBody, Text,  Input, InputGroup, InputRightAddon, InputLeftAddon, Box, Flex} from '@chakra-ui/react'


export interface DonationSub {
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
        const [totalValue, setTotalValue] = useState<number>(0);
        useEffect(() => {
            const weight = subDonation?.weight || 0;
            const value = subDonation?.value || 0;
            setTotalValue(weight * value);
    
        }, [subDonation]);

        return (
            <CardBody display="flex" flexWrap="wrap" alignItems="flex-start" gap={4}>
              <CardBody m={0} p={0} flexDirection="column" alignItems="flex-start" width="auto">
                <Text>Date Donated</Text>
                <Input
                  name="date"
                  type="date"
                  value={subDonation.date instanceof Date ? subDonation.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => onChange(index, e)}
                />
              </CardBody>
          
              <CardBody m={0} p={0} flexDirection="column" alignItems="flex-start" width="auto">
                <Text>Category</Text>
                <Select
                  name="category"
                  value={subDonation.category}
                  placeholder="Select Category"
                  onChange={(e) => onChange(index, e)}
                  width="160px"
                >
                  <option value="food">Food</option>
                  <option value="client">Client</option>
                </Select>
              </CardBody>
          
              <CardBody m={0} p={0} flexDirection="column" alignItems="flex-start" width="auto">
                <Text>Total Weight (lbs)</Text>
                <InputGroup>
                  <Input
                    name="weight"
                    type="number"
                    placeholder="XX"
                    value={isNaN(subDonation.weight) || subDonation.weight === -1 ? "" : subDonation.weight}
                    onChange={(e) => onChange(index, e)}
                  />
                  <InputRightAddon>lbs</InputRightAddon>
                </InputGroup>
              </CardBody>
          
              <CardBody m={0} p={0} flexDirection="column" alignItems="flex-start" width="auto">
                <Text>Value per lbs ($)</Text>
                <InputGroup>
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                    name="value"
                    type="number"
                    placeholder="0.00"
                    value={isNaN(subDonation.value) || subDonation.value === -1 ? "" : subDonation.value}
                    onChange={(e) => onChange(index, e)}
                  />
                </InputGroup>
              </CardBody>
          
              <CardBody m={0} p={0} flexDirection="column" alignItems="flex-start" width="auto">
                <Text>Total Value ($)</Text>
                <Text fontWeight="bold">
                  {(subDonation.value === -1 || subDonation.weight === -1) 
                    ? "$00.00" 
                    : `$${totalValue.toFixed(2)}`
                  }
                </Text>
              </CardBody>
            </CardBody>
          );
          
  }

  export default DonationInputs;