import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import axios from "axios";
import { store } from "react-notifications-component";

type ApplyModalProps = {
  jobId: string;
  showModal: boolean;
  setShowModal: Function;
};

const ApplicationSchema = Yup.object().shape({
  sop: Yup.string().required().max(250).label("Statement of purpose"),
});

function ApplyModal({ jobId, showModal, setShowModal }: ApplyModalProps) {
  const formik = useFormik({
    initialValues: {
      sop: "",
    },
    validationSchema: ApplicationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`/api/jobs/apply/${jobId}`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        store.addNotification({
          container: "bottom-right",
          type: "success",
          message: response.data.message,
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });

        setShowModal(false);
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
      }
    },
  });

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Statement of Purpose</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="sop">
            <Form.Control
              value={formik.values.sop}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.sop && !!formik.errors.sop}
              placeholder="Enter your statement of purpose..."
              as="textarea"
              rows={4}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.sop}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="outline-success" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ApplyModal;
