import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const COLLECTION = 'serviceCategories';

const DEFAULT_CATEGORIES = [
  'مستلزمات عمرة',
  'طيران',
  'فندق',
  'باص'
];

export const ServiceCategoryService = {
  async getAll() {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  subscribe(callback) {
    return onSnapshot(query(collection(db, COLLECTION), orderBy('order', 'asc')), snap => {
      callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  },
  async add(name) {
    return addDoc(collection(db, COLLECTION), { name, order: Date.now() });
  },
  async update(id, data) {
    return updateDoc(doc(db, COLLECTION, id), data);
  },
  async remove(id) {
    return deleteDoc(doc(db, COLLECTION, id));
  },
  async ensureDefaultCategories() {
    const q = query(collection(db, COLLECTION));
    const snapshot = await getDocs(q);
    const existing = snapshot.docs.map(doc => doc.data().name);
    if (existing.length === 0) {
      for (const name of DEFAULT_CATEGORIES) {
        await addDoc(collection(db, COLLECTION), { name, order: Date.now() });
      }
    }
  }
};

export const getAllSupplies = async () => {
  const snapshot = await getDocs(collection(db, "supplies"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 