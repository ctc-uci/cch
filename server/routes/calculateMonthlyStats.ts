import { Router } from "express";

import { getMonthName } from "../common/utils";
import { db } from "../db/db-pgp";

type MonthlyStatEntry = {
	month: string;
	count: number;
}

type CategoryStatisticsRow = {
	categoryName: string;
	entries: MonthlyStatEntry[];
	total: number;
}

type CallsAndOfficeVisitsStats = {
	"Calls (includes dups)": CategoryStatisticsRow;
	"Duplicated Calls": CategoryStatisticsRow;
	"Total Number of Office Visits": CategoryStatisticsRow;
}

type InterviewsTable = {
	"Number of Interviews Conducted": CategoryStatisticsRow;
	"Number of Pos. Tests": CategoryStatisticsRow;
	"Number of NCNS": CategoryStatisticsRow;
	"Number of Others (too late, left)": CategoryStatisticsRow;
	"Total Interviews Scheduled": CategoryStatisticsRow;
}
type FoodCardsTable = Record<string, CategoryStatisticsRow>;
type BusPassesTable = Record<string, CategoryStatisticsRow>;
type WomensBirthdaysCelebratedTable = Record<string, CategoryStatisticsRow>;
type ChildrensBirthdaysCelebratedTable = Record<string, CategoryStatisticsRow>;
type StatsTabData = {
  tabName: string;
  tables: StatsTableData[]
}

type StatsTableData = {
    tableName: string;
    tableData: any;
};

export const calculateMonthlyStats = Router();

const getCallsAndOfficeVisitData = async (year: string) => {
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

	const callsAndOfficeVisitsTable: CallsAndOfficeVisitsStats = {
		"Calls (includes dups)": {
			"categoryName": "Calls (includes dups)",
			"entries": [],
			"total": 0
		},
		"Duplicated Calls": {
			"categoryName": "Duplicated Calls",
			"entries": [],
			"total": 0
		},
		"Total Number of Office Visits": {
			"categoryName": "Total Number of Office Visits",
			"entries": [],
			"total": 0
		}
	}

	data.forEach((entry) => {
		const monthName = getMonthName(entry.month)

		const total_calls = Number(entry.total_calls)
		const total_unduplicated_calls = Number(entry.total_unduplicated_calles)
		const total_office_visits = Number(entry.total_office_visits)

		// Calls including duplicates
		callsAndOfficeVisitsTable["Calls (includes dups)"].entries.push({
			"month": monthName,
			"count": total_calls
		})
		callsAndOfficeVisitsTable["Calls (includes dups)"].total += total_calls

		// Duplicated calls (total - unduplicated)
		callsAndOfficeVisitsTable["Duplicated Calls"].entries.push({
			"month": monthName,
			"count": total_unduplicated_calls
		})
		callsAndOfficeVisitsTable["Duplicated Calls"].total += total_unduplicated_calls

		// Total number of office visits
		callsAndOfficeVisitsTable["Total Number of Office Visits"].entries.push({
			"month": monthName,
			"count": total_office_visits
		})
		callsAndOfficeVisitsTable["Total Number of Office Visits"].total += total_office_visits
	})

  const formattedData: StatsTableData[] = [
    {
      tableName: "Calls and Office Visits",
      tableData: callsAndOfficeVisitsTable
    }
  ]

	return formattedData;
};

const getInterviewsData = async (year: string) => {
	const query = `SELECT
	m.month,
	COALESCE(SUM(interviews_conducted), 0) as interviews_conducted,
	COALESCE(SUM(positive_tests), 0) as positive_tests,
	COALESCE(SUM(no_call_no_shows), 0) as no_call_no_shows,
	COALESCE(SUM(other), 0) as other,
	COALESCE(SUM(interviews_scheduled), 0) as interviews_scheduled
FROM generate_series(1, 12) AS m(month)
LEFT JOIN cm_monthly_stats f ON EXTRACT(MONTH FROM f.date) = m.month
	AND EXTRACT(YEAR FROM f.date) = $1
GROUP BY m.month
ORDER BY m.month;`;

	const data = await db.any(query, [year]);

	const interviewsData: InterviewsTable = {
		"Number of Interviews Conducted": {
			"categoryName": "Number of Interviews Conducted",
			"entries": [],
			"total": 0
		},
		"Number of Pos. Tests": {
			"categoryName": "Number of Pos. Tests",
			"entries": [],
			"total": 0
		},
		"Number of NCNS": {
			"categoryName": "Number of NCNS",
			"entries": [],
			"total": 0
		},
		"Number of Others (too late, left)": {
			"categoryName": "Number of Others (too late, left)",
			"entries": [],
			"total": 0
		},
		"Total Interviews Scheduled": {
			"categoryName": "Total Interviews Scheduled",
			"entries": [],
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

		interviewsData["Number of Interviews Conducted"].entries.push({
			"month": monthName,
			"count": interviewsConducted
		})
		interviewsData["Number of Interviews Conducted"].total += interviewsConducted

		interviewsData["Number of Pos. Tests"].entries.push({
			"month": monthName,
			"count": positiveTests
		})
		interviewsData["Number of Pos. Tests"].total += positiveTests

		interviewsData["Number of NCNS"].entries.push({
			"month": monthName,
			"count": noCallNoShows
		})
		interviewsData["Number of NCNS"].total += noCallNoShows

		interviewsData["Number of Others (too late, left)"].entries.push({
			"month": monthName,
			"count": other
		})
		interviewsData["Number of Others (too late, left)"].total += other

		interviewsData["Total Interviews Scheduled"].entries.push({
			"month": monthName,
			"count": interviewsScheduled
		})
		interviewsData["Total Interviews Scheduled"].total += interviewsScheduled
	})

	const formattedData: StatsTableData[] = [
		{
			tableName: "Interviews",
			tableData: interviewsData
		}
	]

	return formattedData;
}

