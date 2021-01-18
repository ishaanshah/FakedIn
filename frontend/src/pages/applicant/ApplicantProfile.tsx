import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ApplicantProfileForm from "../../components/applicant/ApplicantProfileForm";

function ApplicantProfile() {
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
              <ApplicantProfileForm
                initialValues={{
                  name: "John Doe",
                  education: [
                    {
                      institutionName: "",
                      startYear: "",
                      endYear: "",
                    },
                  ],
                  skills: [],
                }}
                setLoading={(loading) => {
                  console.log(loading);
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ApplicantProfile;
