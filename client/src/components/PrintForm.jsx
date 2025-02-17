import { Button, HStack } from "@chakra-ui/react"
import { useEffect, useRef } from "react";
import { useBackendContext } from "../contexts/hooks/useBackendContext";



import { Document, Page, Text, View, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: { backgroundColor: 'tomato' },
    section: { color: 'white', textAlign: 'center', margin: 30 }
  });
  

const SuccessStoryForm = ({ successStoryData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {successStoryData && successStoryData.map((element) => (
                <View key={element.id}>
                    <Text>Client Name: {element.name}</Text>
                    <Text>Case Manager: {element.cmId}</Text>
                    <Text>Site: {'NO SITE DATA'}</Text>
                    <Text>Date: {element.date}</Text>
                    <Text>Please tell us your situation before entering Colette’s Children’s Home. Please give as many details as you are comfortable with about your story, how long you were homeless, what led to homelessness, etc. We want to help people understand what being homeless is like.: {element.previousSituation}</Text>
                    <Text>Tell us about your time in CCH and how CCH was part of the solution to your situation and the impact it had on you and and/or your children. What was most helpful, what you learned, etc. : {element.cchImpact}</Text>
                    <Text>Tell us where you are now. If you are graduating where are you moving, are you working, how are your children doing, etc. Tell us a finish to your story.: {element.whereNow}</Text>
                    <Text>If you had the opportunity to tell one of our donors what it meant to you to be at CCH or how important it is to provide our services to other women, what would you say?: {element.tellDonors}</Text>
                    <Text>Please give a 1 to 2 sentence quote of what the CCH experience meant to you?: {element.quote}</Text>
                    <Text>Consent: {element.consent}</Text>
                </View>
                ))}
            </Page>
        </Document>
    )
}

const randomSurveyForm = ({ randomSurveyData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {randomSurveyData && randomSurveyData.map((element) => (
                <View key={element.id}>
                    <Text>Date: {element.date}</Text>
                    <Text>Please rate the quality of the service in the CCH program: {element.cchQos}</Text>
                    <Text>Please rate the quality of the service you received from your case manager: {element.cmQos}</Text>
                    <Text>Is your case manager courteous? {element.courteous}</Text>
                    <Text>Is your case manager informative? {element.informative}</Text>
                    <Text>Is your case manager prompt and helpful? {element.promptAndHelpful}</Text>
                    <Text>Please rate the quality of your entrance into the CCH program: {element.entryQuality}</Text>
                    <Text>Please rate the quality of your unit: {element.unitQuality}</Text>
                    <Text>Is the SITE clean: {element.clean}</Text>
                    <Text>Please rate your overall experience at CCH: {element.overallExperience}</Text>
                    <Text>How frequently do you have case meetings? {element.caseMeetingFrequency}</Text>
                    <Text>Were the Lifeskills classes beneficial to you: {element.lifeskills}</Text>
                    <Text>Would you recommend CCH to a friend? {element.recommend}</Text>
                    <Text>Why or why not? {element.recommendReasoning}</Text>
                    <Text>If you entered our program because of a referral, how might we have made CCH more helpful? {element.makeCchMoreHelpful}</Text>
                    <Text>Who is your case manager?: {element.cmId}</Text>
                    <Text>What feedback would you like your case manager to know?: {element.cmFeedback}</Text>
                    <Text>Please share any additional comments or suggestions.: {element.otherComments}</Text>

                </View>
                ))}
            </Page>
        </Document>
    )
}


