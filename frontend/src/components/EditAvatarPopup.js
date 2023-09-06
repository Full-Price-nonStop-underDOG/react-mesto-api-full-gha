import React, { useState, useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarRef = useRef();
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!props.isOpen) {
      setAvatar("");
    }
  }, [props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  function handleAvatarChange(event) {
    setAvatar(event.target.value);
  }

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="update-avatar"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      textButton={props.isLoading ? "Сохранение..." : "Сохранить"}
    >
      <input
        type="url"
        name="avatar"
        id="form__field-card-avatar"
        className="form__field form__field_text_avatar"
        placeholder="Введите ссылку URL"
        ref={avatarRef}
        value={avatar}
        onChange={handleAvatarChange}
        required
      />
      <span className="form__field-error form__field-card-avatar-error">
        Введите URL
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
