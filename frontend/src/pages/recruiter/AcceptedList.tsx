import axios from "axios";
import { range } from "lodash";
import { useEffect, useState } from "react";
import { SortDown, SortUp, Star, StarFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { store } from "react-notifications-component";

const MAX_ITEMS_PER_PAGE = 25;

type AcceptedEntry = {
  _id: string;
  joinedOn: string;
  job: { title: string };
  applicant: {
    _id: string;
    rating: number;
    name: string;
  };
};

function AcceptedList() {
  const [accList, setAccList] = useState<Array<AcceptedEntry>>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("joinedOn");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/get_accepted", {
          params: {
            sortBy,
            sortOrder,
            limit: MAX_ITEMS_PER_PAGE,
            offset: (page - 1) * MAX_ITEMS_PER_PAGE,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAccList(response.data);
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
  }, [page, sortBy, sortOrder]);

  return (
    <>
      <Container className="mt-3 mb-2">
        <Row className="mb-2">
          <Col xs={9}>
            <h1>Your accepted applicants</h1>
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
                <option value="joinedOn">Joined on</option>
                <option value="title">Job title</option>
                <option value="name">Applicant name</option>
                <option value="rating">Applicant rating</option>
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
        {loading && (
          <Row className="text-center">
            <Col>
              <Spinner animation="border" />
            </Col>
          </Row>
        )}
        {!loading && accList.length === 0 && (
          <Row className="text-center mt-3">
            <Col>
              <h4>Hmm, seems like you haven't accepted any applicant.</h4>
            </Col>
          </Row>
        )}
        {!loading && accList.length > 0 && (
          <Row style={{ opacity: loading ? 0.5 : 1 }}>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job title</th>
                    <th>Applicant name</th>
                    <th>Applicant rating</th>
                    <th>Joined on</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {accList.map((entry, idx) => (
                    <tr key={entry._id}>
                      <td className="align-middle">{idx + 1}</td>
                      <td className="align-middle">{entry.job.title}</td>
                      <td className="align-middle">{entry.applicant.name}</td>
                      <td className="align-middle">
                        {range(Math.floor(entry.applicant.rating)).map(
                          (idx) => (
                            <span key={idx}>
                              <StarFill className="text-warning" />
                              &nbsp;
                            </span>
                          )
                        )}
                        {range(5 - Math.floor(entry.applicant.rating)).map(
                          (idx) => (
                            <span key={idx}>
                              <Star />
                              &nbsp;
                            </span>
                          )
                        )}
                      </td>
                      <td className="align-middle">
                        {new Date(entry.joinedOn).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="align-middle">
                        <Button
                          variant="outline-dark"
                          onClick={() => {
                            setSelectedEntry(entry.applicant._id);
                            setShowRateModal(true);
                          }}
                        >
                          Rate
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
                accList.length === 0 || accList.length < MAX_ITEMS_PER_PAGE
              }
            >
              Next
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AcceptedList;
