import React, { useState, useEffect, useRef } from "react";
import AuthenticationForm from "./AuthenticationForm";
import { useNavigate } from "react-router-dom";

function Register(props) {
  const navigate = useNavigate();
  function handleSubmit(email, password) {
    props.onRegistration(email, password);
  }

  useEffect(() => {
    if (props.isRegistrationSuccessful) {
      console.log("xxxx");
      navigate("/sign-in", { replace: true });
    } else {
      console.log("fuck this I am an idiot");
    }
  }, [props.isRegistrationSuccessful]);

  // async function handleSubmit(email, password) {
  //   try {
  //     await props.onRegistration(email, password);

  //     if (props.isRegistrationSuccessful) {
  //       console.log(props.isRegistrationSuccessful, "ватафак");
  //       navigate("/sign-in");
  //     }
  //   } catch (error) {
  //     console.log(props.isRegistrationSuccessful);
  //   }
  // }

  return (
    <AuthenticationForm
      title="Регистрация"
      buttonText="Зарегистрироваться"
      onSubmit={handleSubmit}
    />
  );
}

export default Register;
