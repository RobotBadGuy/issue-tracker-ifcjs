import { labelRenderer } from "../..";

const issuesOverlay = document.querySelector(".issues-overlay");
const closeIssuesBtn = document.querySelector(".issues-close");
const toggleIssuesBtn = document.querySelector(".toggle-issues");
const toggleIssuesVisBtn = document.getElementById("toggle-issues-vis-btn");
const toggleIssuesVisIcon = document.getElementById("toggle-issues-vis-icon");

toggleIssuesBtn.addEventListener("click", () => {
  issuesOverlay.classList.add("show");
});

closeIssuesBtn.addEventListener("click", () => {
  issuesOverlay.classList.remove("show");
});

toggleIssuesVisBtn.addEventListener("click", () => {
  if (toggleIssuesVisIcon.classList.contains("fa-eye-slash")) {
    toggleIssuesVisIcon.classList.remove("fa-eye-slash");
    toggleIssuesVisIcon.classList.add("fa-eye");
    labelRenderer.domElement.style.display = "block";
  } else {
    toggleIssuesVisIcon.classList.remove("fa-eye");
    toggleIssuesVisIcon.classList.add("fa-eye-slash");
    labelRenderer.domElement.style.display = "none";
  }
});

export const openIssues = () => {
  issuesOverlay.classList.add("show");
};
