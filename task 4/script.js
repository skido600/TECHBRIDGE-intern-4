const internshipTracks = {
  analytics: {
    name: "Data Analytics",
    description: "Learn to clean, explore and communicate insights from data.",
    tasks: [
      {
        number: 1,
        title: "Data Cleaning Basics",
        day: 1,
        description:
          "Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.",
        difficulty: "Beginner",
      },
      {
        number: 2,
        title: "Formulas & Pivot Tables",
        day: 4,
        description:
          "Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.",
        difficulty: "Beginner",
      },
      {
        number: 3,
        title: "Data Visualization",
        day: 8,
        description:
          "Create charts and a simple dashboard that communicate useful insights from a dataset.",
        difficulty: "Beginner → Intermediate",
      },
      {
        number: 4,
        title: "Introduction to SQL",
        day: 11,
        description:
          "Practice basic SQL queries and use them to answer real-world questions about data.",
        difficulty: "Beginner → Intermediate",
      },
      {
        number: 5,
        title: "SQL Joins & Aggregations",
        day: 15,
        description:
          "Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.",
        difficulty: "Intermediate",
      },
      {
        number: 6,
        title: "Lookup Functions & Data Wrangling",
        day: 19,
        description:
          "Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.",
        difficulty: "Intermediate",
      },
      {
        number: 7,
        title: "Mini Analysis Project",
        day: 22,
        description:
          "Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.",
        difficulty: "Intermediate",
      },
      {
        number: 8,
        title: "Capstone Project",
        day: 26,
        description:
          "Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.",
        difficulty: "Intermediate",
      },
    ],
  },

  web: {
    name: "Web Development",
    description:
      "Learn to design and build useful web experiences from the ground up.",
    tasks: [
      {
        number: 1,
        title: "Build the TechBridge Homepage",
        day: 1,
        description:
          "Create the first version of the TechBridge website using HTML and CSS.",
        difficulty: "Beginner",
      },
      {
        number: 2,
        title: "Build the TechBridge Programs Experience",
        day: 4,
        description:
          "Create a Programs experience presenting TechBridge's available learning programs.",
        difficulty: "Beginner",
      },
      {
        number: 3,
        title: "Build the Internship Tasks Experience",
        day: 8,
        description:
          "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
        difficulty: "Beginner → Intermediate",
      },
      {
        number: 4,
        title: "Build an Interactive Internship Roadmap",
        day: 11,
        description:
          "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.",
        difficulty: "Beginner → Intermediate",
      },
      {
        number: 5,
        title: "Build the Intern Registration Experience",
        day: 15,
        description:
          "Create a professional registration and onboarding interface for TechBridge interns.",
        difficulty: "Intermediate",
      },
      {
        number: 6,
        title: "Build the Task Submission System",
        day: 19,
        description:
          "Create an interface through which interns can prepare and submit their task work.",
        difficulty: "Intermediate",
      },
      {
        number: 7,
        title: "Build the Intern Dashboard",
        day: 22,
        description:
          "Create a dashboard where an intern can view their profile, progress, tasks and submissions.",
        difficulty: "Intermediate",
      },
      {
        number: 8,
        title: "Build the Complete TechBridge Internship Platform",
        day: 26,
        description:
          "Combine the different components created during the internship into a complete TechBridge platform.",
        difficulty: "Intermediate",
      },
    ],
  },
};

// Currently selected internship track.
let selectedTrack = "analytics";

// Get HTML elements.
const taskList = document.getElementById("taskList");
const selectedTrackName = document.getElementById("selectedTrackName");
const selectedTrackDescription = document.getElementById(
  "selectedTrackDescription",
);

const trackButtons = document.querySelectorAll(".track-button");

// Determine the difficulty styling.
function getDifficultyClass(difficulty) {
  if (difficulty === "Intermediate") {
    return "intermediate";
  }

  if (difficulty.includes("→")) {
    return "mixed";
  }

  return "beginner";
}

// Generate an individual task card.
function createTaskCard(task, index) {
  const difficultyClass = getDifficultyClass(task.difficulty);

  return `
    <article class="task-card" style="animation-delay: ${index * 45}ms">

      <div class="task-card-top">
        <span class="task-number">
          TASK ${String(task.number).padStart(2, "0")}
        </span>

        <span class="day-tag">
          DAY ${String(task.day).padStart(2, "0")}
        </span>
      </div>

      <h4>${task.title}</h4>

      <p>${task.description}</p>

      <div class="task-card-bottom">
        <span class="difficulty ${difficultyClass}">
          <span class="difficulty-dot"></span>
          ${task.difficulty}
        </span>

        <span class="task-arrow" aria-hidden="true">↗</span>
      </div>

    </article>
  `;
}

// Display the selected internship track.
function displayTrack(trackKey) {
  const track = internshipTracks[trackKey];

  // Check if the selected track exists.
  if (!track) {
    console.error("The selected internship track does not exist.");
    return;
  }

  // Update selected track.
  selectedTrack = trackKey;

  // Update track information.
  selectedTrackName.textContent = track.name;
  selectedTrackDescription.textContent = track.description;

  // Render all eight tasks.
  taskList.innerHTML = track.tasks.map(createTaskCard).join("");

  // Update active buttons.
  trackButtons.forEach((button) => {
    const isSelected = button.dataset.track === selectedTrack;

    button.classList.toggle("is-active", isSelected);

    button.setAttribute("aria-pressed", String(isSelected));
  });
}

// Listen for track selection clicks.
trackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    displayTrack(button.dataset.track);
  });
});

// Display the current year in the footer.
document.getElementById("currentYear").textContent = new Date().getFullYear();

// Load Data Analytics by default.
displayTrack(selectedTrack);
