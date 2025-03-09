import * as THREE from 'three';

export function drawFirefly(scene, x, y, z) {
    const bodyGeometry = new THREE.BoxGeometry(0.005, 0.005, 0.005);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); // yellow color 
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(x, y, z);
    scene.add(body);
}