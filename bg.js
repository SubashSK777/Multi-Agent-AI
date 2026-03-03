document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    // Intensely dark background with thick fog for depth fading
    scene.fog = new THREE.FogExp2(0x0d1117, 0.0008);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
    // Position camera dynamically based on mouse later
    camera.position.set(0, 200, 1000);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap pixel ratio for perf
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ==============================================
    // 1. Hovering AI Core (Complex Torus Knot)
    // ==============================================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Breathtaking Torus Knot settings
    const knotGeo = new THREE.TorusKnotGeometry(140, 35, 300, 60, 4, 7);

    // Wireframe outer layer
    const knotWireMat = new THREE.MeshBasicMaterial({
        color: 0x00d2d3,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const knotWire = new THREE.Mesh(knotGeo, knotWireMat);
    coreGroup.add(knotWire);

    // Solid inner glowing layer
    const knotSolidMat = new THREE.MeshStandardMaterial({
        color: 0x6b66ff,
        emissive: 0x3a1b74,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const knotSolid = new THREE.Mesh(knotGeo, knotSolidMat);
    knotSolid.scale.set(0.98, 0.98, 0.98); // slightly smaller inside
    coreGroup.add(knotSolid);

    // --- NEW: Shield Geometry (Icosahedron) ---
    const shieldGeo = new THREE.IcosahedronGeometry(350, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
        color: 0x6b66ff,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    coreGroup.add(shield);

    // Surrounding orbital data rings
    const ringGeo = new THREE.RingGeometry(250, 252, 128);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xff6b6b, side: THREE.DoubleSide, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00d2d3, side: THREE.DoubleSide, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });

    const ring1 = new THREE.Mesh(ringGeo, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat2);
    ring2.rotation.y = Math.PI / 2;
    coreGroup.add(ring2);

    // SCAN LINE EFFECT
    const scanGeo = new THREE.CylinderGeometry(400, 400, 2, 64);
    const scanMat = new THREE.MeshBasicMaterial({
        color: 0x00d2d3,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const scanLine = new THREE.Mesh(scanGeo, scanMat);
    scene.add(scanLine);

    // Core lights
    const pointLight = new THREE.PointLight(0x00d2d3, 4, 1500);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // ==============================================
    // 2. Liquid Digital Ocean (Particle Terrain)
    // ==============================================
    const oceanGroup = new THREE.Group();
    scene.add(oceanGroup);

    const oceanSize = 5000;
    const oceanSegments = 120; // 120x120 grid = 14,400 particles
    const oceanGeo = new THREE.BufferGeometry();
    const oceanPos = new Float32Array((oceanSegments + 1) * (oceanSegments + 1) * 3);
    const oceanColors = new Float32Array((oceanSegments + 1) * (oceanSegments + 1) * 3);

    let idx = 0;
    const colorBottom = new THREE.Color(0x2a1b54); // Deep purple
    const colorTop = new THREE.Color(0x00d2d3); // Cyan peaks

    for (let i = 0; i <= oceanSegments; i++) {
        const z = (i / oceanSegments) * oceanSize - (oceanSize / 2);
        for (let j = 0; j <= oceanSegments; j++) {
            const x = (j / oceanSegments) * oceanSize - (oceanSize / 2);

            // X and Z are set once, Y will be dynamic
            oceanPos[idx * 3] = x;
            oceanPos[idx * 3 + 1] = 0; // Flat initially
            oceanPos[idx * 3 + 2] = z;

            oceanColors[idx * 3] = colorBottom.r;
            oceanColors[idx * 3 + 1] = colorBottom.g;
            oceanColors[idx * 3 + 2] = colorBottom.b;
            idx++;
        }
    }

    oceanGeo.setAttribute('position', new THREE.BufferAttribute(oceanPos, 3));
    oceanGeo.setAttribute('color', new THREE.BufferAttribute(oceanColors, 3));

    const oceanMat = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const ocean = new THREE.Points(oceanGeo, oceanMat);
    ocean.position.y = -350; // Place it far below the core
    oceanGroup.add(ocean);

    // ==============================================
    // 3. Floating Ambient Particles (Dust/Stars)
    // ==============================================
    const dustCount = 3000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
        dustPos[i] = (Math.random() - 0.5) * 4000;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ==============================================
    // Interaction & Animation
    // ==============================================
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates to -1 to 1 for easier scaling
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
    });

    let time = 0;

    // Pre-cache position attribute reference for high-perf manipulation
    const posAttr = oceanGeo.attributes.position;
    const colAttr = oceanGeo.attributes.color;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;

        // --- Camera Parallax ---
        // Move camera in an elegant arc around the center based on mouse
        const targetCamX = mouseX * 500;
        const targetCamY = 250 + (-mouseY * 300); // Inverse Y for natural feel

        camera.position.x += (targetCamX - camera.position.x) * 0.02;
        camera.position.y += (targetCamY - camera.position.y) * 0.02;
        camera.lookAt(coreGroup.position);

        // --- Core Animations ---
        coreGroup.rotation.y += 0.003;
        coreGroup.rotation.x += 0.001;

        // Beats like a heart
        const beat = 0.98 + Math.sin(time * 4) * 0.02;
        knotSolid.scale.setScalar(beat);
        knotWire.scale.setScalar(1 + Math.sin(time * 4) * 0.01);

        // --- NEW: Shield Rotation ---
        shield.rotation.y -= 0.001;
        shield.rotation.z += 0.002;

        // --- NEW: Scan Line Animation ---
        scanLine.position.y = Math.sin(time * 0.5) * 600;
        scanLine.material.opacity = 0.1 + Math.abs(Math.cos(time)) * 0.2;

        // Dynamic ring gyroscopes
        ring1.rotation.x += 0.01;
        ring1.rotation.y += 0.005;
        ring2.rotation.y += 0.01;
        ring2.rotation.z -= 0.005;

        // --- Digital Ocean Waves ---
        // Modify Y positions based on complex overlapping sine waves
        let vIdx = 0;
        for (let i = 0; i <= oceanSegments; i++) {
            for (let j = 0; j <= oceanSegments; j++) {
                const x = posAttr.getX(vIdx);
                const z = posAttr.getZ(vIdx);

                // Complex organic wave calculation
                const y = Math.sin(x * 0.002 + time) * 120
                    + Math.cos(z * 0.003 + time * 1.5) * 90
                    + Math.sin((x + z) * 0.004 - time) * 60;

                posAttr.setY(vIdx, y);

                // Update color strictly based on height mapped from -270 to 270
                const heightRatio = (y + 150) / 300; // normalized ~0 to 1
                const mixColor = colorBottom.clone().lerp(colorTop, Math.max(0, Math.min(1, heightRatio)));
                colAttr.setXYZ(vIdx, mixColor.r, mixColor.g, mixColor.b);

                vIdx++;
            }
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        // --- Dust rotation ---
        dust.rotation.y -= 0.0005;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
