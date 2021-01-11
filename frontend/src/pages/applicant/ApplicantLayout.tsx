import { Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ApplicantProfile from "./ApplicantProfile";

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
      <Route path="/applicant/profile" exact>
        <ApplicantProfile />
      </Route>
    </>
  );
}

export default ApplicantLayout;
