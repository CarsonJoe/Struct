import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { setQuaternionFromProperEuler } from 'three/src/math/MathUtils';



//scene setup
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight - 1);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('lightblue');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 20);
scene.add(gridHelper);

camera.position.set(0, 1, 5);
orbit.update();


const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

function animate(time){
    renderer.render(scene, camera);
    
}

var mouse = false;
function mouseStatus(n) {
     mouse = n;
}
window.mouseStatus = mouseStatus;

window.addEventListener('mousedown', function(){
    if (mouse) {
        return;
    }
    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    for(let i = 0; i < intersects.length; i++){
        if (intersects[i].object.name === 'Beam'){
            displayBeam(intersects[i]);
            //console.log(intersects[i]);
            //intersects[i].setColor("gray");
            document.getElementById("support").classList.add("show");
            document.getElementById("force").classList.add("show");
            return;
        }
    }
    
    document.getElementById("element-info").classList.remove("show");
    document.getElementById("support").classList.remove("show");
    document.getElementById("force").classList.remove("show");
});



renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight -1);

});


function grid() {
    gridHelper.visible = ! gridHelper.visible;
}
window.grid = grid;

function axes() {
    axesHelper.visible = ! axesHelper.visible;
}
window.axes = axes;




//Beam Class - to make seperate file could make not use three.js by changing input from three.vector3 to diy vector3
export default class Beam{
    constructor(pointA, pointB){
        //console.log(pointA,pointB);
        this.a = pointA;
        this.b = pointB;
        this.center = new THREE.Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, (pointA.z + pointB.z) / 2);
        this.length = Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2) + Math.pow((pointB.z - pointA.z), 2));
        this.rotoX = Math.atan((pointB.y - pointA.y) / Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.z - pointA.z, 2)));
        this.rotoY = -Math.atan((pointB.z - pointA.z) / (pointB.x - pointA.x));

        if(pointB.x - pointA.x < 0)
            this.rotoX*= -1;   

        this.rotation = new THREE.Euler(0, this.rotoY, this.rotoX);
        
        const beamGeometry = new THREE.BoxGeometry(this.length, 3.5 / 12, 1.5 / 12);
        const beam = new THREE.Mesh(beamGeometry, new THREE.MeshBasicMaterial({color: 0xffffff}));
        scene.add(beam);
        beam.setRotationFromEuler(this.rotation);
        beam.position.x = this.center.x;
        beam.position.y = this.center.y;
        beam.position.z = this.center.z;
        beam.name = 'Beam';

        const edges = new THREE.EdgesGeometry(beamGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2}));
        scene.add(line);
        line.setRotationFromEuler(this.rotation);
        line.position.x = this.center.x;
        line.position.y = this.center.y;
        line.position.z = this.center.z;

        this.id = beam.id;


    }

    setColor(color){
        console.log(this.beam);
        //beam.material.color.set(color);
    }

}

/*
var Beam = function(A, B){
    var obj = {};

    obj.A = A;
    obj.B = B;

    setup();
    
    obj.displayBeam(){

    }

    function setup(){
        obj.center = new THREE.Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, (pointA.z + pointB.z) / 2);
        obj.length = Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2) + Math.pow((pointB.z - pointA.z), 2));
        obj.rotoX = Math.atan((pointB.y - pointA.y) / Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.z - pointA.z, 2)));
        obj.rotoY = -Math.atan((pointB.z - pointA.z) / (pointB.x - pointA.x));

        if(pointB.x - pointA.x < 0)
            obj.rotoX*= -1;   

        obj.rotation = new THREE.Euler(0, obj.rotoY, obj.rotoX);
        
        const beamGeometry = new THREE.BoxGeometry(obj.length, 3.5 / 12, 1.5 / 12);
        const beam = new THREE.Mesh(beamGeometry, new THREE.MeshBasicMaterial({color: 0xffffff}));
        scene.add(beam);
        beam.setRotationFromEuler(obj.rotation);
        beam.position.x = obj.center.x;
        beam.position.y = obj.center.y;
        beam.position.z = obj.center.z;
        beam.name = 'Beam';

        const edges = new THREE.EdgesGeometry(beamGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2}));
        scene.add(line);
        line.setRotationFromEuler(obj.rotation);
        line.position.x = obj.center.x;
        line.position.y = obj.center.y;
        line.position.z = obj.center.z;

        obj.id = beam.id;
    }

    function displayBeam(sel){
        let s = null;
        let i = 0;
        for (i = 0; i < beams.length; i++){
            
            if (beams[i].id === sel.object.id){
                s = beams[i];
                break;
            }
        }
        document.getElementById("element-info").classList.add("show");
        document.getElementById("element").innerHTML = sel.object.name + " " + i;
        document.getElementById("position").innerHTML = "(" + s.a.x + ", " + s.a.y + ", " + s.a.z + ") - (" + s.b.x + ", " + s.b.y + ", " + s.b.z + ")";
        
    }
    window.displayBeam = displayBeam;
}

*/
