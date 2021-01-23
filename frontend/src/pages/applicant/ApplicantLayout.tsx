import { Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ApplicantProfile from "./ApplicantProfile";
import ApplicantHome from "./ApplicantHome";
import MyApplications from "./MyApplications";

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

      <Route path="/applicant" exact>
        <ApplicantHome />
      </Route>
      <Route path="/applicant/profile" exact>
        <ApplicantProfile />
      </Route>
      <Route path="/applicant/my_applications" exact>
        <MyApplications />
      </Route>
    </>
  );
}

export default ApplicantLayout;
