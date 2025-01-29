// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAglI0xDINGiVIUY5Bwao_d9lYAW9rmXtM",
    authDomain: "taistat.firebaseapp.com",
    projectId: "taistat",
    storageBucket: "taistat.firebasestorage.app",
    messagingSenderId: "949931548556",
    appId: "1:949931548556:web:a733bf10ab77e01d8200a9",
    measurementId: "G-LXWDLSHZ6Y"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set auth language
auth.languageCode = 'it'; // Change to desired language or use auth.useDeviceLanguage();

// Google Auth Function
const googleAuth = async () => {
  const provider = new GoogleAuthProvider();

  // Add scope for additional permissions
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  // Optionally customize parameters
  provider.setCustomParameters({
    'login_hint': 'user@example.com'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log("Access Token:", token);
    console.log("User Info:", user);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    document.getElementById("status").textContent = "Error signing in: " + error.message;
  }
};

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
  const statusElement = document.getElementById("status");
  if (user) {
    statusElement.textContent = `Welcome ${user.displayName}! You are signed in.`;
    console.log("User Details:", user);
  } else {
    statusElement.textContent = "You are not signed in.";
  }
});

// Attach the event listener to the button
document.addEventListener("DOMContentLoaded", () => {
  const googleButton = document.getElementById("googleButton");
  if (googleButton) {
    googleButton.addEventListener("click", googleAuth);
  }
});
