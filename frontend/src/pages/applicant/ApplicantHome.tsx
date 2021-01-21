import axios from "axios";
import { useFormik } from "formik";
import range from "lodash/range";
import { useEffect, useState, useCallback } from "react";
import { Search, SortDown, SortUp } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { store } from "react-notifications-component";
import JobInfoCard from "../../components/applicant/JobInfoCard";
import Spinner from "react-bootstrap/Spinner";

const MAX_ITEMS_PER_PAGE = 10;

function ApplicantHome() {
  const [jobList, setJobList] = useState<Array<{ jobId: string }>>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      searchQuery: "",
      sortBy: "salary",
      sortOrder: "desc",
      jobType: "any",
      duration: 0,
      minSalary: 1000,
      maxSalary: 50000,
    },
    onSubmit: (values) => {
      getJobs(values);
    },
  });

  const getJobs = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const response = await axios.get("/api/jobs", {
          params: {
            ...values,
            count: MAX_ITEMS_PER_PAGE,
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
    },
    [page]
  );

  useEffect(() => {
    getJobs(formik.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getJobs, page]);

  return (
    <Container className="mt-3 mb-2">
      <Row className="mb-2">
        <Col>
          <h1>Search for jobs</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Card>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Card.Title>Sort By</Card.Title>
                <InputGroup>
                  <Form.Control
                    value={formik.values.sortBy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="sortBy"
                    as="select"
                    custom
                  >
                    <option value="salary">Salary</option>
                    <option value="duration">Duration</option>
                    <option value="rating">Rating</option>
                  </Form.Control>
                  <InputGroup.Append>
                    <Button
                      variant="outline-dark"
                      onClick={() => {
                        if (formik.values.sortOrder === "desc") {
                          formik.setFieldValue("sortOrder", "asc");
                        } else {
                          formik.setFieldValue("sortOrder", "desc");
                        }
                      }}
                    >
                      {formik.values.sortOrder === "desc" && <SortDown />}
                      {formik.values.sortOrder === "asc" && <SortUp />}
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <Card.Title className="mt-3">Filter By</Card.Title>
                <Card.Subtitle className="mt-3 text-muted">
                  Job Type
                </Card.Subtitle>
                <Form.Control
                  value={formik.values.jobType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="jobType"
                  as="select"
                  custom
                  className="mt-2"
                >
                  <option value="any">Any</option>
                  <option value="part">Part Time</option>
                  <option value="full">Full Time</option>
                  <option value="home">Work from Home</option>
                </Form.Control>
                <Card.Subtitle className="mt-3 text-muted">
                  Salary (&#8377; / Month)
                </Card.Subtitle>
                <Form.Row>
                  <Col>
                    <Form.Control
                      value={formik.values.minSalary}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="minSalary"
                      type="number"
                      className="mt-2"
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />
                  </Col>
                  <div className="align-self-center">-</div>
                  <Col>
                    <Form.Control
                      value={formik.values.maxSalary}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="maxSalary"
                      type="number"
                      className="mt-2"
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />
                  </Col>
                </Form.Row>
                <Card.Subtitle className="mt-3 text-muted">
                  Duration
                </Card.Subtitle>
                <Form.Control
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="duration"
                  as="select"
                  custom
                  className="mt-2"
                >
                  {range(1, 8).map((month) => (
                    <option value={month} key={month}>
                      &#60; {month} {month === 1 ? "Month" : "Months"}
                    </option>
                  ))}
                  <option value={0}>Indefinite</option>
                </Form.Control>
                <div className="text-right mt-3">
                  <Button variant="dark" type="submit">
                    Apply Filters
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Row>
              <Col>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Search for Jobs..."
                    value={formik.values.searchQuery}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="searchQuery"
                    type="text"
                  />
                  <InputGroup.Append>
                    <Button variant="dark" type="submit">
                      <Search />
                      &nbsp;Search
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Form.Row>
          </Form>
          {!loading &&
            jobList.map((data) => (
              <Row className="mt-3" key={data.jobId}>
                <Col>
                  <JobInfoCard jobId={data.jobId} />
                </Col>
              </Row>
            ))}
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
                  jobList.length === 0 || jobList.length < MAX_ITEMS_PER_PAGE
                }
              >
                Next
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ApplicantHome;
