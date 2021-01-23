import axios from "axios";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { store } from "react-notifications-component";

const MAX_ITEMS_PER_PAGE = 25;

const colorIndex: any = {
  applied: "dark",
  inactive: "secondary",
  accepted: "success",
  shortlisted: "info",
  rejected: "danger",
};

type ApplicationEntry = {
  _id: string;
  job: {
    _id: string;
    title: string;
    salary: string;
    postedBy: {
      name: string;
    };
  };
  joinedOn?: string;
  status: string;
};

function RecruiterHome() {
  const [applicationList, setApplicationList] = useState<
    Array<ApplicationEntry>
  >([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/get_applications", {
          params: {
            limit: MAX_ITEMS_PER_PAGE,
            offset: (page - 1) * MAX_ITEMS_PER_PAGE,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

    getData();
  }, [page]);

  return (
    <Container className="mt-3 mb-2">
      <Row className="mb-2">
        <Col>
          <h1>Your applications</h1>
        </Col>
      </Row>
      {loading && (
        <Row className="text-center">
          <Col>
            <Spinner animation="border" />
          </Col>
        </Row>
      )}
      {!loading && applicationList.length === 0 && (
        <Row className="text-center mt-3">
          <Col>
            <h4>Hmm, seems like you haven't applied to any jobs yet.</h4>
          </Col>
        </Row>
      )}
      {!loading && applicationList.length > 0 && (
        <Row style={{ opacity: loading ? 0.5 : 1 }}>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job title</th>
                  <th>Date of joining</th>
                  <th>Salary (&#8377;/Month)</th>
                  <th>Recruiter name</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {applicationList.map((entry, idx) => (
                  <tr key={entry._id}>
                    <td className="align-middle">{idx + 1}</td>
                    <td className="align-middle">{entry.job.title}</td>
                    <td className="align-middle">
                      {entry.joinedOn && entry.status === "accepted"
                        ? new Date(entry.joinedOn).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="align-middle">{entry.job.salary}</td>
                    <td className="align-middle">{entry.job.postedBy.name}</td>
                    <td
                      style={{ textTransform: "capitalize" }}
                      className={`align-middle text-${
                        colorIndex[entry.status]
                      }`}
                    >
                      {entry.status}
                    </td>
                    <td className="align-middle">
                      <Button
                        variant="outline-dark"
                        onClick={() => {
                          setSelectedApp(entry.job._id);
                          setShowRateModal(true);
                        }}
                        disabled={entry.status !== "accepted"}
                      >
                        Rate job
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

export default RecruiterHome;
