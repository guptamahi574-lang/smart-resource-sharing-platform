// ================= REGISTER =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const branch = document.getElementById("branch").value;
        const year = document.getElementById("year").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // Check password
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        branch,
                        year,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Account created successfully!");

                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Registration error:", error);

            alert(
                "Unable to connect to the server. Please make sure the backend is running."
            );
        }
    });
}


// ================= LOGIN =================


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message || "Login failed.");
                return;
            }

            localStorage.setItem(
                "campusConnectUser",
                JSON.stringify(data.user)
            );

            alert("Login successful! Welcome, " + data.user.name);

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect. Please check that the backend is running.");
        }
    });
}

/* ==========================================
CAMPUSCONNECT — RESOURCE HUB FUNCTIONALITY
========================================== */

document.addEventListener("DOMContentLoaded", function () {


const searchInput = document.querySelector(".resource-search input");
const filterButtons = document.querySelectorAll(".filter-btn");
const resourceCards = document.querySelectorAll(".resource-card");

let activeCategory = "All";

function filterResources() {

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase().trim();

    resourceCards.forEach(function (card) {

        const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
        const description = card.querySelector(".resource-description")?.textContent.toLowerCase() || "";
        const badge = card.querySelector(".resource-badge")?.textContent.toLowerCase().trim() || "";

        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText) ||
            badge.includes(searchText);

        let matchesCategory = true;

        if (activeCategory !== "All") {
            matchesCategory = badge.includes(activeCategory.toLowerCase());
        }

        card.style.display =
            matchesSearch && matchesCategory ? "" : "none";
    });
}

if (searchInput) {
    searchInput.addEventListener("input", filterResources);
}

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const buttonText = button.textContent.trim();

        if (buttonText.includes("Notes")) {
            activeCategory = "Notes";
        } else if (buttonText.includes("PYQs")) {
            activeCategory = "PYQ";
        } else if (buttonText.includes("Books")) {
            activeCategory = "Book";
        } else if (buttonText.includes("Viva")) {
            activeCategory = "Viva";
        } else if (buttonText.includes("Assignments")) {
            activeCategory = "Assignment";
        } else {
            activeCategory = "All";
        }

        filterResources();
    });
});


});
 
 
// ================= SHARE RESOURCE POPUP =================
document.addEventListener("DOMContentLoaded", function () {
    const shareBtn = document.getElementById("shareResourceBtn");
    const modal = document.getElementById("shareResourceModal");
    const closeBtn = document.getElementById("closeShareModal");
    const shareForm = document.getElementById("shareResourceForm");

    if (!shareBtn || !modal || !closeBtn || !shareForm) return;

    shareBtn.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    shareForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("resourceTitle").value.trim();
        const category = document.getElementById("resourceCategory").value;
        const description = document.getElementById("resourceDescription").value.trim();
        const uploader = document.getElementById("resourceUploader").value.trim();

        if (!title || !category || !description || !uploader) {
            alert("Please fill in all fields.");
            return;
        }

        const resourceGrid = document.querySelector(".resource-grid");

        if (!resourceGrid) {
            alert("Resource section was not found.");
            return;
        }

        const card = document.createElement("article");
        card.className = "resource-card";

        const badge = document.createElement("span");
        badge.className = "resource-badge";
        badge.textContent = category;

        const heading = document.createElement("h3");
        heading.textContent = title;

        const descriptionText = document.createElement("p");
        descriptionText.className = "resource-description";
        descriptionText.textContent = description;

        const uploaderText = document.createElement("p");
        uploaderText.textContent = "Shared by " + uploader;

        const viewButton = document.createElement("button");
        viewButton.className = "view-resource-btn";
        viewButton.type = "button";
        viewButton.textContent = "View →";

        card.append(badge, heading, descriptionText, uploaderText, viewButton);
        resourceGrid.prepend(card);
        const newResource = {
    title: title,
    category: category,
    description: description,
    uploader: uploader
};

const savedResources = JSON.parse(
    localStorage.getItem("campusConnectResources") || "[]"
);

savedResources.push(newResource);

localStorage.setItem(
    "campusConnectResources",
    JSON.stringify(savedResources)
);

        shareForm.reset();
        modal.style.display = "none";

        alert("Resource added successfully!");
    });
});
 
// ============ VIEW RESOURCE DETAILS ============

document.addEventListener("click", function (event) {
    const viewButton = event.target.closest(".view-resource-btn");

    if (!viewButton) return;

    const card = viewButton.closest(".resource-card");

    if (!card) return;

    const title = card.querySelector("h3")?.textContent || "Untitled Resource";
    const category = card.querySelector(".resource-badge")?.textContent || "Resource";
    const description = card.querySelector(".resource-description")?.textContent || "No description available.";

    const uploaderElement = Array.from(card.querySelectorAll("p")).find(function (p) {
        return p.textContent.includes("Shared by") ||
               p.textContent.includes("Year");
    });

    const uploader = uploaderElement?.textContent || "Student";

    document.getElementById("detailTitle").textContent = title;
    document.getElementById("detailCategory").textContent = category;
    document.getElementById("detailDescription").textContent = description;
    document.getElementById("detailUploader").textContent =
        uploader.replace("Shared by ", "");

    document.getElementById("viewResourceModal").style.display = "flex";
});

