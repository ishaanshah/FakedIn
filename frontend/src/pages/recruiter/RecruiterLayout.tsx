import { Route } from "react-router-dom";
import Navbar from "../../components/Navbar";

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
    </>
  );
}

export default RecruiterLayout;
