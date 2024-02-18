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

  // Definición de fetchData
  const fetchData = async (url) => {
    console.log(url);
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

  // Uso de useEffect para observar 'termino' cada vez que cambie
  useEffect(() => {
    if (termino) {
      const url = `https://gateway.marvel.com/v1/public/${termino}${timestamp}&apikey=${clavePublica}&hash=${hash}`;
      fetchData(url);
    }
  }, [termino]);

  const handleSearch = () => {
    setTermino(`characters?name=${encodeURIComponent(input)}`);
  };

  const handleClear = () => {
    setInput("");
    onReset(false);
    setError(false);
  };
  const buscarComic = () => {
    let inputEntero = input;
    let terminoParcial =
      "comics?titleStartsWith=" +
      input.toLowerCase().split(" ").slice(0, 2).join(" ");
    const urlParcial = `https://gateway.marvel.com/v1/public/${terminoParcial}${timestamp}&apikey=${clavePublica}&hash=${hash}`;
    fetch(urlParcial)
      .then((response) => response.json())
      .then((datos) => {
        // Filtra los resultados para encontrar el cómic que coincide exactamente con el input completo
        let comicExacto = datos.data.results.find(
          (comic) => comic.title.toLowerCase() === inputEntero.toLowerCase()
        );
        if (comicExacto) {
          // Si se encuentra el cómic exacto, busca por su ID
          let terminoExacto = `comics/${comicExacto.id}`;
          setTermino(terminoExacto);
        }
      });
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
