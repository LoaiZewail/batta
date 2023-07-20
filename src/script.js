import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

THREE.ColorManagement.enabled = false

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/duck.mp3')

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */
const mouse = new THREE.Vector2(-1, 0)

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.enableZoom = false
controls.enablePan = false
controls.autoRotateSpeed = 1

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff')
const directionalLight2 = new THREE.DirectionalLight('#ffffff', .5)
directionalLight.position.set(1, 1, 0)
directionalLight2.position.set(-1, -1, 0)
scene.add(directionalLight, directionalLight2)

/**
 * Model
 */
const gltfLoader = new GLTFLoader()

let model = null
gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        model = gltf.scene
        model.position.y = - 1.2
        model.position.x = -.1
        model.position.z = 0
        scene.add(model)
    }
)

const tick = () => {

    // Cast a ray from the mouse and handle events
    raycaster.setFromCamera(mouse, camera)

    // Test intersect with a model
    if (model) {
        const modelIntersects = raycaster.intersectObject(model)

        if (modelIntersects.length) {
            hitSound.play()
            model.scale.set(1.2, 1.2, 1.2)
        }
        else {
            hitSound.pause();
            model.scale.set(1, 1, 1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    renderer.setClearColor("#FFB12B")

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()