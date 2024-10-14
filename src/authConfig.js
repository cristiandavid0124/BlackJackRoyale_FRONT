const msalConfig = {
    auth: {
        clientId: "a18be00e-d104-4272-b36c-7a05bee4eff4", // Tu client ID
        authority: "https://login.microsoftonline.com/4d4d334a-9797-4b89-b8e9-28946972b8f3/v2.0", // Tu issuer-uri
        redirectUri: "http://localhost:3000", // Cambia esto por la URL de tu aplicación en producción
    },
    cache: {
        cacheLocation: "localStorage", // Puedes usar localStorage o sessionStorage
        storeAuthStateInCookie: false, // true para IE11 o Edge
    },
};

const loginRequest = {
    scopes: ["openid", "profile", "email"],
};

export { msalConfig, loginRequest };
