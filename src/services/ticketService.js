import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getAllTickets = async () => {
  const snapshot = await getDocs(collection(db, "tickets"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// If tickets are also stored inside trips as subcollections, implement this:
export const getAllTicketsInTrips = async () => {
  const tripsSnap = await getDocs(collection(db, "trips"));
  let allTickets = [];
  for (const tripDoc of tripsSnap.docs) {
    const ticketsSnap = await getDocs(collection(tripDoc.ref, "tickets"));
    allTickets = allTickets.concat(ticketsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), tripId: tripDoc.id })));
  }
  return allTickets;
}; 