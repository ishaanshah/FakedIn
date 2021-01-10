import { PersonCircle } from "react-bootstrap-icons";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, Route } from "react-router-dom";

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
        <Nav>
          <NavDropdown
            active
            id="profile-dropdown"
            title={
              <>
                Hello {name}!&nbsp;&nbsp;
                <PersonCircle size={30} />
              </>
            }
          >
            <NavDropdown.Item as={Link} to={"/applicant/profile"}>
              My profile
            </NavDropdown.Item>
            <NavDropdown.Item>Sign out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>

      <Route path="/applicant" exact></Route>
    </>
  );
}

export default ApplicantLayout;
