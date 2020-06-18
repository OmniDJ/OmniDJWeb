import { useState } from "react";

const getClaims = (accessToken) => {
  if (!accessToken || accessToken === "undefined") return {};
  const base64Url = accessToken.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
};

export const useAuth = () => {
  const getUserInfo = () => {
    let loggedInUser = JSON.parse(window.localStorage.getItem("loggedInUser"));
    let accessToken = loggedInUser ? loggedInUser.accessToken : null;

    let claims = accessToken ? getClaims(accessToken) : null;
    let userInfo = claims ? claims.user_claims : null;
    console.log("userInfo este: ", userInfo);
    return {
      accessToken,
      claims,
      userInfo,
    };
  };
  const [authState, setAuthState] = useState(() => getUserInfo());

  const doLogin = (accessToken) => {
    let claims = getClaims(accessToken);
    let userInfo = claims.user_claims;
    setAuthState({
      accessToken,
      claims: getClaims(accessToken),
      userInfo,
    });
    let loggedInUser = {
      accessToken,
    };
    window.localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  };

  const doLogout = () => {
    setAuthState({
      accessToken: null,
      claims: null,
      userInfo: null,
    });
    window.localStorage.removeItem("loggedInUser");
  };
  return [authState, doLogin, doLogout, setAuthState];
};
