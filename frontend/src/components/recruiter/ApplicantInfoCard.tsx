import axios from "axios";
import range from "lodash/range";
import { useEffect, useState } from "react";
import { Star, StarFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { store } from "react-notifications-component";
import ConfirmRejectModal from "./ConfirmRejectModal";

function ApplicantInfoCard({
  appId,
  refresh,
  setRefresh,
}: {
  appId: string;
  refresh: number;
  setRefresh: (value: number) => void;
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [applicationInfo, setApplicationInfo] = useState({
    sop: "",
    appliedOn: "",
    applicant: {
      name: "",
      education: [] as Array<{
        institutionName: string;
        startYear: number;
        endYear?: number;
      }>,
      skills: [],
      rating: 0,
    },
    status: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/applications/get_application_info/${appId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setApplicationInfo(response.data);
      } finally {
        setLoading(false);
      }
    };

    getJobInfo();
  }, [appId]);

  const shortlistApplicant = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/applications/shortlist/${appId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      store.addNotification({
        container: "bottom-right",
        type: "success",
        message: response.data.message,
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
      setApplicationInfo({ ...applicationInfo, status: "shortlisted" });
    } catch (error) {
      store.addNotification({
        container: "bottom-right",
        type: "danger",
        message:
          error?.response?.data?.message ||
          error.message ||
          error?.response?.statusText,
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

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
              <Col>{applicationInfo.applicant.name}</Col>
              <Col className="text-right">
                <b>Applied on: </b>
                {new Date(applicationInfo.appliedOn || 0).toLocaleString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }
                )}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <b>Statement of purpose: </b>
                {applicationInfo.sop}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <b>Education: </b>
              </Col>
            </Row>
            <ul>
              {applicationInfo.applicant.education.map((entry, idx) => (
                <li key={idx}>
                  {entry.institutionName} ({entry.startYear} -{" "}
                  {entry.endYear || "?"})
                </li>
              ))}
            </ul>
            <Row className="mt-2">
              <Col>
                <b>Skills: </b>
                {applicationInfo.applicant.skills.join(", ")}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col className="align-self-center">
                {range(Math.floor(applicationInfo.applicant.rating)).map(
                  (idx) => (
                    <span key={idx}>
                      <StarFill className="text-warning" />
                      &nbsp;
                    </span>
                  )
                )}
                {range(5 - Math.floor(applicationInfo.applicant.rating)).map(
                  (idx) => (
                    <span key={idx}>
                      <Star />
                      &nbsp;
                    </span>
                  )
                )}
              </Col>
              <Col className="text-right">
                {applicationInfo.status === "applied" && (
                  <Button
                    variant="outline-info"
                    onClick={shortlistApplicant}
                    disabled={loading}
                  >
                    Shortlist
                  </Button>
                )}
                {applicationInfo.status === "shortlisted" && (
                  <Button variant="outline-success" disabled={loading}>
                    Accept
                  </Button>
                )}
                &nbsp;&nbsp;&nbsp;
                <Button
                  variant="outline-danger"
                  disabled={loading}
                  onClick={() => setShowRejectModal(true)}
                >
                  Reject
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </div>
      </Card>
      <ConfirmRejectModal
        appId={appId}
        showModal={showRejectModal}
        setShowModal={setShowRejectModal}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </>
  );
}

export default ApplicantInfoCard;
