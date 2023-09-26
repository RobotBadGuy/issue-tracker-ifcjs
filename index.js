// GLOBAL IMPORTS
import "./src/issues/toggleIssues.js";
import "./src/issues/setupIssues.js";
import {
  displayIssueTotal,
  displayIssuesItemCount,
} from "./src/issues/setupIssues.js";
import {
  addLabelToModel,
  addLabelToIssuesOverlay,
  updateIssuesOverlay,
  addLabelsToOverlay,
  addLabelsToModelSpace,
} from "./src/issues/labels.js";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  geomObject,
  edgesWireframe,
  sun,
  box,
  mercury,
  venus,
  earth,
  moon,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
} from "./planets.js";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";

// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
  Clock,
  DirectionalLight,
  Color,
  TextureLoader,
  AmbientLight,
  HemisphereLight,
  AxesHelper,
  GridHelper,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Group,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CameraControls from "camera-controls";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
//for debugging
// https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial

import gsap from "gsap"; // npm i gsap
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IFCLoader } from "web-ifc-three";
// import { IfcViewerAPI } from "web-ifc-viewer";
import {
  IFCCOMPLEXPROPERTY,
  IFCBUILDING,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER,
  IFCBUILDINGSTOREY,
} from "web-ifc";
import { createTree, createTreeMenu } from "./src/tree/selectionTree.js";
import { setupAllCategories } from "./src/categoryVisibility.js";

const closeBtn = document.getElementById("issues-close-btn");
closeBtn.addEventListener("mouseover", () => {
  closeBtn.classList.add("fa-beat-fade");
});
closeBtn.addEventListener("mouseout", () => {
  closeBtn.classList.remove("fa-beat-fade");
});

const toggleIssuesBtn = document.getElementById("toggle-issues-btn");
toggleIssuesBtn.addEventListener("mouseover", () => {
  toggleIssuesBtn.classList.add("fa-beat-fade");
});
toggleIssuesBtn.addEventListener("mouseout", () => {
  toggleIssuesBtn.classList.remove("fa-beat-fade");
});

// ---------------CREATE SCENE--------------- //
const scene = new Scene();
const canvas = document.getElementById("three-canvas");
const axes = new AxesHelper(5);
axes.material.depthTest = false; //allows axes to be scene even when hidden behind objects
axes.renderOrder = 2; //
scene.add(axes);

const boxAxes = new AxesHelper(1);
boxAxes.material.depthTest = false;
box.add(boxAxes);

const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);

// ---------------CREATE CAMERA--------------- //
const camera = new PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
); //0.1 is near, 1000 is far so anything outside those bounds wont be seen
const camPosZ = (camera.position.z = 5);
const camPosX = (camera.position.x = 5);
const camPosY = (camera.position.y = 5);
camera.lookAt({ x: camPosX, y: camPosY, z: camPosZ });
scene.add(camera);

// ---------------CREATE LIGHT--------------- //
const hemisphereLight = new HemisphereLight(0xffffff, 0x888888);
scene.add(hemisphereLight);

// ---------------CREATE RENDERER--------------- //
const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true,
});
const pixelRatio = Math.max(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio); //this is for display quality on different devices
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.setClearColor(0x383838, 1); //bg colour

// ---------------CREATE LABEL RENDERER--------------- //
// https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight, false);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.pointerEvents = "none";
labelRenderer.domElement.style.top = "0";
labelRenderer.domElement.id = "labelrendererdom";
document.body.appendChild(labelRenderer.domElement);
// add labelRenderer.render(scene,camera); to animate function

// ---------------RESPONSIVITY--------------- //
window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// ---------------CREATE ISSUE LABELS--------------- //
const raycaster = new Raycaster();
const pointer = new Vector2();
let labelsArray = [];
let imagesArray = [];
let viewpointArray = [];

class CustomVector3 extends Vector3 {
  constructor(x, y, z, id) {
    super(x, y, z);
    this.id = id;
  }
}

// ---------- CREATE ISSUES ---------- //

window.addEventListener("dblclick", (event) => {
  pointer.x = (event.clientX / canvas.clientWidth) * 2 - 1;
  pointer.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera); //set raycaster in same pos as camera

  const intersection = raycaster.intersectObjects(scene.children); //cast array

  if (!intersection.length) return;
  const location = intersection[0].point; //this stores a vector3 XYZ point
  const id = (location.x + location.y).toFixed(4);

  // Get Screenshot
  const screenshotData = canvas.toDataURL("image/png");
  const imgElement = document.createElement("img");
  imgElement.src = screenshotData;
  imgElement.setAttribute("data-id", id);
  imagesArray.push(imgElement);

  const currViewpoint = cameraControls.getPosition();
  const currentViewpoint = new CustomVector3(
    currViewpoint.x,
    currViewpoint.y,
    currViewpoint.z,
    id
  );

  viewpointArray.push({
    id: currentViewpoint.id,
    position: new CustomVector3(
      currentViewpoint.x,
      currViewpoint.y,
      currViewpoint.z
    ),
  });
  // adds labels/symbols to model space
  labelsArray.push(addLabelToModel(location, id, screenshotData));

  addLabelsToModelSpace(labelsArray);
  addLabelsToOverlay(labelsArray, imagesArray, viewpointArray);
  displayIssueTotal(labelsArray.length);
  displayIssuesItemCount(labelsArray.length);
});

