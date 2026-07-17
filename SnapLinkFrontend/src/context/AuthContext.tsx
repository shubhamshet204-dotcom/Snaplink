import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string;
  login: (jwtToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  function login(jwtToken: string) {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: token !== "",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
