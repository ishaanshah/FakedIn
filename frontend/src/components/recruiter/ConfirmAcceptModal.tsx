import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { store } from "react-notifications-component";

function ConfirmAcceptModal({
  appId,
  showModal,
  setShowModal,
  refresh,
  setRefresh,
}: {
  appId: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  refresh: number;
  setRefresh: (value: number) => void;
}) {
  const handleClick = async () => {
    try {
      const response = await axios.get(`/api/applications/accept/${appId}`, {
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
      <Modal.Header>Confirm acceptance</Modal.Header>
      <Modal.Body>Are you sure you want to accept the applicant?</Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleClick}>
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmAcceptModal;
