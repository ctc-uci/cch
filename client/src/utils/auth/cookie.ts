import { Cookies } from "react-cookie";

interface CookieConfig {
  maxAge: number;
  path: string;
  secure: boolean;
  domain?: string;
}

/**
 * @see {@link https://www.npmjs.com/package/react-cookie}
 */
const cookieConfig: CookieConfig = {
  maxAge: 604800, // 7 days (7 * 24 * 60 * 60 seconds) for persistent login
  path: "/",
  secure: document.location.protocol === "https:",
};

export const cookieKeys = {
  ACCESS_TOKEN: "accessToken",
};

export const setCookie = ({
  key,
  value,
  config = cookieConfig,
}: {
  key: string;
  value: string;
  config?: CookieConfig;
}) => {
  let cookie = `${key}=${value}; max-age=${config.maxAge}; path=${config.path}`;

  if (config.domain) {
    cookie += `; domain=${config.domain}`;
  }

  if (config.secure) {
    cookie += "; secure";
  }

  document.cookie = cookie;
};

export const clearCookie = (key: string) => {
  // To delete a cookie, set it with an expiration date in the past
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const clearAllAuthCookies = () => {
  Object.values(cookieKeys).forEach((key) => {
    clearCookie(key);
  });
};

export const clearCookies = (cookies: Cookies) => {
  Object.values(cookieKeys).forEach((value) => {
    cookies.remove(value);
  });
};
