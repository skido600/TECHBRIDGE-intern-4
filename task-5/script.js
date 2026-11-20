const challenges = {
  "sales-insights": {
    title: "Sales Insights", track: "Data Analytics", difficulty: "Beginner", time: "3–4 hours",
    description: "Explore a sample sales dataset to discover patterns, top-performing products, and monthly performance. Your goal is to turn rows of information into a story a business owner can understand.",
    objective: "Review a sales dataset, clean obvious errors, calculate totals, and identify trends across products and months.",
    skills: "Spreadsheet navigation, sorting and filtering, basic formulas, data cleaning, and communicating insights.",
    tools: "Microsoft Excel or Google Sheets. You can use the sample data provided by your mentor or create a small realistic dataset.",
    deliverable: "A cleaned spreadsheet with summary calculations and a one-page report containing at least three findings.",
    result: "A clear sales summary report with useful recommendations."
  },
  "customer-profiles": {
    title: "Customer Profiles", track: "Data Analytics", difficulty: "Intermediate", time: "4–5 hours",
    description: "Use customer records to understand who a business serves. Look for patterns in age groups, locations, purchase frequency, or customer value.",
    objective: "Prepare customer data, group similar records into segments, and explain what each segment may mean for the business.",
    skills: "Data cleaning, grouping, pivot tables, basic descriptive statistics, and analytical thinking.",
    tools: "Excel or Google Sheets. Optional: SQL for filtering and grouping a larger dataset.",
    deliverable: "A customer segmentation sheet with a short written explanation of each segment and two practical recommendations.",
    result: "A customer analysis that highlights useful audience segments."
  },
  "business-dashboard": {
    title: "Business Dashboard", track: "Data Analytics", difficulty: "Advanced", time: "5–7 hours",
    description: "Bring important business metrics into one visual space. Help a decision-maker understand performance without having to inspect the raw data.",
    objective: "Choose relevant KPIs, prepare the data, and build a dashboard that communicates performance and changes over time.",
    skills: "Data preparation, KPI selection, chart selection, dashboard layout, and insight presentation.",
    tools: "Excel or Google Sheets. Optional: Power BI or Looker Studio for additional dashboard practice.",
    deliverable: "A dashboard with at least four KPIs, three visualisations, clear labels, and a short insight summary.",
    result: "An easy-to-read business performance dashboard."
  },
  "expense-audit": {
    title: "Expense Audit", track: "Data Analytics", difficulty: "Beginner", time: "2–3 hours",
    description: "Review a simple monthly expense record, organise spending into categories, and find where money is going.",
    objective: "Categorise expenses, calculate totals and percentages, and identify the largest spending areas or unusual entries.",
    skills: "Spreadsheet formatting, SUM and percentage formulas, sorting, categorisation, and attention to detail.",
    tools: "Microsoft Excel or Google Sheets.",
    deliverable: "A categorised expense spreadsheet and a short summary of the three largest expense categories.",
    result: "An expense breakdown with practical observations about spending."
  },
  "responsive-landing": {
    title: "Responsive Landing Page", track: "Web Development", difficulty: "Beginner", time: "3–4 hours",
    description: "Create a landing page for a fictional product, service, or event. Make the page clear, attractive, and comfortable to use on mobile and desktop.",
    objective: "Structure a page with a hero section, key benefits, a call-to-action, and a simple footer, then adapt the layout to smaller screens.",
    skills: "Semantic HTML, CSS layout, Flexbox or Grid, responsive media queries, and basic accessibility.",
    tools: "HTML, CSS, JavaScript (optional for a small interaction), and a browser developer tools.",
    deliverable: "A working responsive landing page with readable content, working links or buttons, and no horizontal overflow on mobile.",
    result: "A polished landing page that works across common screen sizes."
  },
  "personal-portfolio": {
    title: "Personal Portfolio", track: "Web Development", difficulty: "Intermediate", time: "4–6 hours",
    description: "Build a small personal portfolio that introduces you, highlights your skills, and showcases projects you have completed.",
    objective: "Create a consistent multi-section website with clear navigation and a useful way for visitors to contact you.",
    skills: "HTML structure, CSS styling, responsive design, navigation, content hierarchy, and basic JavaScript.",
    tools: "HTML, CSS, JavaScript, and a code editor such as Visual Studio Code.",
    deliverable: "A portfolio containing an introduction, about section, at least two project cards, skills, and contact information.",
    result: "A responsive portfolio website you can continue improving as you gain experience."
  },
  "interactive-quiz": {
    title: "Interactive Quiz", track: "Web Development", difficulty: "Intermediate", time: "4–5 hours",
    description: "Create a short quiz that asks questions, accepts answers, tracks the user's score, and displays feedback when the quiz is complete.",
    objective: "Use JavaScript to manage questions, check answers, update the score, and move between quiz questions without refreshing the page.",
    skills: "DOM selection, arrays and objects, event listeners, conditionals, functions, and basic state management.",
    tools: "HTML, CSS, and vanilla JavaScript.",
    deliverable: "A working quiz with at least five questions, visible feedback, a final score, and a restart option.",
    result: "An interactive quiz application that responds to user input."
  },
  "contact-form": {
    title: "Contact Form", track: "Web Development", difficulty: "Beginner", time: "2–3 hours",
    description: "Build a contact form that collects a visitor's name, email address, and message, then gives clear feedback when the form is submitted.",
    objective: "Create labelled form fields, validate required information with JavaScript, and show success or error messages accessibly.",
    skills: "HTML forms, labels, input types, CSS states, JavaScript validation, and DOM updates.",
    tools: "HTML, CSS, and vanilla JavaScript.",
    deliverable: "A responsive form with name, email, and message fields, validation for empty or invalid input, and a success message. A backend is not required.",
    result: "A user-friendly contact form with working client-side validation."
  }
};

