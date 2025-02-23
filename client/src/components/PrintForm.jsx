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

export default function PrintForm({ formType, formId }) {

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
        }
    }
    printForm();
    })

    return (
        <>
            <PDFDownloadLink document={formData.current} fileName='form.pdf'>
                Export Form
            </PDFDownloadLink>
        </>
        
    )
}