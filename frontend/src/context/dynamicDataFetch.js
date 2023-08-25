import { createContext, useContext, useState } from "react";

const MyContext = createContext();

export function MyContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  // define function to set the access token and refresh token
  const setTokens = (tokens) => {
    setAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);
  };

  // define function to log in the user and set the tokens
  const loginUser = async (username, password) => {
    const response = await fetch("http://example.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    setTokens(data);
  };

  return (
    <MyContext.Provider value={{ accessToken, refreshToken, setTokens, loginUser }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
}
