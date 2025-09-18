import React from "react";

export type AuthContextValue = {
  isAuthenticated: boolean;
  login: (token: string | null) => void;
  logout: () => void;
  token: string | null;
};

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);
