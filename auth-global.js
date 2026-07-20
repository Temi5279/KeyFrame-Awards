// auth-global.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Core Firebase Configuration
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

// Monitor the auth state across the entire site
onAuthStateChanged(auth, async (user) => {
    const authActions = document.getElementById('auth-header-actions');
    if (!authActions) return; // Safeguard if element isn't rendered yet

    if (user) {
        let displayName = "Creator Account";
        let photoURL = user.photoURL || "https://ui-avatars.com/api/?name=User&background=6b00ff&color=fff";

        try {
            // Fetch name from Firestore if it exists
            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists() && docSnap.data().fullName) {
                displayName = docSnap.data().fullName;
                // Generate clean initials placeholder based on their actual name
                if (!user.photoURL) {
                    photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ff007f&color=fff`;
                }
            }
        } catch (e) {
            console.error("Error reading profile data:", e);
        }

        // Render the customized account module
        authActions.innerHTML = `
            <div class="user-profile-hub" onclick="window.location.href='/dashboard'" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <img src="${photoURL}" alt="Avatar" style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid var(--neon-pink); object-fit: cover;">
                <span class="user-welcome" style="color: #fff; font-weight: bold; font-size: 0.95rem;">${displayName}</span>
            </div>
            <button class="btn-login" id="logout-btn" style="margin-left: 15px; padding: 6px 16px; font-size: 0.85rem;">Log Out</button>
         Ramos`;

        // Handle global logging out mechanics cleanly
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Stop click from firing the parent dashboard redirect
            signOut(auth).then(() => {
                alert("Log out successful!");
                window.location.href = "/";
            });
        });

    } else {
        // Fallback layout if unauthenticated
        authActions.innerHTML = `
            <button class="btn-login" id="open-login">Login</button>
            <button class="btn-signup" id="open-signup">Sign Up</button>
        `;
        // Re-link visual popup engine triggers if the site interface functions are present
        if (typeof window.attachModalTriggers === 'function') {
            window.attachModalTriggers();
        }
    }
});