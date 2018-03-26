import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from '../config/environment';

export default OAuth2PasswordGrant.extend({
//  serverTokenEndpoint: `${ENV.apiNamespace}/login`,
//  serverTokenRevocationEndpoint: `${ENV.apiNamespace}/logout`
  serverTokenEndpoint: `${ENV.apiNamespace}/token`,
  serverTokenRevocationEndpoint: `${ENV.apiNamespace}/revoke-token`
});
