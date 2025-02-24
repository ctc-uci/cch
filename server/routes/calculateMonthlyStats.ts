import { Router } from "express";
import { getMonthName } from "../common/utils";
import { db } from "../db/db-pgp";

type MonthlyCount = {
	month: string;
	count: number;
}

type TableRow = {
	categoryName: string;
	monthlyCounts: MonthlyCount[];
	total: number;
}

// unique id that corresponds to a row that contains the category name to account for duplicate category names (e.g. multiple case managers with the same name)
interface TableData {
  [key: string]: TableRow;
}

type Table = {
  tableName: string;
  tableData: TableData;
};

type TabData = {
  tabName: string;
  tables: Table[]
}

type CallsAndOfficeVisitsTableData = {
	"Calls (includes dups)": TableRow;
	"Duplicated Calls": TableRow;
  "Number of People (calls plus kids in custody)": TableRow;
	"Total Number of Office Visits": TableRow;
} & TableData;

type DonationRoomTableData = {
  "HB Donation Room Visits": TableRow;

}

type PantryTableData = {
  "HB Pantry Vists": TableRow;
  "Placentia Pantry Visits": TableRow;
  "Placentia Neighborhood Visits": TableRow;
} & TableData;

type PeopleServedData = {
  "HB Donation Room People Served": TableRow;
  "HB Pantry People Served": TableRow;
  "Placentia Pantry People Served": TableRow;
  "Placentia Neighborhood People Served": TableRow;
}

type InterviewsTableData = {
	"Number of Interviews Conducted": TableRow;
	"Number of Pos. Tests": TableRow;
	"Number of NCNS": TableRow;
	"Number of Others (too late, left)": TableRow;
	"Total Interviews Scheduled": TableRow;
} & TableData;

export const calculateMonthlyStats = Router();

const getCallsAndOfficeVisitData = async (year: string): Promise<Table[]> => {
	const query = `
    SELECT
      m.month,
      COALESCE(SUM(total_calls), 0) as total_calls,
      COALESCE(SUM(total_unduplicated_calls), 0) as total_unduplicated_calls,
      COALESCE(SUM(total_office_visits), 0) as total_office_visits,
      COALESCE(SUM(number_of_people), 0) as number_of_people
	  FROM generate_series(1, 12) AS m(month)
	  LEFT JOIN front_desk_monthly f ON EXTRACT(MONTH FROM f.date) = m.month
    AND EXTRACT(YEAR FROM f.date) = $1
	  GROUP BY m.month
	  ORDER BY m.month;`;

	const data = await db.any(query, [year]);

	const callsAndOfficeVisitsTable: CallsAndOfficeVisitsTableData = {
		"Calls (includes dups)": {
			"categoryName": "Calls (includes dups)",
			"monthlyCounts": [],
			"total": 0
		},
		"Duplicated Calls": {
			"categoryName": "Duplicated Calls",
			"monthlyCounts": [],
			"total": 0
		},
    "Number of People (calls plus kids in custody)": {
      "categoryName": "Number of People (calls plus kids in custody)",
      "monthlyCounts": [],
      "total": 0
    },
		"Total Number of Office Visits": {
			"categoryName": "Total Number of Office Visits",
			"monthlyCounts": [],
			"total": 0
		}
	}

	data.forEach((entry) => {
		const monthName = getMonthName(entry.month)

		const total_calls = Number(entry.total_calls)
		const total_unduplicated_calls = Number(entry.total_unduplicated_calls)
		const total_duplicated_calls = total_calls - total_unduplicated_calls
		const total_office_visits = Number(entry.total_office_visits)
    const number_of_people = Number(entry.number_of_people)

		callsAndOfficeVisitsTable["Calls (includes dups)"].monthlyCounts.push({
			"month": monthName,
			"count": total_calls
		})
		callsAndOfficeVisitsTable["Calls (includes dups)"].total += total_calls

		callsAndOfficeVisitsTable["Duplicated Calls"].monthlyCounts.push({
			"month": monthName,
			"count": total_duplicated_calls
		})
		callsAndOfficeVisitsTable["Duplicated Calls"].total += total_duplicated_calls

		callsAndOfficeVisitsTable["Total Number of Office Visits"].monthlyCounts.push({
			"month": monthName,
			"count": total_office_visits
		})
		callsAndOfficeVisitsTable["Total Number of Office Visits"].total += total_office_visits
    callsAndOfficeVisitsTable["Number of People (calls plus kids in custody)"].monthlyCounts.push({
      "month": monthName,
      "count": number_of_people
    })
    callsAndOfficeVisitsTable["Number of People (calls plus kids in custody)"].total += number_of_people
	})

  const formattedData: Table[] = [
    {
      tableName: "Calls and Office Visits",
      tableData: callsAndOfficeVisitsTable
    }
  ]

	return formattedData;
};

