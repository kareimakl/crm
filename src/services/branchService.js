import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  where
} from "firebase/firestore";

const BRANCHES_COLLECTION = "branches";
const CUSTOM_FIELDS_COLLECTION = "customFields";

export const getAllBranches = async () => {
  const querySnapshot = await getDocs(collection(db, BRANCHES_COLLECTION));
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt ? docSnap.data().createdAt.toDate() : null
  }));
};

export const addBranch = async (data) => {
  const docRef = await addDoc(collection(db, BRANCHES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateBranch = async (id, data) => {
  await updateDoc(doc(db, BRANCHES_COLLECTION, id), data);
};

export const deleteBranch = async (id) => {
  await deleteDoc(doc(db, BRANCHES_COLLECTION, id));
};

// Custom fields for branches
export const getBranchCustomFields = async () => {
  const q = query(collection(db, CUSTOM_FIELDS_COLLECTION), where('section', '==', 'branches'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
};

export const addBranchCustomField = async (field) => {
  return addDoc(collection(db, CUSTOM_FIELDS_COLLECTION), { ...field, section: 'branches' });
};

export const updateBranchCustomField = async (id, field) => {
  return updateDoc(doc(db, CUSTOM_FIELDS_COLLECTION, id), field);
};

export const deleteBranchCustomField = async (id) => {
  return deleteDoc(doc(db, CUSTOM_FIELDS_COLLECTION, id));
};

export const getAllTrips = async () => {
  const snapshot = await getDocs(collection(db, "trips"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 