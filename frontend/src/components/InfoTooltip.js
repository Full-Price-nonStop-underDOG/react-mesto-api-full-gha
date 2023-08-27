import React from "react";
import cancel from "../images/cancel.png";
import Union from "../images/Union.png";

function InfoToolTip(props) {
  return (
    <div
      className={`popup popup_type_tooltip ${props.isOpen ? "popup_open" : ""}`}
    >
      <div className="popup__container">
        <div className="popup__form">
          {props.isLuck ? (
            <>
              <img
                src={`${Union}`}
                alt="Регистрация прошла успешно."
                className="popup__tooltip_image"
              />
              <p className="popup__tooltip_text">
                Вы успешно зарегистрировались!
              </p>
            </>
          ) : (
            <>
              <img
                src={`${cancel}`}
                alt="Ошибка при регистрации."
                className="popup__tooltip_image"
              />
              <p className="popup__tooltip_text">
                Что-то пошло не так. Попробуйте ещё раз!
              </p>
            </>
          )}
          <button
            className="popup__close"
            type="button"
            aria-label="Закрыть"
            onClick={props.onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default InfoToolTip;
