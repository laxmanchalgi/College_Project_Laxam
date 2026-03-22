import React, { createContext, useContext, useState, useEffect } from "react";
import { User, dataService } from "../services/dataService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, role?: string) => Promise<void>;
  requestOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("exploresphere_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ✅ FIX: BLOCK LOGIN IF NOT APPROVED
  const login = async (email: string, password: string) => {
    const user = await dataService.login(email, password);

    if (!user.approved) {
      throw new Error("Your account is pending admin approval.");
    }

    setUser(user);
    localStorage.setItem("exploresphere_user", JSON.stringify(user));
  };

  const signup = async (email: string, password: string, displayName: string, role?: string) => {
    const user = await dataService.signup(email, password, displayName, role);

    // ✅ Only allow login if approved
    if (user.approved) {
      setUser(user);
      localStorage.setItem("exploresphere_user", JSON.stringify(user));
    } else {
      throw new Error("Signup successful! Waiting for admin approval.");
    }
  };

  const requestOTP = async (email: string) => {
    await dataService.requestOTP(email);
  };

  // ✅ FIX: ALSO CHECK APPROVAL AFTER OTP LOGIN
  const verifyOTP = async (email: string, otp: string) => {
    const user = await dataService.verifyOTP(email, otp);

    if (!user.approved) {
      throw new Error("Your account is pending admin approval.");
    }

    setUser(user);
    localStorage.setItem("exploresphere_user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("exploresphere_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        requestOTP,
        verifyOTP,
        logout,
        isAdmin: user?.role === "ADMIN",
        isSuperAdmin: user?.email === "sagar.a.ingale03@gmail.com",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ✅ SAFE HOOK (NO APP CRASH)
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    console.error("AuthProvider missing!");
    return {
      user: null,
      loading: false,
      login: async () => {},
      signup: async () => {},
      requestOTP: async () => {},
      verifyOTP: async () => {},
      logout: () => {},
      isAdmin: false,
      isSuperAdmin: false,
    };
  }

  return context;
}