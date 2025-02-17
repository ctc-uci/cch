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

// category name is also present in each row despite the key being the same because we need to account for cases of duplicate category names (e.g. if two case managers have the same first and last name)

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

type WomensBirthdaysCelebratedTable = Record<string, CategoryStatisticsRow>;


export const calculateMonthlyStats = Router();

const getCallsAndOfficeVisitTable = async (year: string) => {
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

	const formattedData: CallsAndOfficeVisitsStats = {
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
		formattedData["Calls (includes dups)"].entries.push({
			"month": monthName,
			"count": total_calls
		})
		formattedData["Calls (includes dups)"].total += total_calls

		// Duplicated calls (total - unduplicated)
		formattedData["Duplicated Calls"].entries.push({
			"month": monthName,
			"count": total_unduplicated_calls
		})
		formattedData["Duplicated Calls"].total += total_unduplicated_calls

		// Total number of office visits
		formattedData["Total Number of Office Visits"].entries.push({
			"month": monthName,
			"count": total_office_visits
		})
		formattedData["Total Number of Office Visits"].total += total_office_visits
	})

	return formattedData;
};

const getInterviewsTable = async (year: string) => {
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

	const formattedData: InterviewsTable = {
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

		formattedData["Number of Interviews Conducted"].entries.push({
			"month": monthName,
			"count": interviewsConducted
		})
		formattedData["Number of Interviews Conducted"].total += interviewsConducted

		formattedData["Number of Pos. Tests"].entries.push({
			"month": monthName,
			"count": positiveTests
		})
		formattedData["Number of Pos. Tests"].total += positiveTests

		formattedData["Number of NCNS"].entries.push({
			"month": monthName,
			"count": noCallNoShows
		})
		formattedData["Number of NCNS"].total += noCallNoShows

		formattedData["Number of Others (too late, left)"].entries.push({
			"month": monthName,
			"count": other
		})
		formattedData["Number of Others (too late, left)"].total += other

		formattedData["Total Interviews Scheduled"].entries.push({
			"month": monthName,
			"count": interviewsScheduled
		})
		formattedData["Total Interviews Scheduled"].total += interviewsScheduled
	})

	return formattedData
}

const getETHFoodBusTable = async (year: string) => {
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
	const formattedData: FoodCardsTable = {};

	data.forEach((entry) => {
		const cmId = entry.cm_id;
		const fullName = `${entry.first_name} ${entry.last_name}`;
		const monthName = getMonthName(entry.month);
		const foodCards = Number(entry.food_cards);

		// Initialize case manager's stats if not exists
		if (!formattedData[cmId]) {
			formattedData[cmId] = {
				categoryName: fullName,
				entries: [],
				total: 0,
			};
		}

		// Add entry for the month
		formattedData[cmId].entries.push({
			month: monthName,
			count: foodCards,
		});

		// Update total food cards
		formattedData[cmId].total += foodCards;
	});

	return formattedData;
}


const getWomensBirthdaysCelebratedTable = async (year: string) => {
	const query = `SELECT
    m.month,
    cm.id AS cm_id,
    cm.first_name,
    cm.last_name,
    COALESCE(SUM(s.womens_birthdays), 0) AS womens_birthdays
FROM
    generate_series(1, 12) AS m(month)
CROSS JOIN
    case_managers cm
LEFT JOIN
    cm_monthly_stats s
    ON EXTRACT(MONTH FROM s.date) = m.month
    AND EXTRACT(YEAR FROM s.date) = $1
    AND s.cm_id = cm.id
GROUP BY
    m.month, cm.id, cm.first_name, cm.last_name
ORDER BY
    cm.id, m.month;`;

	const data = await db.any(query, [year]);
	const formattedData: WomensBirthdaysCelebratedTable = {}

	data.map((entry) => {
		const name = `${entry.first_name} ${entry.last_name}`
    const cmId = entry.cm_id

		if (!(cmId in formattedData)) {
			formattedData[cmId] = {
        "categoryName": name,
				"entries": [],
				"total": 0
			}
		}

		const monthName = getMonthName(entry.month);
		const womensBirthdays = Number(entry.womens_birthdays)

		formattedData[cmId].entries.push({
			"month": monthName,
			"count": womensBirthdays
		})
		formattedData[cmId].total += womensBirthdays
	})

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

	return formattedData
}



calculateMonthlyStats.get("/:year", async (req, res) => {
	const { year } = req.params
	const callsAndOfficeVisitData = await getCallsAndOfficeVisitTable(year);
	const interviewData = await getInterviewsTable(year);
	const ETHFoodBusData = await getETHFoodBusTable(year);
	const womensBirthdayData = await getWomensBirthdaysCelebratedTable(year);

	const response = [
		{
			"tabName": "Calls and Office Visits",
			"data": callsAndOfficeVisitData
		},
		{
			"tabName": "Interviews",
			"data": interviewData
		},
		{
			"tabName": "just the food card table",
			"data": ETHFoodBusData
		}
	]

	res.status(200).json(response);
});
