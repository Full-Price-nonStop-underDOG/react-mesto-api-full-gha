import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  function handleNewNameChange(event) {
    setName(event.target.value);
  }

  function handleNewLinkChange(event) {
    setLink(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Clear previous error message
    if (name.length > 30) {
      setError("Название должно содержать максимум 30 символов");
      return;
    }
    // Send request to the server
    props.onAddPlace(
      {
        name,
        link,
      },
      setError // Pass setError as a callback to handle errors
    );
  }

  function handleClose() {
    setName("");
    setLink("");
    setError(""); // Clear the error message when the popup is closed
    props.onClose();
  }

  useEffect(() => {
    if (!props.isOpen) {
      setName("");
      setLink("");
      setError(""); // Clear the error message when the popup is closed
    }
  }, [props.isOpen]);

  return (
    <PopupWithForm
      title="Новое место"
      name="new-card"
      isOpen={props.isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      textButton={props.isLoading ? "Добавление..." : "Добавить"}
    >
      <input
        minLength="4"
        maxLength="30"
        className="form__field form__text"
        id="form__field-card-text"
        name="name"
        value={name}
        onChange={handleNewNameChange}
        placeholder="Название"
        required
      />
      {error && (
        <span className="form__field-card-text-error form__field-error text-input-error form__field-error_visible">
          {error}
        </span>
      )}
      <span className="form__field-card-text-error form__field-error text-input-error">
        Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.
      </span>
      <input
        type="url"
        className="form__field form__text"
        id="form__field-card-image"
        name="link"
        value={link}
        onChange={handleNewLinkChange}
        placeholder="Ссылка на картинку"
        required
      />

      <span className="form__field-card-image-error form__field-error image-input-error">
        Введите URL
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
