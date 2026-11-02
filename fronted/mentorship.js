
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("mentorSearch");
    const skillFilter = document.getElementById("mentorSkill");
    const cards = document.querySelectorAll(".mentor-card");

    function filterMentors() {
        const search = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const selectedSkill = skillFilter
            ? skillFilter.value.toLowerCase()
            : "all";

        let visibleCount = 0;

        cards.forEach(function (card) {
            const text = card.textContent.toLowerCase();
            const skillText = card.textContent.toLowerCase();

            const matchesSearch = text.includes(search);
            const matchesSkill =
                selectedSkill === "all" ||
                skillText.includes(selectedSkill);

            card.hidden = !(matchesSearch && matchesSkill);

            if (!card.hidden) visibleCount++;
        });

        const emptyMessage = document.getElementById("mentorEmpty");
        if (emptyMessage) {
            emptyMessage.hidden = visibleCount > 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterMentors);
    }

    if (skillFilter) {
        skillFilter.addEventListener("change", filterMentors);
    }

    document.addEventListener("click", function (event) {
        const connectButton = event.target.closest(".mentor-connect");
        if (!connectButton) return;

        const card = connectButton.closest(".mentor-card");
        if (!card) return;

        const mentorName =
            card.querySelector("h3")?.textContent.trim() || "this mentor";

        const requestsKey = "campusConnectMentorRequests";
        let requests = [];

        try {
            requests = JSON.parse(localStorage.getItem(requestsKey) || "[]");
        } catch (error) {
            requests = [];
        }

        const alreadyRequested = requests.some(function (request) {
            return request.mentorName === mentorName;
        });

        if (alreadyRequested) {
            alert("You have already sent a connection request to " + mentorName + ".");
            return;
        }

        if (!confirm("Send a connection request to " + mentorName + "?")) {
            return;
        }

        requests.push({
            mentorName: mentorName,
            requestedAt: new Date().toISOString(),
            status: "Pending"
        });

        try {
            localStorage.setItem(requestsKey, JSON.stringify(requests));
        } catch (error) {
            alert("Could not save your request in this browser.");
            return;
        }

        connectButton.textContent = "Request Sent ✓";
        connectButton.disabled = true;

        alert("Connection request saved on this device!");
    });

    // Restore previously sent requests
    let savedRequests = [];

    try {
        savedRequests = JSON.parse(
            localStorage.getItem("campusConnectMentorRequests") || "[]"
        );
    } catch (error) {
        savedRequests = [];
    }

    document.querySelectorAll(".mentor-connect").forEach(function (button) {
        const card = button.closest(".mentor-card");
        const name = card?.querySelector("h3")?.textContent.trim();

        if (savedRequests.some(function (request) {
            return request.mentorName === name;
        })) {
            button.textContent = "Request Sent ✓";
            button.disabled = true;
        }
    });

    filterMentors();
});
