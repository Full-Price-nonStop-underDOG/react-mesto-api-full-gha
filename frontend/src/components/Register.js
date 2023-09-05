import React, { useState, useEffect, useRef } from 'react';
import AuthenticationForm from './AuthenticationForm';
import { useNavigate } from 'react-router-dom';

function Register(props) {
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  function handleSubmit(email, password) {
    props.onRegistration(email, password);
  }

  useEffect(() => {
    if (props.isRegistrationSuccessful) {
      setRegistrationSuccess(true);
    }
  }, [props.isRegistrationSuccessful]);

  useEffect(() => {
    if (registrationSuccess) {
      console.log('Registration Successful');
      navigate('/sign-in', { replace: true });
    }
  }, [registrationSuccess, navigate]);

  return (
    <AuthenticationForm
      title='Регистрация'
      buttonText='Зарегистрироваться'
      onSubmit={handleSubmit}
    />
  );
}

export default Register;
