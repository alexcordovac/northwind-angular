import {
  provideKeycloak,
  createInterceptorCondition,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
} from 'keycloak-angular';
import { environment } from '@env/environment';

const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(https?:\/\/localhost:7171)(\/.*)?$/i,
});

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      realm: environment.auth.keycloak.realm,
      url: environment.auth.keycloak.url,
      clientId: environment.auth.keycloak.clientId,
    },
    initOptions: {
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      checkLoginIframe: false,
      redirectUri: environment.auth.keycloak.redirectUri,
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 60000,
      }),
    ],
    providers: [
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [localhostCondition],
      },
      AutoRefreshTokenService, UserActivityService
    ],
  });
