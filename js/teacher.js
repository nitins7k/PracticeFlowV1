import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const logoutButton = document.getElementById("logoutButton");

onAuthStateChanged(auth, function (user) {

    if (!user) {
        window.location.href = "login.html";
        return;
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