const getDonationRoomVisitsData = async (year: string): Promise<Table> => {
  const donationVisitsTable : DonationRoomTableData = {
    "HB Donation Room Visits": {
      "categoryName": "HB Donation Room Visits",
      "monthlyCounts": [],
      "total": 0
    },
  };

  const query = `
    SELECT
      m.month,
      COALESCE(SUM(total_visits_hb_donations_room), 0) as total_visits_to_donations_room
    FROM generate_series(1, 12) AS m(month)
    LEFT JOIN front_desk_monthly f ON EXTRACT(MONTH FROM f.date) = m.month
    AND EXTRACT(YEAR FROM f.date) = $1
    GROUP BY m.month
    ORDER BY m.month;`;
  const data = await db.any(query, [year]);

  data.forEach((entry) => {
    const monthName = getMonthName(entry.month)

    const total_visits_to_donations_room = Number(entry.total_visits_to_donations_room)

    donationVisitsTable["HB Donation Room Visits"].monthlyCounts.push({
      "month": monthName,
      "count": total_visits_to_donations_room
    })
    donationVisitsTable["HB Donation Room Visits"].total += total_visits_to_donations_room
  })

  const formattedData: Table =
  {
    tableName: "Donation Room",
    tableData: donationVisitsTable
  };

  return formattedData;
}

const getPantryVisitsData = async (year: string): Promise<Table> => {
  const donationPantryVisitsTable: PantryTableData = {
    "HB Pantry Vists": {
      "categoryName": "HB Pantry Vists",
      "monthlyCounts": [],
      "total": 0
    },
    "Placentia Pantry Visits": {
      "categoryName": "Placentia Pantry Visits",
      "monthlyCounts": [],
      "total": 0
    },
    "Placentia Neighborhood Visits": {
      "categoryName": "Placentia Neighborhood Visits",
      "monthlyCounts": [],
      "total": 0
    }
  };
  const query = `
    SELECT
      m.month,
      COALESCE(SUM(total_visits_hb_pantry), 0) as total_visits_hb_pantry,
      COALESCE(SUM(total_visits_placentia_pantry), 0) as total_visits_placentia_pantry,
      COALESCE(SUM(total_visits_placentia_neighborhood), 0) as total_visits_placentia_neighborhood
    FROM generate_series(1, 12) AS m(month)
    LEFT JOIN front_desk_monthly f ON EXTRACT(MONTH FROM f.date) = m.month
    AND EXTRACT(YEAR FROM f.date) = $1
    GROUP BY m.month
    ORDER BY m.month;`;
  const data = await db.any(query, [year]);
  data.forEach((entry) => {
    const monthName = getMonthName(entry.month)
    const total_visits_hb_pantry = Number(entry.total_visits_hb_pantry)
    const total_visits_placentia_pantry = Number(entry.total_visits_placentia_pantry)
    const total_visits_placentia_neighborhood = Number(entry.total_visits_placentia_neighborhood)
    donationPantryVisitsTable["HB Pantry Vists"].monthlyCounts.push({
      "month": monthName,
      "count": total_visits_hb_pantry
    })
    donationPantryVisitsTable["HB Pantry Vists"].total += total_visits_hb_pantry
    donationPantryVisitsTable["Placentia Pantry Visits"].monthlyCounts.push({
      "month": monthName,
      "count": total_visits_placentia_pantry
    })
    donationPantryVisitsTable["Placentia Pantry Visits"].total += total_visits_placentia_pantry
    donationPantryVisitsTable["Placentia Neighborhood Visits"].monthlyCounts.push({
      "month": monthName,
      "count": total_visits_placentia_neighborhood
    })
    donationPantryVisitsTable["Placentia Neighborhood Visits"].total += total_visits_placentia_neighborhood
  })
  const formattedData: Table =
  {
    tableName: "Donation Pantry",
    tableData: donationPantryVisitsTable
  };
  return formattedData;
}
const getPeopleServedData = async (year: string): Promise<Table> => {
  const query = `SELECT
      m.month,
      COALESCE(SUM(total_served_hb_donations_room), 0) as served_hb_donations_room,
      COALESCE(SUM(total_served_hb_pantry), 0) as served_hb_pantry,
      COALESCE(SUM(total_served_placentia_pantry), 0) as served_placentia_pantry,
      COALESCE(SUM(total_served_placentia_neighborhood), 0) as served_placentia_neighborhood
    FROM generate_series(1, 12) AS m(month)
    LEFT JOIN front_desk_monthly f ON EXTRACT(MONTH FROM f.date) = m.month
    AND EXTRACT(YEAR FROM f.date) = $1
    GROUP BY m.month
    ORDER BY m.month;`;
  const data = await db.any(query, [year]);
  const peopleServedTable: PeopleServedData = {
    "HB Donation Room People Served": {
      "categoryName": "HB Donation Room People Served",
      "monthlyCounts": [],
      "total": 0
    },
    "HB Pantry People Served": {
      "categoryName": "HB Pantry People Served",
      "monthlyCounts": [],
      "total": 0
    },
    "Placentia Pantry People Served": {
      "categoryName": "Placentia Pantry People Served",
      "monthlyCounts": [],
      "total": 0
    },
    "Placentia Neighborhood People Served": {
      "categoryName": "Placentia Neighborhood People Served",
      "monthlyCounts": [],
      "total": 0
    }
  }
  data.forEach((entry) => {
    const monthName = getMonthName(entry.month)
    const served_hb_donations_room = Number(entry.served_hb_donations_room)
    const served_hb_pantry = Number(entry.served_hb_pantry)
    const served_placentia_pantry = Number(entry.served_placentia_pantry)
    const served_placentia_neighborhood = Number(entry.served_placentia_neighborhood)
    peopleServedTable["HB Donation Room People Served"].monthlyCounts.push({
      "month": monthName,
      "count": served_hb_donations_room
    })
    peopleServedTable["HB Donation Room People Served"].total += served_hb_donations_room
    peopleServedTable["HB Pantry People Served"].monthlyCounts.push({
      "month": monthName,
      "count": served_hb_pantry
    })
    peopleServedTable["HB Pantry People Served"].total += served_hb_pantry
    peopleServedTable["Placentia Pantry People Served"].monthlyCounts.push({
      "month": monthName,
      "count": served_placentia_pantry
    })
    peopleServedTable["Placentia Pantry People Served"].total += served_placentia_pantry
    peopleServedTable["Placentia Neighborhood People Served"].monthlyCounts.push({
      "month": monthName,
      "count": served_placentia_neighborhood
    })
    peopleServedTable["Placentia Neighborhood People Served"].total += served_placentia_neighborhood
  }
  )
  const formattedData: Table =
  {
    tableName: "People Served",
    tableData: peopleServedTable
  }

  return formattedData;
}

