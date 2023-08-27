import React from "react";

function ImagePopup({ card, onClose }) {
  console.log("image popup");
  return (
    <div
      className={`popup popup_img popup_background_black ${
        card ? "popup_open" : ""
      }`}
    >
      <div className="popup__container popup__container-img">
        <img
          className="popup__fullscreen-image"
          src={card.link}
          alt={card.name}
        />
        <p className="popup__fullscreen-title">{card.name}</p>
        <button
          className="popup__close"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
