import { useFormik } from "formik";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import "yup-phone";
import { getUserData, updateUserData } from "../../APIService";
import UserContext from "../../contexts/UserContext";

const RecruiterSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  contact: Yup.string().phone().required().label("Phone"),
  bio: Yup.string().max(250).required().label("Bio"),
});

type RecruiterProfileFormProps = {
  initialValues: {
    name: string;
    contact: number | string;
    bio: string;
  };
  setLoading: (loading: boolean) => void;
};

function RecruiterProfileForm({
  initialValues,
  setLoading,
}: RecruiterProfileFormProps) {
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues,
    validationSchema: RecruiterSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await updateUserData({ userType: "recruiter", ...values } as User);
      const user = (await getUserData()) || {};
      setUser(user as User);
      setLoading(false);
    },
    enableReinitialize: true,
  });

  return (
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
          {formik.errors.name}
        </Form.Control.Feedback>
      </Form.Group>
      <Card.Title>Contact Number</Card.Title>
      <Form.Group controlId="contact">
        <Form.Control
          type="tel"
          placeholder="Contact Number"
          value={formik.values.contact}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.contact && !!formik.errors.contact}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.contact}
        </Form.Control.Feedback>
      </Form.Group>

      <Card.Title>About you</Card.Title>
      <Form.Group controlId="bio">
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Bio (Max 250 characters)"
          value={formik.values.bio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.bio && !!formik.errors.bio}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.bio}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="dark" type="submit">
        Continue
      </Button>
    </Form>
  );
}

export default RecruiterProfileForm;
