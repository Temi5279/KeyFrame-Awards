import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyB6PoUXyNIyWUfLcaoGQnUONz_21Tc_Gwg",
    authDomain: "keyframe-awards.firebaseapp.com",
    projectId: "keyframe-awards",
    storageBucket: "keyframe-awards.firebasestorage.app",
    messagingSenderId: "882083630221",
    appId: "1:882083630221:web:629df7642fdf822018a6c4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Tracks the login area on your website header
const authActions = document.getElementById('auth-header-actions');

onAuthStateChanged(auth, async (user) => {
    if (!authActions) return; // Stops if the page layout isn't ready

    if (user) {
        let printName = "Creator";
        let printPic = user.photoURL || "https://ui-avatars.com/api/?name=User&background=00f2fe&color=0d001a";

        try {
            // Check Firestore database for their registered name
            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists() && docSnap.data().fullName) {
                printName = docSnap.data().fullName.split(' ')[0]; // Grabs just their first name
                if (!user.photoURL) {
                    // Generates a colorful profile picture badge using their name initials
                    printPic = `https://ui-avatars.com/api/?name=${encodeURIComponent(printName)}&background=ff007f&color=fff`;
                }
            } else if (user.displayName) {
                printName = user.displayName.split(' ')[0];
            }
        } catch (err) {
            console.log("Profile read handled silently.", err);
        }

        // DYNAMIC ACCCOUNT PANEL (Link, Avatar, and Welcome Message)
        authActions.innerHTML = `
            <a href="/account" style="display: flex; align-items: center; gap: 8px; text-decoration: none; margin-right: 15px;">
                <img src="${printPic}" alt="Avatar" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1.5px solid #00f2fe;">
                <span class="user-welcome" style="color: #fff; font-weight: bold; font-size: 0.9rem;">Hello, ${printName}</span>
            </a>
            <button class="btn-login" id="logout-btn" style="padding: 6px 12px; font-size: 0.8rem;">Log Out</button>
        `;
        
        // Handles logging out smoothly
        document.getElementById('logout-btn').addEventListener('click', () => {
            signOut(auth).then(() => {
                alert("Log out successful!");
                window.location.href = "/"; // Sends them back to home page after logging out
            });
        });
    } else {
        // Default layout if no user is signed in
        authActions.innerHTML = `
            <button class="btn-login" id="open-login">Login</button>
            <button class="btn-signup" id="open-signup">Sign Up</button>
        `;
        if (typeof window.attachModalTriggers === 'function') {
            window.attachModalTriggers();
        }
    }
});