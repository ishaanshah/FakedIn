import axios from "axios";
import range from "lodash/range";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useState } from "react";
import { Star, StarFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ApplyModal from "./ApplyModal";

type JobInfoCardProps = {
  jobId: string;
};

const jobTypeMap: {
  [key: string]: string;
} = {
  full: "Full Time",
  part: "Part Time",
  home: "Work from home",
};

function JobInfoCard({ jobId }: JobInfoCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [jobInfo, setJobInfo] = useState({
    title: "",
    postedBy: {
      name: "",
      email: "",
    },
    maxApplicants: 0,
    positions: 0,
    jobType: "",
    duration: 0,
    salary: 0,
    deadline: new Date(),
    postedOn: new Date(),
    skillsRequired: [],
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/jobs/get_job_info/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJobInfo(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getJobInfo();
  }, [jobId]);

  return (
    <>
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
            <Row>
              <Col>{jobInfo.title}</Col>
              <Col className="text-right">
                <b>Posted on:</b>{" "}
                {new Date(jobInfo.postedOn).toLocaleString("en-IN", {
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
                  <b>Recruiter Name: </b>
                  {jobInfo.postedBy.name}
                </Card.Subtitle>
              </Col>
              <Col>
                <Card.Subtitle>
                  <b>Recruiter E-Mail: </b>
                  <a href={`mailto:${jobInfo.postedBy.email}`}>
                    {jobInfo.postedBy.email}
                  </a>
                </Card.Subtitle>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Card.Subtitle>
                  <b>Max applications: </b>
                  {jobInfo.maxApplicants}
                </Card.Subtitle>
              </Col>
              <Col>
                <Card.Subtitle>
                  <b>Available positions: </b>
                  {jobInfo.positions}
                </Card.Subtitle>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Card.Subtitle>
                  <b>Job Type: </b>
                  {jobTypeMap[jobInfo.jobType]}
                </Card.Subtitle>
              </Col>
              <Col>
                <Card.Subtitle>
                  <b>Duration: </b>
                  {jobInfo.duration
                    ? `${jobInfo.duration} Month/s`
                    : "Indefinite"}
                </Card.Subtitle>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Card.Subtitle>
                  <b>Salary: </b>&#8377; {jobInfo.salary} / Month
                </Card.Subtitle>
              </Col>
              <Col>
                <Card.Subtitle>
                  <b>Last date of application:</b>&nbsp;
                  {new Date(jobInfo.deadline).toLocaleString("en-IN", {
                    hour: "numeric",
                    hour12: false,
                    minute: "numeric",
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
                  <b>Required Skills: </b>
                  {jobInfo.skillsRequired.join(", ")}
                </Card.Subtitle>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col className="align-self-center">
                {range(Math.floor(jobInfo.rating)).map((idx) => (
                  <span key={idx}>
                    <StarFill className="text-warning" />
                    &nbsp;
                  </span>
                ))}
                {range(5 - Math.floor(jobInfo.rating)).map((idx) => (
                  <span key={idx}>
                    <Star />
                    &nbsp;
                  </span>
                ))}
              </Col>
              <Col className="text-right">
                <Button
                  variant="outline-dark"
                  onClick={() => setShowModal(true)}
                  disabled={loading}
                >
                  Apply
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </div>
      </Card>

      <ApplyModal
        showModal={showModal}
        setShowModal={setShowModal}
        jobId={jobId}
      />
    </>
  );
}

export default JobInfoCard;