document.addEventListener("click", function (event) {
    if (
        event.target.id === "closeViewModal" ||
        event.target.id === "closeViewModalBtn"
    ) {
        document.getElementById("viewResourceModal").style.display = "none";
    }

    if (event.target.id === "viewResourceModal") {
        event.target.style.display = "none";
    }
});
 
// ============ VIEW RESOURCE DETAILS ============

document.addEventListener("click", function (event) {
    const viewButton = event.target.closest(".view-resource-btn");

    if (!viewButton) return;

    const card = viewButton.closest(".resource-card");

    if (!card) return;

    const title = card.querySelector("h3")?.textContent || "Untitled Resource";
    const category = card.querySelector(".resource-badge")?.textContent || "Resource";
    const description = card.querySelector(".resource-description")?.textContent || "No description available.";

    const uploaderElement = Array.from(card.querySelectorAll("p")).find(function (p) {
        return p.textContent.includes("Shared by") ||
               p.textContent.includes("Year");
    });

    const uploader = uploaderElement?.textContent || "Student";

    document.getElementById("detailTitle").textContent = title;
    document.getElementById("detailCategory").textContent = category;
    document.getElementById("detailDescription").textContent = description;
    document.getElementById("detailUploader").textContent =
        uploader.replace("Shared by ", "");

    document.getElementById("viewResourceModal").style.display = "flex";
});

document.addEventListener("click", function (event) {
    if (
        event.target.id === "closeViewModal" ||
        event.target.id === "closeViewModalBtn"
    ) {
        document.getElementById("viewResourceModal").style.display = "none";
    }

    if (event.target.id === "viewResourceModal") {
        event.target.style.display = "none";
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const resourceGrid = document.querySelector(".resource-grid");

    if (!resourceGrid) return;

    const savedResources = JSON.parse(
        localStorage.getItem("campusConnectResources") || "[]"
    );

    savedResources.forEach(function (resource) {
        const card = document.createElement("article");
        card.className = "resource-card";

        const badge = document.createElement("span");
        badge.className = "resource-badge";
        badge.textContent = resource.category;

        const heading = document.createElement("h3");
        heading.textContent = resource.title;

        const description = document.createElement("p");
        description.className = "resource-description";
        description.textContent = resource.description;

        const uploader = document.createElement("p");
        uploader.textContent = "Shared by " + resource.uploader;

        const viewButton = document.createElement("button");
        viewButton.className = "view-resource-btn";
        viewButton.type = "button";
        viewButton.textContent = "View →";

        card.append(badge, heading, description, uploader, viewButton);
        resourceGrid.prepend(card);
    });
});
// ===== LEND ITEM POPUP =====
document.addEventListener("DOMContentLoaded", function () {
    const lendBtn = document.getElementById("lendItemBtn");
    const lendModal = document.getElementById("lendModal");
    const closeBtn = document.getElementById("closeLendModal");
    const lendForm = document.getElementById("lendItemForm");

    if (!lendBtn || !lendModal || !closeBtn || !lendForm) return;

    // Open popup
    lendBtn.addEventListener("click", function () {
        lendModal.style.display = "flex";
    });

    // Close popup using cross button
    closeBtn.addEventListener("click", function () {
        lendModal.style.display = "none";
    });

    // Close popup by clicking outside the form
    lendModal.addEventListener("click", function (event) {
        if (event.target === lendModal) {
            lendModal.style.display = "none";
        }
    });

    // Close popup using Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            lendModal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const savedUser = localStorage.getItem("campusConnectUser");

    // Dashboard par login ke bina access nahi
    if (!savedUser) {
        window.location.href = "login.html";
        return;
    }

   const user = JSON.parse(savedUser);

const fullName = user.name || "Student";
const firstName = fullName.trim().split(/\s+/)[0];
const branch = user.branch || "Branch not set";
const yearNumber = Number(user.year);

const yearText = yearNumber >= 1 && yearNumber <= 4
    ? ["1st", "2nd", "3rd", "4th"][yearNumber - 1] + " Year"
    : "Year not set";

const details = branch + " • " + yearText;
const initial = fullName.trim().charAt(0).toUpperCase();

const setText = (id, value) => {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    } else {
        console.warn(`HTML element missing: #${id}`);
    }
};

setText("welcomeName", "Hello, " + firstName + "!");
setText("sidebarName", fullName);
setText("sidebarDetails", details);
setText("sidebarAvatar", initial);

setText("headerName", fullName);
setText("headerDetails", details);
setText("headerAvatar", initial);
});