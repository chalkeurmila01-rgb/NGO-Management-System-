
// NGO Management System

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";
// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIHFfT1mvw9bTi8f3YMmP9Q1cOxlgeSwY",
  authDomain: "ngo-management-system-d9d98.firebaseapp.com",
  databaseURL: "https://ngo-management-system-d9d98-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ngo-management-system-d9d98",
  storageBucket: "ngo-management-system-d9d98.firebasestorage.app",
  messagingSenderId: "802097149516",
  appId: "1:802097149516:web:e4b7ced7fdf929a031a6e9",
  measurementId: "G-7MW3DHY67M"
};

// Firebase App
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Firebase Database
const db = getDatabase(app);

console.log("Firebase connected successfully!");

export { app, auth, db };
