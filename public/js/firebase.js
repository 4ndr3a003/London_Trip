// Firebase Configuration
// IMPORTANTE: Sostituisci questo oggetto con quello del tuo progetto Firebase!
// Vai su Project Settings > General > Your apps > Firebase SDK snippet > Config
const firebaseConfig = {
    apiKey: "AIzaSyA6K3zD0AJd5ZuLFvJJlYTElRNdkQ1hkOM",
    authDomain: "london-trip-985e4.firebaseapp.com",
    projectId: "london-trip-985e4",
    storageBucket: "london-trip-985e4.firebasestorage.app",
    messagingSenderId: "1047229416824",
    appId: "1:1047229416824:web:ca8d9190d9116d6efd748d",
    measurementId: "G-8DL24298KQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Export for use in other files (though global in this setup, it helps structure)
window.db = db;