const cards = [...document.querySelectorAll(".challenge-card")];
const trackButtons = [...document.querySelectorAll("#track-filters [data-track]")];
const difficultyButtons = [...document.querySelectorAll("[data-difficulty]")];
const searchInput = document.getElementById("challenge-search");
const resultCount = document.getElementById("result-count");
const activeFilterLabel = document.getElementById("active-filter-label");
const emptyState = document.getElementById("empty-state");
const challengeGrid = document.getElementById("challenge-grid");
const modal = document.getElementById("challenge-modal");
const closeModalButton = modal.querySelector(".modal-close");
const doneButton = modal.querySelector(".modal-done");
let activeTrack = "All";
let activeDifficulty = "All";
let lastFocusedElement = null;

function updateFilterButtons(buttons, selectedValue, attribute) {
  buttons.forEach((button) => {
    const selected = button.dataset[attribute] === selectedValue;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function filterChallenges() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesTrack = activeTrack === "All" || card.dataset.track === activeTrack;
    const matchesDifficulty = activeDifficulty === "All" || card.dataset.difficulty === activeDifficulty;
    const matchesSearch = card.textContent.toLowerCase().includes(searchTerm);
    const isVisible = matchesTrack && matchesDifficulty && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  resultCount.textContent = visibleCount;
  emptyState.hidden = visibleCount !== 0;
  challengeGrid.hidden = visibleCount === 0;

  const labels = [];
  if (activeTrack !== "All") labels.push(activeTrack);
  if (activeDifficulty !== "All") labels.push(activeDifficulty);
  if (searchTerm) labels.push(`Search: "${searchInput.value.trim()}"`);
  activeFilterLabel.textContent = labels.length ? `Filtered by ${labels.join(" · ")}` : "Showing all challenges";
}

trackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTrack = button.dataset.track;
    updateFilterButtons(trackButtons, activeTrack, "track");
    filterChallenges();
  });
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeDifficulty = button.dataset.difficulty;
    updateFilterButtons(difficultyButtons, activeDifficulty, "difficulty");
    filterChallenges();
  });
});

searchInput.addEventListener("input", filterChallenges);

function resetFilters() {
  activeTrack = "All";
  activeDifficulty = "All";
  searchInput.value = "";
  updateFilterButtons(trackButtons, activeTrack, "track");
  updateFilterButtons(difficultyButtons, activeDifficulty, "difficulty");
  filterChallenges();
}

document.getElementById("reset-filters").addEventListener("click", resetFilters);
document.getElementById("empty-reset").addEventListener("click", resetFilters);

document.querySelectorAll("[data-track-link]").forEach((link) => {
  link.addEventListener("click", () => {
    activeTrack = link.dataset.trackLink;
    updateFilterButtons(trackButtons, activeTrack, "track");
    filterChallenges();
  });
});

function openChallenge(id, trigger) {
  const challenge = challenges[id];
  if (!challenge) return;

  lastFocusedElement = trigger;
  document.getElementById("modal-title").textContent = challenge.title;
  document.getElementById("modal-track").textContent = challenge.track.toUpperCase();
  document.getElementById("modal-difficulty").textContent = challenge.difficulty.toUpperCase();
  document.getElementById("modal-description").textContent = challenge.description;
  document.getElementById("modal-objective").textContent = challenge.objective;
  document.getElementById("modal-skills").textContent = challenge.skills;
  document.getElementById("modal-tools").textContent = challenge.tools;
  document.getElementById("modal-deliverable").textContent = challenge.deliverable;
  document.getElementById("modal-time").textContent = challenge.time;
  document.getElementById("modal-result").textContent = challenge.result;

  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeModalButton.focus();
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => openChallenge(button.dataset.view, button));
});

closeModalButton.addEventListener("click", closeModal);
doneButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
  if (event.key === "Tab" && !modal.hidden) {
    const focusable = [...modal.querySelectorAll("button:not([disabled]), a[href], input:not([disabled])")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("mobile-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("mobile-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

document.getElementById("total-count").textContent = String(cards.length).padStart(2, "0");
filterChallenges();
