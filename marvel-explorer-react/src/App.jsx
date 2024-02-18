// import { useState } from 'react'
import reactLogo from "./assets/react.svg";
import "./App.css";
import SearchBar from "./SearchBar.jsx";
import Card from "./Card.jsx";
import { useState } from "react";

function App() {
  //Hooks para personaje
  const [id, setId] = useState("");
  const [nombre, setNombrePersonaje] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  // //Hooks para comics
  const [nombreComic, setNombreComic] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [creadores, setCreadores] = useState("");
  const [imagenComic, setImagenComic] = useState("");
  const [fechaLanzamiento, setFechaLanzamiento] = useState("");
  //Hooks para visibilidad de las cards
  const [cardVisiblePersonaje, setCardVisiblePersonaje] = useState(false);
  const [cardVisibleComic, setCardVisibleComic] = useState(false);

  function obtenerDatosPersonaje(personaje) {
    if (!personaje || !personaje.name || !personaje.thumbnail) {
      return;
    }
    setNombrePersonaje(personaje.name);
    let imagenUrl =
      personaje.thumbnail.path + "." + personaje.thumbnail.extension;
    setImagen(imagenUrl);
    if (personaje.description) {
      setDescripcion(personaje.description);
    } else {
      setDescripcion("El personaje no tiene descripcion");
    }
    setId(personaje.id);
    setCardVisiblePersonaje(true);
  }

  function obtenerDatosComic(comic) {
    if (!comic || !comic.title || !comic.thumbnail || !comic.creators) {
      return;
    }
    let imagenUrl = comic.thumbnail.path + "." + comic.thumbnail.extension;
    let creadores = comic.creators.items.map((creador) => {
      return creador.name;
    });
    setNombreComic(comic.title);
    if (comic.description === null) {
      setSinopsis("El comic no tiene sinopsis");
    } else {
      setSinopsis(comic.description);
    }
    setCreadores(creadores);
    setImagenComic(imagenUrl);
    setCardVisibleComic(true);
    setFechaLanzamiento(comic.dates[0].date);
    setCardVisibleComic(true);
  }
  function handleSearch(datos) {
    obtenerDatosPersonaje(datos);
    obtenerDatosComic(datos);
  }

  function handleClear() {
    setCardVisiblePersonaje(false);
    setCardVisibleComic(false);
  }
  return (
    <>
      <h1 className="logoMarvel">MARVEL EXPLORER</h1>
      <h2 className="tituloBuscador">BUSCA TUS PERSONAJES FAVORITOS</h2>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>

      <SearchBar onSearch={handleSearch} onReset={handleClear} />
      {cardVisiblePersonaje ? (
        <Card
          nombre={nombre}
          imagen={imagen}
          descripcion={descripcion}
          id={id}
        />
      ) : (
        <></>
      )}
      {cardVisibleComic ? (
        <Card
          nombre={nombreComic}
          imagen={imagenComic}
          descripcion={sinopsis}
          creadores={creadores}
          fechaLanzamiento={fechaLanzamiento}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
