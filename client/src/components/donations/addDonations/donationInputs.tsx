import React from 'react'
import { Select } from '@chakra-ui/react'
import { CardBody, Text,  Input, InputGroup, InputRightAddon, InputLeftAddon} from '@chakra-ui/react'


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
      return (
          <CardBody display="flex" >
            <CardBody m={0}>
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
                      value={isNaN(subDonation.weight) || subDonation.weight === -1 ? "" : subDonation.weight}
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
                      value={isNaN(subDonation.value) || subDonation.value === -1 ? "" : subDonation.value}
                      onChange={(e) => onChange(index, e)}
                  />
              </InputGroup>
              </CardBody>
          </CardBody>
      );
  }

  export default DonationInputs;