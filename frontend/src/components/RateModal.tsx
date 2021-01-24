import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { store } from "react-notifications-component";
import { useState } from "react";
import { range } from "lodash";

function RateModal({
  id,
  showModal,
  setShowModal,
  variant,
}: {
  id: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  variant: "recruiter" | "applicant";
}) {
  const [rating, setRating] = useState(0);
  const handleClick = async () => {
    try {
      const url =
        variant === "recruiter"
          ? `/api/user/rate/${id}`
          : `/api/jobs/rate/${id}`;
      const response = await axios.post(
        url,
        { rating },
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
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      contentClassName="justify-content-center"
      size="sm"
      centered
    >
      <Modal.Header>
        Rate {variant === "recruiter" ? "applicant" : "job"}
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          as="select"
          onChange={(event) => setRating(Number(event.target.value))}
        >
          {range(5).map((idx) => (
            <option value={idx + 1}>{idx + 1} / 5 Stars</option>
          ))}
        </Form.Control>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="dark" onClick={handleClick}>
          Rate
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RateModal;
