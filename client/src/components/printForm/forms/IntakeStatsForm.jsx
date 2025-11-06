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
            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>Intake Stats Form</Text>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Question</Text><Text style={styles.tableCell}>Answer</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Age:</Text><Text style={styles.tableCell}>{element.age}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Assigned Case Manager:</Text><Text style={styles.tableCell}>{element.assignedCaseManager}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Attending School Upon Entry:</Text><Text style={styles.tableCell}>{element.attendingSchoolUponEntry ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Been in Shelter Last 5 Years:</Text><Text style={styles.tableCell}>{element.beenInShelterLast_5Years ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Birthday:</Text><Text style={styles.tableCell}>{element.birthday}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Cal Optima Funded Site:</Text><Text style={styles.tableCell}>{element.calOptimaFundedSite ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Case Manager:</Text><Text style={styles.tableCell}>{element.caseManager}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Chronically Homeless:</Text><Text style={styles.tableCell}>{element.chronicallyHomeless ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>City Last Permanent Address:</Text><Text style={styles.tableCell}>{element.cityLastPermanentAddress}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Client Grant:</Text><Text style={styles.tableCell}>{element.clientGrant}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Case Manager ID:</Text><Text style={styles.tableCell}>{element.cmId}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Convicted Crime:</Text><Text style={styles.tableCell}>{element.convictedCrime ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Currently Employed:</Text><Text style={styles.tableCell}>{element.currentlyEmployed ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Date:</Text><Text style={styles.tableCell}>{element.date}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Date Last Employment:</Text><Text style={styles.tableCell}>{element.dateLastEmployment}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Diagnosed Mental Health:</Text><Text style={styles.tableCell}>{element.diagnosedMentalHealth ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Disabling Condition Form:</Text><Text style={styles.tableCell}>{element.disablingConditionForm ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Duration Homeless:</Text><Text style={styles.tableCell}>{element.durationHomeless}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Email:</Text><Text style={styles.tableCell}>{element.email}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Emergency Contact:</Text><Text style={styles.tableCell}>{element.emergencyContactName}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Emergency Contact Phone Number:</Text><Text style={styles.tableCell}>{element.emergencyContactPhoneNumber}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Employed Upon Entry:</Text><Text style={styles.tableCell}>{element.employedUponEntry ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Entry Date:</Text><Text style={styles.tableCell}>{element.entryDate}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Ethnicity:</Text><Text style={styles.tableCell}>{element.ethnicity}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Family Size:</Text><Text style={styles.tableCell}>{element.familySize}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Name:</Text><Text style={styles.tableCell}>{`${element.firstName} ${element.lastName}`}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>High Risk:</Text><Text style={styles.tableCell}>{element.highRisk ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>History Domestic Violence:</Text><Text style={styles.tableCell}>{element.historyDomesticViolence ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>History Substance Abuse:</Text><Text style={styles.tableCell}>{element.historySubstanceAbuse ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Last City Homeless:</Text><Text style={styles.tableCell}>{element.lastCityHomeless}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Last City Resided:</Text><Text style={styles.tableCell}>{element.lastCityResided}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Month:</Text><Text style={styles.tableCell}>{element.month}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Number of Children:</Text><Text style={styles.tableCell}>{element.numberOfChildren}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Number of Children with Disability:</Text><Text style={styles.tableCell}>{element.numberOfChildrenWithDisability}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Number of Shelters Last 5 Years:</Text><Text style={styles.tableCell}>{element.numberOfSheltersLast_5Years}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Phone Number:</Text><Text style={styles.tableCell}>{element.phoneNumber}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Pregnant:</Text><Text style={styles.tableCell}>{element.pregnant ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Prior Living Situation:</Text><Text style={styles.tableCell}>{element.priorLivingSituation}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Race:</Text><Text style={styles.tableCell}>{element.race}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Signed Photo Release:</Text><Text style={styles.tableCell}>{element.signedPhotoRelease ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Site:</Text><Text style={styles.tableCell}>{element.site}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Support Childcare:</Text><Text style={styles.tableCell}>{element.supportChildcare ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Support Food:</Text><Text style={styles.tableCell}>{element.supportFood ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Support Housing:</Text><Text style={styles.tableCell}>{element.supportHousing ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Support System:</Text><Text style={styles.tableCell}>{element.supportSystem ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Transportation:</Text><Text style={styles.tableCell}>{element.transportation ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Undiagnosed Mental Health:</Text><Text style={styles.tableCell}>{element.undiagnosedMentalHealth ? "Yes" : "No"}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Unique ID:</Text><Text style={styles.tableCell}>{element.uniqueId}</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCellHeader}>Where Client Slept Last Night:</Text><Text style={styles.tableCell}>{element.whereClientSleptLastNight}</Text></View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
