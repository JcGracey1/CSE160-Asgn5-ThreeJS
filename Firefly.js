import * as THREE from 'three';

export function drawFirefly(scene, x, y, z) {
    const bodyGeometry = new THREE.BoxGeometry(0.005, 0.003, 0.005);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(x, y, z);
    scene.add(body);

    // Add a point light for flame glow
    const flameLight = new THREE.PointLight(0xFFA500, 0.5, 0.3, 0.7);
    flameLight.position.set(x, y, z);
    scene.add(flameLight);

    let time = 0;
    // Generate a random phase offset so each firefly starts at a different point in the loop
    const phase = Math.random() * Math.PI * 2;

    function animateFirefly(){
        requestAnimationFrame(animateFirefly);
        time += 0.01; // increment time

        // Use the phase offset in the calculation
        body.position.x = x + Math.sin((time + phase) * 3) * 0.02;
        body.position.y = y + Math.cos((time + phase) * 4) * 0.02;
        body.position.z = z + Math.sin((time + phase) * 2) * 0.02;

        flameLight.position.x = x + Math.sin((time + phase) * 3) * 0.02;
        flameLight.position.y = y + Math.cos((time + phase) * 4) * 0.02;
        flameLight.position.z = z + Math.sin((time + phase) * 2) * 0.02;
    }

    animateFirefly();
}
