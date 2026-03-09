
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
}


var API_ALL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
var API_SEARCH = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";


var allIssues = [];
var currentTab = "All";


loadIssues();


function loadIssues() {
    showSpinner();

    fetch(API_ALL)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            allIssues = data.data || data || [];
            hideSpinner();
            renderCards(allIssues);
        })
        .catch(function(err) {
            console.log("Error fetching issues:", err);
            hideSpinner();
            showEmpty();
        });
}

function renderCards(issues) {
    var grid = document.getElementById("cards-grid");
    var emptyState = document.getElementById("empty-state");

    grid.innerHTML = "";

    var filtered = [];

    if (currentTab === "All") {
        filtered = issues;
    } else if (currentTab === "Open") {
        for (var i = 0; i < issues.length; i++) {
            if (issues[i].status === "open" || issues[i].state === "open") {
                filtered.push(issues[i]);
            }
        }
    } else if (currentTab === "Closed") {
        for (var i = 0; i < issues.length; i++) {
            if (issues[i].status === "closed" || issues[i].state === "closed") {
                filtered.push(issues[i]);
            }
        }
    }

  
    document.getElementById("issues-count-text").innerText = filtered.length + " Issues";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    for (var j = 0; j < filtered.length; j++) {
        var card = buildCard(filtered[j]);
        grid.appendChild(card);
    }
}


function buildCard(issue) {
    var status = issue.status || issue.state || "open";
    var isOpen = status === "open";

    var cardDiv = document.createElement("div");
    cardDiv.className = "issue-card " + (isOpen ? "open-card" : "closed-card");
    cardDiv.onclick = function() {
        openModal(issue);
    };


    var priority = issue.priority || "Low";
    var priorityClass = "priority-low";
    if (priority.toLowerCase() === "high") priorityClass = "priority-high";
    if (priority.toLowerCase() === "medium") priorityClass = "priority-medium";

    var iconSvg = getStatusIcon(isOpen);

    var labelsHTML = "";
    var labels = issue.labels || [];
    for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        var labelName = label.name || label;
        var labelClass = getLabelClass(labelName);
        labelsHTML += '<span class="label-tag ' + labelClass + '">' + labelName + '</span>';
    }


    var author = issue.author || issue.user || "unknown";
    if (typeof author === "object") {
        author = author.login || author.name || "unknown";
    }


    var date = formatDate(issue.created_at || issue.createdAt);

    var title = issue.title || "No title";
    var desc = issue.body || issue.description || "No description";

    cardDiv.innerHTML =
        '<div class="card-top-row">' +
            iconSvg +
            '<span class="priority-badge ' + priorityClass + '">' + priority.toUpperCase() + '</span>' +
        '</div>' +
        '<h3 class="card-title">' + title + '</h3>' +
        '<p class="card-desc">' + desc + '</p>' +
        '<div class="card-labels">' + labelsHTML + '</div>' +
        '<div class="card-footer">' +
            '<p class="card-issue-num">#' + issue.id + ' by ' + author + '</p>' +
            '<p class="card-date">' + date + '</p>' +
        '</div>';

    return cardDiv;
}

function getStatusIcon(isOpen) {
    if (isOpen) {
        return '<img class="card-status-icon" src="./assets/Open-Status.png" alt="open">';
    } else {
        return '<img class="card-status-icon" src="./assets/Closed-Status.png" alt="closed">';
    }
}

function getLabelClass(name) {
    var lower = name.toLowerCase();
    if (lower === "bug") return "label-bug";
    if (lower === "help wanted") return "label-help";
    if (lower === "enhancement") return "label-enhancement";
    return "label-default";
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr);
    return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
}

function switchTab(tab) {
    currentTab = tab;

    document.getElementById("tab-All").classList.remove("active-tab");
    document.getElementById("tab-Open").classList.remove("active-tab");
    document.getElementById("tab-Closed").classList.remove("active-tab");
    document.getElementById("tab-" + tab).classList.add("active-tab");

    renderCards(allIssues);
}

function handleSearch() {
    var query = document.getElementById("search-input").value.trim();

    if (query === "") {
        renderCards(allIssues);
        return;
    }

    showSpinner();

    fetch(API_SEARCH + encodeURIComponent(query))
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            var results = data.data || data || [];
            allIssues = results;
            hideSpinner();
            renderCards(results);
        })
        .catch(function(err) {
            console.log("Search error:", err);
            hideSpinner();
        });
}

function showSpinner() {
    document.getElementById("spinner-wrap").classList.remove("hidden");
    document.getElementById("cards-grid").innerHTML = "";
    document.getElementById("empty-state").classList.add("hidden");
}

function hideSpinner() {
    document.getElementById("spinner-wrap").classList.add("hidden");
}

function showEmpty() {
    document.getElementById("empty-state").classList.remove("hidden");
}