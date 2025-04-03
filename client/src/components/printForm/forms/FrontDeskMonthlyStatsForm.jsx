import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#E2E8F0'
  },
  tableCellHeader: {
    width: '50%',
    padding: 8,
    fontWeight: 'bold',
  },
  tableCell: {
    width: '50%',
    padding: 8,
    backgroundColor: "#EDF2F7"
  },
});

export default function FrontDeskMonthlyStatsForm({ frontDeskMonthlyStatsData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
      {frontDeskMonthlyStatsData && frontDeskMonthlyStatsData.map((element) => (
          <View style={styles.table} key={element.id}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Question</Text>
              <Text style={styles.tableCell}>Answer</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Date:</Text>
              <Text style={styles.tableCell}>{element.date}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Office Visits:</Text>
              <Text style={styles.tableCell}>{element.totalOfficeVisits}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Calls:</Text>
              <Text style={styles.tableCell}>{element.totalCalls}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Number of People:</Text>
              <Text style={styles.tableCell}>{element.numberOfPeople}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Unduplicated Calls:</Text>
              <Text style={styles.tableCell}>{element.totalUnduplicatedCalls}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Visits HB Donations Room:</Text>
              <Text style={styles.tableCell}>{element.totalVisitsHbDonationsRoom}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Served HB Donations Room:</Text>
              <Text style={styles.tableCell}>{element.totalServedHbDonationsRoom}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Visits HB Pantry:</Text>
              <Text style={styles.tableCell}>{element.totalVisitsHbPantry}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Served HB Pantry:</Text>
              <Text style={styles.tableCell}>{element.totalServedHbPantry}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Visits Placentia Pantry:</Text>
              <Text style={styles.tableCell}>{element.totalVisitsPlacentiaPantry}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Served Placentia Pantry:</Text>
              <Text style={styles.tableCell}>{element.totalServedPlacentiaPantry}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Visits Placentia Neighborhood:</Text>
              <Text style={styles.tableCell}>{element.totalVisitsPlacentiaNeighborhood}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Served Placentia Neighborhood:</Text>
              <Text style={styles.tableCell}>{element.totalServedPlacentiaNeighborhood}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
