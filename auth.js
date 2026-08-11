
// =========================================
// NGO Management System
// Authentication
// =========================================

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { auth } from "./firebase.js";


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

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log("Login successful!");
            console.log("User:", userCredential.user);

            alert("Login successful!");

            window.location.href = "dashboard.html";

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
        const confirmPassword = document.getElementById("confirmPassword").value;


        // Check passwords
        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        try {

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log("Registration successful!");
            console.log("User:", userCredential.user);

            alert("Account created successfully!");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration error:", error);

            alert("Registration failed: " + error.message);
        }
    });
    }
