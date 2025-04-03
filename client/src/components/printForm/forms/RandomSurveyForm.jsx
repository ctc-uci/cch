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

export default function RandomSurveyForm({ randomSurveyData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {randomSurveyData && randomSurveyData.map((element) => (
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
              <Text style={styles.tableCellHeader}>Rate CCH Program:</Text>
              <Text style={styles.tableCell}>{element.cchQos}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Rate Case Manager:</Text>
              <Text style={styles.tableCell}>{element.cmQos}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Courteous:</Text>
              <Text style={styles.tableCell}>{element.courteous}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Informative:</Text>
              <Text style={styles.tableCell}>{element.informative}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Prompt and Helpful:</Text>
              <Text style={styles.tableCell}>{element.promptAndHelpful}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Entry Quality:</Text>
              <Text style={styles.tableCell}>{element.entryQuality}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Unit Quality:</Text>
              <Text style={styles.tableCell}>{element.unitQuality}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Clean Site:</Text>
              <Text style={styles.tableCell}>{element.clean}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Overall Experience:</Text>
              <Text style={styles.tableCell}>{element.overallExperience}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Meeting Frequency:</Text>
              <Text style={styles.tableCell}>{element.caseMeetingFrequency}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Lifeskills:</Text>
              <Text style={styles.tableCell}>{element.lifeskills}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Recommend CCH:</Text>
              <Text style={styles.tableCell}>{element.recommend}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Reasoning:</Text>
              <Text style={styles.tableCell}>{element.recommendReasoning}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Improvement:</Text>
              <Text style={styles.tableCell}>{element.makeCchMoreHelpful}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Case Manager ID:</Text>
              <Text style={styles.tableCell}>{element.cmId}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Feedback for CM:</Text>
              <Text style={styles.tableCell}>{element.cmFeedback}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Other Comments:</Text>
              <Text style={styles.tableCell}>{element.otherComments}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
