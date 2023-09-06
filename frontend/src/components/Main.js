import React, { useEffect, useState } from "react";
import pencillImg from "../images/pencill.svg";
import Card from "./Card";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  cards,
  onCardClick,
  CurrentUserContext,
  handleCardLike,
  onCardDelete,
}) {
  return (
    <main className="main">
      <section className="profile">
        <div
          className="profile__avatar"
          style={{
            backgroundImage: `url(${CurrentUserContext.avatar})`,
          }}
          alt="аватар"
        />
        <button
          className="profile__edit-avatar"
          type="button"
          onClick={onEditAvatar}
        >
          <img
            className="profile__pencil"
            src={pencillImg}
            require="true"
            alt="Карандаш"
          />
        </button>
        <div className="profile__info">
          <div className="profile__info-description">
            <h1 className="profile__name">{CurrentUserContext.name}</h1>
            <p className="profile__job">{CurrentUserContext.about}</p>
          </div>
          <button
            className="profile__button-edit"
            type="button"
            aria-label="Редактировать"
            onClick={onEditProfile}
          ></button>
        </div>
        <button
          className="profile__button-add"
          type="button"
          aria-label="Добавить"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="mesta">
        {cards.length > 0 ? (
          cards.map((card) => (
            <Card
              card={card}
              onCardClick={onCardClick}
              onCardLike={handleCardLike}
              onCardDelete={onCardDelete}
              key={card?._id}
            />
          ))
        ) : (
          <p>No cards to display</p>
        )}
      </section>
    </main>
  );
}

export default Main;
