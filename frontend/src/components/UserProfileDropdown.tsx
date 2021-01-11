import { PersonCircle } from "react-bootstrap-icons";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

function UserProfileDropdown({
  variant,
}: {
  variant: "applicant" | "recruiter";
}) {
  const name = "Ishaan Shah";
  return (
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
        <NavDropdown.Item as={Link} to={`/${variant}/profile`}>
          My profile
        </NavDropdown.Item>
        <NavDropdown.Item>Sign out</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

export default UserProfileDropdown;
