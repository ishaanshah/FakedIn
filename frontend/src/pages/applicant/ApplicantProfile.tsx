import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ApplicantProfileForm from "../../components/applicant/ApplicantProfileForm";
import { useEffect, useState, useContext } from "react";
import { isEmpty } from "lodash";
import UserContext from "../../contexts/UserContext";
import Spinner from "react-bootstrap/Spinner";

function ApplicantProfile() {
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!isEmpty(user)) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  return (
    <Container>
      <Row className="mt-3 mb-2">
        <Col>
          <h1>Edit your profile</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="justify-content-center">
            {loading && (
              <Spinner
                style={{ position: "absolute", zIndex: 100 }}
                className="align-self-center"
                animation="border"
              />
            )}
            <Card.Body style={{ opacity: loading ? 0.5 : 1 }}>
              <ApplicantProfileForm
                initialValues={{
                  name: user.name || "",
                  education: user.education || [
                    {
                      institutionName: "",
                      startYear: "",
                      endYear: "",
                    },
                  ],
                  skills: user.skills || [],
                }}
                setLoading={setLoading}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ApplicantProfile;
