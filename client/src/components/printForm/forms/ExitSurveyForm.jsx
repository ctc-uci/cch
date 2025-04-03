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

export default function ExitSurvey({ exitSurveyData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {exitSurveyData && exitSurveyData.map((element) => (
          <View style={styles.table} key={element.id}>
            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>Exit Survey</Text>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Question</Text>
              <Text style={styles.tableCell}>Answer</Text>
            </View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Name:</Text><Text style={styles.tableCell}>{element.name}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Case Manager:</Text><Text style={styles.tableCell}>{element.cm_id}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Site:</Text><Text style={styles.tableCell}>{element.site}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Program Date Completion:</Text><Text style={styles.tableCell}>{element.program_date_completion}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>CCH Rating:</Text><Text style={styles.tableCell}>{element.cch_rating}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Liked Most:</Text><Text style={styles.tableCell}>{element.cch_like_most}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Improvements:</Text><Text style={styles.tableCell}>{element.cch_could_be_improved}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Life Skills Rating:</Text><Text style={styles.tableCell}>{element.life_skills_rating}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Helpful Topics:</Text><Text style={styles.tableCell}>{element.life_skills_helpful_topics}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Future Topics:</Text><Text style={styles.tableCell}>{element.life_skills_offer_topics_in_the_future}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>CM Rating:</Text><Text style={styles.tableCell}>{element.cm_rating}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Change About CM:</Text><Text style={styles.tableCell}>{element.cm_change_about}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>CM Most Beneficial:</Text><Text style={styles.tableCell}>{element.cm_most_beneficial}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Experience Takeaway:</Text><Text style={styles.tableCell}>{element.experience_takeaway}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Experience Accomplished:</Text><Text style={styles.tableCell}>{element.experience_accomplished}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Additional Notes:</Text><Text style={styles.tableCell}>{element.experience_extraNotes}</Text></View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
