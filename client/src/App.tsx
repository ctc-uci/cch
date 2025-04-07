import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { ManageAccounts } from "./components/admin/ManageAccounts";
import { ClientData } from "./components/admin/clientData";
import { CaseManager } from "./components/caseManager/CaseManager";
import { ClientList } from "./components/clientlist/ClientList";
import { ViewPage } from "./components/clientPage/ViewPage";
import { LandingPage } from "./components/login/LandingPage";
import { ChooseLogin } from "./components/login/ChooseLogin";
import { ForgotPassword } from "./components/forgotPassword/ForgotPassword";
import { AdminPin } from "./components/authentification/AdminPin";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Donations } from "./components/donations/Donations"
import { ExitSurvey } from "./components/exit_survey/ExitSurvey";
import { FormsHub } from "./components/formsHub/formsHub";
import { Login } from "./components/login/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RandomClientSurvey } from "./components/randomClientSurvey/RandomClientSurvey";
import { Signup } from "./components/signup/Signup";
import { SuccessStory } from "./components/success_story/SuccessStory";
import { AuthProvider } from "./contexts/AuthContext";
import { BackendProvider } from "./contexts/BackendContext";
import { RoleProvider } from "./contexts/RoleContext";
import { FrontDeskMonthlyStats } from "./components/front_desk/monthlyStats"
import { ClientInterviewScreening } from "./components/clientInterviewScreening/ClientInterviewScreening";
import { IntakeStats } from "./components/intakeStatsForm/intakeStats"
import { CaseManagerMonthlyStats } from "./components/caseManagerMonthlyStats/CaseManagerMonthlyStats";
import { Navbar } from "./components/Navbar";
import { AdminClientList } from "./components/admin/AdminClientList";
import PersonalInformation from "./components/interviewScreeningForm/PersonalInformation";
import { FormProvider } from "./contexts/formContext";
import FinancialInformation from "./components/interviewScreeningForm/financialInformation";
import HealthSocialInformation from "./components/interviewScreeningForm/healthSocialInformation";
import AdditionalInformation from "./components/interviewScreeningForm/additionalInformation";
import ReviewInformation from "./components/interviewScreeningForm/reviewInformation";
import Success from "./components/interviewScreeningForm/success";
import { StartForms } from "./components/formsHub/startForm";
import UserSettings from "./components/userSettings/UserSettings";
import VolunteersPage from "./components/volunteersPage/VolunteersPage";
import { InitialScreenerTable } from "./components/initialScreener/initialScreenerTable";
import CommentForm from "./components/initialScreener/commentForm";
import { Playground } from "./themes/play";

