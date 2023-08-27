import React, { useState, useEffect, useRef } from "react";
import AuthenticationForm from "./AuthenticationForm";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();

  async function handleSubmit(email, password) {
    await props.onLogin(email, password);
    navigate("/"); // Перенаправление на главную страницу
  }

  return (
    <AuthenticationForm
      title="Вход"
      buttonText="Войти"
      onSubmit={handleSubmit}
    />
  );
}

export default Login;