function updateLabelsArray(id) {
  console.log(labelsArray);
  labelsArray = labelsArray.filter((item) => item.element.dataset.id !== id);
  console.log(labelsArray);
}

function updateImagesArray(id) {
  console.log(imagesArray);
  imagesArray = imagesArray.filter((item) => item.dataset.id !== id);
  console.log(imagesArray);
}

function updateViewpointArray(id) {
  console.log(viewpointArray);
  viewpointArray = viewpointArray.filter((pos) => pos.id !== id);
  console.log(viewpointArray);
}

// ---------------CONTROLS--------------- //
// https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
// https://github.com/yomotsu/camera-controls
// https://www.npmjs.com/package/camera-controls
// npm i camera-controls
// SUBSET OF THE THREEJS LIBRARY::
const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

CameraControls.install({ THREE: subsetOfTHREE });
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;
cameraControls.draggingSmoothTime = 0.23;

cameraControls.setLookAt(20, 40, 20, 0, 10, 0, true);

// ---------------THREE LOADER--------------- //
// https://threejs.org/docs/#examples/en/loaders/GLTFLoader
let rocketship;
const loadScreen = document.getElementById("loader-container");
const loaderText = document.querySelector(".loader-text");
const progressText = document.getElementById("loader-text-content");
const loader = new GLTFLoader();
const modelGroup = new Group();

loader.load(
  "./rocket.glb",
  (gltf) => {
    rocketship = gltf.scene;
    modelGroup.add(rocketship);
    modelGroup.scale.set(7, 7, 7);
    modelGroup.position.y += 6;
    scene.add(modelGroup);
    // scene.add(gltf.scene)
    loadScreen.classList.add("hidden");
  },
  (progress) => {
    loaderText.style.display = "block";
    const progressPercent = Math.trunc(
      (progress.loaded / progress.total) * 100
    );
    progressText.textContent = `loading: ${progressPercent} %`;
  },
  (error) => {
    console.log(error);
  }
);

// ---------------IFC LOADER--------------- //
let model;
const ifcModelsArray = [];
const ifcLoader = new IFCLoader();
// MULTITHREADING - ALLOW MOVEMENT DURING LOAD OF FILES
// copy IFCWorker.js & IFCWorker.js.map into root directory
ifcLoader.ifcManager.useWebWorkers(true, "./IFCWorker.js");

const input = document.getElementById("file-input");
const ifcLoadScreen = document.getElementById("ifc-loader-container");
const ifcProgressText = document.getElementById("ifc-loader-text-content");

const annotationContainer = document.getElementById(
  "annotation-viewer-container"
);
// const viewer = new IfcViewerAPI({annotationContainer, backgroundColor: new Color(0xffffff)});

input.addEventListener("change", async () => {
  ifcLoadScreen.classList.remove("hidden");
  const file = input.files[0];
  const url = URL.createObjectURL(file);
  model = await ifcLoader.loadAsync(url);
  // model.removeFromParent();
  scene.add(model);
  ifcModelsArray.push(model);
  ifcLoadScreen.classList.add("hidden");
  zoomToModel(model);
  scene.remove(modelGroup);

  // ---------------GET SPATIAL OBJECT TREE--------------- //
  const modelID = model.modelID;
  const manager = ifcLoader.ifcManager;
  const spatialStructure = await manager.getSpatialStructure(modelID);
  console.log(model);
  console.log(spatialStructure.expressID);
  console.log([spatialStructure]);
  const treeDataContainer = document.querySelector(".tree-items");
  createTree([spatialStructure], treeDataContainer, false);
});

setupProgress();

function setupProgress() {
  ifcLoader.ifcManager.setOnProgress((event) => {
    const percent = Math.trunc((event.loaded / event.total) * 100);
    ifcProgressText.textContent = `loading: ${percent} %`;
  });
}

function zoomToModel(input_model) {
  const box = new Box3().setFromObject(input_model);
  const center = box.getCenter(new Vector3());
  cameraControls.setLookAt(center.x, center.y, center.z, 0, 0, 0, true);
}

