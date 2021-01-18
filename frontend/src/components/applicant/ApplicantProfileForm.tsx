// TODO: Applicant form validation
import axios from "axios";
import { store } from "react-notifications-component";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import { Plus, X } from "react-bootstrap-icons";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import "yup-phone";
import UserContext from "../../contexts/UserContext";
import { useContext } from "react";
import { getUserData } from "../../APIService";
import { pickBy, identity } from "lodash";

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
  name: Yup.string().required().label("Name"),
  education: Yup.array()
    .of(
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
          }),
      })
    )
    .min(1)
    .required()
    .label("Education"),
  skills: Yup.array()
    .of(Yup.string().required())
    .min(1)
    .required()
    .label("Skills"),
  resume: Yup.mixed().notRequired().default(null),
});

type ApplicantProfileFormProps = {
  initialValues: {
    name: string;
    education: Array<{
      institutionName: string;
      startYear: number | string;
      endYear?: number | string;
    }>;
    skills: Array<string>;
    //TODO: resume?: File;
  };
  setLoading: (loading: boolean) => void;
};

function ApplicantProfileForm({
  initialValues,
  setLoading,
}: ApplicantProfileFormProps) {
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "/api/user/update_user_info",
          {
            userType: "applicant",
            name: values.name,
            skills: values.skills,
            education: values.education.map((entry) => {
              if (entry.endYear === "") {
                return {
                  institutionName: entry.institutionName,
                  startYear: entry.startYear,
                };
              } else {
                return entry;
              }
            }),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        store.addNotification({
          container: "bottom-right",
          type: "success",
          message: response.data.message,
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });

        const user = (await getUserData()) || {};
        setUser(user as User);
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
    enableReinitialize: true,
  });

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <Card.Title>Name</Card.Title>
        <Form.Group controlId="name">
          <Form.Control
            type="text"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Group>
        <Card.Title>Education</Card.Title>
        <FieldArray name="education">
          {({ insert, remove }) => (
            <>
              {formik.values.education.map((entry, idx) => (
                <Form.Row key={idx}>
                  <Col xs={4}>
                    <Field
                      as={Form.Group}
                      controlId={`education.${idx}.institutionName`}
                    >
                      <Form.Control
                        type="text"
                        placeholder="Institution Name"
                        value={entry.institutionName}
                        onChange={formik.handleChange}
                      />
                    </Field>
                  </Col>
                  <Col xs={3}>
                    <Field
                      as={Form.Group}
                      controlId={`education.${idx}.startYear`}
                    >
                      <Form.Control
                        type="number"
                        placeholder="Start Year"
                        value={entry.startYear}
                        onChange={formik.handleChange}
                      />
                    </Field>
                  </Col>
                  <Col xs={3}>
                    <Field
                      as={Form.Group}
                      controlId={`education.${idx}.endYear`}
                    >
                      <Form.Control
                        type="number"
                        placeholder="End Year"
                        value={entry.endYear}
                        onChange={formik.handleChange}
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
                      disabled={formik.values.education.length === 1}
                    >
                      <X size={24} onClick={() => remove(idx)} />
                    </Button>
                  </Col>
                </Form.Row>
              ))}
            </>
          )}
        </FieldArray>
        <Card.Title>Skills</Card.Title>
        <Form.Group controlId="skills">
          <Typeahead
            id="skill-chooser"
            options={Skills}
            placeholder="Choose your skills..."
            onChange={(selected) => formik.setFieldValue("skills", selected)}
            onBlur={() => formik.setFieldTouched("skills")}
            selected={formik.values.skills}
            allowNew
            clearButton
            multiple
          />
        </Form.Group>
        {/* TODO:
          <Card.Title>Resume</Card.Title>
          <Form.Group controlId="resume">
            <Form.File
              label={
                formik.values.resume
                ? formik.values.resume.name
                : "Upload your resume"
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.currentTarget.files?.length) {
                  formik.setFieldValue("resume", event.currentTarget.files[0]);
                }
              }}
              custom
            />
          </Form.Group>
          */}
        <Button variant="dark" type="submit">
          Continue
        </Button>
      </Form>
    </FormikProvider>
  );
}

export default ApplicantProfileForm;
