import { useEffect, useRef } from "react";
import * as THREE from "three";

type SceneNode = {
  mesh: THREE.Mesh;
  baseScale: number;
  phase: number;
};

export default function PlatformScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.2, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const architecture = new THREE.Group();
    scene.add(architecture);

    const ink = new THREE.MeshStandardMaterial({
      color: 0x101012,
      roughness: 0.32,
      metalness: 0.55,
    });
    const blue = new THREE.MeshPhysicalMaterial({
      color: 0x3156ff,
      emissive: 0x1736c7,
      emissiveIntensity: 0.32,
      roughness: 0.2,
      metalness: 0.62,
      clearcoat: 0.85,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.05,
      metalness: 0.05,
      transmission: 0.45,
      thickness: 0.6,
    });
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3156ff,
      transparent: true,
      opacity: 0.48,
    });
    const paleLineMaterial = new THREE.LineBasicMaterial({
      color: 0x151518,
      transparent: true,
      opacity: 0.17,
    });

    // The core and surrounding modules form an exploded SaaS architecture.
    const core = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), blue);
    core.rotation.set(0.12, Math.PI / 4, -0.08);
    architecture.add(core);

    const coreEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.05, 2.05, 2.05)),
      paleLineMaterial,
    );
    coreEdges.rotation.copy(core.rotation);
    architecture.add(coreEdges);

    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), glass);
    architecture.add(inner);

    const moduleGeometry = new THREE.BoxGeometry(1.8, 0.16, 1.15);
    const modulePositions = [
      new THREE.Vector3(-2.75, 1.52, -0.4),
      new THREE.Vector3(2.7, 1.42, -0.85),
      new THREE.Vector3(-2.62, -1.62, -0.65),
      new THREE.Vector3(2.82, -1.5, 0.15),
    ];
    const nodes: SceneNode[] = [];

    modulePositions.forEach((position, index) => {
      const module = new THREE.Mesh(moduleGeometry, index % 2 === 0 ? glass : ink);
      module.position.copy(position);
      module.rotation.set(index % 2 ? -0.14 : 0.12, -0.22 + index * 0.14, index % 2 ? 0.1 : -0.1);
      architecture.add(module);

      const moduleEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(moduleGeometry),
        index % 2 === 0 ? lineMaterial : paleLineMaterial,
      );
      moduleEdges.position.copy(module.position);
      moduleEdges.rotation.copy(module.rotation);
      architecture.add(moduleEdges);

      const connector = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(position.x * 0.28, position.y * 0.28, position.z * 0.28),
        position,
      ]);
      architecture.add(new THREE.Line(connector, lineMaterial));

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0x3156ff }),
      );
      node.position.copy(position).multiplyScalar(0.67);
      architecture.add(node);
      nodes.push({ mesh: node, baseScale: 1, phase: index * 1.25 });

      for (let detail = 0; detail < 3; detail += 1) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.84 - detail * 0.1, 0.022, 0.035),
          new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? 0x3156ff : 0xffffff,
            transparent: true,
            opacity: 0.82,
          }),
        );
        rail.position.set(-0.25, 0.105, -0.27 + detail * 0.25);
        module.add(rail);
      }
    });

    const orbit = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.TorusGeometry(3.85, 0.012, 3, 96)),
      paleLineMaterial,
    );
    orbit.rotation.set(Math.PI / 2.35, 0.12, -0.1);
    architecture.add(orbit);

    const pointLight = new THREE.PointLight(0x3156ff, 24, 14, 2);
    pointLight.position.set(2.4, 2.8, 4);
    scene.add(pointLight);
    const softLight = new THREE.DirectionalLight(0xffffff, 4.5);
    softLight.position.set(-4, 5, 6);
    scene.add(softLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1.9));

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frame = 0;

    const handlePointer = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 0.34;
      target.y = (event.clientY / window.innerHeight - 0.5) * 0.24;
    };

    const resize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      const compact = width < 760;
      const mobileScale = THREE.MathUtils.clamp(width / 560, 0.48, 0.66);
      architecture.position.set(compact ? 0.2 : 2.1, compact ? -1.15 : 0.15, compact ? -1.2 : 0);
      architecture.scale.setScalar(compact ? mobileScale : Math.min(1, width / 1200));
    };

    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      pointer.x += (target.x - pointer.x) * 0.035;
      pointer.y += (target.y - pointer.y) * 0.035;

      if (!reducedMotion) {
        architecture.rotation.y = Math.sin(elapsed * 0.18) * 0.1 + pointer.x;
        architecture.rotation.x = Math.sin(elapsed * 0.14) * 0.035 - pointer.y;
        core.rotation.y += 0.0022;
        inner.rotation.x += 0.004;
        inner.rotation.y -= 0.005;
        orbit.rotation.z += 0.0008;
        nodes.forEach(({ mesh, baseScale, phase }) => {
          const pulse = baseScale + Math.sin(elapsed * 2.2 + phase) * 0.42;
          mesh.scale.setScalar(pulse);
        });
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.LineSegments) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="platform-scene" aria-hidden="true" />;
}