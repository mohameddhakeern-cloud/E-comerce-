// =========================================
//   DHARIYA COUTURE — collection.js
// =========================================

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genderParam = urlParams.get('gender');
    if (genderParam) {
        setGenderFilter(genderParam);
    }
    updateResultsCount();
});

// ---- FILTER + SORT + SEARCH ----
// FIX: was keyup only — oninput handles paste & autofill too (called from HTML)
function filterProducts() {
    const searchVal = document.getElementById("search").value.trim().toLowerCase();
    const sortVal = document.getElementById("sort-select").value;
    const categoryVal = document.getElementById("category-select").value;
    const genderVal = document.querySelector(".gender-btn.active")?.dataset.gender || 'all';

    const grid = document.getElementById("product");
    const noResults = document.getElementById("no-results");

    // FIX: re-query inside function so dynamically added cards are picked up
    let cards = Array.from(grid.querySelectorAll(".product-box"));

    // 1. Filter by search + category + gender
    cards.forEach(card => {
        const name = card.getAttribute("data-name").toLowerCase();
        const category = card.getAttribute("data-category").toLowerCase();
        const gender = (card.getAttribute("data-gender") || "all").toLowerCase();

        // FIX: also search brand and price text for backwards compatibility
        const brand = (card.querySelector(".brand")?.innerText || "").toLowerCase();
        const price = (card.querySelector(".price")?.innerText || "").toLowerCase();
        const fullText = name + " " + brand + " " + price;

        const matchesSearch = fullText.includes(searchVal);
        const matchesCategory = categoryVal === "all" || category === categoryVal;
        const matchesGender = genderVal === "all" || gender === genderVal;

        // FIX: use CSS class instead of style.display — works correctly in grid
        if (matchesSearch && matchesCategory && matchesGender) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });

    // 2. Sort visible cards
    const visibleCards = cards.filter(c => !c.classList.contains("hidden"));

    if (sortVal === "low-high") {
        visibleCards.sort((a, b) =>
            parseInt(a.getAttribute("data-price")) - parseInt(b.getAttribute("data-price"))
        );
    } else if (sortVal === "high-low") {
        visibleCards.sort((a, b) =>
            parseInt(b.getAttribute("data-price")) - parseInt(a.getAttribute("data-price"))
        );
    } else if (sortVal === "name") {
        visibleCards.sort((a, b) =>
            a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"))
        );
    }

    // 3. Re-append sorted visible cards to grid
    visibleCards.forEach(card => grid.appendChild(card));

    // 4. Show / hide no-results message
    const anyVisible = cards.some(c => !c.classList.contains("hidden"));
    if (noResults) noResults.style.display = anyVisible ? "none" : "flex";

    updateResultsCount();
}

function setGenderFilter(gender) {
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gender === gender);
    });
    filterProducts();
}

// ---- RESULTS COUNT ----
function updateResultsCount() {
    const countEl = document.getElementById("results-count");
    if (!countEl) return;
    const total = document.querySelectorAll(".product-box:not(.hidden)").length;
    countEl.textContent = total + " product" + (total !== 1 ? "s" : "") + " found";
}