import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {crr} from "../calculator/pricing";
import type {OptionType} from "../calculator/types";

const STRIKE = 100;
const SPOT_MIN = 50;
const SPOT_MAX = 150;
const DAYS_MAX = 180;
const RATE = 0.05;
const VOL = 0.35;
const STEPS = 80;

const SPOT_SEGMENTS = 50;
const DAY_SEGMENTS = 36;

const WIDTH = 10;
const DEPTH = 7;
const VALUE_SCALE = 0.075;

const SWEEP_SECONDS = 7;
/** 曲面由平面「升起」嘅時間 */
const INTRO_SECONDS = 1.2;
/** 切換 Call / Put 時曲面壓扁再彈返起嘅時間 */
const SWITCH_SECONDS = 0.5;

const COLOR_LOW = new THREE.Color("#1d4f8f");
const COLOR_MID = new THREE.Color("#4dabf7");
const COLOR_HIGH = new THREE.Color("#f2c14e");

export interface SurfaceHandle {
    setType(type: OptionType): void;
    start(): void;
    stop(): void;
}

function xOfSpot(spot: number): number {
    return ((spot - SPOT_MIN) / (SPOT_MAX - SPOT_MIN) - 0.5) * WIDTH;
}

// 到期（0 日）喺最近鏡頭嗰邊
function zOfDays(days: number): number {
    return (0.5 - days / DAYS_MAX) * DEPTH;
}

function spotAt(i: number): number {
    return SPOT_MIN + ((SPOT_MAX - SPOT_MIN) * i) / SPOT_SEGMENTS;
}

function daysAt(j: number): number {
    return (DAYS_MAX * j) / DAY_SEGMENTS;
}

function computeGrid(optionType: OptionType): Float32Array {
    const values = new Float32Array((SPOT_SEGMENTS + 1) * (DAY_SEGMENTS + 1));
    for (let j = 0; j <= DAY_SEGMENTS; j++) {
        const years = daysAt(j) / 365;
        for (let i = 0; i <= SPOT_SEGMENTS; i++) {
            values[j * (SPOT_SEGMENTS + 1) + i] = crr({optionType, spot: spotAt(i), strike: STRIKE, years, rate: RATE, vol: VOL}, STEPS);
        }
    }
    return values;
}

function colorFor(value: number, maxValue: number, target: THREE.Color): THREE.Color {
    const t = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
    if (t < 0.5) return target.copy(COLOR_LOW).lerp(COLOR_MID, t * 2);
    return target.copy(COLOR_MID).lerp(COLOR_HIGH, (t - 0.5) * 2);
}

function makeLabel(text: string, color: string, size = 0.42): THREE.Sprite {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    const font = "600 44px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
    context.font = font;
    const width = Math.ceil(context.measureText(text).width) + 24;
    canvas.width = width;
    canvas.height = 64;
    context.font = font;
    context.fillStyle = color;
    context.textBaseline = "middle";
    context.fillText(text, 12, 34);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({map: texture, transparent: true, depthWrite: false, depthTest: false});
    const sprite = new THREE.Sprite(material);
    sprite.scale.set((size * width) / 64, size, 1);
    return sprite;
}

function makeTube(points: THREE.Vector3[], radius: number): THREE.TubeGeometry {
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 1; i < points.length; i++) {
        path.add(new THREE.LineCurve3(points[i - 1], points[i]));
    }
    return new THREE.TubeGeometry(path, points.length * 2, radius, 6, false);
}

