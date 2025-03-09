import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const candlestickTexture = textureLoader.load('assets/candle_wax.jpg', function(texture){
    candlestickTexture.wrapS = THREE.RepeatWrapping;
    candlestickTexture.wrapT = THREE.RepeatWrapping;
    candlestickTexture.repeat.set(1, 4);
});
const candleFlameTexture = textureLoader.load('assets/candle_flame.jpg');

export function drawCandlestick(scene, x, y, z) {
    const scaleFactor = 0.01; // Scale down to 5% of original size (1/20th)
    
    // Base of the candlestick (cylinder)
    const baseGeometry = new THREE.CylinderGeometry(0.5 * scaleFactor, 0.5 * scaleFactor, 5 * scaleFactor, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({ map: candlestickTexture }); 
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(x, y + (5.5 * scaleFactor), z); // Adjusted for smaller height
    scene.add(base);

    // Flame (glowing sphere)
    const flameGeometry = new THREE.SphereGeometry(0.6 * scaleFactor, 3, 3);
    const flameMaterial = new THREE.MeshBasicMaterial({ map: candleFlameTexture });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.set(x, y, z);
    scene.add(flame);

    // Add a point light for flame glow
    const flameLight = new THREE.PointLight(0xFFA500, 0.5, 1, 2); // Reduce intensity & range for small size
    flameLight.position.set(x, y + (5 * scaleFactor), z);
    scene.add(flameLight);

    function animateFlame() {
        requestAnimationFrame(animateFlame);
        const flickerAmount = Math.sin(Date.now() * 0.002) * 0.05;
        flame.scale.setScalar(1 + flickerAmount * 0.05);
        flame.position.y = y + (8.3 * scaleFactor) + flickerAmount * 0.02;

        flameLight.intensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.1;
        flameLight.position.x = x + (Math.random() - 0.5) * 0.005; // Slight movement
        flameLight.position.z = z + (Math.random() - 0.5) * 0.005;
    }
    
    
    animateFlame();
}

// animation not working
export function makeCandleRing(scene, centerX, centerY, centerZ, numCandles) {
    const radius = 0.5;         // Circle radius for the candles
    const angularSpeed = 0.2;   // Radians per second at which each candle moves
    const candleRingGroup = new THREE.Group();
    scene.add(candleRingGroup);
    
    const candles = [];
  
    // Create each candlestick as an Object3D and position it on the circle.
    for (let i = 0; i < numCandles; i++) {
      const initialAngle = (i / numCandles) * Math.PI * 2;
      const candleGroup = new THREE.Object3D();
  
      // Draw the candlestick at the origin of its local group.
      drawCandlestick(candleGroup, 0, 0, 0);
      
      // Set its initial position using circle equations.
      candleGroup.position.set(
        centerX + Math.cos(initialAngle) * radius,
        centerY,
        centerZ + Math.sin(initialAngle) * radius
      );
      
      // Orient it to face the circle center.
      candleGroup.lookAt(centerX, centerY, centerZ);
      
      // Save the current angle for later updates.
      candleGroup.userData.angle = initialAngle;
      
      // Add to group and store for animation.
      candleRingGroup.add(candleGroup);
      candles.push(candleGroup);
    }
    
    // Set up an internal animation loop to update candle positions.
    let prevTime = performance.now();
    function animateRing() {
      const currentTime = performance.now();
      const deltaTime = (currentTime - prevTime) / 1000; // seconds
      prevTime = currentTime;
      
      // Update each candle's angle and position.
      candles.forEach(candle => {
        candle.userData.angle += angularSpeed * deltaTime;
        candle.position.set(
          centerX + Math.cos(candle.userData.angle) * radius,
          centerY,
          centerZ + Math.sin(candle.userData.angle) * radius
        );
        // Re-orient the candle so it continuously faces the center.
        candle.lookAt(centerX, centerY, centerZ);
      });
      
      requestAnimationFrame(animateRing);
    }
    
    animateRing();
  }
