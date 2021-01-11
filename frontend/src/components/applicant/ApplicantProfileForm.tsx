// TODO: Applicant form validation
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import { Plus, X } from "react-bootstrap-icons";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
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
  applicantEducation: Yup.array()
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
  applicantSkills: Yup.array()
    .of(Yup.string().required())
    .min(1)
    .required()
    .label("Skills"),
  applicantResume: Yup.mixed().notRequired().default(null),
});

type ApplicantProfileFormProps = {
  initialValues: {
    applicantEducation: Array<{
      institutionName: string;
      startYear: number | string;
      endYear?: number | string;
    }>;
    applicantSkills: Array<string>;
    applicantResume?: File;
  };
};

function ApplicantProfileForm({ initialValues }: ApplicantProfileFormProps) {
  const formikApplicant = useFormik({
    initialValues,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <FormikProvider value={formikApplicant}>
      <Form onSubmit={formikApplicant.handleSubmit}>
        <Card.Title>Education</Card.Title>
        <FieldArray name="applicantEducation">
          {({ insert, remove }) => (
            <>
              {formikApplicant.values.applicantEducation.map((entry, idx) => (
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
                        formikApplicant.values.applicantEducation.length === 1
                      }
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
        <Form.Group controlId="applicantSkills">
          <Typeahead
            id="skill-chooser"
            options={Skills}
            placeholder="Choose your skills..."
            onChange={(selected) =>
              formikApplicant.setFieldValue("applicantSkills", selected)
            }
            onBlur={() => formikApplicant.setFieldTouched("applicantSkills")}
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
                ? formikApplicant.values.applicantResume.name
                : "Upload your resume"
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
  );
}

export default ApplicantProfileForm;
