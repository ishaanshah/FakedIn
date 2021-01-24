// TODO: Applicant form validation for educaiton field wise
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import { useContext } from "react";
import { Plus, X } from "react-bootstrap-icons";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import "yup-phone";
import { getUserData, updateUserData } from "../../APIService";
import UserContext from "../../contexts/UserContext";

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
        startYear: Yup.number().integer().required().min(0).label("Start year"),
        endYear: Yup.number()
          .integer()
          .when(
            "startYear",
            (startYear: number, schema: any) =>
              startYear &&
              schema.min(
                startYear,
                "End year should be greater than or equal to start year"
              )
          )
          .label("End year"),
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
      setLoading(true);
      await updateUserData({ userType: "applicant", ...values } as User);
      const user = (await getUserData()) || {};
      setUser(user as User);
      setLoading(false);
    },
    validationSchema: ApplicantSchema,
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
            isInvalid={formik.touched.name && !!formik.errors.name}
          />
          <Form.Control.Feedback type="invalid">
            formik.errors.name
          </Form.Control.Feedback>
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
                        isInvalid={
                          formik.touched.education && !!formik.errors.education
                        }
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
                        isInvalid={
                          formik.touched.education && !!formik.errors.education
                        }
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
                        isInvalid={
                          formik.touched.education && !!formik.errors.education
                        }
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
        <Button variant="dark" type="submit">
          Continue
        </Button>
      </Form>
    </FormikProvider>
  );
}

export default ApplicantProfileForm;
