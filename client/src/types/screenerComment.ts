export type screenerComment = {
    id: number;
    initial_interview_id: number;
    cm_id: number;
    willingness: number;
    employability: number;
    attitude: number;
    length_of_sobriety: number;
    completed_tx: boolean;
    drug_test_results: string;
    homeless_episode_one: string;
    homeless_episode_two: string;
    homeless_episode_three: string;
    homeless_episode_four: string;
    disabling_condition: string;
    employed: boolean;
    driver_license: string;
    num_of_children: number;
    children_in_custody: number;
    last_city_perm_residence: string;
    decision: boolean;
    additional_comments: string;
}