const ExitSurvey = ({ exitSurveyData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {exitSurveyData && exitSurveyData.map((element) => (
                <View key={element.id}>
                    <Text>Name: {element.name}</Text>
                    <Text>Case Manager: {element.cmId}</Text>
                    <Text>Site: {element.site}</Text>
                    <Text>Program Data Completion: {element.programDateCompletion}</Text>
                    <Text>CCH Rating? {element.cchRating}</Text>
                    <Text>What did you like most about Colette’s Children’s Home?: {element.cchLikeMost}</Text>
                    <Text>What would make Colette’s Children’s home better?: {element.cchCouldBeImproved}</Text>
                    <Text>How helpful were the Life Skills Meetings?: {element.lifeSkillsRating}</Text>
                    <Text>What topics were the most helpful for you?: {element.lifeSkillsHelpfulTopics}</Text>
                    <Text>What topics would you like CCH to offer in the future?: {element.lifeSkillsOfferTopicsInTheFuture}</Text>
                    <Text>How helpful was case management?: {element.cmRating}</Text>
                    <Text>WWhat would you change about case management?: {element.cmChangeAbout}</Text>
                    <Text>What was the most beneficial part of case management?: {element.cmMostBeneficial}</Text>
                    <Text>How do you think that your experience at CCH will change your future?: {element.experienceTakeaway}</Text>
                    <Text>What have you learned/accomplished while during your stay?: {element.experienceAccomplished}</Text>
                    <Text>What else would you like us to know?: {element.experienceExtraNotes}</Text>

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
                <View key={element.id}>
                    <Text>ID: {element.date}</Text>
                    <Text>Initial Interview ID: {element.initialInterviewId}</Text>
                    <Text>Case Manager ID: {element.cmId}</Text>
                    <Text>Willingness {element.willingness}</Text>
                    <Text>Employability {element.employability}</Text>
                    <Text>Attitude {element.attitude}</Text>
                    <Text>Length of Sobriety: {element.lengthOfSobriety}</Text>
                    <Text>Completed Tx: {element.completedTx}</Text>
                    <Text>Drug Test Results: {element.drugTestResults}</Text>
                    <Text>Homeless Episode One: {element.homelessEpisodeOne}</Text>
                    <Text>Homeless Episode Two: {element.homelessEpisodeTwo}</Text>
                    <Text>Homeless Episode Three: {element.homelessEpisodeThree}</Text>
                    <Text>Homeless Episode Four: {element.homelessEpisodeFour}</Text>
                    <Text>Disabling Condition {element.disablingConditoin}</Text>
                    <Text>Employed {element.employed}</Text>
                    <Text>Driver License: {element.driverLicense}</Text>
                    <Text>Number of Children: {element.numOfChildren}</Text>
                    <Text>Children in Custody: {element.childrenInCustody}</Text>
                    <Text>Last City Permanent Residence: {element.lastCityPermResidence}</Text>
                    <Text>Decision: {element.decision}</Text>
                    <Text>Additional Comments: {element.additionalComments}</Text>


                </View>
                ))}
            </Page>
        </Document>
    )
}

export default function PrintForm({ formType, formId }) {

    const { backend } = useBackendContext();
    const formData = useRef(<Document></Document>);

    async function printForm() {

        if (formType === 'Success Story') {

            try {
                const response = await backend.get(`/successStory/${formId}`);
                const data = response.data;
                formData.current = <SuccessStoryForm successStoryData={data} />
            } catch (e) {
                console.log(`Success story response was not created: ${e.message}`)
            }

        } 
        else if (formType === 'Random Survey') {
            try {
                const response = await backend.get(`/randomSurvey/${formId}`);
                const data = response.data;
                formData.current = <randomSurveyForm randomSurveyData={data} />
            } catch (e) {
                console.log(`Random survey response was not created: ${e.message}`)
            }

        } else if (formType === 'Exit Survey') {
            try {
                const response = await backend.get(`/exitSurvey/${formId}`);
                const data = response.data;
                formData.current = <ExitSurvey exitSurveyData={data} />
            } catch (e) {
                console.log(`Exit Survey response was not created: ${e.message}`,)
            }

        } else if (formType === 'Client Interview Screener') {
            try {
                const response = await backend.get(`/screenerComment/${formId}`);
                const data = response.data;
                formData.current = <clientInterviewScreenerForm clientInterviewScreenerData={data} />
            } catch (e) {
                console.log(`Client Interview Screener response was not created: ${e.message}`,)
            }
        }
    }

    useEffect(() => {
        printForm();
    }, [])

    return (
        <>
            <PDFDownloadLink document={formData.current} fileName='form.pdf'>
                Export Form
            </PDFDownloadLink>
        </>
        
    )
}