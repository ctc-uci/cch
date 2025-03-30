import { useEffect, useRef, useState } from "react";
import { useBackendContext } from "../contexts/hooks/useBackendContext";

import { Document, Page, Text, View, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer'

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



const SuccessStoryForm = ({ successStoryData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                    {successStoryData && successStoryData.map((element) => (
                    <View style={styles.table}>
                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Question</Text>
                            <Text style={styles.tableCell}>Answer</Text>
                        </View>
                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Client Name:</Text>
                            <Text style={styles.tableCell}>{element.name}</Text>
                        </View>
                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Case Manager: </Text>
                            <Text style={styles.tableCell}>{element.cmId}</Text>
                        </View>
                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Site: </Text>
                            <Text style={styles.tableCell}>{element.site}</Text>
                        </View>

                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Date: </Text>
                            <Text style={styles.tableCell}>{element.date}</Text>
                        </View>

                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Please tell us your situation before entering Colette’s Children’s Home. Please give as many details as you are comfortable with about your story, how long you were homeless, what led to homelessness, etc. We want to help people understand what being homeless is like.: </Text>
                            <Text style={styles.tableCell}>{element.previousSituation}</Text>
                        </View>

                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Tell us about your time in CCH and how CCH was part of the solution to your situation and the impact it had on you and and/or your children. What was most helpful, what you learned, etc. : </Text>
                            <Text style={styles.tableCell}>{element.cchImpact}</Text>
                        </View>

                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Tell us where you are now. If you are graduating where are you moving, are you working, how are your children doing, etc. Tell us a finish to your story.: </Text>
                            <Text style={styles.tableCell}>{element.whereNow}</Text>
                        </View>

                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>If you had the opportunity to tell one of our donors what it meant to you to be at CCH or how important it is to provide our services to other women, what would you say?: </Text>
                            <Text style={styles.tableCell}>{element.tellDonors}</Text>
                        </View>

                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Please give a 1 to 2 sentence quote of what the CCH experience meant to you?: </Text>
                            <Text style={styles.tableCell}>{element.quote}</Text>
                        </View>

                        <View key={element.id} style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Consent: </Text>
                            <Text style={styles.tableCell}>{String(element.consent)}</Text>
                        </View>
                    </View>


                    ))}
            </Page>
        </Document>
    );
};

const RandomSurveyForm = ({ randomSurveyData }) => {
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
                        <Text style={styles.tableCellHeader}>Please rate the quality of the service in the CCH program:</Text>
                        <Text style={styles.tableCell}>{element.cchQos}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Please rate the quality of the service you received from your case manager:</Text>
                        <Text style={styles.tableCell}>{element.cmQos}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Is your case manager courteous?</Text>
                        <Text style={styles.tableCell}>{element.courteous}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Is your case manager informative?</Text>
                        <Text style={styles.tableCell}>{element.informative}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Is your case manager prompt and helpful?</Text>
                        <Text style={styles.tableCell}>{element.promptAndHelpful}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Please rate the quality of your entrance into the CCH program:</Text>
                        <Text style={styles.tableCell}>{element.entryQuality}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Please rate the quality of your unit:</Text>
                        <Text style={styles.tableCell}>{element.unitQuality}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Is the SITE clean:</Text>
                        <Text style={styles.tableCell}>{element.clean}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Please rate your overall experience at CCH:</Text>
                        <Text style={styles.tableCell}>{element.overallExperience}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>How frequently do you have case meetings?</Text>
                        <Text style={styles.tableCell}>{element.caseMeetingFrequency}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Were the Lifeskills classes beneficial to you?</Text>
                        <Text style={styles.tableCell}>{element.lifeskills}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Would you recommend CCH to a friend?</Text>
                        <Text style={styles.tableCell}>{element.recommend}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Why or why not?</Text>
                        <Text style={styles.tableCell}>{element.recommendReasoning}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>If you entered our program because of a referral, how might we have made CCH more helpful?</Text>
                        <Text style={styles.tableCell}>{element.makeCchMoreHelpful}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Who is your case manager?</Text>
                        <Text style={styles.tableCell}>{element.cmId}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What feedback would you like your case manager to know?</Text>
                        <Text style={styles.tableCell}>{element.cmFeedback}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Please share any additional comments or suggestions.</Text>
                        <Text style={styles.tableCell}>{element.otherComments}</Text>
                    </View>
                </View>
                ))}
            </Page>
        </Document>
    )
}

