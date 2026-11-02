
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".clubs-grid");
    const cards = [...grid.querySelectorAll(".club-card")];
    const filters = document.querySelectorAll(".club-filter");
    const count = document.querySelector(".clubs-count");
    const suggestButton = document.querySelector(".clubs-suggest-btn");

    const STORAGE_KEY = "campusConnectClubSuggestions";
    let activeCategory = "All Clubs";
    let searchText = "";

    // Add a search box without changing the existing HTML
    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = "Search clubs and communities...";
    search.className = "clubs-search";
    search.setAttribute("aria-label", "Search clubs");
    document.querySelector(".clubs-categories").before(search);

    function applyFilters() {
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.querySelector(".club-type").textContent.trim();
            const text = card.textContent.toLowerCase();

            const categoryMatch =
                activeCategory === "All Clubs" || category === activeCategory;

            const searchMatch = text.includes(searchText);

            card.hidden = !(categoryMatch && searchMatch);

            if (!card.hidden) visibleCount++;
        });

        count.textContent = `${visibleCount} Clubs`;

        let empty = document.getElementById("clubsEmpty");

        if (!empty) {
            empty = document.createElement("p");
            empty.id = "clubsEmpty";
            empty.textContent = "No clubs found. Try another search or category.";
            grid.after(empty);
        }

        empty.hidden = visibleCount > 0;
    }

    // Search
    search.addEventListener("input", () => {
        searchText = search.value.trim().toLowerCase();
        applyFilters();
    });

    // Category filters
    filters.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.textContent.trim();

            filters.forEach(item => item.classList.remove("active"));
            button.classList.add("active");

            applyFilters();
        });
    });

    // Explore Club buttons
    cards.forEach(card => {
        card.querySelector(".club-view-btn").addEventListener("click", () => {
            const title = card.querySelector("h3").textContent.trim();
            const description = card.querySelector("p").textContent.trim();
            const info = [...card.querySelectorAll(".club-info span")]
                .map(item => item.textContent.trim())
                .join("\n");

            alert(`${title}\n\n${description}\n\n${info}\n\nFor membership and joining details, contact the respective college club.`);
        });
    });

    // Suggest a Club form
    suggestButton.addEventListener("click", () => {
        let form = document.getElementById("suggestClubForm");

        if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        form = document.createElement("form");
        form.id = "suggestClubForm";
        form.className = "clubs-suggest-form";

        form.innerHTML = `
            <h2>Suggest a New Club</h2>

            <label for="suggestClubName">Club name</label>
            <input id="suggestClubName" name="clubName"
                maxlength="80" required>

            <label for="suggestClubCategory">Category</label>
            <select id="suggestClubCategory" name="category" required>
                <option value="">Choose category</option>
                <option>Technical</option>
                <option>Cultural</option>
                <option>Creative</option>
                <option>Social Impact</option>
            </select>

            <label for="suggestClubReason">Why should this club be created?</label>
            <textarea id="suggestClubReason" name="reason"
                rows="4" maxlength="1000" required></textarea>

            <label for="suggestClubStudent">Your name</label>
            <input id="suggestClubStudent" name="student"
                maxlength="60" required>

            <div class="clubs-suggest-actions">
                <button type="submit">Submit Suggestion</button>
                <button type="button" id="cancelClubSuggestion">Cancel</button>
            </div>
        `;

        document.querySelector(".clubs-bottom").appendChild(form);
        form.scrollIntoView({ behavior: "smooth", block: "center" });

        document.getElementById("cancelClubSuggestion")
            .addEventListener("click", () => form.remove());

        form.addEventListener("submit", event => {
            event.preventDefault();

            const data = new FormData(form);
            const suggestion = {
                clubName: data.get("clubName").trim(),
                category: data.get("category"),
                reason: data.get("reason").trim(),
                student: data.get("student").trim(),
                submittedAt: new Date().toISOString()
            };

            const previous = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            previous.push(suggestion);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(previous));

            form.remove();
            alert("Your club suggestion has been saved on this browser!");
        });
    });

    applyFilters();
});
