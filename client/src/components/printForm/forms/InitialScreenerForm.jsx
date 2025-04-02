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

export default function InitialScreenerForm({ clientInitialScreeningData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {clientInitialScreeningData && clientInitialScreeningData.map((element) => (
          <View style={styles.table} key={element.id}>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Question</Text><Text style={styles.tableCell}>Answer</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Date:</Text><Text style={styles.tableCell}>{element.date}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Name:</Text><Text style={styles.tableCell}>{element.name}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Age:</Text><Text style={styles.tableCell}>{element.age}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Applicant Type:</Text><Text style={styles.tableCell}>{element.applicantType}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Phone Number:</Text><Text style={styles.tableCell}>{element.phoneNumber}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Marital Status:</Text><Text style={styles.tableCell}>{element.maritalStatus}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Date of Birth:</Text><Text style={styles.tableCell}>{element.dateOfBirth}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Email:</Text><Text style={styles.tableCell}>{element.email}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Last 4 digits of SSN:</Text><Text style={styles.tableCell}>{element.ssnLastFour}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Ethnicity:</Text><Text style={styles.tableCell}>{element.ethnicity}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Veteran?:</Text><Text style={styles.tableCell}>{element.veteran ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Disabled?:</Text><Text style={styles.tableCell}>{element.disabled ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Current Address:</Text><Text style={styles.tableCell}>{element.currentAddress}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Last Permanent Address:</Text><Text style={styles.tableCell}>{element.lastPermAddress}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Reason for Leaving Permanent Address:</Text><Text style={styles.tableCell}>{element.reasonForLeavingPermAddress}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Where Resided Last Night:</Text><Text style={styles.tableCell}>{element.whereResideLastNight}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Currently Homeless?:</Text><Text style={styles.tableCell}>{element.currentlyHomeless ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>How Long Experiencing Homelessness:</Text><Text style={styles.tableCell}>{element.howLongExperiencingHomelessness}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Previously Applied to CCH?:</Text><Text style={styles.tableCell}>{element.prevAppliedToCch ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>When Applied to CCH:</Text><Text style={styles.tableCell}>{element.whenPrevAppliedToCch}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Previously in CCH?:</Text><Text style={styles.tableCell}>{element.prevInCch ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Client ID:</Text><Text style={styles.tableCell}>{element.clientId}</Text></View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
