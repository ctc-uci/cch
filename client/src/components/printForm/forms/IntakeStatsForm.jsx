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

export default function IntakeStatsForm({ intakeStatsData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {intakeStatsData && intakeStatsData.map((element) => (
          <View style={styles.table} key={element.id}>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Question</Text><Text style={styles.tableCell}>Answer</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Title</Text><Text style={styles.tableCell}>{element.ssnLastFour}</Text></View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
