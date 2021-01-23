import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import axios from "axios";
import { store } from "react-notifications-component";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";

type ApplyModalProps = {
  jobId: string;
  showModal: boolean;
  setShowModal: Function;
  refresh: number;
  setRefresh: (value: number) => void;
};

const ApplicationSchema = Yup.object().shape({
  sop: Yup.string().required().max(250).label("Statement of purpose"),
});

function ApplyModal({
  jobId,
  showModal,
  setShowModal,
  refresh,
  setRefresh,
}: ApplyModalProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      sop: "",
    },
    validationSchema: ApplicationSchema,
    onSubmit: async (values) => {
      setLoading(true);
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

        setRefresh(refresh + 1);
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
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      contentClassName="justify-content-center"
      centered
    >
      {loading && (
        <Spinner
          animation="border"
          className="align-self-center"
          style={{ position: "absolute", zIndex: 100 }}
        />
      )}
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Statement of Purpose</Modal.Title>
        </Modal.Header>
        <div style={{ opacity: loading ? 0.5 : 1 }}>
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
            <Button variant="dark" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </div>
      </Form>
    </Modal>
  );
}

export default ApplyModal;
