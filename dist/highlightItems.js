// import {
//     Scene,
//     PerspectiveCamera,
//     WebGLRenderer,
//     MOUSE,
//     Vector2,
//     Vector3,
//     Vector4,
//     Quaternion,
//     Matrix4,
//     Spherical,
//     Box3,
//     Sphere,
//     Raycaster,
//     MathUtils,
//     Clock,
//     DirectionalLight,
//     Color,
//     TextureLoader,
//     AmbientLight,
//     HemisphereLight,
//     AxesHelper,
//     GridHelper,
//     MeshBasicMaterial,
//     MeshLambertMaterial,
//   } from "three";
//     import { IFCLoader } from "web-ifc-three";
//   import {
//     acceleratedRaycast,
//     computeBoundsTree,
//     disposeBoundsTree,
//   } from "three-mesh-bvh";

//   import { camera, ifcModelsArray, scene } from "..";

const canvas = document.getElementById("three-canvas");

// ---------------PICKING--------------- //
const ifcLoader = new IFCLoader();

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


  
  let lastModel;
  
  async function pick(event, material, getProps) {
    const found = cast(event);
    if (found) {
      lastModel = found.object; //when something found store in lastmodel
      const index = found.faceIndex;
      const geometry = found.object.geometry;
      const expressId = ifcLoader.ifcManager.getExpressId(geometry, index);
      const modelId = found.object.modelID;
      // if(getProps){
      // const props = await ifcLoader.ifcManager.getItemProperties(modelId, expressId);
      // const propSets = await ifcLoader.ifcManager.getPropertySets(modelId, expressId);
      // console.log(propSets); //in propertysets, the HasProperties come up as a 'handle' with a number eg #22650
      // for(const pset of propSets){
      //   const realValues = [];
      //   for(const prop of pset.HasProperties){
      //     const id = prop.value;
      //     const value = await ifcLoader.ifcManager.getItemProperties(modelId, expressId); //this gets the actual property for the 'handle'
      //     realValues.push(value);
      //   }
      //   console.log(realValues);
      //   pset.HasProperties = realValues;
      // };
      // };
  
      // GET THE IFCCOMPLEXPROPERTY eg RPV DATA need to install npm i web-ifc
      if (getProps) {
        console.log(expressId);
        console.log(modelId);
        const propSets = await ifcLoader.ifcManager.getPropertySets(modelId, expressId);
        console.log(propSets); //in propertysets, the HasProperties come up as a 'handle' with a number eg #22650
            
        for(const pset of propSets){
        const realValues = [];
          for(const prop of pset.HasProperties){
            const psetPropId = prop.value;
            const value = await ifcLoader.ifcManager.getItemProperties(modelId, psetPropId); //this gets the actual property for the 'handle'
            realValues.push(value);
          }
        console.log(realValues);
        }
        
        const buildingProps = await ifcLoader.ifcManager.getAllItemsOfType(modelId, IFCBUILDING);
        const buildingEltID = buildingProps[0];
        const buildingEltProps = await ifcLoader.ifcManager.getItemProperties(modelId, buildingEltID);
        console.log(buildingProps);
        console.log(buildingEltProps);
  
        const complexProps = await ifcLoader.ifcManager.getAllItemsOfType(modelId, IFCCOMPLEXPROPERTY);
        const complexEltID = complexProps[0];
        console.log(complexEltID);
        // const complexEltProps = await ifcLoader.ifcManager.getItemProperties(modelId, complexEltID);
        // console.log(complexEltProps);
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

export { pick };
