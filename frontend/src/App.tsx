import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./pages/Landing";
import PostSignUp from "./pages/PostSignUp";
import ApplicantLayout from "./pages/applicant/ApplicantLayout";
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import ReactNotification from "react-notifications-component";
import { useEffect, useState } from "react";
import UserContext from "./contexts/UserContext";
import { getUserData } from "./APIService";
import Spinner from "react-bootstrap/Spinner";

function App() {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrUser = async () => {
      const userData = (await getUserData(false)) || {};
      setUser(userData as User);
      // Wait for user to be set, hacky but works
      // TODO: Optimize it to use promises for setUser
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };

    getCurrUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ReactNotification isMobile={false} />
      {loading && (
        <div className="vh-100 vw-100 justify-content-center d-flex align-items-center">
          <Spinner animation="border" />
        </div>
      )}
      {!loading && (
        <Router>
          <Switch>
            <Route path="/" exact>
              <Landing />
            </Route>
            <Route path="/choose" exact>
              <PostSignUp />
            </Route>
            <Route path="/applicant">
              <ApplicantLayout />
            </Route>
            <Route path="/recruiter">
              <RecruiterLayout />
            </Route>
          </Switch>
        </Router>
      )}
    </UserContext.Provider>
  );
}

export default App;