const getDonationPantryVisitsData = async (year: string): Promise<Table[]> => {
  const donationRoomVisits = await getDonationRoomVisitsData(year);
  const donationPantryVisits = await getPantryVisitsData(year);
  const peopleServed = await getPeopleServedData(year);
  const formattedData: Table[] = [
    donationRoomVisits,
    donationPantryVisits,
    peopleServed
  ]
  return formattedData;
}

const getInterviewsData = async (year: string): Promise<Table[]> => {
	const query = `
    SELECT
	    m.month,
	    COALESCE(SUM(number_of_interviews_conducted), 0) as interviews_conducted,
	    COALESCE(SUM(number_of_positive_tests), 0) as positive_tests,
	    COALESCE(SUM(number_of_ncns), 0) as no_call_no_shows,
	    COALESCE(SUM(number_of_others), 0) as other,
	    COALESCE(SUM(number_of_interviews_conducted +
        number_of_positive_tests +
        number_of_ncns +
        number_of_others), 0) as interviews_scheduled
    FROM generate_series(1, 12) AS m(month)
    LEFT JOIN cm_monthly_stats c ON EXTRACT(MONTH FROM c.date) = m.month
	  AND EXTRACT(YEAR FROM c.date) = $1
    GROUP BY m.month
    ORDER BY m.month;`;

	const data = await db.any(query, [year]);

	const interviewsData: InterviewsTableData = {
		"Number of Interviews Conducted": {
			"categoryName": "Number of Interviews Conducted",
			"monthlyCounts": [],
			"total": 0
		},
		"Number of Pos. Tests": {
			"categoryName": "Number of Pos. Tests",
			"monthlyCounts": [],
			"total": 0
		},
		"Number of NCNS": {
			"categoryName": "Number of NCNS",
			"monthlyCounts": [],
			"total": 0
		},
		"Number of Others (too late, left)": {
			"categoryName": "Number of Others (too late, left)",
			"monthlyCounts": [],
			"total": 0
		},
		"Total Interviews Scheduled": {
			"categoryName": "Total Interviews Scheduled",
			"monthlyCounts": [],
			"total": 0
		}
	}

	data.forEach((entry) => {
		const monthName = getMonthName(entry.month);

		const interviewsConducted = Number(entry.interviews_conducted)
		const positiveTests = Number(entry.positive_tests)
		const noCallNoShows = Number(entry.no_call_no_shows)
		const other = Number(entry.other)
		const interviewsScheduled = Number(entry.interviews_scheduled)

		interviewsData["Number of Interviews Conducted"].monthlyCounts.push({
			"month": monthName,
			"count": interviewsConducted
		})
		interviewsData["Number of Interviews Conducted"].total += interviewsConducted

		interviewsData["Number of Pos. Tests"].monthlyCounts.push({
			"month": monthName,
			"count": positiveTests
		})
		interviewsData["Number of Pos. Tests"].total += positiveTests

		interviewsData["Number of NCNS"].monthlyCounts.push({
			"month": monthName,
			"count": noCallNoShows
		})
		interviewsData["Number of NCNS"].total += noCallNoShows

		interviewsData["Number of Others (too late, left)"].monthlyCounts.push({
			"month": monthName,
			"count": other
		})
		interviewsData["Number of Others (too late, left)"].total += other

		interviewsData["Total Interviews Scheduled"].monthlyCounts.push({
			"month": monthName,
			"count": interviewsScheduled
		})
		interviewsData["Total Interviews Scheduled"].total += interviewsScheduled
	})

	const formattedData: Table[] = [
		{
			tableName: "Interviews",
			tableData: interviewsData
		}
	]

	return formattedData;
}

