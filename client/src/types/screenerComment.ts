export type screenerComment = {
    id: number;
    initialInterviewId: number;
    cmId: number;
    willingness: number;
    employability: number;
    attitude: number;
    lengthOfSobriety: number;
    completedTx: boolean;
    drugTestResults: string;
    homelessEpisodeOne: string;
    homelessEpisodeTwo: string;
    homelessEpisodeThree: string;
    homelessEpisodeFour: string;
    disablingCondition: string;
    employed: boolean;
    driverLicense: string;
    numOfChildren: number;
    childrenInCustody: number;
    lastCityPermResidence: string;
    decision: boolean;
    additionalComments: string;
}