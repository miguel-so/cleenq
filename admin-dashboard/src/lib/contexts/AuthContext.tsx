import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  token: string | null;
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (loginResponse: LoginResponse) => {
    localStorage.setItem("cq_auth_token", loginResponse.token);
    localStorage.setItem("cq_user_data", JSON.stringify(loginResponse.user));

    setUser(loginResponse.user);
    setToken(loginResponse.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("cq_auth_token");
    localStorage.removeItem("cq_user_data");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("cq_auth_token");
    const storedUser = localStorage.getItem("cq_user_data");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
