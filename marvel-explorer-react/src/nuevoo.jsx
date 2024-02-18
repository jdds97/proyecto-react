import { useState, useEffect } from "react";
import md5 from "md5";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

function SearchBar({ onSearch, onReset }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [termino, setTermino] = useState(""); // Inicialmente busca por nombre
  const ts = 1;
  const clavePublica = "6c6852c85207adba9e725a4d7e5de26e";
  const clavePrivada = "ed1eb9958e767573a19ff94480cd0cb8c55b6ea9";
  const timestamp = `&ts=${ts}`;
  const hash = md5(`${ts}${clavePrivada}${clavePublica}`);

  useEffect(() => {
    const fetchData = async (url) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo realizar la solicitud");
          }
          return response.json();
        })
        .then((data) => {
          const resultados = data.data.results;
          if (resultados.length === 0) {
            // Si la búsqueda por nombre no devuelve resultados, cambia a buscar por cómic
            buscarComic();
          } else {
            const datos = resultados[0];
            onSearch(datos);
            setError(false);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(true);
        });
    };
  
    const buscarComic = () => {
      const termino =
        "comics?titleStartsWith=" +
        input.toLowerCase().split(" ").slice(0, 2).join(" ");
      const url = `https://gateway.marvel.com/v1/public/${termino}${timestamp}&apikey=${clavePublica}&hash=${hash}`;
      fetch(url)
        .then((response) => response.json())
        .then((comicData) => {
          const matchingComics = comicData.data.results;
          if (matchingComics.length > 0) {
            const exactMatch = matchingComics.find(
              (comic) => comic.title.toLowerCase() === input.toLowerCase()
            );
            if (exactMatch) {
              setTermino("comics/" + exactMatch.id);
              const url = `https://gateway.marvel.com/v1/public/${termino}${timestamp}&apikey=${clavePublica}&hash=${hash}`;
              fetchData(url);
            }
          }
        })
        .catch((error) =>
          console.error("Error al obtener datos del cómic:", error)
        );
    };
  
    if (termino) {
      const url = `https://gateway.marvel.com/v1/public/${termino}${timestamp}&apikey=${clavePublica}&hash=${hash}`;
      fetchData(url);
    }
  }, [termino, onSearch, clavePublica, hash, timestamp, input]);

  const handleSearch = () => {
    setTermino(`characters?name=${encodeURIComponent(input)}`);
  };

  const buscarComic = () => {
    setTermino(
      `comics?titleStartsWith=${encodeURIComponent(
        input.toLowerCase().split(" ").slice(0, 2).join(" ")
      )}`
    );
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const comics = data.data.results; // Accede a todos los resultados de cómics
      const matchingComics = comics.filter((comic) => {
        // Verificar si el título del cómic contiene al menos las dos primeras palabras del título proporcionado
        const comicTitleWords = comic.title.toLowerCase().split(" ");
        const searchTitleWords = input.toLowerCase().split(" ");
        return comicTitleWords
          .slice(0, 2)
          .every((word, index) => word === searchTitleWords[index]);
      });

      if (matchingComics.length > 0) {
        // Buscar el cómic con el título exacto dentro de los cómics que coinciden con las dos primeras palabras
        const exactMatch = matchingComics.find(
          (comic) => comic.title.toLowerCase() === input.toLowerCase()
        );

        if (exactMatch) {
          setTermino("comics/" + exactMatch.id);
          // Si se encuentra una coincidencia exacta, obtener los detalles del cómic
          fetch(url)
            .then((response) => response.json())
            .then((comicData) => {
              // Manipula los datos como desees, por ejemplo, mostrando los resultados en la consola
              onSearch(comicData.data.results[0]);
            })
            .catch((error) =>
              console.error("Error al obtener datos del cómic:", error)
            );
        } else {
          console.log("No se encontró un cómic con el título exacto.");
        }
      } else {
        console.log(
          "No se encontraron cómics que coincidan con las dos primeras palabras del título proporcionado."
        );
      }
    })
    .catch((error) => console.error("Error al obtener cómics:", error));
}
  };

  const handleClear = () => {
    setInput("");
    onReset(false);
  };

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="button-container">
          <button onClick={handleSearch} className="search-button">
            Buscar
          </button>
          <button onClick={handleClear} className="clear-button">
            Limpiar Info
          </button>
        </div>
      </div>
      {error && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert variant="filled" severity="error">
            El personaje con el nombre no existe
          </Alert>
        </Stack>
      )}
    </>
  );
}

export default SearchBar;
