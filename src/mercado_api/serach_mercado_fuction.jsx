import React, { useEffect, useState } from 'react';

const RandomItemsComponent = () => {
  const [items, setItems] = useState([]); // Estado para guardar los productos
  const [error, setError] = useState(null); // Estado para errores
  const [loading, setLoading] = useState(true); // Estado para mostrar indicador de carga

  // Función para obtener productos aleatorios desde la API de Mercado Libre
  const getRandomItems = async () => {
    const accessToken = localStorage.getItem('accessToken'); // Obtén el accessToken del localStorage

    if (!accessToken) {
      setError('No access token found. Please authenticate first.');
      setLoading(false); // Detener la carga si no hay token
      return;
    }

    try {
      const response = await fetch(
        'https://api.mercadolibre.com/sites/MLM/search?q=producto',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching products');
      }

      // Obtén algunos productos aleatoriamente
      const randomItems = data.results
        .sort(() => 0.5 - Math.random())
        .slice(0, 5); // Muestra 5 productos aleatorios

      // Actualiza el estado con los productos obtenidos
      setItems(randomItems);
      setError(null); // Si no hay error, limpiamos el mensaje de error
    } catch (err) {
      setError(`Error fetching products: ${err.message}`);
    } finally {
      setLoading(false); // Detenemos el indicador de carga una vez finalizada la petición
    }
  };

  useEffect(() => {
    getRandomItems(); // Llama a la función cuando el componente se monta
  }, []);

  return (
    <div>
      <h1>Random Products</h1>
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
