import { CookiesProvider } from "react-cookie";
import {
  Form,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { Admin } from "./components/admin/Admin";
import { ClientData } from "./components/admin/clientData";
import { CaseManager } from "./components/caseManager/CaseManager";
import { CatchAll } from "./components/CatchAll";
import { ClientList } from "./components/clientlist/ClientList";
import { ViewPage } from "./components/clientPage/ViewPage";
import { LandingPage } from "./components/login/LandingPage";
import { ChooseLogin } from "./components/login/ChooseLogin";
import { ForgotPassword } from "./components/forgotPassword/ForgotPassword";
import { AdminPin } from "./components/authentification/AdminPin";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Donations } from "./components/admin/Donations"
import { ExitSurvey } from "./components/exit_survey/ExitSurvey";
import { FormTable } from "./components/formsTable/formsTable";
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
import { User } from "./types/user";
// import { Comments } from "./compoenents/clientPage/Comments"


// import { Comments } from "./compoenents/clientPage/Comments"

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

  const user : User = {
    id: 1,
    email: "poop@uci.edu",
    role: "user",
    firebaseUid: "123456789",
  };

  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            {shouldShowNavbar && <Navbar user={user} />}
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
                element={<ProtectedRoute element={<CaseManagerMonthlyStats />} />}
              />
              <Route
                path="/forms-table"
                element={<FormTable />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={<Admin />}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route
                path="/clientlist"
                element={<ClientList />}
              />

              <Route
                path="/clientdata"
                element={<ClientData />}
              />

              <Route
                path = "/donations"
                element = {<Donations />}
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
                path="/ViewClient/:id"
                element={<ViewPage />}
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
                path ="/frontDesk"
                element ={<FrontDeskMonthlyStats/>}
              />
              <Route
                path ="/intakeStats"
                element ={<IntakeStats/>}
              />
              <Route
                path="*"
                element={<ProtectedRoute element={<CatchAll />} />}
              />
            </Routes>

          </RoleProvider>
        </AuthProvider>
      </BackendProvider>
    </CookiesProvider>
  );
};

export default App;
