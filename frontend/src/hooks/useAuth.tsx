import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { User, LoginInput, RegisterInput } from '../types';
import { socket } from "@/lib/socket"
import { Socket } from 'socket.io-client';

interface AuthContextType {
  user: User | null;         
  token: string | null;    
  isAuthenticated: boolean
  isLoading: boolean;        
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  socket:Socket | null;
}

// 2. Create the actual Context object
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. The Provider Component
// This component will "wrap" our whole app and provide the data to everyone.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Persistence: Check localStorage when the browser first loads the app
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false); // Done checking
  }, []);

  //socket connection
  useEffect(() => {
    if (user?.id) {
      if (!socket.connected) {
        socket.connect();
      } else {
        socket.emit('identify', user.id);
      }

      const handleConnect = () => { 
        // here we send the id to the server to identify the user
        socket.emit('identify', user.id); 
      };

      socket.on('connect', handleConnect);

      return () => {
        socket.off('connect', handleConnect);
      };
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [user]);

  // 5. Login Function
  const login = async (data: LoginInput) => {
    const response = await authService.login(data);
    const { token: newToken, user: newUser } = response.data; // Correct: service returns body, so we access .data once

    // Save to state
    setToken(newToken);
    setUser(newUser);

    // Save to localStorage so it persists after page refresh
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // 6. Register Function
  const register = async (data: RegisterInput) => {
    await authService.register(data);
    // After register, we usually make them login, or auto-login them.
  };

  // 7. Logout Function
  //This means:useCallback "don't recreate this function on every render" — a performance optimization.
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // 8. Provide the data to the rest of the app
  const value = {
    user,
    token,
    isAuthenticated: !!user, // !! converts a value to a boolean
    isLoading,
    login,
    register,
    logout,
    socket
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 9. The Hook
// This is what components will actually use: const { user, login } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 