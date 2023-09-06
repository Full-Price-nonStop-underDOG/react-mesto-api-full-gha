import React, { useState } from "react";

function PopupWithForm(props) {
  const [isError, setIsError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    props.onSubmit(e);
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onClose();
      setIsClosing(false);
    }, 300);
  };

  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_open" : ""
      } ${isClosing ? "closing" : ""}`}
    >
      <div className="popup__container">
        <form
          className="popup__form"
          name={props.name}
          noValidate
          onSubmit={handleSubmit}
        >
          <h2 className="form__title">{props.title}</h2>
          {props.children}
          <button
            className="form__button"
            type="submit"
            aria-label="Сохранить"
            disabled={props.isLoading}
          >
            {props.textButton ||
              (props.isLoading ? "Сохранение..." : "Сохранить")}
          </button>
        </form>
        <button
          className="popup__close"
          type="button"
          aria-label="Закрыть"
          onClick={handleClose}
        ></button>
      </div>
    </div>
  );
}

export default PopupWithForm;
