import { Td, Tr } from "@chakra-ui/react";

import {
  NumberInputComponent,
  TextInputComponent,
} from "../intakeStatsForm/formComponents";

export const FrontDeskMonthlyTableBody =  ({
  formData,
  handleChange,
}: {
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <>
      <Tr>
        <Td fontSize="medium">Date</Td>
        <Td>
          <TextInputComponent
            name="date"
            value={formData.date}
            onChange={handleChange}
            type="date"
            width="100%"
            disabled
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total Office Visits</Td>
        <Td>
          <NumberInputComponent
            name="totalOfficeVisits"
            value={formData.totalOfficeVisits}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total # of Calls</Td>
        <Td>
          <NumberInputComponent
            name="totalCalls"
            value={formData.totalCalls}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total # of Unduplicated Calls</Td>

        <Td>
          <NumberInputComponent
            name="totalUnduplicatedCalls"
            value={formData.totalUnduplicatedCalls}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total Visits to HB Donations Room</Td>
        <Td>
          <NumberInputComponent
            name="totalVisitsHbDonationsRoom"
            value={formData.totalVisitsHbDonationsRoom}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total People Served in HB Donations Room</Td>
        <Td>
          <NumberInputComponent
            name="totalServedHbDonationsRoom"
            value={formData.totalServedHbDonationsRoom}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total Visits to HB Pantry</Td>
        <Td>
          <NumberInputComponent
            name="totalVisitsHbPantry"
            value={formData.totalVisitsHbPantry}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total People Served in HB Pantry</Td>
        <Td>
          <NumberInputComponent
            name="totalServedHbPantry"
            value={formData.totalServedHbPantry}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total Visits to Placentia Pantry</Td>
        <Td>
          <NumberInputComponent
            name="totalVisitsPlacentiaPantry"
            value={formData.totalVisitsPlacentiaPantry}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total People Served in Placentia Pantry</Td>
        <Td>
          <NumberInputComponent
            name="totalServedPlacentiaPantry"
            value={formData.totalServedPlacentiaPantry}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total Visits to Placentia Neighborhood Room</Td>
        <Td>
          <NumberInputComponent
            name="totalVisitsPlacentiaNeighborhood"
            value={formData.totalVisitsPlacentiaNeighborhood}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Total People Served in Placentia Neighborhood Room</Td>
        <Td>
          <NumberInputComponent
            name="totalServedPlacentiaNeighborhood"
            value={formData.totalServedPlacentiaNeighborhood}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
      <Tr>
        <Td fontSize="medium">Number of People</Td>
        <Td>
          <NumberInputComponent
            name="numberOfPeople"
            value={formData.numberOfPeople}
            onChange={handleChange}
            min={0}
            width="100%"
          />
        </Td>
      </Tr>
    </>
  );
};