const getContactsData = async (year: string): Promise<Table[]> => {
  const query = `
      SELECT
        m.month,
        cm.id AS cm_id,
        cm.first_name,
        cm.last_name,
        COALESCE(SUM(s.total_number_of_contacts), 0) AS num_contacts
      FROM
        case_managers cm
      JOIN (
          SELECT DISTINCT cm_id
          FROM cm_monthly_stats
          WHERE EXTRACT(YEAR FROM date) = $1
        ) active ON active.cm_id = cm.id
      CROSS JOIN generate_series(1, 12) AS m(month)
      LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
        AND EXTRACT(MONTH FROM s.date) = m.month
        AND EXTRACT(YEAR FROM s.date) = $1
      GROUP BY
        cm.id, cm.first_name, cm.last_name, m.month
      ORDER BY
        cm.id, m.month;
    `;
  const data = await db.any(query, [year]);
  const contactsData: TableData = {};
  data.map((entry) => {
    const name = `${entry.first_name} ${entry.last_name}`
    const cmId = entry.cm_id
    const monthName = getMonthName(entry.month);
    const numContacts = Number(entry.num_contacts)

    if (!(contactsData[cmId])) {
      contactsData[cmId] = {
        "categoryName": name,
        "monthlyCounts": [],
        "total": 0
      }
    }

    contactsData[cmId].monthlyCounts.push({
      "month": monthName,
      "count": numContacts
    })
    contactsData[cmId].total += numContacts
  })
  const formattedData: Table[] = [
    {
      tableName: "Contacts",
      tableData: contactsData
    },
  ]

  return formattedData
}


const getFoodCardsData = async (year: string): Promise<TableData> => {
    const query = `
      SELECT
        m.month,
        cm.id AS cm_id,
        cm.first_name,
        cm.last_name,
        COALESCE(SUM(s.food_cards), 0) AS food_cards
      FROM
        case_managers cm
      JOIN (
          SELECT DISTINCT cm_id
          FROM cm_monthly_stats
          WHERE EXTRACT(YEAR FROM date) = $1
        ) active ON active.cm_id = cm.id
      CROSS JOIN generate_series(1, 12) AS m(month)
      LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
        AND EXTRACT(MONTH FROM s.date) = m.month
        AND EXTRACT(YEAR FROM s.date) = $1
      GROUP BY
        cm.id, cm.first_name, cm.last_name, m.month
      ORDER BY
        cm.id, m.month;
    `;

    const data = await db.any(query, [year]);
    const foodCardsData: TableData = {};

    data.forEach((entry) => {
        const cmId = entry.cm_id;
        const fullName = `${entry.first_name} ${entry.last_name}`;
        const monthName = getMonthName(entry.month);
        const foodCards = Number(entry.food_cards);

        if (!foodCardsData[cmId]) {
            foodCardsData[cmId] = {
                categoryName: fullName,
                monthlyCounts: [],
                total: 0,
            };
        }

        foodCardsData[cmId].monthlyCounts.push({
            month: monthName,
            count: foodCards,
        });
        foodCardsData[cmId].total += foodCards;
    });

    return foodCardsData;
};

const getFoodCardsValueData = async (year: string): Promise<TableData> => {
  const query = `
    SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.food_cards_value), 0) AS food_cards_value
    FROM
      case_managers cm
    JOIN (
        SELECT DISTINCT cm_id
        FROM cm_monthly_stats
        WHERE EXTRACT(YEAR FROM date) = $1
      ) active ON active.cm_id = cm.id
    CROSS JOIN generate_series(1, 12) AS m(month)
    LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
    GROUP BY
      cm.id, cm.first_name, cm.last_name, m.month
    ORDER BY
      cm.id, m.month;
  `;

  const data = await db.any(query, [year]);
  const foodCardsData: TableData = {};

  data.forEach((entry) => {
      const cmId = entry.cm_id;
      const fullName = `${entry.first_name} ${entry.last_name}`;
      const monthName = getMonthName(entry.month);
      const foodCards = Number(entry.food_cards_value);

      if (!foodCardsData[cmId]) {
          foodCardsData[cmId] = {
              categoryName: fullName,
              monthlyCounts: [],
              total: 0,
          };
      }

      foodCardsData[cmId].monthlyCounts.push({
          month: monthName,
          count: foodCards,
      });
      foodCardsData[cmId].total += foodCards;
  });

  return foodCardsData;
};

const getBusPassesData = async (year: string): Promise<TableData> => {
    const query = `
        SELECT
            m.month,
            cm.id AS cm_id,
            cm.first_name,
            cm.last_name,
            COALESCE(SUM(s.bus_passes), 0) AS bus_passes
        FROM
            case_managers cm
        JOIN (
            SELECT DISTINCT cm_id
            FROM cm_monthly_stats
            WHERE EXTRACT(YEAR FROM date) = $1
            GROUP BY cm_id
        ) active ON active.cm_id = cm.id
        CROSS JOIN generate_series(1, 12) AS m(month)
        LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
            AND EXTRACT(MONTH FROM s.date) = m.month
            AND EXTRACT(YEAR FROM s.date) = $1
        GROUP BY
            cm.id, cm.first_name, cm.last_name, m.month
        ORDER BY
            cm.id, m.month;
    `;

    const data = await db.any(query, [year]);
    const busPassesData: TableData = {};

    data.forEach((entry) => {
        const cmId = entry.cm_id;
        const fullName = `${entry.first_name} ${entry.last_name}`;
        const monthName = getMonthName(entry.month);
        const busPasses = Number(entry.bus_passes);

        if (!busPassesData[cmId]) {
            busPassesData[cmId] = {
                categoryName: fullName,
                monthlyCounts: [],
                total: 0,
            };
        }

        busPassesData[cmId].monthlyCounts.push({
            month: monthName,
            count: busPasses,
        });
        busPassesData[cmId].total += busPasses;
    });

    return busPassesData;
};

