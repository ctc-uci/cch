

export type SuccessStory = {
    id: number;
    cchImpact: string;
    cmFirstName: string;
    cmLastName: string;
    site: string;
    entranceDate: Date;
    exitDate: Date;
    prevSituation: string;
    currentSituation: string;
    donorMessage: string;
    quote: string;
    location: string;
    previousSituation: string;
    whereNow: string;
    tellDonors: string;
}

export type SuccessStoryForm = {
    name: string;
    site: number;
    cm_id: number;
    entrance_date: Date;
    exit_date: Date;
    date: Date;
    previous_situation: string;
    cch_impact: string;
    where_now: string;
    tell_donors: string;
    quote: string;
    consent: boolean;
    client_id: null;
  };