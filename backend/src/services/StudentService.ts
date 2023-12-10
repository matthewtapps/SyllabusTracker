import axios from 'axios';


interface AccessTokenResponse {
    access_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
}

export class StudentService {
    private cachedAccessToken = {
        value: null,
        expiry: null
    }

    private async fetchNewAccessToken(): Promise<AccessTokenResponse> {
        const domain = process.env.AUTH0_DOMAIN;
        const clientId = process.env.AUTH0_CLIENT_ID;
        const clientSecret = process.env.AUTH0_CLIENT_SECRET;
        const audience = process.env.AUTH0_AUDIENCE;

        if (!(domain && clientId && clientSecret && audience)) {
            throw new Error(`Invalid process environment variables for Auth0 API request`);
        }

        const url = `${domain}/oauth/token`;
        const options = {
            client_id: clientId,
            client_secret: clientSecret,
            audience: audience,
            grant_type: "client_credentials"
        };

        try {
            const response = await axios.post(url, options, {
                headers: { 'Content-Type': 'application/json' }
            });

            return response.data; 
        } catch (error) {
            throw new Error(`Error fetching access token: ${error}`);
        }
    }

    private async getAccessToken() {
        const now = new Date();

        if (this.cachedAccessToken.value && this.cachedAccessToken.expiry > now) {
            return this.cachedAccessToken.value
        }

        const accessTokenData = await this.fetchNewAccessToken()
        this.cachedAccessToken = {
            value: accessTokenData.access_token,
            expiry: new Date(now.getTime() + accessTokenData.expires_in * 1000)
        }

        return this.cachedAccessToken.value
    }

    async fetchStudents() {
        const accessToken = await this.getAccessToken();
        const issuerBaseURL = process.env.ISSUER_BASE_URL;
        const studentRoleId = 'rol_8BTsLAfK5J5gtlq2'
    
        try {
            const options = {
                method: 'GET',
                url: `${issuerBaseURL}api/v2/roles/${studentRoleId}/users`,
                headers: { authorization: `Bearer ${accessToken}` }
            };
    
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
