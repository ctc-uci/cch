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
    borderBottom: '1px solid #000',
    borderBottomColor: '#E2E8F0',
  },
  tableCellHeader: {
    width: '50%',
    padding: 8,
    fontWeight: 'bold',
  },
  tableCell: {
    width: '50%',
    padding: 8,
    backgroundColor: "#EDF2F7",
  },
});

export default function SuccessStoryForm({ successStoryData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {successStoryData && successStoryData.map((element) => (
          <View style={styles.table} key={element.id}>
            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>Success Story</Text>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Question</Text>
              <Text style={styles.tableCell}>Answer</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Client Name:</Text>
              <Text style={styles.tableCell}>{element.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Case Manager:</Text>
              <Text style={styles.tableCell}>{element.cmId}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Site:</Text>
              <Text style={styles.tableCell}>{element.site}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Date:</Text>
              <Text style={styles.tableCell}>{element.date}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Situation Before CCH:</Text>
              <Text style={styles.tableCell}>{element.previousSituation}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Impact of CCH:</Text>
              <Text style={styles.tableCell}>{element.cchImpact}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Current Situation:</Text>
              <Text style={styles.tableCell}>{element.whereNow}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Message to Donors:</Text>
              <Text style={styles.tableCell}>{element.tellDonors}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Quote:</Text>
              <Text style={styles.tableCell}>{element.quote}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Consent:</Text>
              <Text style={styles.tableCell}>{String(element.consent)}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
