import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { store } from "react-notifications-component";
import { TrashFill, PencilFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

const MAX_ITEMS_PER_PAGE = 10;

function ConfirmDeleteModal({
  jobId,
  showModal,
  setShowModal,
  refresh,
  setRefresh,
}: {
  jobId: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  refresh: number;
  setRefresh: (value: number) => void;
}) {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      contentClassName="justify-content-center"
      size="sm"
      centered
    >
      <Modal.Header>Confirm deletion</Modal.Header>
      <Modal.Body>Are you sure you want to delete the job?</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="outline-danger" type="submit">
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function RecruiterHome() {
  const [jobList, setJobList] = useState<
    Array<{
      _id: string;
      postedOn: string;
      deadline: string;
      title: string;
      maxApplicants: number;
      applicationCount: number;
      positions: number;
    }>
  >([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/get_jobs_posted", {
          params: {
            limit: MAX_ITEMS_PER_PAGE,
            offset: (page - 1) * MAX_ITEMS_PER_PAGE,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJobList(response.data);
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
  }, [page, refresh]);

  return (
    <>
      <Container className="mt-3 mb-2">
        <Row className="mb-2">
          <Col>
            <h1>Your active job listings</h1>
          </Col>
        </Row>
        {!loading && jobList.length === 0 && (
          <Row className="text-center mt-3">
            <Col>
              <h4>
                Sorry we couldn't find any jobs that satisfy your search
                criteria.
              </h4>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job title</th>
                  <th>Posted on</th>
                  <th>Deadline</th>
                  <th>No. of applications</th>
                  <th>No. of positions</th>
                  <th>View applications</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {jobList.map((entry, idx) => (
                  <tr key={entry._id}>
                    <td className="align-middle">{idx + 1}</td>
                    <td className="align-middle">{entry.title}</td>
                    <td className="align-middle">
                      {new Date(entry.postedOn).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="align-middle">
                      {new Date(entry.deadline).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="align-middle">{entry.applicationCount}</td>
                    <td className="align-middle">{entry.positions}</td>
                    <td className="align-middle">
                      <Link to={`/recruiter/applications/${entry._id}`}>
                        View applications
                      </Link>
                    </td>
                    <td className="align-middle">
                      <Button variant="outline-dark" size="sm">
                        <PencilFill />
                      </Button>
                    </td>
                    <td className="align-middle">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setSelectedJob(entry._id);
                        }}
                      >
                        <TrashFill />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
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
                jobList.length === 0 || jobList.length < MAX_ITEMS_PER_PAGE
              }
            >
              Next
            </Button>
          </Col>
        </Row>
      </Container>
      <ConfirmDeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        jobId={selectedJob}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      ;
    </>
  );
}

export default RecruiterHome;
