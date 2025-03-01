import { CookiesProvider } from "react-cookie";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AdminClientList } from "./components/admin/AdminClientList";
import { ClientData } from "./components/admin/clientData";
import { Donations } from "./components/admin/Donations";
import { ManageAccounts } from "./components/admin/ManageAccounts";
import { AdminPin } from "./components/authentification/AdminPin";
import { CaseManager } from "./components/caseManager/CaseManager";
import { CaseManagerMonthlyStats } from "./components/caseManagerMonthlyStats/CaseManagerMonthlyStats";
import { CatchAll } from "./components/CatchAll";
import { ClientInterviewScreening } from "./components/clientInterviewScreening/ClientInterviewScreening";
import { ClientList } from "./components/clientlist/ClientList";
import { ViewPage } from "./components/clientPage/ViewPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ExitSurvey } from "./components/exit_survey/ExitSurvey";
import { ForgotPassword } from "./components/forgotPassword/ForgotPassword";
import { FormsHub } from "./components/formsHub/formsHub";
import { StartForms } from "./components/formsHub/startForm";
import { FormTable } from "./components/formsTable/formsTable";
import { FrontDeskMonthlyStats } from "./components/front_desk/monthlyStats";
import { IntakeStats } from "./components/intakeStatsForm/intakeStats";
import AdditionalInformation from "./components/interviewScreeningForm/additionalInformation";
import FinancialInformation from "./components/interviewScreeningForm/financialInformation";
import HealthSocialInformation from "./components/interviewScreeningForm/healthSocialInformation";
import PersonalInformation from "./components/interviewScreeningForm/PersonalInformation";
import ReviewInformation from "./components/interviewScreeningForm/reviewInformation";
import Success from "./components/interviewScreeningForm/success";
import { ChooseLogin } from "./components/login/ChooseLogin";
import { LandingPage } from "./components/login/LandingPage";
import { Login } from "./components/login/Login";
import { Navbar } from "./components/Navbar.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RandomClientSurvey } from "./components/randomClientSurvey/RandomClientSurvey";
import { Signup } from "./components/signup/Signup";
import { SuccessStory } from "./components/success_story/SuccessStory";
import { AuthProvider } from "./contexts/AuthContext";
import { BackendProvider } from "./contexts/BackendContext";
import { FormProvider } from "./contexts/formContext";
import { useRoleContext } from "./contexts/hooks/useRoleContext.ts";
import { RoleProvider } from "./contexts/RoleContext";
import { User } from "./types/user";

const App = () => {
  //const { role } = useRoleContext();
  const location = useLocation();
  const currentRoute = location.pathname.toLowerCase().split("/")[1];

  const shouldShowNavbar = !(
    currentRoute === "login" ||
    currentRoute === "landing-page" ||
    currentRoute === "choose-login" ||
    currentRoute === "signup" ||
    currentRoute === "forgot-password" ||
    currentRoute === "admin-pin"
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
                  element={<AdminPin />}
                />
                <Route
                  path="/exit-survey"
                  element={<ExitSurvey />}
                />
                <Route
                  path="/success-story"
                  element={<SuccessStory />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/client-interview-screening"
                  element={<ClientInterviewScreening />}
                />
                <Route
                  path="/monthly-statistics"
                  element={
                    <ProtectedRoute
                      element={<CaseManagerMonthlyStats />}
                      allowedRoles={["admin"]}
                    />
                  }
                />
                <Route
                  path="/forms-hub"
                  element={
                    <ProtectedRoute
                      element={<FormsHub />}
                      allowedRoles={["user"]}
                    />
                  }
                />
                <Route
                  path="/start-form"
                  element={
                    <ProtectedRoute
                      element={<StartForms />}
                      allowedRoles={["user"]}
                    />
                  }
                />
                <Route
                  path="/admin-client-list"
                  element={
                    <ProtectedRoute
                      element={<AdminClientList />}
                      allowedRoles={["admin"]}
                    />
                  }
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
                  element={
                    <ProtectedRoute
                      element={<ClientList />}
                      allowedRoles={["user"]}
                    />
                  }
                />

                <Route
                  path="/clientdata"
                  element={
                    <ProtectedRoute
                      element={<ClientData />}
                      allowedRoles={["admin"]}
                    />
                  }
                />

                <Route
                  path="/donations"
                  element={<ProtectedRoute element={<Donations />} />}
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
                  element={
                    <Navigate
                      to="/landing-page"
                      replace
                    />
                  }
                />
                <Route
                  path="/ViewClient/:id"
                  element={
                    <ProtectedRoute
                      element={<ViewPage />}
                      allowedRoles={["user"]}
                    />
                  }
                />
                <Route
                  path="/casemanager"
                  element={<CaseManager />}
                />
                <Route
                  path="/random-client-survey"
                  element={<RandomClientSurvey />}
                />
                <Route
                  path="/frontDesk"
                  element={<FrontDeskMonthlyStats />}
                />
                <Route
                  path="/intakeStats"
                  element={<IntakeStats />}
                />
                <Route
                  path="/personal"
                  element={<PersonalInformation hidden={false} />}
                />
                <Route
                  path="/financial"
                  element={<FinancialInformation hidden={false} />}
                />
                <Route
                  path="/health"
                  element={<HealthSocialInformation hidden={false} />}
                />
                <Route
                  path="/additional"
                  element={<AdditionalInformation hidden={false} />}
                />
                <Route
                  path="/review"
                  element={<ReviewInformation />}
                />
                <Route
                  path="/success"
                  element={<Success />}
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
