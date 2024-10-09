import React, { useEffect, useState } from 'react';

// Generar un 'state' aleatorio para evitar ataques CSRF
const generateState = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const OAuth2Component = () => {
  // Definir un estado para almacenar el 'access token'
  const [accessToken, setAccessToken] = useState(null);

  // Variables de configuración para la autenticación en Mercado Libre
  const clientId = process.env.REACT_APP_CLIENT_ID; // Reemplaza con tu Client ID
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET; // Reemplaza con tu Client Secret
  const redirectUri = process.env.REACT_APP_REDIRECT_URI; // La URI que registraste en tu app de Mercado Libre

  // Función para redirigir al usuario a la página de autenticación de Mercado Libre
  const authorize = () => {
    const state = generateState(); // Genera un valor de state aleatorio para seguridad
    const authUrl = `https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    // Guardar el 'state' generado en sessionStorage para verificarlo luego cuando recibamos la respuesta
    sessionStorage.setItem('oauthState', state);

    // Redirigir al usuario a la URL de autorización de Mercado Libre
    window.location.href = authUrl;
  };

  // Función para intercambiar el 'authorization code' por el 'access token'
  const exchangeCodeForToken = async (authorizationCode) => {
    // Realizamos una solicitud POST a la API de Mercado Libre para obtener el access token
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code', // Tipo de flujo que estamos usando
        client_id: clientId, // Client ID de nuestra aplicación
        client_secret: clientSecret, // Client Secret de nuestra aplicación
        code: authorizationCode, // El código de autorización obtenido tras la redirección
        redirect_uri: redirectUri, // La URI de redirección registrada
      }),
    });

    // Parsear la respuesta para obtener el access token
    const data = await response.json();
    console.log('Access Token:', data.access_token); // Imprimir el token en la consola
    setAccessToken(data.access_token); // Guardar el access token en el estado de React
    localStorage.setItem('accessToken', data.access_token); // Almacenarlo en localStorage para futuras solicitudes
  };

  // Verificar si la URL de redirección contiene el 'authorization code' al cargar el componente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Extraer los parámetros de la URL
    const authorizationCode = urlParams.get('code'); // Obtener el código de autorización si está presente
    const returnedState = urlParams.get('state'); // Obtener el 'state' devuelto
    const savedState = sessionStorage.getItem('oauthState'); // Obtener el 'state' que guardamos antes

    // Verificar que el 'state' coincida para mayor seguridad y evitar ataques CSRF
    if (authorizationCode && returnedState === savedState) {
      exchangeCodeForToken(authorizationCode); // Si es válido, intercambiar el código por el access token
    }
  }, []);

  // Ejemplo de una función para hacer una solicitud a un recurso protegido usando el access token
  const fetchProtectedResource = async () => {
    const token = accessToken || localStorage.getItem('accessToken'); // Obtener el token desde el estado o localStorage
    if (!token) {
      console.error('No access token found'); // Mostrar error si no hay token
      return;
    }

    // Realizar una solicitud GET a un recurso protegido de la API de Mercado Libre
    const response = await fetch(
      'https://api.mercadolibre.com/some-protected-endpoint', // Reemplaza con el endpoint que necesites
      {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en los encabezados
        },
      }
    );

    // Parsear la respuesta y mostrarla en la consola
    const data = await response.json();
    console.log('Protected Resource Data:', data);
  };

  return (
    <div>
      <h1>OAuth 2.0 Authentication</h1>

      {/* Botón para iniciar el proceso de autorización */}
      {!accessToken && (
        <button onClick={authorize}>Authorize with Mercado Libre</button> // Si no hay token, mostrar el botón para autorizar
      )}

      {/* Botón para hacer una solicitud a un recurso protegido */}
      {accessToken && (
        <button onClick={fetchProtectedResource}>
          Fetch Protected Resource
        </button> // Si ya tienes el token, mostrar el botón para hacer la solicitud
      )}
    </div>
  );
};

export default OAuth2Component;
