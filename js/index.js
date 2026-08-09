import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

onAuthStateChanged(auth, function (user) {

    if (user) {
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
    } else {
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
    }

});

logoutButton.addEventListener("click", async function () {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);
        alert("Logout failed.");

    }

});