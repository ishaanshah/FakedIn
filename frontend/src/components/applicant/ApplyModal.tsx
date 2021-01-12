import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

type ApplyModalProps = {
  jobId: number;
  showModal: boolean;
  setShowModal: Function;
};

function ApplyModal({ jobId, showModal, setShowModal }: ApplyModalProps) {
  const formik = useFormik({
    initialValues: {
      sop: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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
              formik.errors.sop
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
