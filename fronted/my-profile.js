
document.addEventListener("DOMContentLoaded", function () {
    const savedUser = localStorage.getItem("campusConnectUser");

    // Login ke bina profile access nahi hogi
    if (!savedUser) {
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(savedUser);

    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const branchInput = document.getElementById("profileBranch");
    const yearInput = document.getElementById("profileYear");
    const aboutInput = document.getElementById("profileAbout");
    const skillsInput = document.getElementById("profileSkills");

    const editSection = document.getElementById("profileEditSection");
    const editButton = document.getElementById("editProfileBtn");
    const closeButton = document.getElementById("closeProfileForm");
    const cancelButton = document.getElementById("cancelProfileEdit");
    const editForm = document.getElementById("profileEditForm");
    const formMessage = document.getElementById("profileFormMessage");

    // Extra profile details browser mein save rahenge
    const profileKey = "campusConnectProfile_" + user.email;

    let extraProfile = JSON.parse(
        localStorage.getItem(profileKey) || "{}"
    );

    function getYearText(year) {
        const years = {
            1: "First Year",
            2: "Second Year",
            3: "Third Year",
            4: "Fourth Year"
        };

        return years[year] || "Year not set";
    }

    function renderProfile() {
        const name = extraProfile.name || user.name || "Student";
        const email = extraProfile.email || user.email || "";
        const branch = extraProfile.branch || user.branch || "Branch not set";
        const year = extraProfile.year || user.year || "";

        document.getElementById("displayName").textContent = name;
        document.getElementById("displayEmail").textContent = email;
        document.getElementById("displayBranch").textContent =
            "B.Tech · " + branch;
        document.getElementById("displayBranchDetail").textContent = branch;
        document.getElementById("displayYear").textContent =
            getYearText(year) + " · Student";
        document.getElementById("displayYearDetail").textContent =
            getYearText(year);

        document.getElementById("profileAvatar").textContent =
            name.trim().charAt(0).toUpperCase() || "S";

        document.getElementById("displayAbout").textContent =
            extraProfile.about ||
            "Add a short introduction about yourself, your interests and what you are learning.";

        const skillsContainer = document.getElementById("displaySkills");
        skillsContainer.replaceChildren();

        const skills = extraProfile.skills ||
            ["Programming", "Learning & Growth", "Teamwork"];

        skills.forEach(function (skill) {
            const span = document.createElement("span");
            span.textContent = skill;
            skillsContainer.appendChild(span);
        });
    }

    function openEditForm() {
        nameInput.value = extraProfile.name || user.name || "";
        emailInput.value = extraProfile.email || user.email || "";
        branchInput.value = extraProfile.branch || user.branch || "";
        yearInput.value = String(extraProfile.year || user.year || 1);
        aboutInput.value = extraProfile.about || "";
        skillsInput.value = (extraProfile.skills || []).join(", ");

        formMessage.textContent = "";
        editSection.hidden = false;
        editSection.scrollIntoView({ behavior: "smooth" });
    }

    function closeEditForm() {
        editSection.hidden = true;
        formMessage.textContent = "";
    }

    editButton.addEventListener("click", openEditForm);
    closeButton.addEventListener("click", closeEditForm);
    cancelButton.addEventListener("click", closeEditForm);

    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedName = nameInput.value.trim();
        const updatedEmail = emailInput.value.trim().toLowerCase();
        const updatedBranch = branchInput.value.trim();
        const updatedYear = Number(yearInput.value);

        if (!updatedName || !updatedEmail) {
            formMessage.textContent = "Name and email are required.";
            return;
        }

        extraProfile = {
            name: updatedName,
            email: updatedEmail,
            branch: updatedBranch,
            year: updatedYear,
            about: aboutInput.value.trim(),
            skills: skillsInput.value
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean)
        };

        localStorage.setItem(profileKey, JSON.stringify(extraProfile));

        // Update the displayed profile
        renderProfile();

        // Update the saved login details for this browser
        const updatedUser = {
            ...user,
            name: updatedName,
            email: updatedEmail,
            branch: updatedBranch,
            year: updatedYear
        };

        localStorage.setItem(
            "campusConnectUser",
            JSON.stringify(updatedUser)
        );

        formMessage.textContent = "Profile updated successfully!";
        editSection.hidden = true;
    });

    renderProfile();
});
