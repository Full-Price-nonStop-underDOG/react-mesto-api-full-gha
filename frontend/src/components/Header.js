import React from "react";
import logImg from "../images/Vector.svg";
import { useLocation, Link, useNavigate } from "react-router-dom";

function Header(props) {
  const way = useLocation();

  const handleSignOut = () => {
    props.onSignOut();
    // Перенаправление на страницу входа после выхода
  };
  return (
    <header className="header header_opacity">
      <img
        className="header__logo"
        src={logImg}
        require="true"
        alt="логотип-место"
      />

      {way.pathname === "/sign-in" && (
        <Link to="/sign-up" className="header-text">
          Регистрация
        </Link>
      )}
      {way.pathname === "/sign-up" && (
        <Link to="/sign-in" className="header-text">
          Войти
        </Link>
      )}
      {way.pathname === "/" && (
        <div className="header__info">
          <p className="header-email header-text">{props.email}</p>
          <Link to="/sign-in" className="header-text" onClick={handleSignOut}>
            Выйти
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