const getBusPassesValueData = async (year: string): Promise<TableData> => {
  const query = `
      SELECT
          m.month,
          cm.id AS cm_id,
          cm.first_name,
          cm.last_name,
          COALESCE(SUM(s.bus_passes_value), 0) AS bus_passes
      FROM
          case_managers cm
      JOIN (
          SELECT DISTINCT cm_id
          FROM cm_monthly_stats
          WHERE EXTRACT(YEAR FROM date) = $1
          GROUP BY cm_id
      ) active ON active.cm_id = cm.id
      CROSS JOIN generate_series(1, 12) AS m(month)
      LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
          AND EXTRACT(MONTH FROM s.date) = m.month
          AND EXTRACT(YEAR FROM s.date) = $1
      GROUP BY
          cm.id, cm.first_name, cm.last_name, m.month
      ORDER BY
          cm.id, m.month;
  `;

  const data = await db.any(query, [year]);
  const busPassesData: TableData = {};

  data.forEach((entry) => {
      const cmId = entry.cm_id;
      const fullName = `${entry.first_name} ${entry.last_name}`;
      const monthName = getMonthName(entry.month);
      const busPasses = Number(entry.bus_passes);

      if (!busPassesData[cmId]) {
          busPassesData[cmId] = {
              categoryName: fullName,
              monthlyCounts: [],
              total: 0,
          };
      }

      busPassesData[cmId].monthlyCounts.push({
          month: monthName,
          count: busPasses,
      });
      busPassesData[cmId].total += busPasses;
  });

  return busPassesData;
};

const getGasCardsData = async (year: string): Promise<TableData> => {
  const query = `
    SELECT
          m.month,
          cm.id AS cm_id,
          cm.first_name,
          cm.last_name,
          COALESCE(SUM(s.gas_cards), 0) AS gas_cards
      FROM
          case_managers cm
      JOIN (
          SELECT DISTINCT cm_id
          FROM cm_monthly_stats
          WHERE EXTRACT(YEAR FROM date) = $1
          GROUP BY cm_id
      ) active ON active.cm_id = cm.id
      CROSS JOIN generate_series(1, 12) AS m(month)
      LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
          AND EXTRACT(MONTH FROM s.date) = m.month
          AND EXTRACT(YEAR FROM s.date) = $1
      GROUP BY
          cm.id, cm.first_name, cm.last_name, m.month
      ORDER BY
          cm.id, m.month;
  `;
  const data = await db.any(query, [year]);
  const gasCardsData: TableData = {};
  data.forEach((entry) => {
    const cmId = entry.cm_id;
    const fullName = `${entry.first_name} ${entry.last_name}`;
    const monthName = getMonthName(entry.month);
    const gasCards = Number(entry.gas_cards);
    if (!gasCardsData[cmId]) {
      gasCardsData[cmId] = {
        categoryName: fullName,
        monthlyCounts: [],
        total: 0,
      };
    }
    gasCardsData[cmId].monthlyCounts.push({
      month: monthName,
      count: gasCards,
    });
    gasCardsData[cmId].total += gasCards;
  });
  return gasCardsData;
};

const getGasCardsValueData = async (year: string): Promise<TableData> => {
  const query = `
    SELECT
          m.month,
          cm.id AS cm_id,
          cm.first_name,
          cm.last_name,
          COALESCE(SUM(s.gas_cards_value), 0) AS gas_cards
      FROM
          case_managers cm
      JOIN (
          SELECT DISTINCT cm_id
          FROM cm_monthly_stats
          WHERE EXTRACT(YEAR FROM date) = $1
          GROUP BY cm_id
      ) active ON active.cm_id = cm.id
      CROSS JOIN generate_series(1, 12) AS m(month)
      LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
          AND EXTRACT(MONTH FROM s.date) = m.month
          AND EXTRACT(YEAR FROM s.date) = $1
      GROUP BY
          cm.id, cm.first_name, cm.last_name, m.month
      ORDER BY
          cm.id, m.month;
  `;
  const data = await db.any(query, [year]);
  const gasCardsData: TableData = {};
  data.forEach((entry) => {
    const cmId = entry.cm_id;
    const fullName = `${entry.first_name} ${entry.last_name}`;
    const monthName = getMonthName(entry.month);
    const gasCards = Number(entry.gas_cards);
    if (!gasCardsData[cmId]) {
      gasCardsData[cmId] = {
        categoryName: fullName,
        monthlyCounts: [],
        total: 0,
      };
    }
    gasCardsData[cmId].monthlyCounts.push({
      month: monthName,
      count: gasCards,
    });
    gasCardsData[cmId].total += gasCards;
  });
  return gasCardsData;
}

