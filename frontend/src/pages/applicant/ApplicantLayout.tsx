import { Route } from "react-router-dom";
import Navbar from "../../components/Navbar";

function ApplicantLayout() {
  return (
    <>
      <Navbar
        variant="applicant"
        entries={[
          {
            path: "/applicant",
            display: "Home",
          },
          {
            path: "/applicant/my_applications",
            display: "My Applications",
          },
        ]}
      />

      <Route path="/applicant" exact></Route>
    </>
  );
}

export default ApplicantLayout;
