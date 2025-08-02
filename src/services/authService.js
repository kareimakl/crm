import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { DEFAULT_ROLES } from "../constants/permissions";

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export class AuthService {
  // Sign up new user with email/password
  static async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role || "rep", // Default role
        branch: userData.branch || null,
        createdAt: serverTimestamp(),
        isActive: true,
        authProvider: 'email'
      };

      await setDoc(doc(db, "users", user.uid), userDoc);

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: userData.name
      });

      return { user, userDoc };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await this.getUserData(user.uid);
      
      if (!userDoc) {
        // Create new user document for Google sign-in
        const newUserDoc = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          role: "rep", // Default role for new Google users
          branch: null,
          createdAt: serverTimestamp(),
          isActive: true,
          authProvider: 'google'
        };

        await setDoc(doc(db, "users", user.uid), newUserDoc);
        return { user, userDoc: newUserDoc };
      }

      return { user, userDoc };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in user with email/password
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await this.getUserData(user.uid);
      
      if (!userDoc) {
        throw new Error('User data not found. Please contact administrator.');
      }

      if (!userDoc.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.');
      }
      
      return { user, userDoc };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign out user
  static async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Reset password
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Get user data from Firestore
  static async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Get user role and permissions
  static async getUserRole(uid) {
    try {
      const userData = await this.getUserData(uid);
      if (!userData) return null;

      // Get role document from Firestore
      const roleDoc = await getDoc(doc(db, "roles", userData.role));
      if (roleDoc.exists()) {
        return roleDoc.data();
      }

      // Fallback to default roles
      const defaultRole = Object.values(DEFAULT_ROLES).find(role => role.roleName === userData.role);
      return defaultRole || DEFAULT_ROLES.REP;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update user data
  static async updateUser(uid, updates) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Check if user has permission for a section
  static async hasPermission(uid, section, requiredPermission = "view") {
    try {
      const role = await this.getUserRole(uid);
      if (!role || !role.permissions) return false;

      const userPermission = role.permissions[section];
      if (!userPermission) return false;

      const permissionLevels = {
        "none": 0,
        "view": 1,
        "edit": 2,
        "admin": 3
      };

      return permissionLevels[userPermission] >= permissionLevels[requiredPermission];
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  // Get all users (admin only)
  static async getAllUsers() {
    try {
      const usersQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(usersQuery);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      return users;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Get users by role
  static async getUsersByRole(role) {
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("role", "==", role)
      );
      const querySnapshot = await getDocs(usersQuery);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      return users;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Create first admin user (only works if no users exist)
  static async createFirstAdmin(email, password, name) {
    try {
      // Check if any users exist
      const users = await this.getAllUsers();
      if (users.length > 0) {
        throw new Error('Admin user already exists. Only one admin can be created.');
      }

      // Create admin user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create admin user document
      const adminUserDoc = {
        uid: user.uid,
        email: user.email,
        name: name,
        role: "super_admin",
        branch: "الفرع الرئيسي",
        createdAt: serverTimestamp(),
        isActive: true,
        authProvider: 'email',
        isFirstAdmin: true
      };

      await setDoc(doc(db, "users", user.uid), adminUserDoc);

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: name
      });

      return { user, userDoc: adminUserDoc };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Auth state listener
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Handle Firebase Auth errors
  static handleAuthError(error) {
    console.error('Auth Error:', error);
    
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('البريد الإلكتروني غير مسجل');
      case 'auth/wrong-password':
        return new Error('كلمة المرور غير صحيحة');
      case 'auth/invalid-email':
        return new Error('البريد الإلكتروني غير صحيح');
      case 'auth/weak-password':
        return new Error('كلمة المرور ضعيفة جداً');
      case 'auth/email-already-in-use':
        return new Error('البريد الإلكتروني مستخدم بالفعل');
      case 'auth/too-many-requests':
        return new Error('تم تجاوز عدد المحاولات المسموح، يرجى المحاولة لاحقاً');
      case 'auth/popup-closed-by-user':
        return new Error('تم إغلاق نافذة تسجيل الدخول');
      case 'auth/popup-blocked':
        return new Error('تم حظر النافذة المنبثقة، يرجى السماح بالنوافذ المنبثقة');
      case 'auth/cancelled-popup-request':
        return new Error('تم إلغاء طلب تسجيل الدخول');
      default:
        return new Error(error.message || 'حدث خطأ أثناء المصادقة');
    }
  }
} 