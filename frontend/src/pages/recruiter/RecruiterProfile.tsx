import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import RecruiterProfileForm from "../../components/recruiter/RecruiterProfileForm";

function RecruiterProfile() {
  return (
    <Container>
      <Row className="mt-3 mb-2">
        <Col>
          <h1>Edit your profile</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <RecruiterProfileForm
                initialValues={{
                  name: "John Doe",
                  contact: "+91-1234567890",
                  bio: "foobar",
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RecruiterProfile;
