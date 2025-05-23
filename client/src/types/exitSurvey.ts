export type exitSurvey = {
  id: number;
  cm_id: number;
  date: string;
  name: string;
  client_id: number;
  site: number;
  program_date_completion: string;
  cch_rating: string;
  cch_like_most: string;
  cch_could_be_improved: string;
  life_skills_rating: string;
  life_skills_helpful_topics: string;
  life_skills_offer_topics_in_the_future: string;
  cm_rating: string;
  cm_change_about: string;
  cm_most_beneficial: string;
  experience_takeaway: string;
  experience_accomplished: string;
  experience_extra_notes: string;
};

export type ExitSurvey = {
  id: number;
  location: string;
  cmFirstName: string;
  cmLastName: string;
  programDateCompletion: Date;
  cchRating: string;
  cchLikeMost: string;
  cchCouldBeImproved: string;
  lifeSkillsRating: string;
  lifeSkillsHelpfulTopics: string;
  lifeSkillsOfferTopicsInTheFuture: string;
  cmRating: string;
  cmChangeAbout: string;
  cmMostBeneficial: string;
  experienceTakeaway: string;
  experienceAccomplished: string;
  experienceExtraNotes: string;
}

export type ExitSurveyForm = {
  name: string;
  cmId: number;
  site: number;
  programDateCompletion: string;
  cchRating: string;
  cchLikeMost: string;
  cchCouldBeImproved: string;
  lifeSkillsRating: string;
  lifeSkillsHelpfulTopics: string;
  lifeSkillsOfferTopicsInTheFuture: string;
  cmRating: string;
  cmChangeAbout: string;
  cmMostBeneficial: string;
  experienceTakeaway: string;
  experienceAccomplished: string;
  experienceExtraNotes: string;
}