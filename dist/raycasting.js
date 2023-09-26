import './index-4cfe99bd.js';
import { R as Raycaster, V as Vector2 } from './planets-23efa383.js';
import './toggleIssues.js';

// ---------------RAYCASTING--------------- //
// https://threejs.org/docs/#api/en/core/Raycaster

// ---------------HIGHLIGHT OBJECT WITH MATERIAL--------------- //
new Raycaster();
new Vector2();
// const previousSelection = {
//   mesh: null,
//   material: null,
// };

// const highlightMat = new MeshBasicMaterial({ color: "green" });

// window.addEventListener("mousemove", (event) => {
//   pointer.x = (event.clientX / canvas.clientWidth) * 2 - 1;
//   pointer.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

//   raycaster.setFromCamera(pointer, camera); //set raycaster in same pos as camera
//   const intersection = raycaster.intersectObjects(scene.children); //cast array

//   if (intersection.length !== 0 && intersection[0].object.type === "Mesh") {
//     console.log(previousSelection.material);
//   }

//   const hasCollided = intersection.length !== 0 && intersection[0].object.type === "Mesh";

//   if(!hasCollided) {
//     restorePreviousSelection()
//     return;
//   }

//   const first = intersection[0];
//   const isPreviousSelection = previousSelection.mesh === first.object;

//   if(isPreviousSelection) return;

//   restorePreviousSelection();

//   previousSelection.mesh = first.object;
//   previousSelection.material = first.object.material;

//   first.object.material = highlightMat;
// });


// function restorePreviousSelection(){
//   if(previousSelection.mesh){
//     previousSelection.mesh.material = previousSelection.material;
//     previousSelection.mesh = null;
//     previousSelection.material = null;
//   }
// }

// ---------------PICKING--------------- //
// window.addEventListener('dblclick', (event) => {
//   pointer.x = (event.clientX / canvas.clientWidth) * 2 - 1;
//   pointer.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
//   raycaster.setFromCamera(pointer, camera); //set raycaster in same pos as camera
//   const intersection = raycaster.intersectObjects(scene.children); //cast array

//   if(!intersection.length) return;
//   const location = intersection[0].point; //this stores a vector3 XYZ point
//   console.log(location);
//   addLabelToModel('p', 'Hello', location, 'red');
//   console.log(location);
// });
