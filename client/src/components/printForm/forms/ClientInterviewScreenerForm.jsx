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

export default function ClientInterviewScreenerForm({ clientInterviewScreenerData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {clientInterviewScreenerData && clientInterviewScreenerData.map((element) => (
          <View style={styles.table} key={element.id}>
            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>Client Interview Screener</Text>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Question</Text><Text style={styles.tableCell}>Answer</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>ID:</Text><Text style={styles.tableCell}>{element.date}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Initial Interview ID:</Text><Text style={styles.tableCell}>{element.initialInterviewId}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Case Manager ID:</Text><Text style={styles.tableCell}>{element.cmId}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Willingness:</Text><Text style={styles.tableCell}>{element.willingness}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Employability:</Text><Text style={styles.tableCell}>{element.employability}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Attitude:</Text><Text style={styles.tableCell}>{element.attitude}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Length of Sobriety:</Text><Text style={styles.tableCell}>{element.lengthOfSobriety}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Completed Tx:</Text><Text style={styles.tableCell}>{element.completedTx}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Drug Test Results:</Text><Text style={styles.tableCell}>{element.drugTestResults}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Homeless Episode One:</Text><Text style={styles.tableCell}>{element.homelessEpisodeOne}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Homeless Episode Two:</Text><Text style={styles.tableCell}>{element.homelessEpisodeTwo}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Homeless Episode Three:</Text><Text style={styles.tableCell}>{element.homelessEpisodeThree}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Homeless Episode Four:</Text><Text style={styles.tableCell}>{element.homelessEpisodeFour}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Disabling Condition:</Text><Text style={styles.tableCell}>{element.disablingConditoin}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Employed:</Text><Text style={styles.tableCell}>{element.employed}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Driver License:</Text><Text style={styles.tableCell}>{element.driverLicense}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Number of Children:</Text><Text style={styles.tableCell}>{element.numOfChildren}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Children in Custody:</Text><Text style={styles.tableCell}>{element.childrenInCustody}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Last City Permanent Residence:</Text><Text style={styles.tableCell}>{element.lastCityPermResidence}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Decision:</Text><Text style={styles.tableCell}>{element.decision}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Additional Comments:</Text><Text style={styles.tableCell}>{element.additionalComments}</Text></View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
