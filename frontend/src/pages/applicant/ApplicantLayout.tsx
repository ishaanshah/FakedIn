import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Route } from "react-router-dom";
import UserProfileDropdown from "../../components/UserProfileDropdown";

function ApplicantLayout() {
  const name = "Ishaan Shah";

  return (
    <>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>
          <b>FakedIn</b>
        </Navbar.Brand>
        <Nav className="mr-auto" activeKey={window.location.pathname}>
          <Nav.Link eventKey="/applicant" as={Link} to="/applicant">
            Home
          </Nav.Link>
          <Nav.Link
            eventKey="/applicant/my_applications"
            as={Link}
            to="/applicant/my_applications"
          >
            My Applications
          </Nav.Link>
        </Nav>
        <UserProfileDropdown variant="applicant" />
      </Navbar>

      <Route path="/applicant" exact></Route>
    </>
  );
}

export default ApplicantLayout;
