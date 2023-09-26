import { scene } from "..";
import { IFCLoader } from "web-ifc-three";
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
} from "web-ifc";

// 28 mins? //

const ifcLoader = new IFCLoader();
const manager = ifcLoader.ifcManager;

// ---------- CATEGORY VISIBILITY ---------- //
const categories = {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER,
};

function getName(category) {
  const names = Object.keys(categories);
  return names.find((name) => categories[name] === category);
}

async function getAll(category) {
  return ifcLoader.ifcManager.getAllItemsOfType(model.modelID, category);
  ifcLoader.ifcManager.getAllItemsOfType
}

const subsets = {};

async function setupAllCategories() {
  const allCategories = Object.values(categories);
  for (const category of allCategories) {
    await setupCategory(category);
  }
}

// SETUP CATEGORY AND BIND TO CHECKBOX
// SETUP CATEGORY
async function setupCategory(category) {
  const subset = await newSubsetOfType(category);
  subset.userData.category = category.toString();
  subsets[category] = subset;
  togglePickable(subset, true);
  setupCheckbox(category);
}

// BINDS TO CHECKBOX
function setupCheckbox(category) {
  const name = getName(category);
  const checkbox = document.getElementById(name);
  checkbox.addEventListener("change", () => {
    const subset = subsets[category];
    if (checkbox.checked) {
      scene.add(subset);
      togglePickable(subset, true);
    } else {
      subset.removeFromParent();
      togglePickable(subset, false);
    }

    updatePostproduction();
  });
}

async function newSubsetOfType(category) {
  const ids = await getAll(category);
  return ifcLoader.ifcManager.createSubset({
    modelID: model.modelID,
    scene,
    ids,
    removePrevious: true,
    customID: category.toString(),
  });
}

// ENABLE/DISABLE OTHER ITEMS FROM BEING PICKABLE
function togglePickable(mesh, isPickable) {
  const pickableModels = viewer.context.items.pickableIfcModels;
  if (isPickable) {
    pickableModels.push(mesh);
  } else {
    const index = pickableModels.indexOf(model);
    pickableModels.splice(index, 1);
  }
}

function removeFromSubset(result) {
  const index = result.faceIndex;
  const subset = result.object;
  const id = ifcLoader.ifcManager.getExpressId(subset.geometry, index);

  Ifcloader.ifcManager.removeFromSubset(
    subset.modelID,
    [id],
    subset.userData.category
  );
  updatePostproduction();
}

ifcLoader.ifcManager.removeFromSubset();

function updatePostproduction() {
  viewer.context.renderer.postProduction.update();
}

export { setupAllCategories };
