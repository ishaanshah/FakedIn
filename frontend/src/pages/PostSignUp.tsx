import { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import ApplicantProfileForm from "../components/applicant/ApplicantProfileForm";
import RecruiterProfileForm from "../components/recruiter/RecruiterProfileForm";
import { useHistory } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { isEmpty } from "lodash";

function PostSignUp() {
  // State denoting type of the user i.e Recruiter or Applicant
  const [userRole, setUserRole] = useState("applicant");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!isEmpty(user)) {
      setLoading(false);
      if (user.userType !== "unknown") {
        history.replace(`/${user.userType}`);
      }
    } else {
      history.replace("/");
    }
  }, [user, history]);

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <div style={{ fontSize: "3em" }}>
            Hi <b>{user.name}</b>!
          </div>
          <br />
          <div style={{ fontSize: "1.5em" }}>
            We'll need some more information about you and you'll be good to go
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Card className="justify-content-center">
            {loading && (
              <Spinner
                style={{ position: "absolute", zIndex: 100 }}
                className="align-self-center"
                animation="border"
              />
            )}
            <div style={{ opacity: loading ? 0.5 : 1 }}>
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
                      name: user.name || "",
                      education: [
                        {
                          institutionName: "",
                          startYear: "",
                          endYear: "",
                        },
                      ],
                      skills: [],
                    }}
                  />
                </Card.Body>
              )}
              {userRole === "recruiter" && (
                <Card.Body>
                  <RecruiterProfileForm
                    initialValues={{
                      name: user.name || "",
                      contact: "",
                      bio: "",
                    }}
                  />
                </Card.Body>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PostSignUp;
