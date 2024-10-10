const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

async function getRandomItems() {
  const response = await fetch(
    'https://api.mercadolibre.com.mx/sites/MLM/search?q=producto',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  // Obtén algunos productos aleatoriamente
  const randomItems = data.results.sort(() => 0.5 - Math.random()).slice(0, 5); // Muestra 5 productos aleatorios

  // Muestra los productos en tu página web
  randomItems.forEach((item) => {
    document.body.innerHTML += `<div>
      <h2>${item.title}</h2>
      <img src="${item.thumbnail}" />
      <p>Precio: $${item.price}</p>
      <a href="${item.permalink}" target="_blank">Ver producto</a>
    </div>`;
  });
}

getRandomItems();
