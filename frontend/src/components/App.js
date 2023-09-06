import React, { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  navigate,
  Navigate,
  useNavigate,
  redirect,
} from 'react-router-dom';
import Header from '../components/Header.js';
import Main from '../components/Main.js';
import Footer from '../components/Footer.js';
import PopupWithForm from './PopupWithForm.js';
import api from '../utils/Api.js';
import ImagePopup from './ImagePopup.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import Register from './Register.js';
import ProtectedRouteElement from './ProtectedRoute.js';
import Login from './Login.js';
import authenticationApi from '../utils/AuthenticationApi.js';
import InfoToolTip from './InfoTooltip.js';

// app.js — входной файл

export function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [email, setEmail] = React.useState('');
  const [isRegistrationSuccessful, setRegistrationSuccessful] = useState(false);

  const resetRegistrationStatus = () => {
    setRegistrationSuccessful(false);
  };

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});
  const [isLuck, setIsLuck] = React.useState(false);
  const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] =
    React.useState(false);

  useEffect(() => {
    console.log(isLoggedIn, 'isloggedIn');
  }, [isLoggedIn]);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const checkTokensAndFetchData = async () => {
      const jwt = localStorage.getItem('jwt');

      if (jwt) {
        try {
          const res = await authenticationApi.checkToken(jwt);

          setEmail(res.email);
          console.log('Token check success');
        } catch (err) {
          if (err.status === 401) {
            console.log('401 — токен не передан');
          }
          console.log('401 — токен некорректен', jwt, err);
        }
      }

      setIsLoading(true);

      Promise.all([api.getUserInfo(jwt), api.getInitialCardsData(jwt)])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    };

    checkTokensAndFetchData();

    if (isLoggedIn === false) {
      redirect('/sign-in', { replace: true });
    }
  }, [isLoggedIn]); // Эффект будет срабатывать при изменении isLoggedIn

  function handleSignOut() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    redirect('/sign-in', { replace: true });
  }

  async function loginSubmit(email, password) {
    try {
      const res = await authenticationApi.login(email, password);
      localStorage.setItem('jwt', res.token);
      setIsLoggedIn(true);
      console.log(res.token);
      console.log('login');
      setEmail(email);
      redirect('/', { replace: true });
    } catch (err) {
      if (err.status === 400) {
        console.log('400 - не передано одно из полей');
      } else if (err.status === 401) {
        console.log('401 - пользователя с данным email не сущетсвует');
      }
    }
  }

  async function registerSubmit(email, password) {
    try {
      await authenticationApi.register(email, password);

      setIsLuck(true);

      setRegistrationSuccessful(true);
      //console.log(isRegistrationSuccessful);
      redirect('/sign-in', { replace: true });
      setInfoToolTipPopupOpen(true);
    } catch (err) {
      if (err.status === 400) {
        console.log('400 - поле заполненно некорректно');
      }
      setInfoToolTipPopupOpen(true);
      setIsLuck(false);
      setRegistrationSuccessful(false);
      console.log(isRegistrationSuccessful);
    }
  }

  // useEffect(() => {
  //   if (isRegistrationSuccessful) {
  //     console.log("xxxx");
  //     redirect("/sign-in", { replace: true });
  //   } else {
  //     console.log("fuck this I am an idiot");
  //   }
  // }, [isRegistrationSuccessful]);

  function handleCardLike(card) {
    const jwt = localStorage.getItem('jwt');

    const isLiked = card.likes.some((i) => i === currentUser._id);

    console.log(card);
    if (isLiked) {
      api
        .removeLike(card._id, jwt)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.error('Error removing like:', error);
        });
    } else {
      api
        .addLike(card._id, jwt)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.error('Error adding like:', error);
        });
    }
  }

  function handleCardDelete(card) {
    const jwt = localStorage.getItem('jwt');
    console.log(card);
    console.log(card._id);
    api
      .removeCard(card._id, jwt)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.log('Ошибка при удалении карточки:', error);
      });
  }

  function handleUpdateUser(userData) {
    const jwt = localStorage.getItem('jwt');
    console.log(userData);
    setIsLoading(true); // Устанавливаем состояние загрузки в true перед отправкой запроса
    api
      .editProfileInfo(userData, jwt)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
        setIsLoading(false); // Устанавливаем состояние загрузки в false после получения ответа
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Устанавливаем состояние загрузки в false в случае ошибки
      });
  }

  function handleUpdateAvatar(newAvatar) {
    const jwt = localStorage.getItem('jwt');
    setIsLoading(true); // Устанавливаем состояние загрузки в true перед отправкой запроса
    api
      .updateProfileUserAvatar(newAvatar, jwt)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
        setIsLoading(false); // Устанавливаем состояние загрузки в false после получения ответа
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Устанавливаем состояние загрузки в false в случае ошибки
      });
  }

  function handleAddPlaceSubmit(newCard, setError) {
    const jwt = localStorage.getItem('jwt');
    setIsLoading(true); // Set loading state to true before sending the request
    api
      .addNewCard(newCard, jwt)
      .then((addedCard) => {
        setCards([addedCard, ...cards]);
        closeAllPopups();
        setIsLoading(false); // Set loading state to false after receiving the response
      })
      .catch((error) => {
        console.log('Error adding card:', error);
        setError('Имя карточки слишком длинное.'); // Set the error message
        setIsLoading(false); // Set loading state to false in case of an error
      });
  }

  const handleEditAvatarClick = (event) => {
    setEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = (event) => {
    setEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = (event) => {
    setAddPlacePopupOpen(true);
  };

  const closeAllPopups = (event) => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setInfoToolTipPopupOpen(false);
    setSelectedCard(null);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  // useEffect(() => {
  //   api
  //     .getUserInfo()
  //     .then((data) => {
  //       setCurrentUser(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  return (
    <CurrentUserContext.Provider value={currentUser || ''}>
      <div className='page'>
        <BrowserRouter>
          <Header
            email={email}
            onSignOut={handleSignOut}
            isLoggedIn={isLoggedIn}
          />

          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRouteElement
                  element={Main}
                  isLoggedIn={isLoggedIn}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  cards={cards}
                  onCardClick={handleCardClick}
                  CurrentUserContext={currentUser}
                  handleCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              }
            />

            <Route
              path='/sign-up'
              element={
                <Register
                  onRegistration={registerSubmit}
                  isRegistrationSuccessful={isRegistrationSuccessful}
                  resetRegistrationStatus={resetRegistrationStatus}
                  redirect={redirect}
                  replace
                />
              }
            />
            <Route
              path='/sign-in'
              element={
                <Login
                  onLogin={loginSubmit}
                  replace
                  resetRegistrationStatus={resetRegistrationStatus}
                />
              }
            />
          </Routes>
        </BrowserRouter>
        {isLoggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        ></AddPlacePopup>

        <div className='popup popup_type_confirmation'>
          <div className='popup__container'>
            <button type='button' className='popup__close'></button>
            <form className='popup__form'>
              <h2 className='popup__title'>Вы уверены?</h2>
              <button type='submit' className='popup__submit'>
                Да
              </button>
            </form>
          </div>
        </div>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        ></EditAvatarPopup>
        {selectedCard && (
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        )}
        <InfoToolTip
          isLuck={isLuck}
          isOpen={isInfoToolTipPopupOpen}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
