import { Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import RecruiterProfile from "./RecruiterProfile";

function RecruiterLayout() {
  return (
    <>
      <Navbar
        variant="recruiter"
        entries={[
          {
            path: "/recruiter",
            display: "Home",
          },
          {
            path: "/recruiter/accepted",
            display: "Accepted",
          },
        ]}
      />

      <Route path="/recruiter" exact></Route>
      <Route path="/recruiter/profile" exact>
        <RecruiterProfile />
      </Route>
    </>
  );
}

export default RecruiterLayout;
