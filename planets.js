import {
    BoxGeometry,
    SphereGeometry,
    LineBasicMaterial,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhysicalMaterial,
    Mesh,
    Color,
    TextureLoader,
    EdgesGeometry,
    LineSegments,
} from 'three';


// CREATE OBJECT
const loader = new TextureLoader();
const orangeMaterial = new MeshLambertMaterial({ color: "orange" });
const blueMaterial = new MeshLambertMaterial({ color: "blue" });
const whiteMaterial = new MeshLambertMaterial({ color: "white" });

const sunSphere = new SphereGeometry(1.4);
const sun = new Mesh (sunSphere, blueMaterial);

const boxGeom = new BoxGeometry(1, 1, 1);
const box = new Mesh (boxGeom, blueMaterial);

const mercurySphere = new SphereGeometry(0.4879);
const mercury = new Mesh (mercurySphere, orangeMaterial);
mercury.position.x += 57.91;

const venusSphere = new SphereGeometry(1.2104);
const venus = new Mesh (venusSphere, orangeMaterial);
venus.position.x += 108.2;

const earthSphere = new SphereGeometry(1.2742);
const earth = new Mesh (earthSphere, blueMaterial);
// earth.scale.set(0.2,0.2,0.2);
earth.position.x += 149.6;

const moonSphere = new SphereGeometry(0.3474);
const moon = new Mesh (moonSphere, orangeMaterial);
moon.position.x += 2.3844;

const marsSphere = new SphereGeometry(0.6779);
const mars = new Mesh (marsSphere, orangeMaterial);
mars.position.x += 227.9;

const jupiterSphere = new SphereGeometry(13.982);
const jupiter = new Mesh (jupiterSphere, orangeMaterial);
jupiter.position.x += 778.5;

const saturnSphere = new SphereGeometry(11.646);
const saturn = new Mesh (saturnSphere, orangeMaterial);
saturn.position.x += 1430.0;

const uranusSphere = new SphereGeometry(5.0724);
const uranus = new Mesh (uranusSphere, orangeMaterial);
uranus.position.x += 2870.0;

const neptuneSphere = new SphereGeometry(4.9244);
const neptune = new Mesh (neptuneSphere, orangeMaterial);
neptune.position.x += 4500.0;

const geomMesh = new BoxGeometry(2, 2, 2);
const geomMat = new MeshBasicMaterial({
    color: 'white',
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});
// the polygonOffset pushes the faces away and makes the lines stand out
const geomObject = new Mesh(geomMesh, geomMat);

const edgesGeom = new BoxGeometry(2, 2, 2);
const edgesObject = new EdgesGeometry(edgesGeom);
const edgesMat = new LineBasicMaterial({color: 0x000000});
const edgesWireframe = new LineSegments(edgesObject, edgesMat);


export {geomObject, edgesWireframe, sun, box, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune};