import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function MenuModal(props) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button style={{backgroundColor:'mintcream', color:'#000892 '}} variant="info" onClick={handleShow}>
        Additional Info
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.item[0]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Allergens: {props.item[2]}</Modal.Body>
        <Modal.Body>Nutritional Content: {props.item[3]}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default MenuModal;