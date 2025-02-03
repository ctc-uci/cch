import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { Admin } from "./components/admin/Admin";
import { CaseManager } from "./components/caseManager/CaseManager";
import { CatchAll } from "./components/CatchAll";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Login } from "./components/login/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RandomClientSurvey } from "./components/randomClientSurvey/RandomClientSurvey";
import { Signup } from "./components/signup/Signup";
import { ClientList } from "./components/clientlist/ClientList";
import { AuthProvider } from "./contexts/AuthContext";
import { BackendProvider } from "./contexts/BackendContext";
import { RoleProvider } from "./contexts/RoleContext";
import { ExitSurvey } from "./components/exit_survey/ExitSurvey";
import { SuccessStory } from "./components/success_story/SuccessStory";
import { ViewPage } from "./components/clientPage/ViewPage"
import { FrontDeskMonthlyStats } from "./components/front_desk/monthlyStats"
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
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path='/exit-survey'
                  element={<ExitSurvey />}
                />
                <Route
                  path='/success-story'
                  element={<SuccessStory />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
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
                  element={<CaseManager />} />
                <Route
                  path="/random-client-survey"
                  element={<RandomClientSurvey />}
                />
                <Route 
                  path ="/frontDeskMonthlyStats/:id"
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
