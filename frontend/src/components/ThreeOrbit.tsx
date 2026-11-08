"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type OrbitPoint = {
  angle: number;
  radius: number;
  speed: number;
  mesh: THREE.Mesh;
  yOffset: number;
};

const ORBIT_COLORS = [0xcb5f2f, 0x245d63, 0x8b6b2d, 0xb86f88, 0x3d4f8f];

export function ThreeOrbit() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf6f1e8, 5, 16);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1.45, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 2.2);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 7, 8);
    const fillLight = new THREE.DirectionalLight(0xffd7bf, 1.1);
    fillLight.position.set(-4, 2, 6);
    scene.add(ambient, keyLight, fillLight);

    const root = new THREE.Group();
    scene.add(root);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 2),
      new THREE.MeshStandardMaterial({
        color: 0xcb5f2f,
        roughness: 0.38,
        metalness: 0.28,
        emissive: 0x321100,
        emissiveIntensity: 0.22,
      }),
    );
    core.castShadow = true;
    root.add(core);

    const ringMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x245d63, roughness: 0.4, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x8b6b2d, roughness: 0.45, metalness: 0.18 }),
      new THREE.MeshStandardMaterial({ color: 0x5b718f, roughness: 0.42, metalness: 0.22 }),
    ];

    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.04, 10, 120), ringMaterials[0]),
      new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.04, 10, 120), ringMaterials[1]),
      new THREE.Mesh(new THREE.TorusGeometry(3.75, 0.04, 10, 120), ringMaterials[2]),
    ];
    rings[0].rotation.x = Math.PI / 2.8;
    rings[1].rotation.x = -Math.PI / 2.4;
    rings[2].rotation.x = Math.PI / 3.1;
    root.add(...rings);

    const orbitGroup = new THREE.Group();
    root.add(orbitGroup);

    const orbitPoints: OrbitPoint[] = ORBIT_COLORS.map((color, index) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.27 : 0.18, 32, 32),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.32,
          metalness: 0.25,
          emissive: color,
          emissiveIntensity: 0.12,
        }),
      );
      orbitGroup.add(mesh);
      return {
        angle: index * (Math.PI / 2.5),
        radius: 2.1 + index * 0.32,
        speed: 0.002 + index * 0.00045,
        mesh,
        yOffset: index % 2 === 0 ? 0.35 : -0.25,
      };
    });

    const pointers = { x: 0, y: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointers.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointers.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    };

    const handlePointerLeave = () => {
      pointers.x = 0;
      pointers.y = 0;
    };

    mount.addEventListener("pointermove", handlePointerMove);
    mount.addEventListener("pointerleave", handlePointerLeave);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const animate = () => {
      core.rotation.x += 0.004;
      core.rotation.y += 0.006;
      orbitGroup.rotation.y += 0.0025;
      root.rotation.x += pointers.y * 0.006;
      root.rotation.y += pointers.x * 0.01;

      orbitPoints.forEach((point, index) => {
        point.angle += point.speed;
        point.mesh.position.x = Math.cos(point.angle) * point.radius;
        point.mesh.position.z = Math.sin(point.angle) * point.radius;
        point.mesh.position.y = Math.sin(point.angle * 1.8) * 0.18 + point.yOffset;
        point.mesh.rotation.x += 0.01 + index * 0.002;
        point.mesh.rotation.y += 0.013 + index * 0.0025;
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    let frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) => material.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  return <div ref={mountRef} className="no-print relative h-[440px] w-full overflow-hidden rounded-[2rem]" />;
}
