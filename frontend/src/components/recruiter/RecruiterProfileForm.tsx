import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import "yup-phone";

const RecruiterSchema = Yup.object().shape({
  recruiterContact: Yup.string().phone().required().label("Phone"),
  recruiterBio: Yup.string().max(250).required().label("Bio"),
});

type RecruiterProfileFormProps = {
  initialValues: {
    recruiterContact: number | string;
    recruiterBio: string;
  };
};

function RecruiterProfileForm({ initialValues }: RecruiterProfileFormProps) {
  const formikRecruiter = useFormik({
    initialValues,
    validationSchema: RecruiterSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Form onSubmit={formikRecruiter.handleSubmit}>
      <Card.Title>Contact Number</Card.Title>
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

      <Card.Title>About you</Card.Title>
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
  );
}

export default RecruiterProfileForm;
