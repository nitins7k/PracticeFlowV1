import { db, auth } from "./firebase-config.js";
import { supabase } from "./supabase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth, function (user) {

    const uploadSection = document.getElementById("worksheetForm").closest("section");

    if (!user) {
        uploadSection.style.display = "none";
    }

});

const form = document.getElementById("worksheetForm");
const worksheetList = document.getElementById("worksheetList");

loadWorksheets();

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!auth.currentUser) {
        alert("Please login as a teacher to upload worksheets.");
        window.location.href = "login.html";
        return;
    }

    const className = document.getElementById("classSelect").value;
    const subject = document.getElementById("subject").value.trim();
    const chapter = document.getElementById("chapter").value.trim();
    const title =
        document.getElementById("title").value.trim() || "Worksheet";
    const pdfFile = document.getElementById("pdfFile").files[0];

    if (!pdfFile) {
        alert("Please select a PDF.");
        return;
    }

    try {

        const fileName = Date.now() + "-" + pdfFile.name;

        const { error } = await supabase.storage
            .from("pdfs")
            .upload(fileName, pdfFile);

        if (error) {
            throw error;
        }

        const { data } = supabase.storage
            .from("pdfs")
            .getPublicUrl(fileName);

        await addDoc(collection(db, "worksheets"), {
            class: className,
            subject: subject,
            chapter: chapter,
            title: title,
            pdfUrl: data.publicUrl,
            uploadDate: serverTimestamp()
        });

        alert("Worksheet uploaded successfully.");

        form.reset();

        loadWorksheets();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

});

async function loadWorksheets() {

    worksheetList.innerHTML = "<p>Loading...</p>";

    const q = query(
        collection(db, "worksheets"),
        orderBy("class")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        worksheetList.innerHTML =
            "<p>No worksheets uploaded yet.</p>";
        return;
    }

    const worksheets = [];

    snapshot.forEach(doc => {
        worksheets.push(doc.data());
    });

    displayWorksheets(worksheets);

}

function displayWorksheets(worksheets) {

    worksheetList.innerHTML = "";

    const grouped = {};

    worksheets.forEach(item => {

        if (!grouped[item.class]) grouped[item.class] = {};
        if (!grouped[item.class][item.subject]) grouped[item.class][item.subject] = {};
        if (!grouped[item.class][item.subject][item.chapter]) {
            grouped[item.class][item.subject][item.chapter] = [];
        }

        grouped[item.class][item.subject][item.chapter].push(item);

    });

    Object.keys(grouped).sort().forEach(className => {

        const classDetails = document.createElement("details");
        classDetails.open = true;
        classDetails.className = "card";

        const classSummary = document.createElement("summary");
        classSummary.innerHTML = "<strong>Class " + className + "</strong>";
        classDetails.appendChild(classSummary);

        Object.keys(grouped[className]).sort().forEach(subject => {

            const subjectDetails = document.createElement("details");
            subjectDetails.open = true;
            subjectDetails.style.margin = "15px 0 0 20px";

            const subjectSummary = document.createElement("summary");
            subjectSummary.textContent = subject;

            subjectDetails.appendChild(subjectSummary);

            Object.keys(grouped[className][subject]).sort().forEach(chapter => {

                const chapterDetails = document.createElement("details");
                chapterDetails.open = true;
                chapterDetails.style.margin = "12px 0 0 20px";

                const chapterSummary = document.createElement("summary");
                chapterSummary.textContent = chapter;

                chapterDetails.appendChild(chapterSummary);

                grouped[className][subject][chapter].forEach(item => {

                    const row = document.createElement("div");
                    row.className = "file-card";

                    const title = document.createElement("p");
                    title.className = "file-title";
                    title.textContent = item.title;

                    const actions = document.createElement("div");
                    actions.className = "file-actions";

                    const view = document.createElement("a");
                    view.href = item.pdfUrl;
                    view.target = "_blank";
                    view.textContent = "View PDF";

                    const download = document.createElement("a");
                    download.href = item.pdfUrl;
                    download.download = "";
                    download.target = "_blank";
                    download.textContent = "Download PDF";

                    actions.appendChild(view);
                    actions.appendChild(download);

                    row.appendChild(title);
                    row.appendChild(actions);

                    chapterDetails.appendChild(row);

                });

                subjectDetails.appendChild(chapterDetails);

            });

            classDetails.appendChild(subjectDetails);

        });

        worksheetList.appendChild(classDetails);

    });

}