// ----------------EDITING---------------- //
async function editFloorName() {
  const storeysIds = await ifcLoader.ifcManager.getAllItemsOfType(
    model.modelID,
    IFCBUILDINGSTOREY,
    false
  );
  const firstStoreyId = storeysIds[0];
  const storey = await ifcLoader.ifcManager.getItemProperties(
    model.modelID,
    firstStoreyId
  );
  console.log(storey);
  // GET NEW NAME & SAVE USING WRITELINE
  const result = prompt("Enter new name for the storey");
  storey.LongName.value = result;
  ifcLoader.ifcManager.ifcAPI.WriteLine(model.modelID, storey);

  // CREATE NEW FILE USING EDITED DATA
  const data = await ifcLoader.ifcManager.ifcAPI.ExportFileAsIFC(model.modelID);
  const mesh = await ifcLoader.ifcManager.ifcAPI.GetGeometry();
  const blob = new Blob([data]);
  const file = new File([blob], "modified.ifc");
  // TEMPORARILY CREATE A LINK, CLICK IT TO DL FILE, THEN REMOVE LINK
  const link = document.createElement("a");
  link.download = "modified.ifc";
  link.href = URL.createObjectURL(file);
  document.body.appendChild(link);
  link.click();

  link.remove();
}

// ---------------PICKING--------------- //
// npm i three-mesh-bvh
ifcLoader.ifcManager.setupThreeMeshBVH(
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast
);
const ifcRaycaster = new Raycaster();
ifcRaycaster.firstHitOnly = true;
const mouse = new Vector2();

function cast(event) {
  const bounds = canvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  ifcRaycaster.setFromCamera(mouse, camera);
  return ifcRaycaster.intersectObjects(ifcModelsArray)[0];
}

const highlightMaterial = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff88ff,
  depthTest: false,
});
const selectionMaterial = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xaa88aa,
  depthTest: false,
});

let lastModel;

async function pick(event, material, getProps) {
  const found = cast(event);
  if (found) {
    lastModel = found.object; //when something found store in lastmodel
    const index = found.faceIndex;
    const geometry = found.object.geometry;
    const expressId = ifcLoader.ifcManager.getExpressId(geometry, index);
    const modelId = found.object.modelID;

    const props = await ifcLoader.ifcManager.getItemProperties(
      modelId,
      expressId
    );

    // GET THE IFCCOMPLEXPROPERTY eg RPV DATA need to install npm i web-ifc
    if (getProps) {
      const propSets = await ifcLoader.ifcManager.getPropertySets(
        modelId,
        expressId
      );
      // console.log(propSets); //in propertysets, the HasProperties come up as a 'handle' with a number eg #22650

      for (const pset of propSets) {
        const realValues = [];
        for (const prop of pset.HasProperties) {
          const psetPropId = prop.value;
          const value = await ifcLoader.ifcManager.getItemProperties(
            modelId,
            psetPropId
          ); //this gets the actual property for the 'handle'
          realValues.push(value);
        }
      }

      const buildingProps = await ifcLoader.ifcManager.getAllItemsOfType(
        modelId,
        IFCBUILDING
      );
      const buildingEltID = buildingProps[0];
      const buildingEltProps = await ifcLoader.ifcManager.getItemProperties(
        modelId,
        buildingEltID
      );

      const complexProps = await ifcLoader.ifcManager.getAllItemsOfType(
        modelId,
        IFCCOMPLEXPROPERTY
      );
      const complexEltID = complexProps[0];
    }

    ifcLoader.ifcManager.createSubset({
      scene: scene,
      modelID: found.object.modelID,
      ids: [expressId],
      removePrevious: true,
      material: material,
    });
    // else if lastmodel is defined, remove the subset & material, set lastModel to undefined
  } else if (lastModel) {
    ifcLoader.ifcManager.removeSubset(lastModel.modelID, material);
    lastModel = undefined; //reset the model
  }
}

async function removeFromSubset(exprID) {
  const getSpatial = await ifcLoader.ifcManager.getSpatialStructure(
    model.modelID
  );
  const modelExpressID = getSpatial.expressID;
  const mesh = await ifcLoader.ifcManager.ifcAPI.GetGeometry(
    modelExpressID,
    parseInt(exprID)
  );
  ifcLoader.ifcManager.removeFromSubset(model.modelID, parseInt(exprID));

  updatePostproduction();
}

async function addToSubset(exprID) {
  const getSpatial = await ifcLoader.ifcManager.getSpatialStructure(
    model.modelID
  );
  const modelExpressID = getSpatial.expressID;
  const mesh = await ifcLoader.ifcManager.ifcAPI.GetGeometry(
    modelExpressID,
    parseInt(exprID)
  );
  console.log("adding to subset");

  updatePostproduction();
}

function updatePostproduction() {
  renderer.postProduction.update();
  // viewer.context.renderer.postProduction.update();
}

canvas.onmousemove = (event) => pick(event, highlightMaterial, false);
canvas.onclick = (event) => pick(event, selectionMaterial, true);

// ---------------ANIMATION--------------- //
function animate() {
  // sun.rotation.y += 0.01;
  box.rotation.y += 0.01;
  box.rotation.x += 0.01;
  earth.rotation.y += 0.03;
  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

export {
  scene,
  camera,
  cameraControls,
  canvas,
  labelRenderer,
  removeFromSubset,
  addToSubset,
  updateLabelsArray,
  updateImagesArray,
  updateViewpointArray,
  labelsArray,
  imagesArray,
  viewpointArray,
};