//I just have to use snake case here, the routes in exitSurvey.ts don't have the keysToCamel thing so i think its that, but i can't really change it cause other code is already working around it
const ExitSurvey = ({ exitSurveyData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {exitSurveyData && exitSurveyData.map((element) => (
                <View style={styles.table} key={element.id}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Question</Text>
                        <Text style={styles.tableCell}>Answer</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Name:</Text>
                        <Text style={styles.tableCell}>{element.name}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Case Manager:</Text>
                        <Text style={styles.tableCell}>{element.cm_id}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Site:</Text>
                        <Text style={styles.tableCell}>{element.site}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Program Data Completion:</Text>
                        <Text style={styles.tableCell}>{element.program_date_completion}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>CCH Rating?</Text>
                        <Text style={styles.tableCell}>{element.cch_rating}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What did you like most about Colette’s Children’s Home?</Text>
                        <Text style={styles.tableCell}>{element.cch_like_most}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What would make Colette’s Children’s Home better?</Text>
                        <Text style={styles.tableCell}>{element.cch_could_be_improved}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>How helpful were the Life Skills Meetings?</Text>
                        <Text style={styles.tableCell}>{element.life_skills_rating}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What topics were the most helpful for you?</Text>
                        <Text style={styles.tableCell}>{element.life_skills_helpful_topics}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What topics would you like CCH to offer in the future?</Text>
                        <Text style={styles.tableCell}>{element.life_skills_offer_topics_in_the_future}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>How helpful was case management?</Text>
                        <Text style={styles.tableCell}>{element.cm_rating}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What would you change about case management?</Text>
                        <Text style={styles.tableCell}>{element.cm_change_about}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What was the most beneficial part of case management?</Text>
                        <Text style={styles.tableCell}>{element.cm_most_beneficial}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>How do you think that your experience at CCH will change your future?</Text>
                        <Text style={styles.tableCell}>{element.experience_takeaway}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What have you learned/accomplished during your stay?</Text>
                        <Text style={styles.tableCell}>{element.experience_accomplished}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>What else would you like us to know?</Text>
                        <Text style={styles.tableCell}>{element.experience_extraNotes}</Text>
                    </View>
                </View>
                ))}
            </Page>
        </Document>
    )
}

const clientInterviewScreenerForm = ({ clientInterviewScreenerData }) => {
    return (

        <Document>
            <Page size="A4" style={styles.page}>
                {clientInterviewScreenerData && clientInterviewScreenerData.map((element) => (
                <View style={styles.table} key={element.id}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Question</Text>
                        <Text style={styles.tableCell}>Answer</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>ID:</Text>
                        <Text style={styles.tableCell}>{element.date}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Initial Interview ID:</Text>
                        <Text style={styles.tableCell}>{element.initialInterviewId}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Case Manager ID:</Text>
                        <Text style={styles.tableCell}>{element.cmId}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Willingness:</Text>
                        <Text style={styles.tableCell}>{element.willingness}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Employability:</Text>
                        <Text style={styles.tableCell}>{element.employability}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Attitude:</Text>
                        <Text style={styles.tableCell}>{element.attitude}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Length of Sobriety:</Text>
                        <Text style={styles.tableCell}>{element.lengthOfSobriety}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Completed Tx:</Text>
                        <Text style={styles.tableCell}>{element.completedTx}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Drug Test Results:</Text>
                        <Text style={styles.tableCell}>{element.drugTestResults}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Homeless Episode One:</Text>
                        <Text style={styles.tableCell}>{element.homelessEpisodeOne}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Homeless Episode Two:</Text>
                        <Text style={styles.tableCell}>{element.homelessEpisodeTwo}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Homeless Episode Three:</Text>
                        <Text style={styles.tableCell}>{element.homelessEpisodeThree}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Homeless Episode Four:</Text>
                        <Text style={styles.tableCell}>{element.homelessEpisodeFour}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Disabling Condition:</Text>
                        <Text style={styles.tableCell}>{element.disablingConditoin}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Employed:</Text>
                        <Text style={styles.tableCell}>{element.employed}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Driver License:</Text>
                        <Text style={styles.tableCell}>{element.driverLicense}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Number of Children:</Text>
                        <Text style={styles.tableCell}>{element.numOfChildren}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Children in Custody:</Text>
                        <Text style={styles.tableCell}>{element.childrenInCustody}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Last City Permanent Residence:</Text>
                        <Text style={styles.tableCell}>{element.lastCityPermResidence}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Decision:</Text>
                        <Text style={styles.tableCell}>{element.decision}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellHeader}>Additional Comments:</Text>
                        <Text style={styles.tableCell}>{element.additionalComments}</Text>
                    </View>
                </View>
                ))}
            </Page>
        </Document>
    )
}

