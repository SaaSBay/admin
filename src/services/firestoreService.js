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


// src/services/firestoreService.js (add these functions)

// Get all contacts
export async function getContacts() {
  try {
    const q = query(
      collection(db, "Contacts"), 
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const contacts = [];
    querySnapshot.forEach((doc) => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() // Convert Timestamp to Date
      });
    });
    
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}

// Update contact status
export async function updateContactStatus(contactId, status, notes = "") {
  try {
    const docRef = doc(db, "Contacts", contactId);
    await updateDoc(docRef, {
      status: status,
      notes: notes,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating contact status:", error);
    throw error;
  }
}

// Delete contact
export async function deleteContact(contactId) {
  try {
    const docRef = doc(db, "Contacts", contactId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}

// Get contacts by status
export async function getContactsByStatus(status) {
  try {
    const q = query(
      collection(db, "Contacts"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const contacts = [];
    querySnapshot.forEach((doc) => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts by status:", error);
    throw error;
  }
}



// Add these functions to your existing firestoreService.js

// Get platform settings
export async function getPlatformSettings() {
  try {
    const docRef = doc(db, "settings", "platform");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default settings if none exist
      return {
        commissionRate: 15,
        defaultVendorPlan: 'free',
        autoApproveVendors: false,
        emailNotifications: {
          newApplications: true,
          newContacts: true,
          statusUpdates: true,
          weeklyReports: false
        },
        platformSettings: {
          siteName: 'SaaSBay',
          maintenanceMode: false,
          allowRegistrations: true,
          requireApproval: true
        }
      };
    }
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    throw error;
  }
}

// Update platform settings
export async function updatePlatformSettings(settings) {
  try {
    const docRef = doc(db, "settings", "platform");
    await setDoc(docRef, {
      ...settings,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating platform settings:", error);
    throw error;
  }
}


// Add these functions to your existing firestoreService.js

// Get analytics data
export async function getAnalyticsData(timeRange = '30d') {
  try {
    const now = new Date();
    const daysAgo = parseInt(timeRange.replace('d', ''));
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

    // Get vendor applications for the time range
    const applicationsQuery = query(
      collection(db, "vendorApplications"),
      where("createdAt", ">=", Timestamp.fromDate(startDate)),
      orderBy("createdAt", "asc")
    );
    const applicationsSnap = await getDocs(applicationsQuery);

    // Get contacts for the time range
    const contactsQuery = query(
      collection(db, "Contacts"),
      where("createdAt", ">=", Timestamp.fromDate(startDate)),
      orderBy("createdAt", "asc")
    );
    const contactsSnap = await getDocs(contactsQuery);

    // Process the data
    const applications = [];
    const contacts = [];

    applicationsSnap.forEach(doc => {
      applications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });

    contactsSnap.forEach(doc => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });

    return { applications, contacts };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
}

// Get summary statistics
export async function getAnalyticsSummary() {
  try {
    // Get total applications
    const applicationsSnap = await getDocs(collection(db, "vendorApplications"));
    const totalApplications = applicationsSnap.size;

    // Get total contacts
    const contactsSnap = await getDocs(collection(db, "Contacts"));
    const totalContacts = contactsSnap.size;

    // Get applications by status
    const pendingQuery = query(collection(db, "vendorApplications"), where("status", "==", "pending"));
    const approvedQuery = query(collection(db, "vendorApplications"), where("status", "==", "approved"));
    
    const [pendingSnap, approvedSnap] = await Promise.all([
      getDocs(pendingQuery),
      getDocs(approvedQuery)
    ]);

    return {
      totalApplications,
      totalContacts,
      pendingApplications: pendingSnap.size,
      approvedApplications: approvedSnap.size,
      conversionRate: totalApplications > 0 ? Math.round((approvedSnap.size / totalApplications) * 100) : 0
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    throw error;
  }
}
