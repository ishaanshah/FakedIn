import axios from "axios";
import { useEffect, useState } from "react";
import { SortDown, SortUp } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { store } from "react-notifications-component";
import { useParams } from "react-router-dom";
import ApplicantInfoCard from "../../components/recruiter/ApplicantInfoCard";

const MAX_ITEMS_PER_PAGE = 10;

function ApplicantList() {
  const { jobId } = useParams<{ jobId: string }>();
  const [sortBy, setSortBy] = useState("appliedOn");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState<number>(1);
  const [refresh, setRefresh] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [applicationList, setApplicationList] = useState<
    Array<{ applicationId: string }>
  >([]);

  useEffect(() => {
    const getApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/jobs/get_applications/${jobId}`,
          {
            params: {
              sortBy,
              sortOrder,
              count: MAX_ITEMS_PER_PAGE,
              offset: (page - 1) * MAX_ITEMS_PER_PAGE,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setApplicationList(response.data);
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

    getApplications();
  }, [sortBy, sortOrder, page, jobId, refresh]);

  return (
    <Container className="mt-3 mb-2">
      <Row className="mb-2 align-items-center">
        <Col xs={9}>
          <h1>Job Applications</h1>
        </Col>
        <Col className="text-right">
          <InputGroup>
            <Form.Control
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              name="sortBy"
              as="select"
              custom
            >
              <option value="appliedOn">Application date</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </Form.Control>
            <InputGroup.Append>
              <Button
                variant="outline-dark"
                onClick={() => {
                  if (sortOrder === "desc") {
                    setSortOrder("asc");
                  } else {
                    setSortOrder("desc");
                  }
                }}
              >
                {sortOrder === "desc" && <SortDown />}
                {sortOrder === "asc" && <SortUp />}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      {!loading &&
        applicationList.map((data) => (
          <Row className="mt-3" key={data.applicationId}>
            <Col>
              <ApplicantInfoCard
                appId={data.applicationId}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </Col>
          </Row>
        ))}
      {!loading && applicationList.length === 0 && (
        <Row className="text-center mt-3">
          <Col>
            <h4>Seems like there are no applications for this job yet.</h4>
          </Col>
        </Row>
      )}
      {loading && (
        <Row className="text-center mt-3">
          <Col>
            <Spinner animation="border" />
          </Col>
        </Row>
      )}
      <Row className="mt-4">
        <Col>
          <Button
            variant="dark"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
        </Col>
        <Col className="text-right">
          <Button
            variant="dark"
            onClick={() => setPage(page + 1)}
            disabled={
              applicationList.length === 0 ||
              applicationList.length < MAX_ITEMS_PER_PAGE
            }
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ApplicantList;
