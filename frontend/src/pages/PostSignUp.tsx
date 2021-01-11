import { useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import ApplicantProfileForm from "../components/applicant/ApplicantProfileForm";
import RecruiterProfileForm from "../components/recruiter/RecruiterProfileForm";

function PostSignUp() {
  // State denoting type of the user i.e Recruiter or Applicant
  const [userRole, setUserRole] = useState("applicant");

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <div style={{ fontSize: "3em" }}>
            Hi <b>John Doe</b>!
          </div>
          <br />
          <div style={{ fontSize: "1.5em" }}>
            We'll need some more information about you and you'll be good to go
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Header>
              <Nav
                fill
                variant="tabs"
                defaultActiveKey="applicant"
                onSelect={(selectedTab) => {
                  if (selectedTab) {
                    setUserRole(selectedTab);
                  }
                }}
              >
                <Nav.Item>
                  <Nav.Link eventKey="applicant">I'm an Applicant</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="recruiter">I'm a Recruiter</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            {userRole === "applicant" && (
              <Card.Body>
                <ApplicantProfileForm
                  initialValues={{
                    applicantEducation: [
                      {
                        institutionName: "",
                        startYear: "",
                        endYear: "",
                      },
                    ],
                    applicantSkills: [],
                  }}
                />
              </Card.Body>
            )}
            {userRole === "recruiter" && (
              <Card.Body>
                <RecruiterProfileForm
                  initialValues={{
                    recruiterContact: "",
                    recruiterBio: "",
                  }}
                />
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PostSignUp;
