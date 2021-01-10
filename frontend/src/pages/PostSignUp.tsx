// TODO: Applicant form validation
import { useFormik, FormikProvider, FieldArray, Field } from "formik";
import { useState } from "react";
import { X, Plus } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";
import { Typeahead } from "react-bootstrap-typeahead";
import "yup-phone";

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

const ApplicantSchema = Yup.object().shape({
  applicantEducation: Yup.array().of(
    Yup.object().shape({
      institutionName: Yup.string().required().label("Institution name"),
      startYear: Yup.number()
        .integer()
        .default(null)
        .required()
        .label("Start year"),
      endYear: Yup.number()
        .integer()
        .when("startYear", {
          is: (startYear: number) => !!startYear,
          then: Yup.number().min(Yup.ref("startYear") as any),
        })
        .required()
        .min(1)
        .label("Education"),
    })
  ),
  applicantSkills: Yup.string().required().label("Skills"),
});

const RecruiterSchema = Yup.object().shape({
  recruiterContact: Yup.string().phone().required().label("Phone"),
  recruiterBio: Yup.string().max(250).required().label("Bio"),
});

function PostSignUp() {
  // State denoting type of the user i.e Recruiter or Applicant
  const [userRole, setUserRole] = useState("applicant");

  const formikApplicant = useFormik({
    initialValues: {
      applicantEducation: [
        {
          institutionName: "",
          startYear: "",
          endYear: "",
        },
      ],
      applicantSkills: [],
      applicantResume: null,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const formikRecruiter = useFormik({
    initialValues: {
      recruiterContact: "",
      recruiterBio: "",
    },
    validationSchema: RecruiterSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <div style={{ fontSize: "3em" }}>
            Hi <b>John Doe</b>!
          </div>
          <br />
          <div style={{ fontSize: "1.5em" }}>
            We'll need some more information about you and you'll be good to go
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Header>
              <Nav
                fill
                variant="tabs"
                defaultActiveKey="applicant"
                onSelect={(selectedTab) => {
                  if (selectedTab) {
                    setUserRole(selectedTab);
                  }
                }}
              >
                <Nav.Item>
                  <Nav.Link eventKey="applicant">I'm an Applicant</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="recruiter">I'm a Recruiter</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            {userRole === "applicant" && (
              <Card.Body>
                <Card.Title>Education</Card.Title>
                <FormikProvider value={formikApplicant}>
                  <Form onSubmit={formikApplicant.handleSubmit}>
                    <FieldArray name="applicantEducation">
                      {({ insert, remove }) => (
                        <>
                          {formikApplicant.values.applicantEducation.map(
                            (entry, idx) => (
                              <Form.Row key={idx}>
                                <Col xs={4}>
                                  <Field
                                    as={Form.Group}
                                    controlId={`applicantEducation.${idx}.institutionName`}
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder="Institution Name"
                                      value={entry.institutionName}
                                      onChange={formikApplicant.handleChange}
                                    />
                                  </Field>
                                </Col>
                                <Col xs={3}>
                                  <Field
                                    as={Form.Group}
                                    controlId={`applicantEducation.${idx}.startYear`}
                                  >
                                    <Form.Control
                                      type="number"
                                      placeholder="Start Year"
                                      value={entry.startYear}
                                      onChange={formikApplicant.handleChange}
                                    />
                                  </Field>
                                </Col>
                                <Col xs={3}>
                                  <Field
                                    as={Form.Group}
                                    controlId={`applicantEducation.${idx}.endYear`}
                                  >
                                    <Form.Control
                                      type="number"
                                      placeholder="End Year"
                                      value={entry.endYear}
                                      onChange={formikApplicant.handleChange}
                                    />
                                  </Field>
                                </Col>
                                <Col>
                                  <Button
                                    variant="dark"
                                    onClick={() =>
                                      insert(idx + 1, {
                                        institutionName: "",
                                        startYear: "",
                                        endYear: "",
                                      })
                                    }
                                  >
                                    <Plus size={24} />
                                  </Button>
                                  &nbsp;&nbsp;
                                  <Button
                                    variant="dark"
                                    disabled={
                                      formikApplicant.values.applicantEducation
                                        .length === 1
                                    }
                                  >
                                    <X size={24} onClick={() => remove(idx)} />
                                  </Button>
                                </Col>
                              </Form.Row>
                            )
                          )}
                        </>
                      )}
                    </FieldArray>
                    <Card.Title>Skills</Card.Title>
                    <Form.Group controlId="applicantSkills">
                      <Typeahead
                        id="skill-chooser"
                        options={Skills}
                        placeholder="Choose your skills..."
                        onChange={(selected) =>
                          formikApplicant.setFieldValue(
                            "applicantSkills",
                            selected
                          )
                        }
                        onBlur={() =>
                          formikApplicant.setFieldTouched("applicantSkills")
                        }
                        selected={formikApplicant.values.applicantSkills}
                        allowNew
                        clearButton
                        multiple
                      />
                    </Form.Group>
                    <Card.Title>Resume</Card.Title>
                    <Form.Group controlId="applicantResume">
                      <Form.File
                        label={
                          formikApplicant.values.applicantResume
                            ? (formikApplicant.values.applicantResume! as File)
                                .name
                            : "Upload your resume"
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (event.currentTarget.files?.length) {
                            formikApplicant.setFieldValue(
                              "applicantResume",
                              event.currentTarget.files[0]
                            );
                          }
                        }}
                        custom
                      />
                    </Form.Group>
                    <Button variant="dark" type="submit">
                      Continue
                    </Button>
                  </Form>
                </FormikProvider>
              </Card.Body>
            )}
            {userRole === "recruiter" && (
              <Card.Body>
                <Form onSubmit={formikRecruiter.handleSubmit}>
                  <Form.Group controlId="recruiterContact">
                    <Form.Control
                      type="tel"
                      placeholder="Contact Number"
                      value={formikRecruiter.values.recruiterContact}
                      onChange={formikRecruiter.handleChange}
                      onBlur={formikRecruiter.handleBlur}
                      isInvalid={
                        formikRecruiter.touched.recruiterContact &&
                        !!formikRecruiter.errors.recruiterContact
                      }
                      isValid={
                        formikRecruiter.touched.recruiterContact &&
                        !formikRecruiter.errors.recruiterContact
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikRecruiter.errors.recruiterContact}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="recruiterBio">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Bio (Max 250 characters)"
                      value={formikRecruiter.values.recruiterBio}
                      onChange={formikRecruiter.handleChange}
                      onBlur={formikRecruiter.handleBlur}
                      isInvalid={
                        formikRecruiter.touched.recruiterBio &&
                        !!formikRecruiter.errors.recruiterBio
                      }
                      isValid={
                        formikRecruiter.touched.recruiterBio &&
                        !formikRecruiter.errors.recruiterBio
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikRecruiter.errors.recruiterBio}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="dark" type="submit">
                    Continue
                  </Button>
                </Form>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PostSignUp;
