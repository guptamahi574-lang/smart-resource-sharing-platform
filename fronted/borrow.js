
document.addEventListener("DOMContentLoaded", function () {
    const lendForm = document.getElementById("lendItemForm");
    const lendModal = document.getElementById("lendModal");

    if (!lendForm) return;

    const itemName = document.getElementById("lendItemName");
    const category = document.getElementById("lendItemCategory");
    const description = document.getElementById("lendItemDescription");
    const ownerName = document.getElementById("lendOwnerName");
    const ownerBranch = document.getElementById("lendOwnerBranch");
    const ownerYear = document.getElementById("lendOwnerYear");
    const availability = document.getElementById("lendAvailability");

    const storageKey = "campusConnectLendItems";

    function getSavedItems() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch {
            return [];
        }
    }

    function renderItems() {
        const items = getSavedItems();
        const container = document.querySelector(".borrow-grid");

        if (!container) {
            console.warn("Borrow cards container not found. Check its class in borrow.html.");
            return;
        }

        container.querySelectorAll("[data-user-added='true']").forEach(function (card) {
            card.remove();
        });

        items.forEach(function (item) {
            const card = document.createElement("article");
            card.className = "borrow-card";
            card.dataset.userAdded = "true";

            const title = document.createElement("h3");
            title.textContent = item.name;

            const badge = document.createElement("span");
            badge.className = "borrow-badge";
            badge.textContent = item.category;

            const details = document.createElement("p");
            details.textContent = item.description;

            const owner = document.createElement("p");
            owner.textContent = "Shared by " + item.ownerName;

            const branch = document.createElement("p");
            branch.textContent = item.branch + " • " + item.year;

            const status = document.createElement("p");
            status.textContent = "Availability: " + item.availability;

            card.append(title, badge, details, owner, branch, status);
            container.prepend(card);
        });
    }

    lendForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const item = {
            name: itemName.value.trim(),
            category: category.value,
            description: description.value.trim(),
            ownerName: ownerName.value.trim(),
            branch: ownerBranch.value,
            year: ownerYear.value,
            availability: availability.value
        };

        if (
            !item.name ||
            !item.category ||
            !item.description ||
            !item.ownerName ||
            !item.branch ||
            !item.year ||
            !item.availability
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const items = getSavedItems();
        items.push(item);

        try {
            localStorage.setItem(storageKey, JSON.stringify(items));
        } catch (error) {
            alert("Item could not be saved in this browser.");
            console.error(error);
            return;
        }

        renderItems();
        lendForm.reset();

        if (lendModal) {
            lendModal.style.display = "none";
        }

        alert("Your item has been added successfully!");
    });

    renderItems();
});
