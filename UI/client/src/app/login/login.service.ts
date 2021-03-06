import { Injectable } from '@angular/core';

import { CookiesService } from '../services/cookies.service';
import { Manifest } from '../../manifest';

@Injectable()
export class LoginService {
    constructor() {}

    // Private: Generate the GUID
    private getGuid(): string {
        let s = [];
         let hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';
        return s.join('');
    };

    // Private: Get the Athena login url
    private getLoginUrl(): string {
        let guid = this.getGuid(),
            state = `${location.protocol}//${location.host}/oauth.${guid}`,
            loginUrl = Manifest.athenaUri + '/core/connect/authorize?client_id=' + Manifest.athenaClientId + '&scope=' +
                    'openid%20email%20profile%20ctx_principal_aliases&response_type=code&redirect_uri=' +
                    Manifest.authenticationRedirectUri + '&state=' + state;
        window.sessionStorage.setItem('state', guid);
        return loginUrl;
    };

    // Private: Get the Athena logout url
    private getLogoutUrl(): string {
        let idToken = CookiesService.get('id_token');
        let logoutUrl = `${Manifest.athenaUri}/core/connect/endsession?id_token_hint=${idToken}&post_logout_redirect_uri=${Manifest.redirectUri}`;
        return logoutUrl;
    };

    // Public: Go to Athena login page
    public login(): void {
        let loginUrl = this.getLoginUrl();
        window.location.replace(loginUrl);
    }

    // Public: Log out the current customer
    public logout(): void {
        let logoutUrl = this.getLogoutUrl();
        CookiesService.remove('name');
        CookiesService.remove('email');
        CookiesService.remove('id_token');
        CookiesService.remove('sub');
        window.location.replace(logoutUrl);
    }
}