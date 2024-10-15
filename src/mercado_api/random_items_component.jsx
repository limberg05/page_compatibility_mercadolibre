import React, { useEffect, useState, useCallback } from 'react';
import { SearchForm, buildUrl, fetchItemsFromAPI } from './';

const RandomItemsComponent = () => {
  const [items, setItems] = useState([]); // Estado para guardar los productos
  const [error, setError] = useState(null); // Estado para errores
  const [loading, setLoading] = useState(false); // Estado para mostrar indicador de carga

  // Estado para los filtros de búsqueda
  const [searchParams, setSearchParams] = useState({
    category: 'MLM1648',
    query: 'procesadores',
    priceMin: '',
    priceMax: '',
    sort: 'relevance',
  });

  // Función para obtener productos desde la API de Mercado Libre
  const getRandomItems = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('No access token found. Please authenticate first.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = buildUrl(searchParams); // Llamamos a buildUrl con los parámetros
      const data = await fetchItemsFromAPI(url, accessToken); // Llamada a la API
      setItems(data.results);
      setError(null); // Limpiar errores
    } catch (err) {
      setError(`Error fetching products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    getRandomItems();
  };

  useEffect(() => {
    getRandomItems(); // Llama a la función cuando el componente se monta
  }, [getRandomItems]);

  return (
    <div>
      <h1>Buscar Procesadores</h1>
      {/* Formulario para filtros */}
      <SearchForm
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        handleSubmit={handleSubmit}
      />
      {/* Mensajes y resultados */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : items.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} style={{ marginBottom: '20px' }}>
              <h2>{item.title}</h2>
              <img src={item.thumbnail} alt={item.title} />
              <p>Precio: ${item.price}</p>
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver producto
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RandomItemsComponent;
