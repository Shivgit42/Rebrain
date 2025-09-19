import React from "react";

export type AuthContextValue = {
  isAuthenticated: boolean;
  login: (token: string | null) => void;
  logout: () => void;
  token: string | null;
  loading: boolean;
};

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);
