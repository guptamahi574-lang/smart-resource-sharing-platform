
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("projectSearch");
    const filterButtons = document.querySelectorAll(".project-filter");
    const grid = document.querySelector(".projects-grid");
    const emptyMessage = document.getElementById("projectsEmpty");
    const shareButton = document.getElementById("shareProjectBtn");
    const shareSection = document.getElementById("share-project");

    const storageKey = "campusConnectProjects";
    let activeCategory = "All";

    function getProjects() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch {
            return [];
        }
    }

    function filterProjects() {
        const cards = document.querySelectorAll(".project-card");
        const search = searchInput.value.toLowerCase().trim();
        let visible = 0;

        cards.forEach(function (card) {
            const text = card.textContent.toLowerCase();
            const category = card.dataset.category || "";

            const matchesSearch = text.includes(search);
            const matchesCategory =
                activeCategory === "All" ||
                category.toLowerCase() === activeCategory.toLowerCase();

            card.hidden = !(matchesSearch && matchesCategory);
            if (!card.hidden) visible++;
        });

        if (emptyMessage) emptyMessage.hidden = visible > 0;
    }

    function createCard(project) {
        const card = document.createElement("article");
        card.className = "project-card";
        card.dataset.category = project.category;
        card.dataset.userAdded = "true";

        const top = document.createElement("div");
        top.className = "project-card-top";

        const icon = document.createElement("span");
        icon.className = "project-icon";
        icon.textContent = "💡";

        const status = document.createElement("span");
        status.className = "project-status";
        status.textContent = "Student Project";

        top.append(icon, status);
    
        const title = document.createElement("h3");
        title.textContent = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;

        const tags = document.createElement("div");
        tags.className = "project-tags";
        const tag = document.createElement("span");
        tag.textContent = project.category;
        tags.append(tag);

        const meta = document.createElement("div");
        meta.className = "project-meta";
        const owner = document.createElement("span");
        owner.textContent = "👤 " + project.owner;
        const category = document.createElement("span");
        category.textContent = project.category;
        meta.append(owner, category);

const actions = document.createElement("div");
actions.className = "project-card-actions";

const button = document.createElement("button");
button.type = "button";
button.className = "project-view-btn";
button.textContent = "Project Details ↗";

actions.appendChild(button);

if (project.id) {
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "project-delete-btn";
    deleteButton.textContent = "🗑 Delete";
    deleteButton.dataset.projectId = project.id;
    actions.appendChild(deleteButton);
}

card.append(top, title, description, tags, meta, actions);
return card;

    }

    function renderSavedProjects() {
        if (!grid) return;

        grid.querySelectorAll("[data-user-added='true']").forEach(function (card) {
            card.remove();
        });

        getProjects().forEach(function (project) {
            grid.appendChild(createCard(project));
        });

        filterProjects();
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterProjects);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            activeCategory = button.dataset.category || "All";
            filterProjects();
        });
    });

    if (shareButton && shareSection) {
        shareButton.addEventListener("click", function () {
            let form = document.getElementById("shareProjectForm");

            if (!form) {
                form = document.createElement("form");
                form.id = "shareProjectForm";
                form.className = "share-project-form";

                form.innerHTML = `
                    <h3>Share Your Project</h3>

                    <label for="projectTitle">Project Name</label>
                    <input id="projectTitle" name="projectTitle"
                           type="text" required maxlength="100">

                    <label for="projectCategory">Category</label>
                    <select id="projectCategory" name="projectCategory" required>
                        <option value="">Choose category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="AI/ML">AI / ML</option>
                        <option value="App Development">App Development</option>
                        <option value="Other">Other</option>
                    </select>

                    <label for="projectDescription">Description</label>
                    <textarea id="projectDescription"
                              name="projectDescription"
                              required maxlength="500"></textarea>

                    <label for="projectOwner">Your Name</label>
                    <input id="projectOwner" name="projectOwner"
                           type="text" required maxlength="80">

                    <button type="submit">Submit Project</button>
                    <button type="button" id="cancelShareProject">Cancel</button>
                    <p id="projectFormMessage" role="status"></p>
                `;

                shareSection.appendChild(form);

                form.addEventListener("submit", function (event) {
                    event.preventDefault();

                  
const project = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    title: form.projectTitle.value.trim(),
    category: form.projectCategory.value,
    description: form.projectDescription.value.trim(),
    owner: form.projectOwner.value.trim()
};


                    if (!project.title || !project.category ||
                        !project.description || !project.owner) {
                        return;
                    }

                    const projects = getProjects();
                    projects.push(project);

                    try {
                        localStorage.setItem(storageKey, JSON.stringify(projects));
                    } catch (error) {
                        form.querySelector("#projectFormMessage").textContent =
                            "Could not save. Browser storage may be full.";
                        return;
                    }

                    form.reset();
                    form.remove();
                    renderSavedProjects();
                    alert("Project added successfully!");
                });

                form.querySelector("#cancelShareProject").addEventListener(
                    "click", function () {
                        form.remove();
                    }
                );
            }

            form.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

    document.addEventListener("click", function (event) {
        const button = event.target.closest(".project-view-btn");
        if (!button) return;

        const card = button.closest(".project-card");
        if (!card) return;

        const title = card.querySelector("h3")?.textContent || "Project";
        const description = card.querySelector("p")?.textContent || "";
        const category = card.dataset.category || "Other";

        alert(
            "Project: " + title +
            "\nCategory: " + category +
            "\n\n" + description
        );
    });

    renderSavedProjects();
});

document.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(".project-delete-btn");
    if (!deleteButton) return;

    const projectId = deleteButton.dataset.projectId;

    if (!confirm("Are you sure you want to delete this project?")) {
        return;
    }

    const projects = JSON.parse(
        localStorage.getItem("campusConnectProjects") || "[]"
    );

    const updatedProjects = projects.filter(function (project) {
        return project.id !== projectId;
    });

    localStorage.setItem(
        "campusConnectProjects",
        JSON.stringify(updatedProjects)
    );

    const card = deleteButton.closest(".project-card");
    if (card) card.remove();

    alert("Project deleted successfully!");
});
