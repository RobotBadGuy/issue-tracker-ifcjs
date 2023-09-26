// https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import {
  displayIssueTotal,
  displayIssuesItemCount,
} from "./setupIssues.js";

import {
  scene, labelsArray, imagesArray, updateLabelsArray, updateImagesArray, updateViewpointArray,
} from "../..";
import { zoomToIssue } from "./setupIssues";

// ---------------CREATE SCENE LABEL OBJECT--------------- //
function addLabelToModel(XYZpos, id) {
  const labelDiv = document.createElement("div");
  const label = document.createElement(`p`);
  labelDiv.setAttribute("data-id", id);
  label.id = "issue-symbol";
  label.classList.add(
    "fa-solid",
    "fa-location-dot",
    "fa-2xl",
    "issues-icon-color"
  );
  // label.classList.add("labelSymbolDOM");
  labelDiv.appendChild(label);
  const labelObject = new CSS2DObject(labelDiv);
  labelObject.position.copy(XYZpos);
  return labelObject;
}

// ---------------ADD LABELS TO ISSUES ITEMS SIDE PANEL--------------- //

const issueItemsOverlayDOM = document.querySelector(".issues-items");

const addLabelToIssuesOverlay = (labelItem, labelImg, viewPos) => {
  const labelItemID = labelItem.element.dataset.id;
  const labelImgSrc = labelImg.src;
  // const LabelXPos = labelItem.position.x;
  // const LabelYPos = labelItem.position.y;
  // const LabelZPos = labelItem.position.z;
  const LabelXPos = viewPos.position.x;
  const LabelYPos = viewPos.position.y;
  const LabelZPos = viewPos.position.z;

  const article = document.createElement("article");
  article.classList.add("issue-item");
  article.setAttribute("data-id", labelItemID);
  article.setAttribute("data-x", LabelXPos);
  article.setAttribute("data-y", LabelYPos);
  article.setAttribute("data-z", LabelZPos);
  article.innerHTML = `
            <article class="issues-item" data-id="${labelItemID}">
            <img src="${labelImgSrc}" class="issues-item-img" alt="Issue image" />
            <!-- issue info -->
            <div>
              <h4 class="issues-item-name">Issue ${
                issueItemsOverlayDOM.childNodes.length + 1
              }</h4>
              <p class="issues-item-location">location</p>
              <button class="issues-item-remove-btn" data-id="${labelItemID}">remove</button>
            </div>
            <!-- info toggle -->
            <div class="issues-btn-container">
              <button class="issues-item-info-btn" data-id="${labelItemID}">
                <i class="fa-solid fa-circle-info fa-xl"></i>
              </button>
              <button class="issues-item-goto-btn" data-id="${labelItemID}">
              <i class="fa-solid fa-magnifying-glass-location fa-xl"></i>
            </button>

            </div>
            <!-- title -->
            <div></div>
          </article>
  `;
  issueItemsOverlayDOM.appendChild(article);
};

// ---------------REMOVE LABELS FROM ISSUES ITEMS SIDE PANEL--------------- //
function removeIssueItem(id) {
  const articles = issueItemsOverlayDOM.querySelectorAll(".issue-item");
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (article.getAttribute("data-id") === id) {
      issueItemsOverlayDOM.removeChild(article);
      break;
    }
  }
  removeLabelFromArray(id);
  removeImageFromArray(id);
  removeViewpointFromArray(id);
}

// ---------------REMOVE LABEL SYMBOLS FROM DOM RENDERER--------------- //

function setupIssuesFunctionality() {
  issueItemsOverlayDOM.addEventListener("click", function (e) {
    const element = e.target;
    const parent = e.target.parentElement;
    const id = e.target.dataset.id;
    const parentID = e.target.parentElement.dataset.id;
    const articleParent = e.target.closest("article");

    if (element.classList.contains("issues-item-remove-btn")) {
      removeIssueItem(id);
    }

    if (parent.classList.contains("issues-item-goto-btn")) {
      const posX = articleParent.parentElement.dataset.x;
      const posY = articleParent.parentElement.dataset.y;
      const posZ = articleParent.parentElement.dataset.z;
      zoomToIssue(posX, posY, posZ);
    }
  });
}

function addLabelsToModelSpace(UpdatedLabelsArray) {
  // updateIssuesOverlay();
  UpdatedLabelsArray.map((label) => {
    // addLabelToIssuesOverlay(label);
    scene.add(label);
  });
}

function addLabelsToOverlay(UpdatedLabelsArray, updatedImagesArray, updatedPosArray) {
  updateIssuesOverlay();
  UpdatedLabelsArray.map((label) => {
    const matchingImg = updatedImagesArray.find(
      (labelImg) => labelImg.dataset.id === label.element.dataset.id
    );
    const matchingPos = updatedPosArray.find(
      (pos) => pos.id === label.element.dataset.id
    );
    addLabelToIssuesOverlay(label, matchingImg, matchingPos);
  });
}

function removeLabelFromArray(id) {
  updateLabelsArray(id);
  addLabelsToModelSpace(labelsArray);
  displayIssueTotal(labelsArray.length);
  displayIssuesItemCount(labelsArray.length);
  removeLabelFromScene(id);
}

function removeLabelFromScene(id) {
  let css2DObjectToRemove;
  scene.children.forEach((child) => {
    if (child.element && child.element.dataset.id === id) {
      css2DObjectToRemove = child;
    }
  });
  if (css2DObjectToRemove) {
    scene.remove(css2DObjectToRemove);
  }
}

function removeImageFromArray(id) {
  updateImagesArray(id);
}

function removeViewpointFromArray(id) {
  updateViewpointArray(id);
}


// ---------------REFRESH ISSUES OVERLAY SECTION--------------- //

function updateIssuesOverlay() {
  issueItemsOverlayDOM.innerHTML = "";
}

const init = () => {
  setupIssuesFunctionality();
};
init();

export { addLabelToModel, addLabelToIssuesOverlay, updateIssuesOverlay, addLabelsToOverlay, addLabelsToModelSpace };
