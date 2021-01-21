import { Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PostJob from "./PostJob";
import RecruiterHome from "./RecruiterHome";
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
          {
            path: "/recruiter/post_job",
            display: "Post a job",
          },
        ]}
      />

      <Route path="/recruiter" exact>
        <RecruiterHome />
      </Route>
      <Route path="/recruiter/profile" exact>
        <RecruiterProfile />
      </Route>
      <Route path="/recruiter/post_job" exact>
        <PostJob />
      </Route>
    </>
  );
}

export default RecruiterLayout;
