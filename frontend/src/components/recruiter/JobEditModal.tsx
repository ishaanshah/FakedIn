import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import DatePicker from "react-datepicker";
import { store } from "react-notifications-component";
import * as Yup from "yup";

const EditJobSchema = Yup.object().shape({
  maxApplicants: Yup.number()
    .min(1)
    .integer()
    .required()
    .label("Max Applications"),
  positions: Yup.number().min(1).integer().required().label("Positions"),
  deadline: Yup.date().required().label("Deadline"),
});

function ConfirmDeleteModal({
  jobId,
  showModal,
  setShowModal,
  refresh,
  setRefresh,
  maxApplicants,
  positions,
  deadline,
}: {
  jobId: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  refresh: number;
  setRefresh: (value: number) => void;
  maxApplicants: number;
  positions: number;
  deadline: Date;
}) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      maxApplicants: maxApplicants || 1,
      positions: positions || 1,
      deadline: deadline || new Date(),
    },
    validationSchema: EditJobSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post(
          "/api/jobs/edit_job",
          { jobId, ...values },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        <Modal.Header>Update job details</Modal.Header>
        <div style={{ opacity: loading ? 0.5 : 1 }}>
          <Modal.Body>
            <Form.Row>
              <Col>
                <Form.Group controlId="maxApplicants">
                  <Form.Label>Max applications</Form.Label>
                  <Form.Control
                    value={formik.values.maxApplicants}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.maxApplicants &&
                      !!formik.errors.maxApplicants
                    }
                    placeholder="Max applications"
                    type="number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.maxApplicants}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="positions">
                  <Form.Label>Positions</Form.Label>
                  <Form.Control
                    value={formik.values.positions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.positions && !!formik.errors.positions
                    }
                    placeholder="Positions"
                    type="number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.positions}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Group controlId="deadline">
              <Form.Label>Deadline</Form.Label>
              <DatePicker
                selected={formik.values.deadline}
                dateFormat="dd/MM/yyyy h:mm aa"
                minDate={deadline}
                customInput={
                  <Form.Control
                    isInvalid={
                      formik.touched.deadline && !!formik.errors.deadline
                    }
                  />
                }
                onChange={(date) => formik.setFieldValue("deadline", date)}
                onBlur={() => formik.setFieldTouched("deadline")}
                showPopperArrow={false}
                wrapperClassName="w-100"
                showTimeInput
              />
              <div className="d-block invalid-feedback">
                {formik.touched.deadline && formik.errors.deadline}
              </div>
            </Form.Group>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Update
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ConfirmDeleteModal;