const InitialScreenerForm = ({ clientInitialScreeningData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
            {clientInitialScreeningData && clientInitialScreeningData.map((element) => (
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
                    <Text style={styles.tableCellHeader}>Name:</Text>
                    <Text style={styles.tableCell}>{element.name}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Age:</Text>
                    <Text style={styles.tableCell}>{element.age}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Applicant Type:</Text>
                    <Text style={styles.tableCell}>{element.applicantType}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Phone Number:</Text>
                    <Text style={styles.tableCell}>{element.phoneNumber}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Marital Status:</Text>
                    <Text style={styles.tableCell}>{element.maritalStatus}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Date of Birth:</Text>
                    <Text style={styles.tableCell}>{element.dateOfBirth}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Email:</Text>
                    <Text style={styles.tableCell}>{element.email}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Last 4 digits of SSN:</Text>
                    <Text style={styles.tableCell}>{element.ssnLastFour}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Ethnicity:</Text>
                    <Text style={styles.tableCell}>{element.ethnicity}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Veteran?:</Text>
                    <Text style={styles.tableCell}>{element.veteran ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Disabled?:</Text>
                    <Text style={styles.tableCell}>{element.disabled ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Current Address:</Text>
                    <Text style={styles.tableCell}>{element.currentAddress}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Last Permanent Address:</Text>
                    <Text style={styles.tableCell}>{element.lastPermAddress}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Reason for Leaving Permanent Address:</Text>
                    <Text style={styles.tableCell}>{element.reasonForLeavingPermAddress}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Where Resided Last Night:</Text>
                    <Text style={styles.tableCell}>{element.whereResideLastNight}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Currently Homeless?:</Text>
                    <Text style={styles.tableCell}>{element.currentlyHomeless ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>How Long Experiencing Homelessness:</Text>
                    <Text style={styles.tableCell}>{element.howLongExperiencingHomelessness}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Previously Applied to CCH?:</Text>
                    <Text style={styles.tableCell}>{element.prevAppliedToCch ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>When Applied to CCH:</Text>
                    <Text style={styles.tableCell}>{element.whenPrevAppliedToCch}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Previously in CCH?:</Text>
                    <Text style={styles.tableCell}>{element.prevInCch ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Child's Name:</Text>
                    <Text style={styles.tableCell}>{element.childName}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Child's Date of Birth:</Text>
                    <Text style={styles.tableCell}>{element.childDob}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Has Custody of Child?</Text>
                    <Text style={styles.tableCell}>{element.custodyOfChild ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Father's Name:</Text>
                    <Text style={styles.tableCell}>{element.fatherName}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Name of School Child Attends:</Text>
                    <Text style={styles.tableCell}>{element.nameSchoolChildrenAttend}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>City of School:</Text>
                    <Text style={styles.tableCell}>{element.cityOfSchool}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>How Heard About CCH?</Text>
                    <Text style={styles.tableCell}>{element.howHearAboutCch}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Programs Been In Before:</Text>
                    <Text style={styles.tableCell}>{element.programsBeenInBefore}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Monthly Income:</Text>
                    <Text style={styles.tableCell}>${element.monthlyIncome}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Sources of Income:</Text>
                    <Text style={styles.tableCell}>{element.sourcesOfIncome}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Monthly Bills:</Text>
                    <Text style={styles.tableCell}>{element.monthlyBills}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Currently Employed:</Text>
                    <Text style={styles.tableCell}>{element.currentlyEmployed ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Last Employer:</Text>
                    <Text style={styles.tableCell}>{element.lastEmployer}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Last Employed Date:</Text>
                    <Text style={styles.tableCell}>{element.lastEmployedDate}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Education History:</Text>
                    <Text style={styles.tableCell}>{element.educationHistory}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Transportation:</Text>
                    <Text style={styles.tableCell}>{element.transportation}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Legal Resident:</Text>
                    <Text style={styles.tableCell}>{element.legalResident ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Medical Coverage:</Text>
                    <Text style={styles.tableCell}>{element.medical ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Medical City:</Text>
                    <Text style={styles.tableCell}>{element.medicalCity}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Medical Insurance:</Text>
                    <Text style={styles.tableCell}>{element.medicalInsurance}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Medications:</Text>
                    <Text style={styles.tableCell}>{element.medications}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Domestic Violence History:</Text>
                    <Text style={styles.tableCell}>{element.domesticViolenceHistory}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Social Worker:</Text>
                    <Text style={styles.tableCell}>{element.socialWorker}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Social Worker Telephone:</Text>
                    <Text style={styles.tableCell}>{element.socialWorkerTelephone}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Social Worker Office Location:</Text>
                    <Text style={styles.tableCell}>{element.socialWorkerOfficeLocation}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Length of Sobriety:</Text>
                    <Text style={styles.tableCell}>{element.lengthOfSobriety}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Last Drug Use:</Text>
                    <Text style={styles.tableCell}>{element.lastDrugUse}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Last Alcohol Use:</Text>
                    <Text style={styles.tableCell}>{element.lastAlcoholUse}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Time Using Drugs/Alcohol:</Text>
                    <Text style={styles.tableCell}>{element.timeUsingDrugsAlcohol}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Been Convicted:</Text>
                    <Text style={styles.tableCell}>{element.beenConvicted ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Conviction Reason and Time:</Text>
                    <Text style={styles.tableCell}>{element.convictedReasonAndTime}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Present Warrant Exist:</Text>
                    <Text style={styles.tableCell}>{element.presentWarrantExist ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Warrant County:</Text>
                    <Text style={styles.tableCell}>{element.warrantCounty}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Probation/Parole Officer:</Text>
                    <Text style={styles.tableCell}>{element.probationParoleOfficer}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Probation/Parole Officer Telephone:</Text>
                    <Text style={styles.tableCell}>{element.probationParoleOfficerTelephone}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Personal References:</Text>
                    <Text style={styles.tableCell}>{element.personalReferences}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Personal Reference Telephone:</Text>
                    <Text style={styles.tableCell}>{element.personalReferenceTelephone}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Future Plans and Goals:</Text>
                    <Text style={styles.tableCell}>{element.futurePlansGoals}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Last Permanent Residence Household Composition:</Text>
                    <Text style={styles.tableCell}>{element.lastPermanentResidenceHouseholdComposition}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Why No Longer at Last Residence:</Text>
                    <Text style={styles.tableCell}>{element.whyNoLongerAtLastResidence}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>What Could Prevent Homelessness:</Text>
                    <Text style={styles.tableCell}>{element.whatCouldPreventHomeless}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Client ID:</Text>
                    <Text style={styles.tableCell}>{element.clientId}</Text>
                </View>
            </View>
            ))}
            </Page>
        </Document>

    )
}

const IntakeStatsForm = ({ intakeStatsData }) => {
  return (
    <Document>
    <Page size="A4" style={styles.page}>
    {intakeStatsData && intakeStatsData.map((element) => (
    <View style={styles.table} key={element.id}>
        <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Question</Text>
            <Text style={styles.tableCell}>Answer</Text>
        </View>
        <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Title</Text>
                    <Text style={styles.tableCell}>{element.ssnLastFour}</Text>
                </View>
    </View>
    ))}
    </Page>
</Document>

  )
}

const FrontDeskMonthlyStatsForm = ({ frontDeskMonthlyStatsData }) => {
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


const CaseManagerMonthlyStatsForm = ({ caseManagerMonthlyStatsData }) => {
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





export default function PrintForm({ formType, formId }) {
    // console.log(formType, formId);

    const { backend } = useBackendContext();
    const formData = useRef(<Document><Page></Page></Document>);
    const [formDataTest, setFormDataTest] = useState(null);

    useEffect(() => {
      async function printForm() {
        if (formType === 'Success Story') {

            try {
                const response = await backend.get(`/successStory/${formId}`);
                const data = response.data;
                formData.current = <SuccessStoryForm successStoryData={data} />
                setFormDataTest(data)
            } catch (e) {
                console.log(`Success story response was not created: ${e.message}`)
            }

        }
        else if (formType === 'Random Survey') {
            try {
                const response = await backend.get(`/randomSurvey/${formId}`);
                const data = [response.data];
                formData.current = <RandomSurveyForm randomSurveyData={data} />
                setFormDataTest(data)
            } catch (e) {
                console.log(`Random survey response was not created: ${e.message}`)
            }

        } else if (formType === 'Exit Survey') {
            try {
                const response = await backend.get(`/exitSurvey/${formId}`);
                const data = response.data;
                //I have no idea why I have to access this data like this
                formData.current = <ExitSurvey exitSurveyData={data["data"]} />
                setFormDataTest(data) //I feel like this should do nothing but when i delete this line the print function breaks
            } catch (e) {
                console.log(`Exit Survey response was not created: ${e.message}`,)
            }
        //formsTable currently doesnt show client interview screener forms
        } else if (formType === 'Client Interview Screener') {
            try {
                const response = await backend.get(`/screenerComment/${formId}`);
                const data = response.data;

                formData.current = <clientInterviewScreenerForm clientInterviewScreenerData={data} />
                setFormDataTest(data)
            } catch (e) {
                console.log(`Client Interview Screener response was not created: ${e.message}`,)
            }
        } else if (formType === 'Initial Screeners') {
            try {
                const response = await backend.get(`/initialInterview/id/${formId}`);
                const data = response.data;
                // console.log(data);
                formData.current = <InitialScreenerForm clientInitialScreeningData={data} />
                setFormDataTest(data);
            } catch (e) {
                console.log(`Initial Screener response was not created: ${e.message}`,);
            }
        } else if (formType === 'Client Tracking Statistics (Intake Statistics') {
          try {
            const response = await backend.get(`/intakeStatsForm/${formId}`);
            const data = [response.data];
            formData.current = <IntakeStatsForm intakeStatsData={data} />
            setFormDataTest(data);
          } catch (e) {
            console.log(`Client Tracking Statistics (Intake Statistics) response was not created: ${e.message}`);
          }
        } else if (formType === 'Front Desk Monthly Statistics') {
          try {
            const response = await backend.get(`/frontDesk/${formId}`);
            const data = [response.data];
            // console.log(data);
            // console.log('front desk', data);
            formData.current = <FrontDeskMonthlyStatsForm frontDeskMonthlyStatsData={data[0]}  />
            setFormDataTest(data);
          } catch (e) {
            console.log(`Front Desk Monthly Statistics response was not created: ${e.message}`);
          }
        } else if (formType === 'Case Manager Monthly Statistics') {
          try {
            const response = await backend.get(`/caseManagerMonthlyStats/id/${formId}`);
            const data = [response.data];
            formData.current = <CaseManagerMonthlyStatsForm caseManagerMonthlyStatsData={data[0]} />
            // console.log("monthly stats", data);
            setFormDataTest(data);
          } catch (e) {
            console.log(`Client Tracking Statistics (Intake Statistics) response was not created: ${e.message}`);
          }
        }
    // console.log(formType);

    }
    printForm();
  }, [formType, formId, backend])


    return (
        <>
            <PDFDownloadLink document={formData.current} fileName='form.pdf'>
                Export Form
            </PDFDownloadLink>
        </>

    )
}