const getContactsData = async (year: string) => {
  const formattedData: StatsTableData[] = [
    {
      tableName: "Contacts",
      tableData: {}
    },
  ]

  return formattedData
}

const getDonationPantryVisitsData = async (year: string) => {
  const formattedData: StatsTableData[] = [
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

const getETHFoodBusData = async (year: string) => {
	// Query to get food card and bus pass statistics for active case managers
	const query = `
		SELECT
			gs.month,
			cm.id AS cm_id,
			cm.first_name,
			cm.last_name,
			COALESCE(SUM(s.food_card_values), 0) AS food_cards,
			COALESCE(SUM(s.bus_passes), 0) AS bus_passes
		FROM
			case_managers cm
		JOIN (
			SELECT DISTINCT cm_id
			FROM cm_monthly_stats
			WHERE EXTRACT(YEAR FROM date) = $1
		) active ON active.cm_id = cm.id
		CROSS JOIN generate_series(1, 12) AS gs(month)
		LEFT JOIN cm_monthly_stats s ON s.cm_id = cm.id
			AND EXTRACT(MONTH FROM s.date) = gs.month
			AND EXTRACT(YEAR FROM s.date) = $1
		GROUP BY
			cm.id, cm.first_name, cm.last_name, gs.month
		ORDER BY
			cm.id, gs.month;
	`;

	const data = await db.any(query, [year]);
	const foodCardsData: FoodCardsTable = {};
  const busPassesData: BusPassesTable = {};

	data.forEach((entry) => {
		const cmId = entry.cm_id;
		const fullName = `${entry.first_name} ${entry.last_name}`;
		const monthName = getMonthName(entry.month);
		const foodCards = Number(entry.food_cards);
    const busPasses = Number(entry.bus_passes);

		if (!foodCardsData[cmId]) {
			foodCardsData[cmId] = {
				categoryName: fullName,
				entries: [],
				total: 0,
			};
		}

		foodCardsData[cmId].entries.push({
			month: monthName,
			count: foodCards,
		});
    foodCardsData[cmId].total += foodCards;

    if (!busPassesData[cmId]) {
			busPassesData[cmId] = {
				categoryName: fullName,
				entries: [],
				total: 0,
			};
		}
    busPassesData[cmId].entries.push({
			month: monthName,
			count: busPasses,
		});

    busPassesData[cmId].total += busPasses;
	});

  const formattedData: StatsTableData[] = [
    {
      tableName: "Food Cards",
      tableData: foodCardsData
    },
    {
      tableName: "Bus Passes",
      tableData: busPassesData
    }
  ]

	return formattedData;
}


const getWomensBirthdaysCelebratedData = async (year: string) => {
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
    HAVING SUM(womens_birthdays) > 0 -- Ensure only those with women's birthdays
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
	const womensBirthdaysCelebratedData: WomensBirthdaysCelebratedTable = {}

	data.map((entry) => {
		const name = `${entry.first_name} ${entry.last_name}`
    const cmId = entry.cm_id
    const monthName = getMonthName(entry.month);
		const womensBirthdays = Number(entry.womens_birthdays)

		if (!(womensBirthdaysCelebratedData[cmId])) {
			womensBirthdaysCelebratedData[cmId] = {
        "categoryName": name,
				"entries": [],
				"total": 0
			}
		}

		womensBirthdaysCelebratedData[cmId].entries.push({
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

const getChildrensBirthdaysCelebratedData = async (year: string) => {
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
	const childrensBirthdaysCelebratedData: ChildrensBirthdaysCelebratedTable = {}

	data.map((entry) => {
		const name = `${entry.first_name} ${entry.last_name}`
    const cmId = entry.cm_id
    const monthName = getMonthName(entry.month);
		const childrensBirthdays = Number(entry.childrens_birthdays)

		if (!(childrensBirthdaysCelebratedData[cmId])) {
			childrensBirthdaysCelebratedData[cmId] = {
        "categoryName": name,
				"entries": [],
				"total": 0
			}
		}

		childrensBirthdaysCelebratedData[cmId].entries.push({
			"month": monthName,
			"count": childrensBirthdays
		})
		childrensBirthdaysCelebratedData[cmId].total += childrensBirthdays
	})

  return childrensBirthdaysCelebratedData
}

const getBirthdaysData = async (year: string) => {
  const womensBirthdaysCelebratedData = await getWomensBirthdaysCelebratedData(year);
  const childrensBirthdaysCelebratedData = await getChildrensBirthdaysCelebratedData(year);
  const formattedData: StatsTableData[] = [
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

const getMiscData = async (year: string) => {
  const formattedData: StatsTableData[] = [
    {
      tableName: "Babies Born",
      tableData: {}
    },
    {
      tableName: "Women who enroll in School or a trade program while in CCH",
      tableData: {}
    },
  ]

  return formattedData
}

const getReferralsData = async (year: string) => {
  const formattedData: StatsTableData[] = [
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
calculateMonthlyStats.get("/:year", async (req, res) => {
	const { year } = req.params
	const callsAndOfficeVisitData = await getCallsAndOfficeVisitData(year);
	const interviewData = await getInterviewsData(year);
	const contactsData = await getContactsData(year);
	const donationPantryVisitsData = await getDonationPantryVisitsData(year);
	const ETHFoodBusData = await getETHFoodBusData(year); // returns 2 tables: food cards and bus passes
	const birthdaysData = await getBirthdaysData(year);
  const miscData = await getMiscData(year);
  const referralsData = await getReferralsData(year);
	const response : StatsTabData[] = [
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
			"tables": ETHFoodBusData
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
