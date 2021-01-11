import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./pages/Landing";
import PostSignUp from "./pages/PostSignUp";
import ApplicantLayout from "./pages/applicant/ApplicantLayout";
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";

function App() {
  return (
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
  );
}

export default App;
