import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useHistory } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import { PersonCircle } from "react-bootstrap-icons";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

type CustomNavbarProps = {
  variant: "applicant" | "recruiter";
  entries: Array<{
    path: string;
    display: React.ReactNode;
  }>;
};

function CustomNavbar({ variant, entries }: CustomNavbarProps) {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem("token");
    setUser({} as User);
    history.push("/");
  };

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand>
        <b>FakedIn</b>
      </Navbar.Brand>
      <Nav className="mr-auto">
        {entries.map((entry, idx) => (
          <Nav.Link key={idx} as={NavLink} to={entry.path} exact>
            {entry.display}
          </Nav.Link>
        ))}
      </Nav>

      <Nav>
        <NavDropdown
          active
          id="profile-dropdown"
          title={
            <>
              Hello {user.name}!&nbsp;&nbsp;
              <PersonCircle size={30} />
            </>
          }
        >
          <NavDropdown.Item
            as={NavLink}
            to={`/${variant}/profile`}
            activeClassName="active"
            exact
          >
            My profile
          </NavDropdown.Item>
          <NavDropdown.Item onClick={logout}>Sign out</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

export default CustomNavbar;
