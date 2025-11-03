import React, {useEffect, useState} from 'react'
import { HStack, Select, Stack } from '@chakra-ui/react'
import { CardBody, Text, Input, InputGroup, InputRightAddon, InputLeftAddon } from '@chakra-ui/react'


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
            <CardBody p={0} mt={4}>
              <HStack justifyContent="space-between" alignItems="center">
              <Stack>
                <Text fontSize="sm">Date Donated</Text>
                <Input
                  name="date"
                  type="date"
                  size="sm"
                  value={subDonation.date instanceof Date ? subDonation.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);

                    const customEvent = {
                      target: {
                        name: 'date',
                        value: newDate,
                        checked: false,
                        type: 'date',
                        validity: {} as ValidityState,
                      }
                    } as unknown as React.ChangeEvent<HTMLInputElement>;

                    onChange(index, customEvent);
                  }}
                />
              </Stack>

              <Stack>
                <Text fontSize="sm">Category</Text>
                <Select
                  name="category"
                  size="sm"
                  value={subDonation.category}
                  placeholder="Select Category"
                  onChange={(e) => onChange(index, e)}
                  width="160px"
                >
                  <option value="food">Food</option>
                  <option value="client">Client</option>
                </Select>
              </Stack>

              <Stack>
                <Text fontSize="sm">Total Weight (lbs)</Text>
                <InputGroup size="sm">
                  <Input
                    maxWidth="120px"
                    name="weight"
                    type="number"
                    placeholder="XX"
                    size="sm"
                    value={isNaN(subDonation.weight) || subDonation.weight === -1 ? "" : subDonation.weight}
                    onChange={(e) => onChange(index, e)}
                  />
                  <InputRightAddon>lbs</InputRightAddon>
                </InputGroup>
              </Stack>
              
              <Text fontSize="sm" mt={6}>x</Text>

              <Stack>
                <Text fontSize="sm">Value per lbs ($)</Text>
                <InputGroup size="sm">
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                    maxWidth="120px"
                    name="value"
                    type="number"
                    placeholder="0.00"
                    size="sm"
                    value={isNaN(subDonation.value) || subDonation.value === -1 ? "" : subDonation.value}
                    onChange={(e) => onChange(index, e)}
                  />
                </InputGroup>
              </Stack>

              <Text fontSize="sm" mt={6}>=</Text>

              <Stack>
                <Text fontSize="sm">Total Value ($)</Text>
                <Text fontSize="sm" color="gray.500">
                  {(subDonation.value === -1 || subDonation.weight === -1)
                    ? "$00.00"
                    : `$${totalValue.toFixed(2)}`
                  }
                </Text>
              </Stack>
            </HStack>
            </CardBody>
          );

  }

  export default DonationInputs;