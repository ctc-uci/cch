import { FormData } from '../types/screenFormData';

import React, { createContext, useContext, useState } from 'react';

interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

type ContextProviderProps = {
    children: React.ReactNode;
};

export const FormProvider = ({ children }: ContextProviderProps) => {
    const [formData, setFormData] = useState<FormData>({
        applicantType: "",
        firstName: "",
        lastName: "",
        name: "",
        age: "",
        date: "",
        phoneNumber: "",
        maritalStatus: "",
        dateOfBirth: "",
        email: "",
        ssnLastFour: "",
        ethnicity: "",
        veteran: "",
        disabled: "",
        currentAddress: "",
        lastPermAddress: "",
        reasonForLeavingPermAddress: "",
        whereResideLastNight: "",
        currentlyHomeless: "",
        eventLeadingToHomelessness: "",
        howLongExperiencingHomelessness: "",
        prevAppliedToCch: "",
        whenPrevAppliedToCch: "",
        prevInCch: "",
        whenPrevInCch: "",
        childName: "",
        childDOB: "",
        custodyOfChild: "",
        fatherName: "",
        nameSchoolChildrenAttend: "",
        cityOfSchool: "",
        howHearAboutCch: "",
        programsBeenInBefore: "",
        monthlyIncome: "",
        sourcesOfIncome: "",
        monthlyBills: "",
        estimateAmountBills: "",
        currentlyEmployed: "",
        lastEmployer: "",
        lastEmployedDate: "",
        childrenAge: "",
        educationHistory: "",
        dateOfEducation: "",    
        transportation: "",
        legalResident: "",
        medical: "",
        medicalCity: "",
        medicalInsurance: "",
        medicalConditions: "",
        medications: "",
        domesticViolenceHistory: "",
        socialWorker: "",
        socialWorkerTelephone: "",
        socialWorkerOfficeLocation: "",
        lengthOfSobriety: "",
        lastDrugUse: "",
        lastAlcoholUse: "",
        timeUsingDrugsAlcohol: "",
        beenConvicted: "",
        convictedReasonAndTime: "",
        presentWarrantExist: "",
        warrantCounty: "",
        probationParoleOfficer: "",
        probationParoleOfficerTelephone: "",
        personalReferences: "",
        personalReferenceTelephone: "",
        futurePlansGoals: "",
        lastPermanentResidenceHouseholdComposition: "",
        whyNoLongerAtLastResidence: "",
        whatCouldPreventHomeless: "",
    });
    return (
        <FormContext.Provider value={{ formData, setFormData }}>
            {children}
        </FormContext.Provider>
    );
};

export const useForm = (): FormContextType => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useForm must be used within a FormProvider');
    }
    return context;
}