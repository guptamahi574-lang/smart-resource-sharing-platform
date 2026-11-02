
document.addEventListener("DOMContentLoaded", function () {
    const editBtn = document.getElementById("editProfileBtn");
    const editSection = document.getElementById("profileEditSection");
    const profileForm = document.getElementById("profileEditForm");
    const closeBtn = document.getElementById("closeProfileForm");
    const cancelBtn = document.getElementById("cancelProfileEdit");
    const message = document.getElementById("profileFormMessage");

    if (!editBtn || !editSection || !profileForm) return;

    const fields = {
        name: document.getElementById("profileName"),
        email: document.getElementById("profileEmail"),
        branch: document.getElementById("profileBranch"),
        year: document.getElementById("profileYear"),
        about: document.getElementById("profileAbout"),
        skills: document.getElementById("profileSkills")
    };

    const storageKey = "campusConnectProfile";

    function showProfile(profile) {
        const name = profile.name || "Student";
        document.getElementById("displayName").textContent = name;
        document.getElementById("displayBranch").textContent = profile.branch || "";
        document.getElementById("displayYear").textContent = profile.year || "";
        document.getElementById("displayEmail").textContent = profile.email || "";
        document.getElementById("displayBranchDetail").textContent = profile.branch || "";
        document.getElementById("displayYearDetail").textContent = profile.year || "";
        document.getElementById("displayAbout").textContent = profile.about || "Add a little about yourself.";
        document.getElementById("displaySkills").textContent = profile.skills || "Add your skills";

        const avatar = document.getElementById("profileAvatar");
        if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
    }

    function getProfileFromForm() {
        return {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            branch: fields.branch.value,
            year: fields.year.value,
            about: fields.about.value.trim(),
            skills: fields.skills.value.trim()
        };
    }

    function openForm() {
        const profile = JSON.parse(localStorage.getItem(storageKey) || "null");

        if (profile) {
            fields.name.value = profile.name || "";
            fields.email.value = profile.email || "";
            fields.branch.value = profile.branch || "";
            fields.year.value = profile.year || "";
            fields.about.value = profile.about || "";
            fields.skills.value = profile.skills || "";
        }

        message.textContent = "";
        editSection.hidden = false;
        editSection.scrollIntoView({ behavior: "smooth" });
    }

    function closeForm() {
        editSection.hidden = true;
        message.textContent = "";
    }

    editBtn.addEventListener("click", openForm);

    if (closeBtn) closeBtn.addEventListener("click", closeForm);
    if (cancelBtn) cancelBtn.addEventListener("click", closeForm);

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const profile = getProfileFromForm();

        if (!profile.name || !profile.email) {
            message.textContent = "Please enter your name and email.";
            return;
        }

        localStorage.setItem(storageKey, JSON.stringify(profile));
        showProfile(profile);
        message.textContent = "Profile saved successfully!";
        editSection.hidden = true;
    });

    const savedProfile = JSON.parse(localStorage.getItem(storageKey) || "null");

    if (savedProfile) {
        showProfile(savedProfile);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const cards = Array.from(
        document.querySelectorAll(".notification-card")
    );
    const filterButtons = document.querySelectorAll(".notification-filter");
    const markAllBtn = document.getElementById("markAllReadBtn");
    const totalCount = document.getElementById("totalNotifications");
    const unreadCount = document.getElementById("unreadNotifications");
    const emptyMessage = document.getElementById("notificationEmpty");

    if (cards.length === 0) return;

    const storageKey = "campusConnectNotifications";

    let savedStates = JSON.parse(
        localStorage.getItem(storageKey) || "{}"
    );

    cards.forEach(function (card, index) {
        const id = card.dataset.id || "notification-" + index;

        if (savedStates[id] !== undefined) {
            card.dataset.read = savedStates[id] ? "true" : "false";
        }

        card.dataset.notificationId = id;
    });

    function saveStates() {
        savedStates = {};

        cards.forEach(function (card) {
            savedStates[card.dataset.notificationId] =
                card.dataset.read === "true";
        });

        localStorage.setItem(storageKey, JSON.stringify(savedStates));
    }

    function updateCounts() {
        const unread = cards.filter(function (card) {
            return card.dataset.read !== "true";
        }).length;

        if (totalCount) totalCount.textContent = cards.length;
        if (unreadCount) unreadCount.textContent = unread;
    }

    function applyFilter(category) {
        let visibleCount = 0;

        cards.forEach(function (card) {
            const cardCategory = (
                card.dataset.category || ""
            ).toLowerCase();

            const isUnread = card.dataset.read !== "true";

            const matchesCategory =
                category === "all" ||
                (category === "unread" && isUnread) ||
                cardCategory === category;

            card.hidden = !matchesCategory;

            if (matchesCategory) visibleCount++;
        });

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            applyFilter(
                (button.dataset.filter || "all").toLowerCase()
            );
        });
    });

    markAllBtn?.addEventListener("click", function () {
        cards.forEach(function (card) {
            card.dataset.read = "true";
        });

        saveStates();
        updateCounts();

        const activeButton = document.querySelector(
            ".notification-filter.active"
        );

        applyFilter(
            activeButton?.dataset.filter?.toLowerCase() || "all"
        );
    });

    updateCounts();
    applyFilter("all");
});
