import { CookiesProvider } from "react-cookie";
import {
  Form,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
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
// import { Comments } from "./compoenents/clientPage/Comments"


// import { Comments } from "./compoenents/clientPage/Comments"

const App = () => {
  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
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
                  path="/login/:userType"
                  element={<Login />}
                />
                <Route
                  path="/signup/:userType"
                  element={<Signup />}
                />
                <Route
                  path="/forgot-password/:userType"
                  element={<ForgotPassword />}
                />
                 <Route
                  path="/admin-pin/:userType"
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
                      to="/login"
                      replace
                    />
                  }
                />
                <Route
                  path="*"
                  element={<ProtectedRoute element={<CatchAll />} />}
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

              </Routes>
            </Router>
          </RoleProvider>
        </AuthProvider>
      </BackendProvider>
    </CookiesProvider>
  );
};

export default App;