function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createSurface(container: HTMLElement, getScale: () => number): SurfaceHandle {
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(5.6, 6.8, 11.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.9, 0.4);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 24;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotate = !prefersReducedMotion();
    controls.autoRotateSpeed = 0.5;
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const light = new THREE.DirectionalLight(0xffffff, 2.2);
    light.position.set(5, 10, 6);
    scene.add(light);

    const grid = new THREE.GridHelper(WIDTH, 10, 0x33415e, 0x1f2a42);
    grid.scale.set(1, 1, DEPTH / WIDTH);
    scene.add(grid);

    // 曲面
    const vertexCount = (SPOT_SEGMENTS + 1) * (DAY_SEGMENTS + 1);
    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    const indices: number[] = [];
    for (let j = 0; j < DAY_SEGMENTS; j++) {
        for (let i = 0; i < SPOT_SEGMENTS; i++) {
            const a = j * (SPOT_SEGMENTS + 1) + i;
            const b = a + 1;
            const c = a + SPOT_SEGMENTS + 1;
            const d = c + 1;
            indices.push(a, c, b, b, c, d);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setIndex(indices);

    const surface = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({vertexColors: true, side: THREE.DoubleSide, roughness: 0.55, metalness: 0.1, transparent: true, opacity: 0.9}));
    scene.add(surface);
    const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true, transparent: true, opacity: 0.07}));
    scene.add(wire);

    // 到期损益（绿线）同时间扫描线（金线）
    const expiryLine = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({color: 0x37d67a}));
    scene.add(expiryLine);
    const sweepPoints = Array.from({length: SPOT_SEGMENTS + 1}, () => new THREE.Vector3());
    const sweepLine = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({color: 0xf2c14e}));
    scene.add(sweepLine);

    const strikeLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(xOfSpot(STRIKE), 0.01, zOfDays(0)), new THREE.Vector3(xOfSpot(STRIKE), 0.01, zOfDays(DAYS_MAX))]),
        new THREE.LineDashedMaterial({color: 0x9aabc7, dashSize: 0.2, gapSize: 0.15})
    );
    strikeLine.computeLineDistances();
    scene.add(strikeLine);

    const labels: Array<[THREE.Sprite, THREE.Vector3]> = [
        [makeLabel("股价 150", "#9aabc7", 0.5), new THREE.Vector3(WIDTH / 2, 0, DEPTH / 2 + 0.7)],
        [makeLabel("股价 50", "#9aabc7", 0.5), new THREE.Vector3(-WIDTH / 2, 0, DEPTH / 2 + 0.7)],
        [makeLabel("行权价 100", "#e8eefb", 0.55), new THREE.Vector3(xOfSpot(STRIKE), 0, DEPTH / 2 + 0.7)],
        [makeLabel("剩余 180 天", "#f2c14e", 0.55), new THREE.Vector3(-WIDTH / 2 - 1.4, 0, zOfDays(DAYS_MAX))],
        [makeLabel("到期日", "#37d67a", 0.55), new THREE.Vector3(-WIDTH / 2 - 1.1, 0, zOfDays(0))],
    ];
    for (const [sprite, position] of labels) {
        sprite.position.copy(position);
        scene.add(sprite);
    }

    let values: Float32Array = new Float32Array(0);
    let maxValue = 1;
    const scratch = new THREE.Color();

    // 出場時曲面由平「升起」；切換 Call / Put 時壓扁再彈返
    let introAt = prefersReducedMotion() ? -Infinity : performance.now();
    let burstAt = -Infinity;
    const scaleFor = (now: number): number => {
        const intro = (now - introAt) / 1000 / INTRO_SECONDS;
        const target = intro >= 1 ? 1 : 1 - Math.pow(1 - Math.max(intro, 0), 3);
        const burst = burstAt >= 0 ? (now - burstAt) / 1000 / SWITCH_SECONDS : 1;
        const spring = burst >= 1 ? 1 : 0.45 + 0.55 * Math.sin(Math.PI * burst);
        return target * spring;
    };

    // 曲面高度、到期線、掃描線都要跟同一個 scale，否則會散開
    const applyScale = (scale: number) => {
        for (let j = 0; j <= DAY_SEGMENTS; j++) {
            for (let i = 0; i <= SPOT_SEGMENTS; i++) {
                positions[j * (SPOT_SEGMENTS + 1) * 3 + i * 3 + 1] = values[j * (SPOT_SEGMENTS + 1) + i] * VALUE_SCALE * scale;
            }
        }
        geometry.attributes.position.needsUpdate = true;
    };

    const applyType = (type: OptionType) => {
        values = computeGrid(type);
        maxValue = values.reduce((max, value) => Math.max(max, value), 0);
        for (let j = 0; j <= DAY_SEGMENTS; j++) {
            for (let i = 0; i <= SPOT_SEGMENTS; i++) {
                const index = j * (SPOT_SEGMENTS + 1) + i;
                const value = values[index];
                positions.set([xOfSpot(spotAt(i)), value * VALUE_SCALE, zOfDays(daysAt(j))], index * 3);
                colorFor(value, maxValue, scratch).toArray(colors, index * 3);
            }
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();

        const expiryPoints: THREE.Vector3[] = [];
        for (let i = 0; i <= SPOT_SEGMENTS; i++) {
            expiryPoints.push(new THREE.Vector3(xOfSpot(spotAt(i)), values[i] * VALUE_SCALE + 0.03, zOfDays(0)));
        }
        expiryLine.geometry.dispose();
        expiryLine.geometry = makeTube(expiryPoints, 0.06);
    };

    // 由 180 日扫到 0 日：曲线慢慢贴近到期损益
    const updateSweep = (progress: number, scale: number) => {
        const row = (1 - progress) * DAY_SEGMENTS;
        const j0 = Math.floor(row);
        const j1 = Math.min(j0 + 1, DAY_SEGMENTS);
        const mix = row - j0;
        for (let i = 0; i <= SPOT_SEGMENTS; i++) {
            const v0 = values[j0 * (SPOT_SEGMENTS + 1) + i];
            const v1 = values[j1 * (SPOT_SEGMENTS + 1) + i];
            const value = v0 + (v1 - v0) * mix;
            sweepPoints[i].set(xOfSpot(spotAt(i)), value * VALUE_SCALE * scale + 0.04, zOfDays(daysAt(row)));
        }
        sweepLine.geometry.dispose();
        sweepLine.geometry = makeTube(sweepPoints, 0.05);
    };

    const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width === 0 || height === 0) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio * Math.max(getScale(), 1), 3));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let frame = 0;
    let running = false;
    // 掃描線由 180 日掃到 0 日：入場時掃描同升起同步，之後各自循環
    const sweepStart = () => introAt + INTRO_SECONDS * 1000 * 0.35;

    const render = (now: number) => {
        if (!running) return;
        const scale = scaleFor(now);
        applyScale(scale);
        const progress = prefersReducedMotion() ? 0.5 : (((now - sweepStart()) / 1000) % SWEEP_SECONDS) / SWEEP_SECONDS;
        updateSweep(progress < 0 ? 0 : progress, scale);
        controls.update();
        renderer.render(scene, camera);

        // 升起／切換動畫做完後，如果仲有自動旋轉就繼續跑，
        // 否則停低唔好白燒 GPU（reveal 一離開呢版就會 stop()）
        const settled = now - introAt >= INTRO_SECONDS * 1000 && (burstAt < 0 || now - burstAt >= SWITCH_SECONDS * 1000);
        if (settled && !controls.autoRotate) {
            running = false;
            return;
        }
        frame = requestAnimationFrame(render);
    };

    applyType("call");
    resize();

    return {
        setType(type) {
            applyType(type);
            if (prefersReducedMotion()) {
                applyScale(1);
                return;
            }
            // 切換時壓扁再彈返，配合掃描線重播一次
            burstAt = performance.now();
            introAt = burstAt - INTRO_SECONDS * 1000;
            if (!running) {
                running = true;
                frame = requestAnimationFrame(render);
            }
        },
        start() {
            if (!prefersReducedMotion()) {
                // 每次重新入到呢一版都由「升起」開始，順手重播掃描線
                introAt = performance.now();
                burstAt = -Infinity;
            }
            running = true;
            resize();
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(render);
        },
        stop() {
            running = false;
            cancelAnimationFrame(frame);
        },
    };
}
