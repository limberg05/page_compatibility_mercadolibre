import React, { useEffect, useState, useCallback } from 'react';

// Generar un 'state' aleatorio para evitar ataques CSRF
const generateState = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const OAuth2Component = () => {
  const [accessToken, setAccessToken] = useState(null);

  const clientId = process.env.REACT_APP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI;

  // Función para intercambiar el 'authorization code' por el 'access token'
  const exchangeCodeForToken = useCallback(
    async (authorizationCode) => {
      try {
        const response = await fetch(
          'https://api.mercadolibre.com/oauth/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: clientId,
              client_secret: clientSecret,
              code: authorizationCode,
              redirect_uri: redirectUri,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.log('Error Response:', data); // Log the full error response for debugging
          throw new Error(`Error al obtener el token: ${response.statusText}`);
        }

        setAccessToken(data.access_token);
        localStorage.setItem('accessToken', data.access_token);
        console.log('Access Token:', data.access_token);
      } catch (error) {
        console.error('Error al intercambiar el authorization code:', error);
      }
    },
    [clientId, clientSecret, redirectUri]
  );

  // Verificar si la URL de redirección contiene el 'authorization code'
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    const returnedState = urlParams.get('state');
    const savedState = sessionStorage.getItem('oauthState');

    if (authorizationCode && returnedState === savedState) {
      exchangeCodeForToken(authorizationCode); // Intercambiar el código por el access token
    }
  }, [exchangeCodeForToken]);

  // Función para iniciar el proceso de autorización
  const authorize = () => {
    const state = generateState();
    const authUrl = `https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=read offline_access`;
    sessionStorage.setItem('oauthState', state);
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>OAuth 2.0 Authentication</h1>
      {!accessToken ? (
        <div>
          <button onClick={authorize}>Authorize with Mercado Libre</button>
          <p>{'Waiting for authorization...'}</p>
        </div>
      ) : (
        <div>
          <h2>Your Access Token:</h2>
          <p>{accessToken}</p>
        </div>
      )}
    </div>
  );
};

export default OAuth2Component;
