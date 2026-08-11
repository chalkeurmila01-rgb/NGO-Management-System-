
// =========================================
// NGO Management System
// Authentication
// =========================================

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import {
    auth,
    db
} from "./firebase.js";


// =========================================
// LOGIN
// =========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            // Firebase Authentication
            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            console.log("Login successful!");
            console.log("User:", user);

            // Get user's data from Realtime Database
            const userRef = ref(db, "users/" + user.uid);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {

                const userData = snapshot.val();

                console.log("User data:", userData);

                alert("Login successful!");

                // Check user role
                if (userData.role === "admin") {

                    window.location.href = "admin.html";

                } else {

                    window.location.href = "dashboard.html";
                }

            } else {

                alert("User data not found in database.");

                await signOut(auth);
            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Login failed: " + error.message);
        }
    });
}


// =========================================
// REGISTRATION
// =========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check passwords
        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        try {

            // Create Firebase Authentication user
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;


            // Save user information in Realtime Database
            await set(ref(db, "users/" + user.uid), {

                name: name,
                email: email,
                role: "user"

            });


            console.log("Registration successful!");
            console.log("User:", user);

            alert("Account created successfully!");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration error:", error);

            alert("Registration failed: " + error.message);
        }
    });
}


// =========================================
// USER LOGOUT
// =========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            alert("Logout successful!");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Logout error:", error);

            alert("Logout failed: " + error.message);
        }
    });
}


// =========================================
// ADMIN LOGOUT
// =========================================

const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");

if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            alert("Admin logout successful!");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Admin logout error:", error);

            alert("Admin logout failed: " + error.message);
        }
    });
}


// =========================================
// DASHBOARD AUTH PROTECTION
// =========================================

const isDashboardPage =
    window.location.pathname.endsWith("dashboard.html");

if (isDashboardPage) {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;
        }

        console.log("Authenticated user:", user.email);

        // Check role
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {

            const userData = snapshot.val();

            // Admin should not stay on user dashboard
            if (userData.role === "admin") {

                window.location.href = "admin.html";
            }

        } else {

            await signOut(auth);

            window.location.href = "login.html";
        }
    });
}


// =========================================
// ADMIN PAGE PROTECTION
// =========================================

const isAdminPage =
    window.location.pathname.endsWith("admin.html");

if (isAdminPage) {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;
        }

        console.log("Checking admin access...");

        // Get user's database record
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {

            const userData = snapshot.val();

            console.log("User role:", userData.role);

            // Allow only admin
            if (userData.role !== "admin") {

                alert("Access denied. Admin only.");

                window.location.href = "dashboard.html";
            }

        } else {

            await signOut(auth);

            window.location.href = "login.html";
        }
    });
                }

// =========================================
// ADMIN - TOTAL USERS
// =========================================

const totalUsersElement =
    document.getElementById("totalUsers");

if (totalUsersElement) {

    const usersRef = ref(db, "users");

    get(usersRef)
        .then((snapshot) => {

            if (snapshot.exists()) {

                const users = snapshot.val();

                const totalUsers =
                    Object.keys(users).length;

                totalUsersElement.textContent =
                    totalUsers;

            } else {

                totalUsersElement.textContent = "0";
            }

        })
        .catch((error) => {

            console.error(
                "Error loading users:",
                error
            );

            totalUsersElement.textContent = "0";
        });
}