const App = () => {

  const location = useLocation();
  const currentRoute = location.pathname.toLowerCase().split("/")[1];

  const shouldShowNavbar = !(
    currentRoute === 'login' ||
    currentRoute === 'landing-page' ||
    currentRoute === 'choose-login' ||
    currentRoute === 'signup' ||
    currentRoute === 'forgot-password' ||
    currentRoute === 'admin-pin'
  );

  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <FormProvider>
            {shouldShowNavbar && <Navbar />}
            <Routes>
              <Route
                path="/landing-page"
                element={<LandingPage />}
              />
                <Route
                path="/choose-login"
                element={<ChooseLogin />}
              />
              <Route
                path="/login/:userType?"
                element={<Login />}
              />
              <Route
                path="/signup/:userType?"
                element={<Signup />}
              />
              <Route
                path="/forgot-password/:userType?"
                element={<ForgotPassword />} 
              />
                <Route
                path="/admin-pin/:userType?"
                element={<ProtectedRoute element={<AdminPin />} allowedRoles={['admin', 'user']} />}
              />
              <Route
                path="/exit-survey"
                element={<ProtectedRoute element={<ExitSurvey />} allowedRoles={['client']} />}
              />
              <Route
                path="/success-story"
                element={<ProtectedRoute element = {<SuccessStory />} allowedRoles={['client']}/>}
              />
              <Route
                path="/settings"
                element={<ProtectedRoute element={<UserSettings />} allowedRoles={['admin', 'user']} />}
              />
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} allowedRoles={['admin', 'user']} />}
              />
              <Route
                path="/client-interview-screening"
                element={<ProtectedRoute element={<ClientInterviewScreening />} allowedRoles={['client']} />}
              />
              <Route
                path="/monthly-statistics"
                element={<ProtectedRoute element={<CaseManagerMonthlyStats />} allowedRoles={['admin', 'user']} />}
              />
              <Route
                path="/forms-hub"
                element={<ProtectedRoute element={<FormsHub />} allowedRoles={['admin', 'user']} />}
              />
              <Route
                  path="/start-form"
                  element={<ProtectedRoute element={<StartForms />} allowedRoles={['admin', 'user']} />}
                />
              <Route
                path="/admin-client-list"
                element={<ProtectedRoute element={<AdminClientList />} allowedRoles={['admin' , 'user']} />}
              />
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute
                    element={<ManageAccounts />}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route
                path="/clientlist"
                element={<ProtectedRoute element={<ClientList />} allowedRoles={['admin', 'user']} />}
              />

              <Route
                path="/clientdata"
                element={<ProtectedRoute element={<ClientData />} allowedRoles={['admin', 'user']} />}
              />

                <Route
                  path = "/donations"
                  element={<ProtectedRoute element={<Donations />} allowedRoles={['admin', 'user']} />}
                />
                <Route
                  path = "/volunteer-tracking"
                  element = {<ProtectedRoute element={<VolunteersPage />} allowedRoles={["admin"]}/>}
                />
                <Route
                  path = "/admin-client-forms"
                  element = {<ProtectedRoute element={<FormsHub admin />} allowedRoles={["admin"]}/>}
                />
                <Route
                  path="/ViewClient/:id"
                  element={<ProtectedRoute element={<ViewPage />} allowedRoles={['admin', 'user']} />}
                />
                <Route
                  path="/casemanager"
                  element={<ProtectedRoute element={<CaseManager />} allowedRoles={['admin', 'user']} />}
                />
                <Route
                  path="/random-client-survey"
                  element={<ProtectedRoute element={<RandomClientSurvey />} allowedRoles={["client"]}/>}
                />
                <Route
                  path ="/frontDesk"
                  element={<ProtectedRoute element={<FrontDeskMonthlyStats />} allowedRoles={['admin', 'user']} />}
                />
                <Route
                  path ="/intakeStats"
                  element={<ProtectedRoute element={<IntakeStats />} allowedRoles={['admin', 'user']} />}
                />
                  <Route
                    path ="/personal"
                    element ={<PersonalInformation hidden={false}/>}
                  />
                  <Route
                    path ="/financial"
                    element ={<FinancialInformation hidden={false}/>}
                  />
                  <Route
                    path ="/health"
                    element ={<HealthSocialInformation hidden={false}/>}
                  />
                  <Route
                    path ="/additional"
                    element ={<AdditionalInformation hidden={false}/>}
                  />
                  <Route
                    path ="/review"
                    element ={<ReviewInformation/>}
                  />
                  <Route
                    path ="/success"
                    element ={<Success/>}
                  />
                  <Route path="/playground" element={<Playground/>}/>
                  <Route
                    path = "/initial-screener-table"
                    element = {<ProtectedRoute element={<InitialScreenerTable />} allowedRoles={["user"]}/>}
                  />
                  <Route
                    path = "/comment-form/:id"
                    element = {<ProtectedRoute element={<CommentForm />} allowedRoles={["user"]}/>}
                  />
                  
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/landing-page"
                      replace
                    />
                  }
                />
                <Route
                  path="*"
                  element={<Navigate
                    to="/landing-page"
                    replace
                  />}
                />
                
              </Routes>
            </FormProvider>
          </RoleProvider>
        </AuthProvider>
      </BackendProvider>
    </CookiesProvider>
  );
};

export default App;
