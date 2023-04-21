import "./comicsList.scss";
import React, { useState, useEffect } from "react";
import { Transition, TransitionGroup } from "react-transition-group";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";

const ComicsList = () => {
  const { loading, error, getAllComics } = useMarvelService();
  const [comicsList, setComicsList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset).then(onComicsListLoaded);
  };

  const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList.length < 8) {
      ended = true;
    }
    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setNewItemLoading(false);
    setOffset(offset + 8);
    setComicsEnded(ended);
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }
      const duration = 500;

      const defaultStyle = {
        transition: `all ${duration}ms ease-in-out`,
        opacity: 0,
      };

      const transitionStyles = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 },
      };
      return (
        <Transition timeout={duration} mountOnEnter unmountOnExit>
          {(state) => (
            <li
              className="comics__item"
              key={i}
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
            >
              <Link to={`${item.id}`}>
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  style={imgStyle}
                  className="comics__item-img"
                />
                <div className="comics__item-name">{item.title}</div>
                <div className="comics__item-price">{item.price}</div>
              </Link>
            </li>
          )}
        </Transition>
      );
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return (
      <ul className="comics__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  const items = renderItems(comicsList);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {items}

      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