const getFoodBusData = async (year: string): Promise<Table[]> => {
    const foodCardsData = await getFoodCardsData(year);
    const busPassesData = await getBusPassesData(year);
    const foodCardsValueData = await getFoodCardsValueData(year);
    const busPassesValueData = await getBusPassesValueData(year);
    const gasCardsData = await getGasCardsData(year);
    const gasCardsValueData = await getGasCardsValueData(year);

    const formattedData: Table[] = [
        {
            tableName: "Food Cards",
            tableData: foodCardsData,
        },
        {
            tableName: "Food Cards Value",
            tableData: foodCardsValueData,
        },
        {
            tableName: "Bus Passes",
            tableData: busPassesData,
        },
        {
            tableName: "Bus Passes Value",
            tableData: busPassesValueData,
        },
        {
            tableName: "Gas Cards",
            tableData: gasCardsData,
        },
        {
            tableName: "Gas Cards Value",
            tableData: gasCardsValueData,
        }
    ];

    return formattedData;
};

const getWomensBirthdaysCelebratedData = async (year: string): Promise<TableData> => {
	// Query to get women's birthdays statistics for case managers who have celebrated women's birthdays that year
  const query = `
    SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.women_birthdays), 0) AS womens_birthdays
    FROM
      case_managers cm
    JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
    ) active ON active.cm_id = cm.id
    CROSS JOIN generate_series(1, 12) AS m(month)
    LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
    GROUP BY
      m.month, cm.id, cm.first_name, cm.last_name
    ORDER BY
    cm.id, m.month;
  `;

	const data = await db.any(query, [year]);
	const womensBirthdaysCelebratedData: TableData = {}

	data.map((entry) => {
		const name = `${entry.first_name} ${entry.last_name}`
    const cmId = entry.cm_id
    const monthName = getMonthName(entry.month);
		const womensBirthdays = Number(entry.womens_birthdays)

		if (!(womensBirthdaysCelebratedData[cmId])) {
			womensBirthdaysCelebratedData[cmId] = {
        "categoryName": name,
				"monthlyCounts": [],
				"total": 0
			}
		}

		womensBirthdaysCelebratedData[cmId].monthlyCounts.push({
			"month": monthName,
			"count": womensBirthdays
		})
		womensBirthdaysCelebratedData[cmId].total += womensBirthdays
	})

  return womensBirthdaysCelebratedData;

}

const getChildrensBirthdaysCelebratedData = async (year: string): Promise<TableData> => {
  const query = `
    SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.kid_birthdays), 0) AS childrens_birthdays
    FROM
      case_managers cm
    JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
    ) active ON active.cm_id = cm.id
    CROSS JOIN generate_series(1, 12) AS m(month)
    LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
    GROUP BY
        m.month, cm.id, cm.first_name, cm.last_name
    ORDER BY
      cm.id, m.month;
    `;

	const data = await db.any(query, [year]);
	const childrensBirthdaysCelebratedData: TableData = {}

	data.map((entry) => {
		const name = `${entry.first_name} ${entry.last_name}`
    const cmId = entry.cm_id
    const monthName = getMonthName(entry.month);
		const childrensBirthdays = Number(entry.childrens_birthdays)

		if (!(childrensBirthdaysCelebratedData[cmId])) {
			childrensBirthdaysCelebratedData[cmId] = {
        "categoryName": name,
				"monthlyCounts": [],
				"total": 0
			}
		}

		childrensBirthdaysCelebratedData[cmId].monthlyCounts.push({
			"month": monthName,
			"count": childrensBirthdays
		})
		childrensBirthdaysCelebratedData[cmId].total += childrensBirthdays
	})

  return childrensBirthdaysCelebratedData
}

const getBirthdaysData = async (year: string): Promise<Table[]> => {
  const womensBirthdaysCelebratedData = await getWomensBirthdaysCelebratedData(year);
  const childrensBirthdaysCelebratedData = await getChildrensBirthdaysCelebratedData(year);
  const formattedData: Table[] = [
    {
      tableName: "Womens Birthdays Celebrated",
      tableData: womensBirthdaysCelebratedData
    },
    {
      tableName: "Kids Birthdays Celebrated",
      tableData: childrensBirthdaysCelebratedData
    }
  ]

	return formattedData
}

