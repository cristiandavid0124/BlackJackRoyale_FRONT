import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        clientId: '066fef70-45bd-422a-a870-149ae2f088f4', // ID de la aplicación registrada en Azure AD.
        authority: 'https://login.microsoftonline.com/common/v2.0', // Autoridad de Azure para autenticación.
        redirectUri: 'https://blackjackroyaleapp-f6hagcdvc5bbejb0.canadacentral-01.azurewebsites.net/BlackJackRoyale', // Nueva URL de redirección.
        postLogoutRedirectUri: 'https://blackjackroyaleapp-f6hagcdvc5bbejb0.canadacentral-01.azurewebsites.net/BlackJackRoyale', // Página a la que redirigir tras el logout.
        navigateToLoginRequestUrl: false, // Si "true", navega de vuelta al lugar original tras login.
    },
    cache: {
        cacheLocation: 'sessionStorage', // "sessionStorage" para mayor seguridad; "localStorage" permite SSO entre pestañas.
        storeAuthStateInCookie: false, // Activar solo si hay problemas en navegadores antiguos (como IE11).
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    scopes: [], // Define los scopes requeridos para acceder a las APIs protegidas.
};

