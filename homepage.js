import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Payment URL
const paymentUrl = "https://payment.intasend.com/pay/c1582709-fc7a-4b88-95b2-6d63a34bd836/";

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
                        
                        if (userData.paymentStatus === "paid") {
                            checkoutButton.innerText = "Go to Course";
                            checkoutButton.href = "excel.html";
                        } else {
                            checkoutButton.innerText = `Continue to Checkout for ${selectedCourse.name} course`;
                            checkoutButton.addEventListener("click", initiatePayment);
                        }

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

// Function to initiate payment
function initiatePayment() {
    let paymentWindow = window.open(paymentUrl, "IntaSend Payment", "width=600,height=700");

    if (!paymentWindow) {
        alert("Popup blocked! Please allow popups for this site.");
        return;
    }

    document.getElementById("statusMessage").innerText = "Waiting for payment...";

    let checkPopup = setInterval(async () => {
        if (paymentWindow.closed) {
            clearInterval(checkPopup);
            document.getElementById("statusMessage").innerText = "Payment window closed.";
            return;
        }

        try {
            if (paymentWindow.location.href.includes("https://taistat-firm.com/excel.html")) {
                clearInterval(checkPopup);
                paymentWindow.close();
                await updatePaymentStatus(localStorage.getItem('loggedInUserId'));
                document.getElementById("statusMessage").innerText = "Payment successful! Redirecting...";
                setTimeout(() => {
                    window.location.href = "excel.html";
                }, 2000);
            }
        } catch (error) {
            // Ignore cross-origin errors
        }
    }, 1000);
}

// Function to update payment status in Firestore
async function updatePaymentStatus(userId) {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, { paymentStatus: "paid", paymentMethod: "IntaSend" }, { merge: true });
}

// Restrict direct access to excel.html
if (window.location.pathname.includes("excel.html")) {
    restrictAccess();
}

async function restrictAccess() {
    let userId = localStorage.getItem('loggedInUserId');
    if (!userId) {
        window.location.href = "index.html";
        return;
    }

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().paymentStatus !== "paid") {
        window.location.href = paymentUrl;
    }
}

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
