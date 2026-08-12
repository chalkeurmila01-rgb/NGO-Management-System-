// =========================================
// NGO Management System
// Authentication
// =========================================

console.log("AUTH.JS IS RUNNING");

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    ref,
    set,
    get,
    push
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

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            console.log("Login successful!");
            console.log("User:", user);

            const userRef = ref(db, "users/" + user.uid);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {

                const userData = snapshot.val();

                console.log("User data:", userData);

                alert("Login successful!");

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

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;


            await set(
                ref(db, "users/" + user.uid),
                {
                    name: name,
                    email: email,
                    role: "user"
                }
            );


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

const logoutBtn =
    document.getElementById("logoutBtn");

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

        console.log(
            "Authenticated user:",
            user.email
        );

        const userRef =
            ref(db, "users/" + user.uid);

        const snapshot =
            await get(userRef);

        if (snapshot.exists()) {

            const userData =
                snapshot.val();

            if (userData.role === "admin") {

                window.location.href =
                    "admin.html";
            }

        } else {

            await signOut(auth);

            window.location.href =
                "login.html";
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

            window.location.href =
                "login.html";

            return;
        }

        console.log(
            "Checking admin access..."
        );

        const userRef =
            ref(db, "users/" + user.uid);

        const snapshot =
            await get(userRef);

        if (snapshot.exists()) {

            const userData =
                snapshot.val();

            console.log(
                "User role:",
                userData.role
            );

            if (userData.role !== "admin") {

                alert(
                    "Access denied. Admin only."
                );

                window.location.href =
                    "dashboard.html";
            }

        } else {

            await signOut(auth);

            window.location.href =
                "login.html";
        }
    });
}


// =========================================
// ADMIN - TOTAL USERS
// =========================================

const totalUsersElement =
    document.getElementById("totalUsers");

if (totalUsersElement) {

    const usersRef =
        ref(db, "users");

    get(usersRef)
        .then((snapshot) => {

            if (snapshot.exists()) {

                const users =
                    snapshot.val();

                const totalUsers =
                    Object.keys(users).length;

                totalUsersElement.textContent =
                    totalUsers;

            } else {

                totalUsersElement.textContent =
                    "0";
            }

        })
        .catch((error) => {

            console.error(
                "Error loading users:",
                error
            );

            totalUsersElement.textContent =
                "0";
        });
}


// =========================================
// ADMIN - TOTAL VOLUNTEERS
// =========================================

const totalVolunteersElement =
    document.getElementById("totalVolunteers");

if (totalVolunteersElement) {

    const volunteersRef =
        ref(db, "volunteers");

    get(volunteersRef)
        .then((snapshot) => {

            if (snapshot.exists()) {

                const volunteers =
                    snapshot.val();

                const totalVolunteers =
                    Object.keys(volunteers).length;

                totalVolunteersElement.textContent =
                    totalVolunteers;

                console.log(
                    "Total volunteers:",
                    totalVolunteers
                );

            } else {

                totalVolunteersElement.textContent =
                    "0";
            }

        })
        .catch((error) => {

            console.error(
                "Error loading volunteers:",
                error
            );

            totalVolunteersElement.textContent =
                "0";
        });
}


// =========================================
// VOLUNTEER MANAGEMENT
// =========================================

// Volunteer form
const volunteerForm =
    document.getElementById("volunteerForm");


// =========================================
// ADD VOLUNTEER
// =========================================

if (volunteerForm) {

    volunteerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "volunteerName"
                ).value.trim();

            const email =
                document.getElementById(
                    "volunteerEmail"
                ).value.trim();

            const phone =
                document.getElementById(
                    "volunteerPhone"
                ).value.trim();

            const address =
                document.getElementById(
                    "volunteerAddress"
                ).value.trim();


            if (
                !name ||
                !email ||
                !phone ||
                !address
            ) {

                alert(
                    "Please fill all volunteer fields."
                );

                return;
            }


            try {

                // Create a unique Firebase ID
                const volunteerRef =
                    push(ref(db, "volunteers"));


                // Save volunteer data
                await set(
                    volunteerRef,
                    {
                        name: name,
                        email: email,
                        phone: phone,
                        address: address
                    }
                );


                console.log(
                    "Volunteer added successfully."
                );


                alert(
                    "Volunteer added successfully!"
                );


                // Clear form
                volunteerForm.reset();


                // Reload volunteer records
                loadVolunteers();


            } catch (error) {

                console.error(
                    "Error adding volunteer:",
                    error
                );

                alert(
                    "Failed to add volunteer: " +
                    error.message
                );
            }
        }
    );
}


