
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".opportunities-grid");
    const cards = [...document.querySelectorAll(".opportunity-card")];
    const searchInput = document.getElementById("opportunitySearch");
    const searchButton = document.getElementById("opportunitySearchBtn");
    const filters = document.querySelectorAll(".opportunity-filter");
    const sortSelect = document.getElementById("opportunitySort");

    let activeCategory = "All";
    let searchText = "";

    function filterAndSort() {
        const visibleCards = [];

        cards.forEach(card => {
            const category = card.querySelector(".opportunity-category")
                .textContent.trim().toLowerCase();

            const text = card.textContent.toLowerCase();

            const categoryMatch =
                activeCategory === "All" ||
                category === activeCategory.toLowerCase().replace(/s$/, "");

            const searchMatch = text.includes(searchText);

            if (categoryMatch && searchMatch) {
                card.hidden = false;
                visibleCards.push(card);
            } else {
                card.hidden = true;
            }
        });

        // Sort visible cards
        if (sortSelect.value === "deadline") {
            visibleCards.sort((a, b) => {
                const aText = a.querySelector(".opportunity-deadline strong")
                    .textContent.trim();
                const bText = b.querySelector(".opportunity-deadline strong")
                    .textContent.trim();

                const aDate = Date.parse(aText);
                const bDate = Date.parse(bText);

                if (Number.isNaN(aDate) && Number.isNaN(bDate)) return 0;
                if (Number.isNaN(aDate)) return 1;
                if (Number.isNaN(bDate)) return -1;

                return aDate - bDate;
            });
        }

        visibleCards.forEach(card => grid.appendChild(card));

        let emptyMessage = document.getElementById("opportunityEmpty");

        if (!emptyMessage) {
            emptyMessage = document.createElement("p");
            emptyMessage.id = "opportunityEmpty";
            emptyMessage.textContent = "No matching opportunities found. Try another search or category.";
            emptyMessage.hidden = true;
            grid.after(emptyMessage);
        }

        emptyMessage.hidden = visibleCards.length !== 0;
    }

    // Category filters
    filters.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.textContent.trim();

            filters.forEach(filter => filter.classList.remove("active"));
            button.classList.add("active");

            filterAndSort();
        });
    });

    // Search button
    searchButton.addEventListener("click", () => {
        searchText = searchInput.value.trim().toLowerCase();
        filterAndSort();
    });

    // Search as the user types
    searchInput.addEventListener("input", () => {
        searchText = searchInput.value.trim().toLowerCase();
        filterAndSort();
    });

    // Press Enter to search
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            searchText = searchInput.value.trim().toLowerCase();
            filterAndSort();
        }
    });

    // Sorting
    sortSelect.addEventListener("change", filterAndSort);

    // View Opportunity buttons
    cards.forEach(card => {
        const button = card.querySelector(".opportunity-view-btn");

        button.addEventListener("click", () => {
            const title = card.querySelector("h3").textContent.trim();
            const organization = card.querySelector(".opportunity-organization")
                .textContent.trim();
            const description = card.querySelector(".opportunity-description")
                .textContent.trim();
            const deadline = card.querySelector(".opportunity-deadline strong")
                .textContent.trim();

            alert(
                `${title}\n\nOrganization: ${organization}\n\n${description}\n\nDeadline: ${deadline}\n\nThis is a sample listing. Check official sources for real application details.`
            );
        });
    });

    filterAndSort();
});
