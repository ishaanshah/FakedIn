import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./pages/Landing";
import PostSignUp from "./pages/PostSignUp";
import ApplicantLayout from "./pages/applicant/ApplicantLayout";
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import ReactNotification from "react-notifications-component";
import { useEffect, useState } from "react";
import UserContext from "./contexts/UserContext";
import { getUserData } from "./APIService";

function App() {
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const getCurrUser = async () => {
      const userData = (await getUserData(false)) || {};
      setUser(userData as User);
    };

    getCurrUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ReactNotification isMobile={false} />
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
    </UserContext.Provider>
  );
}

export default App;