// =========================================
// LOAD VOLUNTEERS
// =========================================

const volunteerList =
    document.getElementById("volunteerList");


async function loadVolunteers() {

    if (!volunteerList) {

        return;
    }


    try {

        const volunteersRef =
            ref(db, "volunteers");

        const snapshot =
            await get(volunteersRef);


        if (!snapshot.exists()) {

            volunteerList.innerHTML = `
                <p class="text-gray-500">
                    No volunteers found.
                </p>
            `;

            return;
        }


        const volunteers =
            snapshot.val();


        volunteerList.innerHTML = "";


        Object.keys(volunteers).forEach(
            (volunteerId) => {

                const volunteer =
                    volunteers[volunteerId];


                const volunteerCard =
                    document.createElement("div");


                volunteerCard.className =
                    "border border-gray-200 rounded-lg p-5 mb-4";


                volunteerCard.innerHTML = `

                    <h4 class="text-xl font-bold text-blue-700 mb-2">
                        ${volunteer.name}
                    </h4>

                    <p class="text-gray-600">
                        <strong>Email:</strong>
                        ${volunteer.email}
                    </p>

                    <p class="text-gray-600">
                        <strong>Phone:</strong>
                        ${volunteer.phone}
                    </p>

                    <p class="text-gray-600">
                        <strong>Address:</strong>
                        ${volunteer.address}
                    </p>

                `;


                volunteerList.appendChild(
                    volunteerCard
                );
            }
        );


    } catch (error) {

        console.error(
            "Error loading volunteers:",
            error
        );


        volunteerList.innerHTML = `
            <p class="text-red-600">
                Error loading volunteer records.
            </p>
        `;
    }
}


// =========================================
// LOAD VOLUNTEERS WHEN PAGE OPENS
// =========================================

if (volunteerList) {

    loadVolunteers();
}

// =========================================
// ADMIN - TOTAL DONATIONS
// =========================================

const totalDonationsElement =
document.getElementById("totalDonations");

if (totalDonationsElement) {

const donationsRef =
    ref(db, "donations");

get(donationsRef)
    .then((snapshot) => {

        if (snapshot.exists()) {

            const donations =
                snapshot.val();

            const totalDonations =
                Object.keys(donations).length;

            totalDonationsElement.textContent =
                totalDonations;

            console.log(
                "Total donations:",
                totalDonations
            );

        } else {

            totalDonationsElement.textContent =
                "0";
        }

    })
    .catch((error) => {

        console.error(
            "Error loading donations:",
            error
        );

        totalDonationsElement.textContent =
            "0";
    });

}

// =========================================
// ADMIN - TOTAL BENEFICIARIES
// =========================================

const totalBeneficiariesElement =
    document.getElementById("totalBeneficiaries");

if (totalBeneficiariesElement) {

    const beneficiariesRef =
        ref(db, "beneficiaries");

    get(beneficiariesRef)
        .then((snapshot) => {

            if (snapshot.exists()) {

                const beneficiaries =
                    snapshot.val();

                const totalBeneficiaries =
                    Object.keys(beneficiaries).length;

                totalBeneficiariesElement.textContent =
                    totalBeneficiaries;

                console.log(
                    "Total beneficiaries:",
                    totalBeneficiaries
                );

            } else {

                totalBeneficiariesElement.textContent =
                    "0";
            }

        })
        .catch((error) => {

            console.error(
                "Error loading beneficiaries:",
                error
            );

            totalBeneficiariesElement.textContent =
                "0";
        });
}