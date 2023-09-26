import { openIssues } from "./toggleIssues.js";
import { camera, cameraControls } from "../../index.js";

const issuesItemCountDOM = document.querySelector('.issues-item-count');
const issuesItemsDOM = document.querySelector('.issues-items');
const issuesTotalDOM = document.querySelector('.issues-total');

export const addToIssues = (id) => {
    console.log(id);
    openIssues();
};

function displayIssueTotal(issuesArrayLength) {
    issuesTotalDOM.textContent = `Total Issues : ${issuesArrayLength} `;
};

function displayIssuesItemCount(issuesArrayLength) {
    issuesItemCountDOM.textContent = `${issuesArrayLength}`;
}

function zoomToIssue(posX, posY, posZ){
    cameraControls.setLookAt(posX, posY, posZ , 0, 0, 0, true);
    // cameraControls.setLookAt(20, 40, 20, 0, 10, 0, true);
}

export { displayIssueTotal , displayIssuesItemCount , zoomToIssue };