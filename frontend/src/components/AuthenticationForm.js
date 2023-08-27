import React, { useState } from "react";
import { Link } from "react-router-dom";

function AuthenticationForm({ onSubmit, title, buttonText }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(email, password);
  }

  return (
    <div className="page">
      <section className="authentication">
        <h2 className="authentication__title">{title}</h2>
        <form className="authentication__form" onSubmit={handleSubmit}>
          <input
            className="authentication__form-input"
            placeholder="Email"
            name="email"
            type="email"
            required
            value={email || ""}
            onChange={handleEmailChange}
          />
          <input
            className="authentication__form-input"
            placeholder="Пароль"
            name="password"
            type="password"
            required
            value={password || ""}
            onChange={handlePasswordChange}
          />

          <button className="authentication__form-submit" type="submit">
            {buttonText}
          </button>

          <div className="authentication__sign-up">
            <p className="authentication__sign-up_words">
              {title === "Регистрация" ? "Уже зарегистрированы?" : ""}
            </p>
            <Link
              to={title === "Регистрация" ? "" : ""}
              className="authentication__sign-up_words"
            >
              {title === "Регистрация" ? "Войти" : ""}
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AuthenticationForm;
