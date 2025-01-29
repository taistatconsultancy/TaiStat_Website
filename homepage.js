import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6xgrttBIm9vw07xRltKsqHZNpS1jJ8xw",
    authDomain: "taistat-f0e1d.firebaseapp.com",
    projectId: "taistat-f0e1d",
    storageBucket: "taistat-f0e1d.firebasestorage.app",
    messagingSenderId: "196742294604",
    appId: "1:196742294604:web:715fe57bf6471221b898e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

// Handle authenticated user
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;

                    // Load selected course details
                    const selectedCourse = JSON.parse(sessionStorage.getItem('selectedCourse'));
                    if (selectedCourse) {
                        document.getElementById('courseName').innerText = selectedCourse.name;
                        document.getElementById('coursePrice').innerText = `Ksh ${selectedCourse.price}`;
                        

                        // Update checkout button
                        const checkoutButton = document.getElementById('checkoutButton');
                        checkoutButton.innerText = `Continue to Checkout to ${selectedCourse.name} course`;
                        checkoutButton.href = "excel.html";

                        // Show the course details section
                        document.getElementById('selectedCourseContainer').style.display = 'block';
                    }
                } else {
                    console.log("No document found matching ID");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
    } else {
        console.log("User ID not found in Local Storage");
    }
});

// Toggle User Menu
const profileIcon = document.getElementById('profileIcon');
const userMenu = document.getElementById('userMenu');

profileIcon.addEventListener('click', () => {
    userMenu.classList.toggle('active');
});

// Logout functionality
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});
