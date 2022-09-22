import * as THREE from 'three';
import Beam from './structure.js';



//toggle between hiding and showing the dropdown content
var focus = null;

function addButton() {
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById("beam-menu").classList.remove("show");
    document.getElementById("support-menu").classList.remove("show");
    document.getElementById("force-menu").classList.remove("show");
    if(focus){
        if(focus == 'beam'){
            pointA = new THREE.Vector3(parseFloat(document.getElementById("p1x").value), parseFloat(document.getElementById("p1y").value), parseFloat(document.getElementById("p1z").value));
            pointB = new THREE.Vector3(parseFloat(document.getElementById("p2x").value), parseFloat(document.getElementById("p2y").value), parseFloat(document.getElementById("p2z").value));
            addElement();
        }
        if(focus == 'support'){
            
            document.getElementById("support").classList.add("show");
            document.getElementById("force").classList.add("show");
        }
        
    }
}
window.addButton = addButton;

function beamButton() {
    focus = "beam";
    document.getElementById("beam-menu").classList.toggle("show");
    document.getElementById("support-menu").classList.remove("show");
    document.getElementById("force-menu").classList.remove("show");
}
window.beamButton = beamButton;

function supportButton() {
    document.getElementById("support-menu").classList.toggle("show");
    document.getElementById("beam-menu").classList.remove("show");
    document.getElementById("force-menu").classList.remove("show");
}
window.supportButton = supportButton;

function forceButton() {
    document.getElementById("force-menu").classList.toggle("show");
    document.getElementById("beam-menu").classList.remove("show");
    document.getElementById("support-menu").classList.remove("show");
}
window.forceButton = forceButton;


// Close the dropdown menu if the user clicks outside of it
function close() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    element = null;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}






var beams = [];
var element = 'beam';





function addElement(){
    if(element == 'beam')
        var b = new Beam(pointA, pointB);
        beams.push(b);
        //addIntersections(b);
    if(element == 'support')
        selected.supports.push(new Support());
    if(element == 'force')
        selected.forces.push(new Force());
}


function reset() {
    beams.length = 0;
    console.log(beams);
}
window.reset = reset;


function addIntersections(beam){
    for(let i = 0; i < beams.length; i++){
        if(isCoPlanar(beams[i].a, beams[i].b, beam.a, beam.b)){
            var intPoint = intersection(beams[i].a, beams[i].b, beam.a, beam.b);
            if(isPointOnLine(beams[i].a, beams[i].b, intPoint) && isPointOnLine(beam.a, beam.b, intPoint)){
                beam.supports.push(new Support(intPoint));
                beams[i].supports.push(new Support(intPoint));
            }
        }
    }
}

//checks if coplanar
function tripleProduct(a,b,c) {
    return a.clone().dot(
        (new THREE.Vector3()).cross(b,c)
    );
}
  
function isCoPlanar(a,b,c,d) {
    var ab = b.clone().sub(a);
    var ac = c.clone().sub(a);
    var ad = d.clone().sub(a);
    return tripleProduct(ab,ac,ad) === 0;
}

//finds intersection vector of two lines with two given point vectors
function intersection(a,b,c,d){


}

//checks if the intersection point is on the line
function isPointOnLine(pointA, pointB, test){
    return(distance(test, pointA) + distance(test, pointA) < distance(pointA, center(pointA, pointB)) + distance(pointB, center(pointA, pointB)))
}

//finds the center vector of two vectors
function center(pointA, pointB){
    return(new THREE.Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, (pointA.z + pointB.z) / 2));
}

//finds distance between two vectors
function distance(pointA, pointB){
    return(Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2) + Math.pow((pointB.z - pointA.z), 2)));
}


//WIPWIPWIPWIWPIWPIWIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP
// WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP

//console.log(lineIntersect(new THREE.Vector3(0,0,0), new THREE.Vector3(10,0,0), new THREE.Vector3(4,0,-5), new THREE.Vector3(4,0,5)));


function lineIntersect(a, b, c, d){
    const marginOfError = 0.001;

    var r = b.subVectors(b, a);
    var s = d.subVectors(d, c);
    var q = a.subVectors(a, c);

    var dotqr = new THREE.Vector3(q.dot(r));//-40, 0, 0
    var dotqs = new THREE.Vector3(q.dot(s));//50, 0, 0
    var dotrs = new THREE.Vector3(r.dot(s));//0, 0, 0
    var dotrr = new THREE.Vector3(r.dot(r));//100, 0, 0
    var dotss = new THREE.Vector3(s.dot(s));//100, 0, 0

    var denom = new THREE.Vector3((dotrr.x * dotss.x) - (dotrs.x * dotrs.x), (dotrr.y * dotss.y) - (dotrs.y * dotrs.y), (dotrr.z * dotss.z) - (dotrs.z * dotrs.z));//10000, 0, 0
    var numer = new THREE.Vector3((dotqs.x * dotrs.x) - (dotqr.x * dotss.x), (dotqs.y * dotrs.y) - (dotqr.y * dotss.y), (dotqs.z * dotrs.z) - (dotqr.z * dotss.z));//4000, 0, 0




    var t = numer.divide(denom);//.4, nan, nan
    var u = (dotqs.add(t).multiply(dotrs)).divide(dotss);//0, nan, nan

    //var p0 = a + t * r;
    //var p1 = c + u * s;

    console.log(u);
    

    //if(distance(p1, p0) <= marginOfError)
    //    return(center(p0, p1));

}



function displayBeam(sel){
    let s = null;
    let i = 0;
    for (let i = 0; i < beams.length; i++){
        
        if (beams[i].id === sel.object.id){
            s = beams[i];
            break;
        }
    }
    //i++;
    document.getElementById("element-info").classList.add("show");
    document.getElementById("element").innerHTML = sel.object.name + " " + i;
    document.getElementById("position").innerHTML = "(" + s.a.x + ", " + s.a.y + ", " + s.a.z + ") - (" + s.b.x + ", " + s.b.y + ", " + s.b.z + ")";
    console.log(s);
    //s.setColor(0xf7f7f7);
    //s.beam.material.color.set(0xf7f7f7);
}
window.displayBeam = displayBeam;

beams.push(new Beam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 2, 3)));
//beams[0].appForces.push(new Force());
//beams.push(new Beam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-5, -2, -3)));