const getReferralsData = async (year: string): Promise<Table[]> => {
  const query = `
    SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.women_healthcare_referrals), 0) AS women_healthcare_referrals,
      COALESCE(SUM(s.kid_healthcare_referrals), 0) AS kid_healthcare_referrals,
      COALESCE(SUM(s.women_counseling_referrals), 0) AS women_counseling_referrals,
      COALESCE(SUM(s.kid_counseling_referrals), 0) AS kid_counseling_referrals
    FROM
      case_managers cm
    JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
    ) active ON active.cm_id = cm.id
    CROSS JOIN generate_series(1, 12) AS m(month)
    LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
    GROUP BY
      m.month, cm.id, cm.first_name, cm.last_name
    ORDER BY
      cm.id, m.month;
  `;
  const data = await db.any(query, [year]);
  const womenHealthcareReferralsData: TableData = {};
  const kidHealthcareReferralsData: TableData = {};
  const womenCounselingReferralsData: TableData = {};
  const kidCounselingReferralsData: TableData = {};
  data.map((entry) => {
    const name = `${entry.first_name} ${entry.last_name}`
    const cmId = entry.cm_id
    const monthName = getMonthName(entry.month)
    const womenHealthcareReferrals = Number(entry.women_healthcare_referrals)
    const kidHealthcareReferrals = Number(entry.kid_healthcare_referrals)
    const womenCounselingReferrals = Number(entry.women_counseling_referrals)
    const kidCounselingReferrals = Number(entry.kid_counseling_referrals)
    if (!womenHealthcareReferralsData[cmId]) {
      womenHealthcareReferralsData[cmId] = {
        categoryName: name,
        monthlyCounts: [],
        total: 0,
      };
    }
    womenHealthcareReferralsData[cmId].monthlyCounts.push({
      month: monthName,
      count: womenHealthcareReferrals,
    });
    womenHealthcareReferralsData[cmId].total += womenHealthcareReferrals;
    if (!kidHealthcareReferralsData[cmId]) {
      kidHealthcareReferralsData[cmId] = {
        categoryName: name,
        monthlyCounts: [],
        total: 0,
      };
    }
    kidHealthcareReferralsData[cmId].monthlyCounts.push({
      month: monthName,
      count: kidHealthcareReferrals,
    });
    kidHealthcareReferralsData[cmId].total += kidHealthcareReferrals;
    if(!womenCounselingReferralsData[cmId]) {
      womenCounselingReferralsData[cmId] = {
        categoryName: name,
        monthlyCounts: [],
        total: 0,
      };
    }
    womenCounselingReferralsData[cmId].monthlyCounts.push({
      month: monthName,
      count: womenCounselingReferrals,
    });
    womenCounselingReferralsData[cmId].total += womenCounselingReferrals;
    if(!kidCounselingReferralsData[cmId]) {
      kidCounselingReferralsData[cmId] = {
        categoryName: name,
        monthlyCounts: [],
        total: 0,
      };
    }
    kidCounselingReferralsData[cmId].monthlyCounts.push({
      month: monthName,
      count: kidCounselingReferrals,
    });
    kidCounselingReferralsData[cmId].total += kidCounselingReferrals;
  })
  const formattedData: Table[] = [
    {
      tableName: "Healthcare Referrals for Women",
      tableData: womenHealthcareReferralsData
    },
    {
      tableName: "Healthcare Referrals for Kids",
      tableData: kidHealthcareReferralsData
    },
    {
      tableName: "Counseling Referrals for Women",
      tableData: womenCounselingReferralsData
    },
    {
      tableName: "Counseling Referrals for Kids",
      tableData: kidCounselingReferralsData
    },
  ]

  return formattedData
}

const getBabiesBornData = async (year: string): Promise<TableData> => {
  const query = `
    SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.babies_born), 0) AS babies_born
    FROM
      case_managers cm
    JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
      HAVING SUM(babies_born) > 0
    ) active ON active.cm_id = cm.id
    CROSS JOIN generate_series(1, 12) AS m(month)
    LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
    GROUP BY
      m.month, cm.id, cm.first_name, cm.last_name
    ORDER BY
      cm.id, m.month;
  `;

  const data = await db.any(query, [year]);
    const babiesBornData: TableData = {};

    data.forEach((entry) => {
      const cmId = entry.cm_id;
      const fullName = `${entry.first_name} ${entry.last_name}`;
      const monthName = getMonthName(entry.month);
      const babiesBorn = Number(entry.babies_born);

      if (!babiesBornData[cmId]) {
        babiesBornData[cmId] = {
          categoryName: fullName,
          monthlyCounts: [],
          total: 0,
        };
      }

      babiesBornData[cmId].monthlyCounts.push({
        month: monthName,
        count: babiesBorn,
      });
      babiesBornData[cmId].total += babiesBorn;
    });

    return babiesBornData;

}

const getEnrolledData = async (year: string): Promise<TableData> => {
  const query = `
  SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.women_enrolled_in_school), 0) AS enrolled_in_school
  FROM
      case_managers cm
  JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
  ) active ON active.cm_id = cm.id
  CROSS JOIN generate_series(1, 12) AS m(month)
  LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
  GROUP BY
      m.month, cm.id, cm.first_name, cm.last_name
  ORDER BY
      cm.id, m.month;
  `;

  const data = await db.any(query, [year]);
    const enrolledData: TableData = {};

    data.forEach((entry) => {
      const cmId = entry.cm_id;
      const fullName = `${entry.first_name} ${entry.last_name}`;
      const monthName = getMonthName(entry.month);
      const enrolled = Number(entry.enrolled_in_school);

      if (!enrolledData[cmId]) {
        enrolledData[cmId] = {
          categoryName: fullName,
          monthlyCounts: [],
          total: 0,
        };
      }

      enrolledData[cmId].monthlyCounts.push({
        month: monthName,
        count: enrolled,
      });
      enrolledData[cmId].total += enrolled;
    });

    return enrolledData;

}

