import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({ Component, dataType }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { loading, error, getCharacter, getComics, clearError } =
    useMarvelService();

  useEffect(() => {
    updateData();
  }, [id]);

  const onDataLoaded = (data) => {
    
    setData(data);
  };

  const updateData = () => {
    clearError();
    switch (dataType) {
      case "comic":
        getComics(id).then(onDataLoaded);
        break;
      case "character":
        getCharacter(id).then(onDataLoaded);
    }
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(error || loading || !data) ? (
    <Component data={data} />
  ) : null;

  return (
    <>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default SinglePage;
