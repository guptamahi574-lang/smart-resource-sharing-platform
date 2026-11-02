
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".experience-grid");
    const filterButtons = document.querySelectorAll(".experience-filter");
    const shareButton = document.querySelector(".experience-share-btn");
    const countLabel = document.querySelector(".experience-count");

    const STORAGE_KEY = "campusConnectExperiences";

    let activeCategory = "All Stories";
    let searchQuery = "";

    let savedStories = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    function saveStories() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStories));
    }
    async function loadStoriesFromServer() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/experiences"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("Stories load nahi hui");
        }

        grid.innerHTML = "";

        savedStories = result.stories.map(story => ({
            ...story,
            author: story.authorName,
            year: [story.branch, story.year]
                .filter(Boolean)
                .join(" · ")
        }));

        savedStories.forEach(createStoryCard);
        updateCount();
        applyFilters();

    } catch (error) {
        console.error("Experience loading error:", error);
        alert("Stories load nahi ho pa rahi. Backend check karo.");
    }
}

    function getCards() {
        return [...grid.querySelectorAll(".experience-card")];
    }

    function updateCount() {
        countLabel.textContent = `${getCards().length} Stories`;
    }

    function applyFilters() {
        getCards().forEach(card => {
            const category =
                card.querySelector(".experience-category")?.textContent.trim() || "";

            const text = card.textContent.toLowerCase();

            const matchesCategory =
                activeCategory === "All Stories" || category === activeCategory;

            const matchesSearch = text.includes(searchQuery);

            card.hidden = !(matchesCategory && matchesSearch);
        });
    }

    function createStoryCard(story) {
        const card = document.createElement("article");
        card.className = "experience-card";

        const top = document.createElement("div");
        top.className = "experience-card-top";

        const category = document.createElement("span");
        category.className = "experience-category";
        category.textContent = story.category;

        const number = document.createElement("span");
        number.className = "experience-number";
        number.textContent = String(getCards().length + 1).padStart(2, "0");

        top.append(category, number);

        const title = document.createElement("h3");
        title.textContent = story.title;

        const description = document.createElement("p");
        description.textContent = story.description;

        const author = document.createElement("div");
        author.className = "experience-author";

        const avatar = document.createElement("div");
        avatar.className = "experience-avatar";
        avatar.textContent = story.author
            .split(/\s+/)
            .map(word => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        const authorInfo = document.createElement("div");
        const authorName = document.createElement("strong");
        authorName.textContent = story.author;

        const authorYear = document.createElement("span");
        authorYear.textContent = story.year || "CampusConnect Student";

        authorInfo.append(authorName, authorYear);
        author.append(avatar, authorInfo);

        const readButton = document.createElement("button");
        readButton.type = "button";
        readButton.className = "experience-read-btn";
        readButton.textContent = "Read Story →";

        readButton.addEventListener("click", () => {
            showStory(story);
        });

        card.append(top, title, description, author, readButton);
        grid.appendChild(card);
    }

    
function showStory(story) {
    const overlay = document.createElement("div");
    overlay.className = "experience-story-overlay";

    const modal = document.createElement("section");
    modal.className = "experience-story-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "experience-story-close";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close story");

    const category = document.createElement("p");
    category.textContent = story.category;

    const title = document.createElement("h2");
    title.textContent = story.title;

    const author = document.createElement("p");
    author.textContent = `Shared by ${story.author}`;

    const body = document.createElement("p");
    body.className = "experience-story-body";
    body.textContent = story.fullStory || story.description;

    // Rating summary
    const ratingSummary = document.createElement("p");
    ratingSummary.className = "experience-rating-summary";

    const feedbackList = document.createElement("div");
    feedbackList.className = "experience-feedback-list";

    // Feedback form
    const feedbackHeading = document.createElement("h3");
    feedbackHeading.textContent = "Rate this experience";

    const user = JSON.parse(
        localStorage.getItem("campusConnectUser") || "null"
    );

    const loginMessage = document.createElement("p");
    const ratingLabel = document.createElement("label");
    ratingLabel.textContent = "Your rating";

    const stars = document.createElement("div");
    stars.className = "experience-rating-stars";
    stars.setAttribute("role", "group");
    stars.setAttribute("aria-label", "Choose a rating");

    let selectedRating = 0;

    const commentLabel = document.createElement("label");
    commentLabel.textContent = "Your feedback";

    const commentInput = document.createElement("textarea");
    commentInput.placeholder = "Share your thoughts about this experience...";
    commentInput.maxLength = 1000;
    commentInput.rows = 4;
    commentInput.className = "experience-feedback-input";

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.className = "experience-feedback-submit";
    submitButton.textContent = "Submit Feedback";

    const status = document.createElement("p");
    status.className = "experience-feedback-status";
    status.setAttribute("aria-live", "polite");

    function renderRatingSummary(average, total) {
        ratingSummary.textContent = total
            ? `⭐ ${Number(average).toFixed(1)} / 5 · ${total} rating(s)`
            : "No ratings yet. Be the first to rate!";
    }

    function renderFeedback(feedback = []) {
        feedbackList.replaceChildren();

        if (!feedback.length) {
            const empty = document.createElement("p");
            empty.textContent = "No written feedback yet.";
            feedbackList.appendChild(empty);
            return;
        }

        const heading = document.createElement("h3");
        heading.textContent = "Student Feedback";
        feedbackList.appendChild(heading);

        feedback.forEach(item => {
            const entry = document.createElement("article");
            entry.className = "experience-feedback-entry";

            const name = document.createElement("strong");
            name.textContent = item.studentName || "Student";

            const rating = document.createElement("p");
            rating.textContent = `⭐ ${item.rating}/5`;

            const comment = document.createElement("p");
            comment.textContent = item.comment || "No written comment.";

            entry.append(name, rating, comment);
            feedbackList.appendChild(entry);
        });
    }

    const existingFeedback = (story.feedback || []).find(
        item => user && item.studentId &&
            String(item.studentId) === String(user.id)
    );

    if (existingFeedback) {
        selectedRating = Number(existingFeedback.rating);
        commentInput.value = existingFeedback.comment || "";
        submitButton.textContent = "Update Feedback";
    }

    function updateStars() {
        [...stars.children].forEach((button, index) => {
            button.textContent = index < selectedRating ? "★" : "☆";
            button.setAttribute(
                "aria-pressed",
                String(index + 1 === selectedRating)
            );
        });
    }

    for (let i = 1; i <= 5; i++) {
        const starButton = document.createElement("button");
        starButton.type = "button";
        starButton.textContent = "☆";
        starButton.setAttribute("aria-label", `${i} star`);
        starButton.className = "experience-star-button";

        starButton.addEventListener("click", () => {
            selectedRating = i;
            updateStars();
        });

        stars.appendChild(starButton);
    }

    updateStars();

    if (!user || !user.id) {
        loginMessage.textContent =
            "Please log in to submit a rating or feedback.";
        stars.hidden = true;
        ratingLabel.hidden = true;
        commentLabel.hidden = true;
        commentInput.hidden = true;
        submitButton.hidden = true;
    } else {
        loginMessage.textContent = `Giving feedback as ${user.name}`;
    }

    async function submitFeedback() {
        if (!user || !user.id) {
            status.textContent = "Please log in first.";
            return;
        }

        if (!story._id) {
            status.textContent = "Story ID missing. Please reload the page.";
            return;
        }

        if (selectedRating < 1 || selectedRating > 5) {
            status.textContent = "Please select a star rating.";
            return;
        }

        submitButton.disabled = true;
        status.textContent = "Saving feedback...";

        try {
            const response = await fetch(
                `http://localhost:5000/api/experiences/${story._id}/feedback`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentId: user.id,
                        rating: selectedRating,
                        comment: commentInput.value.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Feedback could not be saved.");
            }

            story.feedback = data.feedback || [];
            renderRatingSummary(data.averageRating, data.totalRatings);
            renderFeedback(story.feedback);

            submitButton.textContent = "Update Feedback";
            status.textContent = "Your feedback has been saved!";

        } catch (error) {
            status.textContent = error.message ||
                "Could not connect to the server. Is the backend running?";
        } finally {
            submitButton.disabled = false;
        }
    }

    submitButton.addEventListener("click", submitFeedback);

    renderRatingSummary(
        story.averageRating || 0,
        story.totalRatings || 0
    );
    renderFeedback(story.feedback || []);

    function closeModal() {
        overlay.remove();
        document.removeEventListener("keydown", handleEscape);
    }

    function handleEscape(event) {
        if (event.key === "Escape") closeModal();
    }

    closeButton.addEventListener("click", closeModal);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeModal();
    });

    document.addEventListener("keydown", handleEscape);

    modal.append(
        closeButton,
        category,
        title,
        author,
        body,
        ratingSummary,
        feedbackHeading,
        loginMessage,
        ratingLabel,
        stars,
        commentLabel,
        commentInput,
        submitButton,
        status,
        feedbackList
    );

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    closeButton.focus();
}


    function showShareForm() {
        if (document.querySelector(".experience-share-form")) return;

        const form = document.createElement("form");
        form.className = "experience-share-form";
        form.innerHTML = `
            <h2>Share Your Experience</h2>
            <label for="experienceTitle">Story title</label>
            <input id="experienceTitle" name="title" maxlength="100" required>

            <label for="experienceCategory">Category</label>
            <select id="experienceCategory" name="category" required>
                <option value="">Choose a category</option>
                <option>Internships</option>
                <option>Placements</option>
                <option>College Life</option>
                <option>Skills &amp; Learning</option>
            </select>

            <label for="experienceDescription">Short summary</label>
            <textarea id="experienceDescription" name="description"
                maxlength="300" rows="3" required></textarea>

            <label for="experienceFullStory">Your story</label>
            <textarea id="experienceFullStory" name="fullStory"
                maxlength="5000" rows="6" required></textarea>

            <label for="experienceAuthor">Your name</label>
            <input id="experienceAuthor" name="author" maxlength="60" required>

            <label for="experienceYear">Branch and year (optional)</label>
            <input id="experienceYear" name="year" maxlength="60"
                placeholder="e.g. CST · 2nd Year">

            <div class="experience-form-actions">
                <button type="submit">Publish Story</button>
                <button type="button" class="experience-cancel-btn">Cancel</button>
            </div>
        `;

        document.querySelector(".experience-bottom-note").appendChild(form);
        form.scrollIntoView({ behavior: "smooth", block: "center" });

        form.querySelector(".experience-cancel-btn").addEventListener("click", () => {
            form.remove();
        });

       form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);

    const story = {
        title: data.get("title").trim(),
        category: data.get("category"),
        description: data.get("description").trim(),
        fullStory: data.get("fullStory").trim(),
        authorName: data.get("author").trim(),
        branch: "",
        year: data.get("year").trim()
    };

    const branchYear = story.year.split("·").map(x => x.trim());
    story.branch = branchYear[0] || "";
    story.year = branchYear[1] || "";

    try {
        const response = await fetch(
            "http://localhost:5000/api/experiences",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(story)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Publish failed");
        }

        form.remove();
        await loadStoriesFromServer();
        alert("Story database mein publish ho gayi!");

    } catch (error) {
        console.error(error);
        alert("Story publish nahi hui. Backend terminal check karo.");
    }
});
    }

    // Read buttons on the six original sample stories
    getCards().forEach(card => {
        const button = card.querySelector(".experience-read-btn");

        button?.addEventListener("click", () => {
            showStory({
                title: card.querySelector("h3")?.textContent.trim() || "Experience",
                category: card.querySelector(".experience-category")?.textContent.trim() || "",
                description: card.querySelector("p")?.textContent.trim() || "",
                fullStory: card.querySelector("p")?.textContent.trim() || "",
                author: card.querySelector(".experience-author strong")?.textContent.trim() || "Student"
            });
        });
    });

    // Restore stories saved in the browser
    loadStoriesFromServer();

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.textContent.trim();

            filterButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");

            applyFilters();
        });
    });

    // Add a search box without changing the existing HTML
    const filterSection = document.querySelector(".experience-filters");
    const search = document.createElement("input");

    search.type = "search";
    search.className = "experience-search";
    search.placeholder = "Search stories...";
    search.setAttribute("aria-label", "Search experiences");

    filterSection.before(search);

    search.addEventListener("input", () => {
        searchQuery = search.value.trim().toLowerCase();
        applyFilters();
    });

    shareButton.addEventListener("click", showShareForm);

    updateCount();
});
