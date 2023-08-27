import React, { useState, useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit-profile"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      textButton={props.isLoading ? "Сохранение..." : "Сохранить"}
    >
      <input
        placeholder="Имя"
        minLength="2"
        maxLength="40"
        className="form__field form__text form__field_text_name"
        id="name-input"
        name="name"
        value={name || ""}
        onChange={handleNameChange}
        required
      />
      <span className="form__field-error name-input-error">
        Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.
      </span>
      <input
        placeholder="О себе"
        minLength="4"
        maxLength="200"
        required
        className="form__field form__text form__field_text_job"
        id="job-input"
        value={description || ""}
        name="about"
        onChange={handleDescriptionChange}
      />
      <span className="form__field-error form__field-error job-input-error">
        Расскажите о себе
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
