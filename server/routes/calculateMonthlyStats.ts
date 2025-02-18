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
	"Total Number of Office Visits": TableRow;
} & TableData;

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
      COALESCE(SUM(total_unduplicated_calles), 0) as total_unduplicated_calles,
      COALESCE(SUM(total_office_visits), 0) as total_office_visits
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
		"Total Number of Office Visits": {
			"categoryName": "Total Number of Office Visits",
			"monthlyCounts": [],
			"total": 0
		}
	}

	data.forEach((entry) => {
		const monthName = getMonthName(entry.month)

		const total_calls = Number(entry.total_calls)
		const total_unduplicated_calls = Number(entry.total_unduplicated_calles)
		const total_duplicated_calls = total_calls - total_unduplicated_calls
		const total_office_visits = Number(entry.total_office_visits)

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
	})

  const formattedData: Table[] = [
    {
      tableName: "Calls and Office Visits",
      tableData: callsAndOfficeVisitsTable
    }
  ]

	return formattedData;
};

const getInterviewsData = async (year: string): Promise<Table[]> => {
	const query = `
    SELECT
	    m.month,
	    COALESCE(SUM(interviews_conducted), 0) as interviews_conducted,
	    COALESCE(SUM(positive_tests), 0) as positive_tests,
	    COALESCE(SUM(no_call_no_shows), 0) as no_call_no_shows,
	    COALESCE(SUM(other), 0) as other,
	    COALESCE(SUM(interviews_scheduled), 0) as interviews_scheduled
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
  const formattedData: Table[] = [
    {
      tableName: "Contacts",
      tableData: {}
    },
  ]

  return formattedData
}

const getDonationPantryVisitsData = async (year: string): Promise<Table[]> => {
  const formattedData: Table[] = [
    {
      tableName: "Donation Room",
      tableData: {}
    },
    {
      tableName: "Pantry and Neighborhood Visits",
      tableData: {}
    },
    {
      tableName: "People Served",
      tableData: {}
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
        COALESCE(SUM(s.food_card_values), 0) AS food_cards
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
            HAVING SUM(bus_passes) > 0
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

const getFoodBusData = async (year: string): Promise<Table[]> => {
    const foodCardsData = await getFoodCardsData(year);
    const busPassesData = await getBusPassesData(year);

    const formattedData: Table[] = [
        {
            tableName: "Food Cards",
            tableData: foodCardsData,
        },
        {
            tableName: "Bus Passes",
            tableData: busPassesData,
        },
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
      COALESCE(SUM(s.womens_birthdays), 0) AS womens_birthdays
    FROM
      case_managers cm
    JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
      HAVING SUM(womens_birthdays) > 0
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

  return womensBirthdaysCelebratedData

// 	const totalMonthlyQuery = `SELECT
//     m.month,
//     COALESCE(SUM(s.womens_birthdays), 0) AS womens_birthdays
// FROM
//     generate_series(1, 12) AS m(month)
// LEFT JOIN
//     cm_monthly_stats s
//     ON EXTRACT(MONTH FROM s.date) = m.month
//     AND EXTRACT(YEAR FROM s.date) = $1
// GROUP BY
//     m.month
// ORDER BY
//     m.month;`

// 	const totalMonthlyData = await db.any(query, [year]);
// 	let totalMonthlyTotal = 0

// 	formattedData["Total Monthly"] = {
// 		"entries": totalMonthlyData.map((entry) => {
// 			totalMonthlyTotal += Number(entry.womens_birthdays)

// 			return {
// 				"name": getMonthName(entry.month),
// 				"count": Number(entry.womens_birthdays)
// 			}
// 		}),
// 		"total": totalMonthlyTotal
// 	}

}

const getChildrensBirthdaysCelebratedData = async (year: string): Promise<TableData> => {
  const query = `
    SELECT
      m.month,
      cm.id AS cm_id,
      cm.first_name,
      cm.last_name,
      COALESCE(SUM(s.childrens_birthdays), 0) AS childrens_birthdays
    FROM
      case_managers cm
    JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
      HAVING SUM(childrens_birthdays) > 0 -- Ensure only those with childrens birthdays
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
  const formattedData: Table[] = [
    {
      tableName: "Healthcare Referrals for Women",
      tableData: {}
    },
    {
      tableName: "Healthcare Referrals for Kids",
      tableData: {}
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
      COALESCE(SUM(s.enrolled_in_school), 0) AS enrolled_in_school
  FROM
      case_managers cm
  JOIN (
      SELECT cm_id
      FROM cm_monthly_stats
      WHERE EXTRACT(YEAR FROM date) = $1
      GROUP BY cm_id
      HAVING SUM(enrolled_in_school) > 0
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

const getMiscData = async (year: string): Promise<Table[]> => {
  const babiesBornData = await getBabiesBornData(year);
  const enrolledData = await getEnrolledData(year);

  const formattedData: Table[] = [
    {
      tableName: "Babies Born",
      tableData: babiesBornData
    },
    {
      tableName: "Women who enroll in School or a trade program while in CCH",
      tableData: enrolledData
    },
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
