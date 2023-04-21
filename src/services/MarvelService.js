import md5 from "js-md5";
import { useHttp } from "../hooks/http.hook";
const useMarvelService = () => {
  const { loading, request, error,clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiPublicKey = "ddbedf86d07d57be97ba5a729d69a17b";
  const _apiPrivateKey = "76a1050540337430bf894a1b8d258207e5644df5";
  const _ts = Number(new Date());
  let _hash = md5.create().update(_ts + _apiPrivateKey + _apiPublicKey);
  let baseOffset = 210;

  const getBaseOffset = () => {
    return baseOffset;
  };
  const add9ToBaseOffset = (offset) => {
    baseOffset = offset + 9;
  };

  const getAllCharacters = async (offset = getBaseOffset()) => {
    const res = await request(
      `${_apiBase}characters?ts=${_ts}&limit=9&offset=${offset}&apikey=${_apiPublicKey}&hash=${_hash}`
    );
    add9ToBaseOffset(offset);
    return res.data.results.map(_transformCharacter);
  };
  const getCharacter = async (id) => {
    const res = await request(
      `${_apiBase}characters/${id}?ts=${_ts}&apikey=${_apiPublicKey}&hash=${_hash}`
    );
    return _transformCharacter(res.data.results[0]);
  };

  const getCharacterByName = async (name) => {
    const res = await request(
      `${_apiBase}characters?name=${name}&limit=1&ts=${_ts}&apikey=${_apiPublicKey}&hash=${_hash}`
    );
    return _transformCharacter(res.data.results[0]);
  };




  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 200)}...`
        : "There is no description for this character",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items.slice(0, 10),
    };
  };

  const getAllComics = async (offset = 0) => {
    const res = await request(
      `${_apiBase}comics?orderBy=issueNumber&ts=${_ts}&limit=8&offset=${offset}&apikey=${_apiPublicKey}&hash=${_hash}`
    );
    return res.data.results.map(_transformComics);
  };
  const getComics = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?ts=${_ts}&apikey=${_apiPublicKey}&hash=${_hash}`);
		return _transformComics(res.data.results[0]);
	};

  const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
	};

  return { loading, error, getAllCharacters, getCharacter, getBaseOffset,clearError,getAllComics,getComics,getCharacterByName };
};
export default useMarvelService;
