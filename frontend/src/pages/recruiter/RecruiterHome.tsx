import axios from "axios";
import { useEffect, useState } from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { store } from "react-notifications-component";
import { Link } from "react-router-dom";
import ConfirmDeleteModal from "../../components/recruiter/ConfirmDeleteModal";
import JobEditModal from "../../components/recruiter/JobEditModal";

const MAX_ITEMS_PER_PAGE = 10;

type jobEntry = {
  _id: string;
  postedOn: string;
  deadline: string;
  title: string;
  maxApplicants: number;
  applicationCount: number;
  positions: number;
};

function RecruiterHome() {
  const [jobList, setJobList] = useState<Array<jobEntry>>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<jobEntry>({} as jobEntry);
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
        {loading && (
          <Row className="text-center">
            <Col>
              <Spinner animation="border" />
            </Col>
          </Row>
        )}
        {!loading && jobList.length === 0 && (
          <Row className="text-center mt-3">
            <Col>
              <h4>Hmm, seems like you don't have any active job listings.</h4>
            </Col>
          </Row>
        )}
        {!loading && jobList.length > 0 && (
          <Row style={{ opacity: loading ? 0.5 : 1 }}>
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
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(entry);
                            setShowEditModal(true);
                          }}
                        >
                          <PencilFill />
                        </Button>
                      </td>
                      <td className="align-middle">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(entry);
                            setShowDeleteModal(true);
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
        jobId={selectedJob._id}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <JobEditModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        jobId={selectedJob._id}
        refresh={refresh}
        setRefresh={setRefresh}
        maxApplicants={selectedJob.maxApplicants?.valueOf()}
        positions={selectedJob.positions?.valueOf()}
        deadline={new Date(selectedJob.deadline || 0)}
      />
    </>
  );
}

export default RecruiterHome;
