import axios from "axios";
import { useFormik } from "formik";
import { range } from "lodash";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import DatePicker from "react-datepicker";
import { store } from "react-notifications-component";
import * as Yup from "yup";

// List of available skills
const Skills = [
  "C/C++",
  "Python",
  "JavaScript",
  "ReactJS",
  "ExpressJS",
  "Java",
  "Data Science",
  "Ruby",
  "ML/DL",
  "Haskell",
  "Lua",
];

const PostJobSchema = Yup.object().shape({
  title: Yup.string().required().label("Job title"),
  skillsRequired: Yup.array().of(Yup.string()).min(1).required().label("Skill"),
  maxApplicants: Yup.number()
    .min(1)
    .integer()
    .required()
    .label("Max applications"),
  positions: Yup.number().min(1).integer().required().label("Positions"),
  deadline: Yup.date()
    .min(new Date(), "Deadline should be a date in the future")
    .required()
    .label("Deadline"),
  jobType: Yup.mixed()
    .oneOf(["full", "part", "home"])
    .required()
    .label("Job type"),
  duration: Yup.number().integer().min(0).max(7).required().label("Duration"),
  salary: Yup.number().min(0).required().label("Salary"),
});

function PostJob() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      maxApplicants: "",
      positions: "",
      deadline: new Date(),
      skillsRequired: [],
      jobType: "full",
      duration: 0,
      salary: "",
    },
    validationSchema: PostJobSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post("/api/jobs/post_job", values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        store.addNotification({
          type: "success",
          message: response.data.message,
          container: "bottom-right",
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });

        formik.resetForm();
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
  });

  return (
    <Container>
      <Row className="mt-3 mb-2">
        <Col>
          <h1>Post a job</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="justify-content-center">
            {loading && (
              <Spinner
                style={{ position: "absolute", zIndex: 100 }}
                className="align-self-center"
                animation="border"
              />
            )}
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Card.Title>Job Title</Card.Title>
                <Form.Group controlId="title">
                  <Form.Control
                    type="text"
                    placeholder="Job Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.title && !!formik.errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
                <Card.Title>Skills</Card.Title>
                <Form.Group controlId="skillsRequired">
                  <Typeahead
                    id="skill-chooser"
                    options={Skills}
                    placeholder="Choose skills required..."
                    onChange={(selected) =>
                      formik.setFieldValue("skillsRequired", selected)
                    }
                    onBlur={() => formik.setFieldTouched("skillsRequired")}
                    selected={formik.values.skillsRequired}
                    isInvalid={
                      formik.touched.skillsRequired &&
                      !!formik.errors.skillsRequired
                    }
                    allowNew
                    clearButton
                    multiple
                  />
                  <div className="invalid-feedback d-block">
                    {formik.touched.skillsRequired &&
                      formik.errors.skillsRequired}
                  </div>
                </Form.Group>
                <Form.Row>
                  <Col>
                    <Card.Title>Maximum Applications</Card.Title>
                    <Form.Group controlId="maxApplicants">
                      <Form.Control
                        value={formik.values.maxApplicants}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Maximum Applications"
                        type="number"
                        isInvalid={
                          formik.touched.maxApplicants &&
                          !!formik.errors.maxApplicants
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.maxApplicants}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Card.Title>Positions</Card.Title>
                    <Form.Group controlId="positions">
                      <Form.Control
                        value={formik.values.positions}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Positions"
                        type="number"
                        isInvalid={
                          formik.touched.positions && !!formik.errors.positions
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.positions}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Card.Title>Salary (&#8377; / Month)</Card.Title>
                    <Form.Group controlId="salary">
                      <Form.Control
                        value={formik.values.salary}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Salary"
                        type="number"
                        isInvalid={
                          formik.touched.salary && !!formik.errors.salary
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.salary}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col>
                    <Card.Title>Job Type</Card.Title>
                    <Form.Group controlId="jobType">
                      <Form.Control
                        value={formik.values.jobType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.jobType && !!formik.errors.jobType
                        }
                        as="select"
                        custom
                      >
                        <option value="full">Full Time</option>
                        <option value="part">Part Time</option>
                        <option value="home">Work from home</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Card.Title>Job Duration</Card.Title>
                    <Form.Group controlId="duration">
                      <Form.Control
                        value={formik.values.duration}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.duration && !!formik.errors.duration
                        }
                        as="select"
                        custom
                      >
                        {range(1, 7).map((month) => (
                          <option value={month} key={month}>
                            {month} {month === 1 ? "Month" : "Months"}
                          </option>
                        ))}
                        <option value={0}>Indefinite</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Card.Title>Deadline</Card.Title>
                    <Form.Group controlId="deadline">
                      <DatePicker
                        selected={formik.values.deadline}
                        dateFormat="dd/MM/yyyy h:mm aa"
                        customInput={
                          <Form.Control
                            isInvalid={
                              formik.touched.deadline &&
                              !!formik.errors.deadline
                            }
                          />
                        }
                        onChange={(date) =>
                          formik.setFieldValue("deadline", date)
                        }
                        onBlur={() => formik.setFieldTouched("deadline")}
                        showPopperArrow={false}
                        wrapperClassName="w-100"
                        minDate={new Date()}
                        showTimeInput
                      />
                      <div className="d-block invalid-feedback">
                        {formik.touched.deadline && formik.errors.deadline}
                      </div>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Button variant="dark" type="submit">
                  Post
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PostJob;
