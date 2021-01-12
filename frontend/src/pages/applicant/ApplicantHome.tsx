import { useFormik } from "formik";
import range from "lodash/range";
import { Search, SortDown, SortUp } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import JobInfoCard from "../../components/applicant/JobInfoCard";

function ApplicantHome() {
  const formik = useFormik({
    initialValues: {
      searchQuery: "",
      sortBy: "Salary",
      sortOrder: "desc",
      jobType: "any",
      jobDuration: 0,
      minSalary: 1000,
      maxSalary: 10000,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
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
                    <option>Salary</option>
                    <option>Duration</option>
                    <option>Rating</option>
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
                  <option value="">Any</option>
                  <option>Part Time</option>
                  <option>Full Time</option>
                  <option>Work from Home</option>
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
                  value={formik.values.jobDuration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="jobDuration"
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
          {range(5).map((idx) => (
            <Row className="mt-3" key={idx}>
              <Col>
                <JobInfoCard jobId={idx} />
              </Col>
            </Row>
          ))}
          <Row className="mt-3">
            <Col>
              <Button variant="dark">Previous</Button>
            </Col>
            <Col className="text-right">
              <Button variant="dark">Next</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ApplicantHome;
