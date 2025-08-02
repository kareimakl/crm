import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { RoleService } from '../services/roleService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize default roles on first load
  useEffect(() => {
    const initializeRoles = async () => {
      try {
        await RoleService.initializeDefaultRoles();
      } catch (error) {
        console.error("Error initializing roles:", error);
      }
    };
    initializeRoles();
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await AuthService.getUserData(user.uid);
          setUserData(userDoc);
          
          // Get user role and permissions
          const role = await AuthService.getUserRole(user.uid);
          setUserRole(role);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up function
  const signUp = async (email, password, userData) => {
    try {
      const result = await AuthService.signUp(email, password, userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      const result = await AuthService.signIn(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      throw error;
    }
  };

  // Check permission for a section
  const hasPermission = async (section, requiredPermission = "view") => {
    if (!currentUser) return false;
    
    try {
      return await AuthService.hasPermission(currentUser.uid, section, requiredPermission);
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  };

  // Check permission synchronously (for UI rendering)
  const hasPermissionSync = (section, requiredPermission = "view") => {
    if (!userRole || !userRole.permissions) return false;
    
    const userPermission = userRole.permissions[section];
    if (!userPermission) return false;

    const permissionLevels = {
      "none": 0,
      "view": 1,
      "edit": 2,
      "admin": 3
    };

    return permissionLevels[userPermission] >= permissionLevels[requiredPermission];
  };

  // Get user's accessible sections
  const getAccessibleSections = () => {
    if (!userRole || !userRole.permissions) return [];
    
    const accessibleSections = [];
    Object.entries(userRole.permissions).forEach(([section, permission]) => {
      if (permission !== "none") {
        accessibleSections.push({
          name: section,
          permission: permission
        });
      }
    });
    
    return accessibleSections;
  };

  // Update user data
  const updateUserData = async (updates) => {
    if (!currentUser) throw new Error("No user logged in");
    
    try {
      await AuthService.updateUser(currentUser.uid, updates);
      // Refresh user data
      const updatedUserData = await AuthService.getUserData(currentUser.uid);
      setUserData(updatedUserData);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    hasPermission,
    hasPermissionSync,
    getAccessibleSections,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 