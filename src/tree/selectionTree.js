import { scene, addToSubset, removeFromSubset } from "../..";

// Get the tree view element
const treeItemsContainer = document.getElementById("tree-items");

function createTree(data, parentElement, isChild) {
  const ul = document.createElement("ul");
  parentElement.appendChild(ul);
  data.forEach((item) => {
    const li = document.createElement("li");
    ul.appendChild(li);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("tree-checkbox");

    const label = document.createElement("label");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-arrow-right", "fa-xs");
    const toggleBtn = document.createElement("button");
    toggleBtn.appendChild(icon);
    toggleBtn.classList.add("tree-expand-btn");
    label.appendChild(toggleBtn);
    label.appendChild(checkbox);
    label.innerHTML += `${item.type} expressID: ${item.expressID}`;
    label.setAttribute("data-expressID", item.expressID);
    li.appendChild(label);

    const childContainer = document.createElement("ul");
    // IF CHILD ELEMENT, COLLAPSE TREE NODE
    if (isChild) {
      childContainer.style.display = "none";
      childContainer.classList.add("tree-child-item");
    }

    li.appendChild(childContainer);

    // ADD EVENT LISTENER TO CHECKBOX
    const getCheckbox = li.querySelector(".tree-checkbox");
    getCheckbox.checked = true;
    getCheckbox.addEventListener("change", () => {
      const parentElement = getCheckbox.parentElement;
      const parentExpressID = parentElement.dataset.expressid;

      if (getCheckbox.checked) {
        console.log("checked");
        addToSubset(parentExpressID);
      } else {
        console.log("unchecked");
        removeFromSubset(parentExpressID);
      }
    });

    // ADD EVENT LISTENER TO BUTTON
    const labelBtn = li.querySelector("button");
    const iconElement = labelBtn.querySelector("i");
    if (item.children && item.children.length > 0) {
      labelBtn.addEventListener("click", () => {
        if (iconElement.classList.contains("fa-arrow-right")) {
          iconElement.classList.remove("fa-arrow-right");
          iconElement.classList.add("fa-arrow-down-short-wide");
          childContainer.style.display = "block";
        } else {
          iconElement.classList.remove("fa-arrow-down-short-wide");
          iconElement.classList.add("fa-arrow-right");
          childContainer.style.display = "none";
        }
      });
      createTree(item.children, childContainer, true); //RECURSIVE FUNCTIONALITY
    } else {
      iconElement.classList.remove("fa-solid", "fa-arrow-right", "fa-xs");
      labelBtn.style.display = "none";
    }
  });
}

// MAKE ASIDE ELEMENT RESIZE DYNAMICALLY
const asideElement = document.getElementById("treeAsideElement");
const asideElementBtn = document.getElementById("tree-stretch-btn");
let isResizing = false;
let startX = 0;
let startWidth = 0;

asideElementBtn.addEventListener("mousedown", startResize);
asideElementBtn.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", stopResize);

function startResize(event) {
  if (event.button === 0) {
    // Only trigger when left mouse button is pressed
    isResizing = true;
    startX = event.clientX;
    startWidth = parseInt(
      document.defaultView.getComputedStyle(asideElement).width,
      10
    );
  }
}

function handleMouseMove(event) {
  if (isResizing && event.buttons === 1) {
    // Only resize when left mouse button is being held down
    const width = startWidth + (event.clientX - startX);
    asideElement.style.width = `${width}px`;
  }
}

function stopResize() {
  isResizing = false;
}

// ------- IFC JS EXAMPLE ------- //
function createTreeMenu(ifcProject) {
  const root = document.getElementById("tree-root");
  removeAllChildren(root);
  const ifcProjectNode = createNestedChild(root, ifcProject);
  for (const child of ifcProject.children) {
    constructTreeMenuNode(ifcProjectNode, child);
  }
}

function constructTreeMenuNode(parent, node) {
  const children = node.children;
  if (children.length === 0) {
    createSimpleChild(parent, node);
    return;
  }
  const nodeElement = createNestedChild(parent, node);
  for (const child of children) {
    constructTreeMenuNode(nodeElement, child);
  }
}

function createSimpleChild(parent, node) {
  const content = nodeToString(node);
  const childNode = document.createElement("li");
  childNode.classList.add("leaf-node");
  childNode.textContent = content;
  parent.appendChild(childNode);

  // childNode.onmouseenter = () => {
  //   viewer.IFC.selector.prepickIfcItemsByID(model.modelID, [node.expressID]);
  // }
}

function createNestedChild(parent, node) {
  const content = nodeToString(node);
  const root = document.createElement("li");
  createTitle(root, content);
  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("nested");
  root.appendChild(childrenContainer);
  parent.appendChild(root);
  return childrenContainer;
}

function createTitle() {
  const title = document.createElement("span");
  title.classList.add("caret");
  title.onclick = () => {
    title.parentElement.querySelector(".nested").classList.toggle("active");
    title.classList.toggle("caret-down");
  };
  title.textContent = content;
  parent.appendChild(title);
}

function nodeToString(node) {
  return `${node.type} - ${node.expressID}`;
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export { createTree, createTreeMenu };
