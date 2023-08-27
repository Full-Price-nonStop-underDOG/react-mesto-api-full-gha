import { React, useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = props.card?.owner._id === currentUser._id;
  const isLiked = props.card?.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `mesto__like ${
    isLiked && "mesto__like_active"
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  return (
    <div className="mesto" key={props.card?._id}>
      {isOwn && (
        <button
          className="mesto__delete"
          type="button"
          aria-label="Удалить"
          onClick={handleDeleteClick}
        />
      )}

      <div
        className="mesto__img"
        style={{ backgroundImage: `url(${props.card?.link})` }}
        onClick={handleClick}
      />
      <div className="mesto__non-image">
        <h2 className="mesto__title">{props.card?.name}</h2>
        <div className="mesto__like-container">
          <button
            className={cardLikeButtonClassName}
            type="button"
            aria-label="Лайк"
            onClick={handleLikeClick}
          ></button>
          <p className="mesto__amount-like">{props.card?.likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