const getLicenseData = async (year: string): Promise<TableData> => {
  const query = `
  SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.women_licenses_earned), 0) AS licenses_earned
  FROM
      case_managers cm
  JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
  ) active ON active.cm_id = cm.id
  CROSS JOIN generate_series(1, 12) AS m(month)
  LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
  GROUP BY
      m.month, cm.id, cm.first_name, cm.last_name
  ORDER BY
      cm.id, m.month;
  `;
  const data = await db.any(query, [year]);
  const licenseData: TableData = {};

  data.forEach((entry) => {
    const cmId = entry.cm_id;
    const fullName = `${entry.first_name} ${entry.last_name}`;
    const monthName = getMonthName(entry.month);
    const license = Number(entry.licenses_earned);

    if (!licenseData[cmId]) {
      licenseData[cmId] = {
        categoryName: fullName,
        monthlyCounts: [],
        total: 0,
      };
    }

    licenseData[cmId].monthlyCounts.push({
      month: monthName,
      count: license,
    });
    licenseData[cmId].total += license;
  });

  return licenseData;
}

const getReunificationData = async (year: string): Promise<TableData> => {
  const query = `
  SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.reunifications), 0) AS reunifications
  FROM
      case_managers cm
  JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
  ) active ON active.cm_id = cm.id
  CROSS JOIN generate_series(1, 12) AS m(month)
  LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
  GROUP BY
      m.month, cm.id, cm.first_name, cm.last_name
  ORDER BY
      cm.id, m.month;
  `;
  const data = await db.any(query, [year]);
  const reunificationData: TableData = {};
  data.forEach((entry) => {
    const cmId = entry.cm_id;
    const fullName = `${entry.first_name} ${entry.last_name}`;
    const monthName = getMonthName(entry.month);
    const reunification = Number(entry.reunifications);

    if (!reunificationData[cmId]) {
      reunificationData[cmId] = {
        categoryName: fullName,
        monthlyCounts: [],
        total: 0,
      };
    }

    reunificationData[cmId].monthlyCounts.push({
      month: monthName,
      count: reunification,
    });
    reunificationData[cmId].total += reunification;
  });
  return reunificationData;
}
const getDiplomaData = async (year: string): Promise<TableData> => {
  const query = `
  SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.women_degrees_earned), 0) AS degrees_earned
  FROM
      case_managers cm
  JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
  ) active ON active.cm_id = cm.id
  CROSS JOIN generate_series(1, 12) AS m(month)
  LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
      AND EXTRACT(MONTH FROM s.date) = m.month
      AND EXTRACT(YEAR FROM s.date) = $1
  GROUP BY
      m.month, cm.id, cm.first_name, cm.last_name
  ORDER BY
      cm.id, m.month;
  `;
  const data = await db.any(query, [year]);
  const diplomaData: TableData = {};
  data.forEach((entry) => {
    const cmId = entry.cm_id;
    const fullName = `${entry.first_name} ${entry.last_name}`;
    const monthName = getMonthName(entry.month);
    const diploma = Number(entry.degrees_earned);

    if (!diplomaData[cmId]) {
      diplomaData[cmId] = {
        categoryName: fullName,
        monthlyCounts: [],
        total: 0,
      };
    }

    diplomaData[cmId].monthlyCounts.push({
      month: monthName,
      count: diploma,
    });
    diplomaData[cmId].total += diploma;
  });
  return diplomaData;
}

const getMiscData = async (year: string): Promise<Table[]> => {
  const babiesBornData = await getBabiesBornData(year);
  const enrolledData = await getEnrolledData(year);
  const licenseData = await getLicenseData(year);
  const reunificationData = await getReunificationData(year);
  const diplomaData = await getDiplomaData(year);
  const formattedData: Table[] = [
    {
      tableName: "Babies Born",
      tableData: babiesBornData
    },
    {
      tableName: "Women who enroll in School or a trade program while in CCH",
      tableData: enrolledData
    },
    {
      tableName: "Women who earn a GED or Diploma while in CCH",
      tableData: diplomaData
    },
    {
      tableName: "Women who get a drivers license while in the program",
      tableData: licenseData
    },
    {
      tableName: "Reunifications",
      tableData: reunificationData
    }
  ]

  return formattedData
}

calculateMonthlyStats.get("/:year", async (req, res) => {
	const { year } = req.params
	const callsAndOfficeVisitData = await getCallsAndOfficeVisitData(year);
	const interviewData = await getInterviewsData(year);
	const contactsData = await getContactsData(year);
	const donationPantryVisitsData = await getDonationPantryVisitsData(year);
	const birthdaysData = await getBirthdaysData(year); // returns 2 tables: womens birthdays and kids birthdays
  const foodBusData = await getFoodBusData(year); // returns 2 tables: food cards and bus passes
  const referralsData = await getReferralsData(year); // returns 2 tables: healthcare referrals for women and healthcare referrals for kids
  const miscData = await getMiscData(year); // returns 2 tables: babies born and women who enroll in school or a trade program while in CCH
	const response : TabData[] = [
		{
			"tabName": "Calls and Office Visits",
			"tables": callsAndOfficeVisitData
		},
		{
			"tabName": "Interviews",
			"tables": interviewData
		},
    {
      "tabName": "Contacts",
      "tables": contactsData
    },
    {
      "tabName": "Donation & Pantry Visits",
      "tables": donationPantryVisitsData
    },
    {
			"tabName": "Birthdays",
			"tables": birthdaysData
		},
		{
			"tabName": "E&TH Food & Bus",
			"tables": foodBusData
		},
    {
			"tabName": "Referrals",
			"tables": referralsData
		},
    {
			"tabName": "Misc.",
			"tables": miscData
		},
	]

	res.status(200).json(response);
});
