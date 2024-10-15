import React, { useEffect, useState, useCallback } from 'react';

const RandomItemsComponent = () => {
  const [items, setItems] = useState([]); // Estado para guardar los productos
  const [error, setError] = useState(null); // Estado para errores
  const [loading, setLoading] = useState(false); // Estado para mostrar indicador de carga

  // Estado para los filtros de búsqueda
  const [searchParams, setSearchParams] = useState({
    category: 'MLM1648', // Categoría para computacion
    query: 'procesadores',
    priceMin: '',
    priceMax: '',
    brand: ['AMD', 'Intel'],
    sort: 'relevance', // Parámetro de orden: relevance, price_asc, price_desc
  });

  // Función para manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  // Función para construir la URL con los filtros, envuelta en useCallback
  const buildUrl = useCallback(() => {
    const { category, query, priceMin, priceMax, brand, sort } = searchParams;
    let url = `https://api.mercadolibre.com/sites/MLM/search?category=${category}&q=${query}`;

    if (priceMin) url += `&price=${priceMin}-${priceMax || ''}`;
    if (brand) url += `&brand=${brand}`;
    if (sort) url += `&sort=${sort}`;

    return url;
  }, [searchParams]); // searchParams es la dependencia aquí

  // Función para obtener productos desde la API de Mercado Libre
  const getRandomItems = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken'); // Obtén el accessToken del localStorage

    if (!accessToken) {
      setError('No access token found. Please authenticate first.');
      setLoading(false); // Detener la carga si no hay token
      return;
    }

    try {
      setLoading(true); // Activar la carga mientras se realiza la petición
      const url = buildUrl(); // Llamamos a la función buildUrl
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching products');
      }

      // Actualiza el estado con los productos obtenidos
      setItems(data.results);
      setError(null); // Si no hay error, limpiamos el mensaje de error
    } catch (err) {
      setError(`Error fetching products: ${err.message}`);
    } finally {
      setLoading(false); // Detenemos el indicador de carga una vez finalizada la petición
    }
  }, [buildUrl]); // buildUrl es una dependencia

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    getRandomItems();
  };

  useEffect(() => {
    getRandomItems(); // Llama a la función cuando el componente se monta
  }, [getRandomItems]); // Ahora 'getRandomItems' es estable debido a useCallback

  return (
    <div>
      <h1>Buscar Procesadores</h1>

      {/* Formulario para filtros */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Palabra clave: </label>
          <input
            type="text"
            name="query"
            value={searchParams.query}
            onChange={handleInputChange}
            placeholder="procesadores"
          />
        </div>

        <div>
          <label>Marca: </label>
          <input
            type="text"
            name="brand"
            value={searchParams.brand}
            onChange={handleInputChange}
            placeholder="Ej: Intel, AMD"
          />
        </div>

        <div>
          <label>Precio mínimo: </label>
          <input
            type="number"
            name="priceMin"
            value={searchParams.priceMin}
            onChange={handleInputChange}
            placeholder="Ej: 1000"
          />
        </div>

        <div>
          <label>Precio máximo: </label>
          <input
            type="number"
            name="priceMax"
            value={searchParams.priceMax}
            onChange={handleInputChange}
            placeholder="Ej: 5000"
          />
        </div>

        <div>
          <label>Ordenar por: </label>
          <select
            name="sort"
            value={searchParams.sort}
            onChange={handleInputChange}
          >
            <option value="relevance">Relevancia</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>

        <button type="submit">Buscar</button>
      </form>

      {/* Mensaje de error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Cargando */}
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
