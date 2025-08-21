// src/services/firestoreService.js
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query, 
  where,
  Timestamp 
} from "firebase/firestore";

// TODO: Replace with your Firebase project config!
const firebaseConfig = {
  apiKey: "AIzaSyCMWgiDQWkT6SqrYnthrM96GXAl3zrl0uo",

  authDomain: "saasbay.firebaseapp.com",

  projectId: "saasbay",

  storageBucket: "saasbay.firebasestorage.app",

  messagingSenderId: "43607687238",

  appId: "1:43607687238:web:2fc8f7feb9e2d8896e8a47",

  measurementId: "G-1W3KLFSWTY"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to safely convert Firestore Timestamp to JS Date
function toDateSafe(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (ts instanceof Date) return ts;
  return null;
}

// Get all vendor applications
export async function getVendorApplications() {
  try {
    const q = query(
      collection(db, "vendorApplications"), 
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const applications = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      applications.push({
        id: docSnap.id,
        ...data,
        createdAt: toDateSafe(data.createdAt)
      });
    });
    
    return applications;
  } catch (error) {
    console.error("Error fetching vendor applications:", error);
    throw error;
  }
}

// Update application status
export async function updateApplicationStatus(applicationId, status, notes = "") {
  try {
    const docRef = doc(db, "vendorApplications", applicationId);
    await updateDoc(docRef, {
      status: status,
      notes: notes,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}

// Delete application
export async function deleteApplication(applicationId) {
  try {
    const docRef = doc(db, "vendorApplications", applicationId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
}

// Get applications by status
export async function getApplicationsByStatus(status) {
  try {
    const q = query(
      collection(db, "vendorApplications"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const applications = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      applications.push({
        id: docSnap.id,
        ...data,
        createdAt: toDateSafe(data.createdAt)
      });
    });
    
    return applications;
  } catch (error) {
    console.error("Error fetching applications by status:", error);
    throw error;
  }
}
