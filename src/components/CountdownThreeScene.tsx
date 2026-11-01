import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CountdownThreeSceneProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const UNIT_MAXIMUMS = [366, 24, 60, 60] as const;
// These map to the centres of a four-column CSS grid, including its gaps.
const DIAL_POSITIONS = [-3.35, -1.12, 1.12, 3.35] as const;
const TWO_PI = Math.PI * 2;

function createCircle(radius: number, color: number, opacity: number) {
  const points: THREE.Vector3[] = [];

  for (let index = 0; index < 96; index += 1) {
    const angle = (index / 96) * TWO_PI;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.LineLoop(geometry, material);
}

function createTicks(radius: number, count: number) {
  const vertices: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * TWO_PI;
    const isQuarter = index % Math.max(1, count / 4) === 0;
    const tickLength = isQuarter ? 0.105 : 0.055;
    const innerRadius = radius - tickLength;

    vertices.push(
      Math.cos(angle) * innerRadius,
      Math.sin(angle) * innerRadius,
      0,
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.LineBasicMaterial({
    color: 0xfff4dc,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.LineSegments(geometry, material);
}

function createParticleField() {
  // Seeded randomness keeps the constellation stable across mounts.
  let seed = 1949;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const positions: number[] = [];
  const colors: number[] = [];
  const gold = new THREE.Color(0xd6a323);
  const ivory = new THREE.Color(0xfff4dc);

  for (let index = 0; index < 90; index += 1) {
    positions.push(
      (random() - 0.5) * 8.2,
      (random() - 0.5) * 2.2,
      -0.2 - random() * 1.5
    );

    const color = gold.clone().lerp(ivory, random() * 0.65);
    colors.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.026,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

/**
 * A decorative WebGL clockwork layer. The DOM remains responsible for every
 * number and label, so the countdown stays accessible if WebGL is unavailable.
 */
export function CountdownThreeScene({
  days,
  hours,
  minutes,
  seconds
}: CountdownThreeSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef([days, hours, minutes, seconds]);
  const renderOnceRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    valuesRef.current = [days, hours, minutes, seconds];
    renderOnceRef.current();
  }, [days, hours, minutes, seconds]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
    } catch {
      host.dataset.webgl = 'unavailable';
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4.25, 4.25, 1.25, -1.25, 0.1, 20);
    camera.position.set(0, 0, 7);

    const clockwork = new THREE.Group();
    scene.add(clockwork);

    const baselineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.75, 0, -0.4),
      new THREE.Vector3(3.75, 0, -0.4)
    ]);
    const baselineMaterial = new THREE.LineBasicMaterial({
      color: 0xd6a323,
      transparent: true,
      opacity: 0.12,
      depthWrite: false
    });
    clockwork.add(new THREE.Line(baselineGeometry, baselineMaterial));

    const dialGroups: THREE.Group[] = [];
    const innerRings: THREE.LineLoop[] = [];
    const markerPivots: THREE.Group[] = [];

    DIAL_POSITIONS.forEach((position, index) => {
      const dial = new THREE.Group();
      dial.position.x = position;
      dial.rotation.x = index % 2 === 0 ? 0.08 : -0.08;

      const outerRing = createCircle(0.76, 0xd6a323, 0.48);
      const innerRing = createCircle(0.61, index % 2 === 0 ? 0xfff4dc : 0x68d7cd, 0.2);
      innerRing.rotation.z = index * 0.35;

      dial.add(outerRing, innerRing, createTicks(0.73, 24));

      const markerPivot = new THREE.Group();
      const marker = new THREE.Mesh(
        new THREE.CircleGeometry(0.04, 18),
        new THREE.MeshBasicMaterial({
          color: index === 3 ? 0xfff4dc : 0xd6a323,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      marker.position.y = 0.76;
      marker.position.z = 0.05;
      markerPivot.add(marker);
      dial.add(markerPivot);

      const centre = new THREE.Mesh(
        new THREE.CircleGeometry(0.018, 12),
        new THREE.MeshBasicMaterial({
          color: 0xd6a323,
          transparent: true,
          opacity: 0.5,
          depthWrite: false
        })
      );
      centre.position.z = 0.03;
      dial.add(centre);

      clockwork.add(dial);
      dialGroups.push(dial);
      innerRings.push(innerRing);
      markerPivots.push(markerPivot);
    });

    const particles = createParticleField();
    scene.add(particles);

    const currentAngles = valuesRef.current.map((value, index) =>
      -(value % UNIT_MAXIMUMS[index]) / UNIT_MAXIMUMS[index] * TWO_PI
    );
    const lastValues = [...valuesRef.current];
    const pulses = [0, 0, 0, 0];

    let frameID = 0;
    let running = false;
    let inViewport = true;
    let pageVisible = !document.hidden;
    let previousTime = performance.now();

    const draw = (now: number) => {
      const delta = Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      const elapsed = now / 1000;

      markerPivots.forEach((markerPivot, index) => {
        const value = valuesRef.current[index];
        const maximum = UNIT_MAXIMUMS[index];
        const targetAngle = -((value % maximum) / maximum) * TWO_PI;

        if (lastValues[index] !== value) {
          lastValues[index] = value;
          pulses[index] = 1;
        }

        if (reduceMotion) {
          currentAngles[index] = targetAngle;
        } else {
          const shortestDistance = Math.atan2(
            Math.sin(targetAngle - currentAngles[index]),
            Math.cos(targetAngle - currentAngles[index])
          );
          currentAngles[index] += shortestDistance * (1 - Math.exp(-delta * 8));
        }

        markerPivot.rotation.z = currentAngles[index];
        pulses[index] = Math.max(0, pulses[index] - delta * 2.4);
        const pulseScale = 1 + pulses[index] * 0.045;
        dialGroups[index].scale.setScalar(pulseScale);

        if (!reduceMotion) {
          innerRings[index].rotation.z = elapsed * (index % 2 === 0 ? 0.035 : -0.028) + index * 0.35;
          dialGroups[index].rotation.y = Math.sin(elapsed * 0.32 + index) * 0.055;
        }
      });

      if (!reduceMotion) {
        particles.rotation.z = elapsed * 0.004;
        particles.position.y = Math.sin(elapsed * 0.3) * 0.025;
      }

      renderer.render(scene, camera);
    };

    const animate = (now: number) => {
      if (!running) return;
      draw(now);
      frameID = window.requestAnimationFrame(animate);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frameID);
    };

    const start = () => {
      if (!inViewport || !pageVisible) return;

      if (reduceMotion) {
        draw(performance.now());
        return;
      }

      if (running) return;

      running = true;
      previousTime = performance.now();
      frameID = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      const aspect = width / height;
      const viewWidth = 8.5;
      const viewHeight = viewWidth / aspect;

      camera.left = -viewWidth / 2;
      camera.right = viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        if (inViewport) start();
        else stop();
      },
      { rootMargin: '100px' }
    );
    intersectionObserver.observe(host);

    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    renderOnceRef.current = () => {
      if (inViewport && pageVisible) draw(performance.now());
    };
    resize();
    start();

    return () => {
      stop();
      renderOnceRef.current = () => undefined;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) return;

        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 pointer-events-none select-none opacity-80"
      aria-hidden="true"
    />
  );
}
