import React, { useEffect, useState, useCallback } from 'react';

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

  // Función para intercambiar el 'authorization code' por el 'access token' (memorizada con useCallback)

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
  }, [exchangeCodeForToken]); // Aquí agregamos `exchangeCodeForToken` como dependencia

  return (
    <div>
      <h1>OAuth 2.0 Authentication</h1>

      {/* Botón para iniciar el proceso de autorización */}
      {!accessToken && (
        <div>
          <button onClick={authorize}>Authorize with Mercado Libre</button>
          <p>{'Waiting for authorization...'}</p>
        </div>
      )}

      {/* Mostrar el access token cuando está disponible */}
      {accessToken && (
        <div>
          <h2>Your Access Token:</h2>
          <p>{accessToken}</p> {/* Muestra el access token en la página */}
        </div>
      )}
    </div>
  );
};

export default OAuth2Component;
