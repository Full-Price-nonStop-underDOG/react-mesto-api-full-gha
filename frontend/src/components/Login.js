import React, { useEffect } from 'react';
import AuthenticationForm from './AuthenticationForm';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const navigate = useNavigate();

  useEffect(() => {
    props.resetRegistrationStatus();
  }, []);

  async function handleSubmit(email, password) {
    try {
      await props.onLogin(email, password);
      navigate('/'); // Перенаправление на главную страницу при успешном входе
    } catch (error) {
      // Обработка ошибки входа (например, показ сообщения об ошибке)
      console.error('Ошибка входа:', error);
    }
  }

  return (
    <AuthenticationForm
      title='Вход'
      buttonText='Войти'
      onSubmit={handleSubmit}
    />
  );
}

export default Login;
