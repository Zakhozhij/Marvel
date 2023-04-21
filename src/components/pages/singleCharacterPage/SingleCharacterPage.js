import "./singleCharacterPage.scss";
import { Link } from "react-router-dom";

const SingleCharPage = ({ data }) => {
  const { name, description, thumbnail } = data;
  let imgStyle = { objectFit: "cover" };
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = { objectFit: "contain" };
  }
  return (
    <div className="single-char">
      <img
        src={thumbnail}
        alt={name}
        style={imgStyle}
        className="single-char__img"
      />
      <div className="single-char__info">
        <h2 className="single-char__name">{name}</h2>
        <p className="single-char__descr">{description}</p>
      </div>
      <Link to="/" className="single-char__back">
        Back to all
      </Link>
    </div>
  );
};
export default SingleCharPage;
