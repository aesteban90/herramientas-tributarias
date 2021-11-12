import React from "react";
import "./modal.css";


function Modal({ setOpenModal, actionConfirmModal, title, body, actionString }) {
    let activeBtnAceptar = true;
    let activeBtnCancelar = true;
    let textBtnAceptar = "Aceptar";
    let textBtnCancelar = "Cancelar";
    
    switch (actionString) {
        case "informante":
            activeBtnCancelar = false;
            textBtnAceptar = "Ir a Configurar Informante";
            break;
        case "ruc-vinculado-informante":
            textBtnAceptar = "Ir a Configurar Informante";
            break;
        case "informante-actual-delete":           
            activeBtnAceptar = false;
            break;
        default:
            break;
    }

  return (      
    <div className="modal">
        <div className="modalBackground"></div>
        <div className="modalContainer">
            <div className="title">
                <h5>{title}</h5>
            </div>
            <div className="body">
                <p>{body}</p>
            </div>
            <div className="footer">
                {activeBtnCancelar && <button className="btn btn-light mr-4" onClick={() => {setOpenModal()}}>{textBtnCancelar}</button>}
                {activeBtnAceptar && <button className="btn btn-success mr-4" onClick={() => {actionConfirmModal()}}>{textBtnAceptar}</button>}
            </div>
        </div>
    </div>
  );
}

export default Modal;