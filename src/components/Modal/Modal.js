import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalComp = ({
  show,
  setShow,
  save,
  cancel,
  onSave,
  onCancel,
  title,
  children,
}) => {
  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {cancel && (
          <Button variant="secondary" onClick={() => setShow(false)}>
            {cancel}
          </Button>
        )}
        {save && (
          <Button variant="primary" onClick={onSave}>
            {save}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComp;
