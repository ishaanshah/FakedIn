import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Route } from "react-router-dom";
import UserProfileDropdown from "../../components/UserProfileDropdown";

function RecruiterLayout() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>
          <b>FakedIn</b>
        </Navbar.Brand>
        <Nav className="mr-auto" activeKey={window.location.pathname}>
          <Nav.Link eventKey="/recruiter" as={Link} to="/recruiter">
            Home
          </Nav.Link>
          <Nav.Link
            eventKey="/recruiter/accepted"
            as={Link}
            to="/recruiter/accepted"
          >
            Accepted
          </Nav.Link>
        </Nav>
      </Navbar>
      <UserProfileDropdown variant="recruiter" />

      <Route path="/recruiter" exact></Route>
    </>
  );
}

export default RecruiterLayout;
