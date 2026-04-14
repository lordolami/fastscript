import { buildOAuthAuthorizeUrl, createOAuthState } from "./auth-flows.mjs";

const PROVIDERS = {
  github: {
    name: "GitHub",
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userUrl: "https://api.github.com/user",
    scope: "read:user user:email",
  },
  google: {
    name: "Google",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: "openid email profile",
  },
  microsoft: {
    name: "Microsoft",
    authorizeUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    userUrl: "https://graph.microsoft.com/v1.0/me",
    scope: "openid profile email User.Read",
  },
};

export function listAuthProviders() {
  return Object.keys(PROVIDERS);
}

export function getAuthProvider(name) {
  const key = String(name || "").toLowerCase();
  const provider = PROVIDERS[key];
  if (!provider) {
    const error = new Error(`Unknown OAuth provider: ${name}`);
    error.status = 400;
    throw error;
  }
  return { id: key, ...provider };
}

export function createOAuthAdapter(name, {
  clientId = process.env[`${String(name || "").toUpperCase()}_CLIENT_ID`],
  clientSecret = process.env[`${String(name || "").toUpperCase()}_CLIENT_SECRET`],
  redirectUri = process.env[`${String(name || "").toUpperCase()}_REDIRECT_URI`],
} = {}) {
  const provider = getAuthProvider(name);
  return {
    ...provider,
    clientId,
    clientSecret,
    redirectUri,
    authorizeUrl({ state = createOAuthState(), scope = provider.scope } = {}) {
      return {
        state,
        url: buildOAuthAuthorizeUrl({
          authorizeUrl: provider.authorizeUrl,
          clientId,
          redirectUri,
          scope,
          state,
        }),
      };
    },
    async exchangeCode(code) {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      });
      const response = await fetch(provider.tokenUrl, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body,
      });
      if (!response.ok) {
        const error = new Error(`OAuth token exchange failed (${response.status})`);
        error.status = 502;
        throw error;
      }
      return response.json();
    },
    async fetchUser(accessToken) {
      const response = await fetch(provider.userUrl, {
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: "application/json",
        },
      });
      if (!response.ok) {
        const error = new Error(`OAuth user fetch failed (${response.status})`);
        error.status = 502;
        throw error;
      }
      return response.json();
    },
  };
}
