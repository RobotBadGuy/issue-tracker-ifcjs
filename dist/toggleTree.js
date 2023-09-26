const treeOverlay = document.querySelector(".tree-overlay");
const closeTreeBtn = document.querySelector(".tree-close");
const toggleTreeBtn = document.querySelector(".toggle-tree");

toggleTreeBtn.addEventListener("click", () => {
  treeOverlay.classList.add("show");
});

closeTreeBtn.addEventListener("click", () => {
  treeOverlay.classList.remove("show");
});

const openIssues = () => {
  treeOverlay.classList.add("show");
};

export { openIssues };
