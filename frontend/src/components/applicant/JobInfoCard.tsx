import range from "lodash/range";
import { Star } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

type JobInfoCardProps = {
  jobId: number;
};

function JobInfoCard({ jobId }: JobInfoCardProps) {
  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>Job Title</Col>
          <Col className="text-right">
            <b>Posted at:</b>{" "}
            {new Date().toLocaleString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Card.Subtitle>
              <b>Recruiter Name:</b> Jane Doe
            </Card.Subtitle>
          </Col>
          <Col>
            <Card.Subtitle>
              <b>Recruiter E-Mail:</b>{" "}
              <a href="mailto:jane.doe@gmail.com">jane.doe@gmail.com</a>
            </Card.Subtitle>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card.Subtitle>
              <b>Max applications:</b> 10
            </Card.Subtitle>
          </Col>
          <Col>
            <Card.Subtitle>
              <b>Available positions:</b> 5
            </Card.Subtitle>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card.Subtitle>
              <b>Job Type:</b> Full Time
            </Card.Subtitle>
          </Col>
          <Col>
            <Card.Subtitle>
              <b>Duration:</b> 6 Months
            </Card.Subtitle>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card.Subtitle>
              <b>Salary:</b> &#8377; 35,000 / Month
            </Card.Subtitle>
          </Col>
          <Col>
            <Card.Subtitle>
              <b>Last date of application:</b>&nbsp;
              {new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Card.Subtitle>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card.Subtitle>
              <b>Required Skills:</b> C&#47;C++, ML&#47;DL, Python
            </Card.Subtitle>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col className="align-self-center">
            {range(5).map((idx) => (
              <span key={idx}>
                <Star />
                &nbsp;
              </span>
            ))}
          </Col>
          <Col className="text-right">
            <Button variant="outline-dark">Apply</Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
}

export default JobInfoCard;
