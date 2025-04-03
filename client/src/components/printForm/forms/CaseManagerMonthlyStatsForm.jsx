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

export default function CaseManagerMonthlyStatsForm({ caseManagerMonthlyStatsData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
      {caseManagerMonthlyStatsData && caseManagerMonthlyStatsData.map((element) => (
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
              <Text style={styles.tableCellHeader}>Case Manager ID:</Text>
              <Text style={styles.tableCell}>{element.cmId}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Total Number of Contacts:</Text>
              <Text style={styles.tableCell}>{element.totalNumberOfContacts}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Women Birthdays:</Text>
              <Text style={styles.tableCell}>{element.womenBirthdays}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Kid Birthdays:</Text>
              <Text style={styles.tableCell}>{element.kidBirthdays}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Birthday Cards:</Text>
              <Text style={styles.tableCell}>{element.birthdayCards}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Birthday Cards Value:</Text>
              <Text style={styles.tableCell}>${element.birthdayCardsValue}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Food Cards:</Text>
              <Text style={styles.tableCell}>{element.foodCards}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Food Cards Value:</Text>
              <Text style={styles.tableCell}>${element.foodCardsValue}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Bus Passes:</Text>
              <Text style={styles.tableCell}>{element.busPasses}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Bus Passes Value:</Text>
              <Text style={styles.tableCell}>${element.busPassesValue}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Gas Cards:</Text>
              <Text style={styles.tableCell}>{element.gasCards}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Gas Cards Value:</Text>
              <Text style={styles.tableCell}>${element.gasCardsValue}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Women Healthcare Referrals:</Text>
              <Text style={styles.tableCell}>{element.womenHealthcareReferrals}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Kid Healthcare Referrals:</Text>
              <Text style={styles.tableCell}>{element.kidHealthcareReferrals}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Women Counseling Referrals:</Text>
              <Text style={styles.tableCell}>{element.womenCounselingReferrals}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Kid Counseling Referrals:</Text>
              <Text style={styles.tableCell}>{element.kidCounselingReferrals}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Babies Born:</Text>
              <Text style={styles.tableCell}>{element.babiesBorn}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Women Degrees Earned:</Text>
              <Text style={styles.tableCell}>{element.womenDegreesEarned}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Women Enrolled in School:</Text>
              <Text style={styles.tableCell}>{element.womenEnrolledInSchool}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Women Licenses Earned:</Text>
              <Text style={styles.tableCell}>{element.womenLicensesEarned}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Reunifications:</Text>
              <Text style={styles.tableCell}>{element.reunifications}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Number of Interviews Conducted:</Text>
              <Text style={styles.tableCell}>{element.numberOfInterviewsConducted}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Number of Positive Tests:</Text>
              <Text style={styles.tableCell}>{element.numberOfPositiveTests}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Number of NCNS:</Text>
              <Text style={styles.tableCell}>{element.numberOfNcns}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Number of Others:</Text>
              <Text style={styles.tableCell}>{element.numberOfOthers}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Number of Interviews Accepted:</Text>
              <Text style={styles.tableCell}>{element.numberOfInterviewsAccpeted}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
