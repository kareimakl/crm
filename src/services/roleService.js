import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  where,
  addDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { DEFAULT_ROLES, SECTIONS, PERMISSIONS } from "../constants/permissions";

export class RoleService {
  // Initialize default roles in Firestore
  static async initializeDefaultRoles() {
    try {
      const rolesToCreate = Object.values(DEFAULT_ROLES);
      
      for (const role of rolesToCreate) {
        await setDoc(doc(db, "roles", role.roleName), {
          ...role,
          createdAt: serverTimestamp(),
          isDefault: true
        });
      }
      
      console.log("Default roles initialized successfully");
    } catch (error) {
      console.error("Error initializing default roles:", error);
      throw error;
    }
  }

  // Create new role
  static async createRole(roleData) {
    try {
      const roleDoc = {
        ...roleData,
        createdAt: serverTimestamp(),
        isDefault: false
      };

      await setDoc(doc(db, "roles", roleData.roleName), roleDoc);
      return roleDoc;
    } catch (error) {
      throw error;
    }
  }

  // Get role by name
  static async getRole(roleName) {
    try {
      const roleDoc = await getDoc(doc(db, "roles", roleName));
      if (roleDoc.exists()) {
        return roleDoc.data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Get all roles
  static async getAllRoles() {
    try {
      const rolesQuery = collection(db, "roles");
      const querySnapshot = await getDocs(rolesQuery);
      
      const roles = [];
      querySnapshot.forEach((doc) => {
        roles.push({ id: doc.id, ...doc.data() });
      });
      
      return roles;
    } catch (error) {
      throw error;
    }
  }

  // Update role
  static async updateRole(roleName, updates) {
    try {
      const roleRef = doc(db, "roles", roleName);
      await updateDoc(roleRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete role (only non-default roles)
  static async deleteRole(roleName) {
    try {
      const role = await this.getRole(roleName);
      if (role && role.isDefault) {
        throw new Error("Cannot delete default roles");
      }

      await deleteDoc(doc(db, "roles", roleName));
    } catch (error) {
      throw error;
    }
  }

  // Update role permissions
  static async updateRolePermissions(roleName, permissions) {
    try {
      const roleRef = doc(db, "roles", roleName);
      await updateDoc(roleRef, {
        permissions,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }

  // Get available sections for role management
  static getAvailableSections() {
    return Object.values(SECTIONS);
  }

  // Get available permission levels
  static getAvailablePermissions() {
    return Object.values(PERMISSIONS);
  }

  // Validate role permissions
  static validateRolePermissions(permissions) {
    const availableSections = this.getAvailableSections();
    const availablePermissions = this.getAvailablePermissions();
    
    for (const section of availableSections) {
      if (!permissions[section]) {
        permissions[section] = PERMISSIONS.NONE;
      }
      
      if (!availablePermissions.includes(permissions[section])) {
        throw new Error(`Invalid permission level for section ${section}`);
      }
    }
    
    return permissions;
  }

  // Create role with default permissions
  static createDefaultRolePermissions() {
    const permissions = {};
    const sections = this.getAvailableSections();
    
    sections.forEach(section => {
      permissions[section] = PERMISSIONS.NONE;
    });
    
    return permissions;
  }

  // Custom fields for roles
  static async getRoleCustomFields() {
    const q = query(collection(db, 'customFields'), where('section', '==', 'roles'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  }

  static async addRoleCustomField(field) {
    return addDoc(collection(db, 'customFields'), { ...field, section: 'roles' });
  }

  static async updateRoleCustomField(id, field) {
    return updateDoc(doc(db, 'customFields', id), field);
  }

  static async deleteRoleCustomField(id) {
    return deleteDoc(doc(db, 'customFields', id));
  }
}

export const getRoleCustomFields = RoleService.getRoleCustomFields;
export const addRoleCustomField = RoleService.addRoleCustomField;
export const deleteRoleCustomField = RoleService.deleteRoleCustomField; 