import { Configuration, LogLevel } from '@azure/msal-browser';

export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_UNICEF_SOCIAL_signup_signin',
    forgotPassword: 'B2C_1_PasswordResetPolicy',
    editProfile: 'B2C_1_ProfileEditingPolicy',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/B2C_1_UNICEF_SOCIAL_signup_signin',
    },
    forgotPassword: {
      authority:
        'https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/B2C_1_PasswordResetPolicy',
    },
    editProfile: {
      authority:
        'https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/B2C_1_ProfileEditingPolicy',
    },
  },
  authorityDomain: 'unicefpartners.b2clogin.com',
}

export const getMsalConfig = ({ clientId }: { clientId: string }): Configuration => {
  return {
    auth: {
      clientId,// This is the ONLY mandatory field that you need to supply.
      authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
      knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
      redirectUri: '/docs', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
      postLogoutRedirectUri: '/docs', // Indicates the page to navigate after logout.
      navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
      cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
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
              return;
            case LogLevel.Verbose:
              return;
            case LogLevel.Warning:
              return;
            default:
              return;
          }
        },
      },
    },
  }
}

export const loginRequest = {
  scopes: [],
}

export const accessTokenRequest = (account) => ({
  scopes: [],
  account,
});