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
                  type="datetime-local"
                  size="sm"
                  maxWidth="210px"
                  value={subDonation.date instanceof Date 
                    ? new Date(subDonation.date.getTime() - subDonation.date.getTimezoneOffset() * 60000)
                        .toISOString().slice(0, 16)
                    : ''}
                  onChange={(e) => {
                    // Convert datetime-local value to UTC Date
                    const localDate = new Date(e.target.value);
                    // Create UTC date by treating the local datetime as UTC
                    const utcDate = new Date(Date.UTC(
                      localDate.getFullYear(),
                      localDate.getMonth(),
                      localDate.getDate(),
                      localDate.getHours(),
                      localDate.getMinutes(),
                      localDate.getSeconds()
                    ));

                    const customEvent = {
                      target: {
                        name: 'date',
                        value: utcDate,
                        checked: false,
                        type: 'datetime-local',
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
                    maxWidth="100px"
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
                    maxWidth="100px"
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