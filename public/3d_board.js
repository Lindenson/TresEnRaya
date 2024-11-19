//Размеры
let board;
const isMobile = window.innerWidth <= 768; // Ширина <= 768px считается мобильным
const boardWidth = 3.3
const boardOver = 0.05;
const boardDisproportion = 1.12
const boardHeight = 0.25
const scale = isMobile ? 60 : 40

// Загрузка звука падения
const stoneHitSound = new Audio('./stone.mp3');
const textHitSound = new Audio('./ooh.mp3');

// Сцена, камера и рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(scale, window.innerWidth / window.innerHeight, 0.1, 800);
camera.position.set(0.5, 3.5, 4.5);
camera.lookAt(0, -0.1, 0.7);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Для мягких теней

document.body.appendChild(renderer.domElement);

// Загрузка текстуры дерева
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('./wood.jpg');
const metalTexture = textureLoader.load('./metal.jpg');
const stoneTexture = textureLoader.load('./stone.jpg');

// Создаем доску с наклоном
function createBoard() {
    const boardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, boardWidth);
    const boardMaterial = new THREE.MeshStandardMaterial({map: woodTexture});
    board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.receiveShadow = true;  // Плоскость будет принимать тени
    board.position.y = -0.18;
    board.rotation.x = Math.PI / 110; // Наклон доски на 5 градусов к зрителю
    scene.add(board);

    // Канавки для сетки
    const grooveMaterial = new THREE.MeshStandardMaterial({color: 0x3b2400, map: woodTexture});
    const grooveDepth = -0.04; // Насколько углублены канавки
    const grooveWidth = 0.05;  // Ширина канавок

    // Вертикальные канавки
    const verticalGrooveGeometry = new THREE.BoxGeometry(grooveWidth, grooveDepth, 3.4);
    const groove1 = new THREE.Mesh(verticalGrooveGeometry, grooveMaterial)
    groove1.position.set(-0.48, 0.01 - grooveDepth / 2, 0.07);
    scene.add(groove1);

    const groove2 = groove1.clone();
    groove2.position.set(0.52, 0.01 - grooveDepth / 2, 0.07);
    scene.add(groove2);

    // Горизонтальные канавки
    const horizontalGrooveGeometry = new THREE.BoxGeometry(3.2, grooveDepth, grooveWidth);
    const groove3 = new THREE.Mesh(horizontalGrooveGeometry, grooveMaterial);
    groove3.position.set(0.01, 0.01 - grooveDepth / 2, -0.52);
    scene.add(groove3);

    const groove4 = groove3.clone();
    groove4.position.set(0.01, 0.01 - grooveDepth / 2, 0.64);
    scene.add(groove4);
}


// Функция создания X с анимацией и звуком
function createXFalling(col, row) {
    const material = new THREE.MeshStandardMaterial({map: stoneTexture});
    const geometry = new THREE.BoxGeometry(1, 0.24, 0.16);

    const x1 = new THREE.Mesh(geometry, material);
    const x2 = new THREE.Mesh(geometry, material);
    x1.castShadow = true;  // Этот объект будет отбрасывать тень
    x2.castShadow = true;  // Этот объект будет отбрасывать тень

    // Начальная позиция
    const startX = (col - 1) * boardDisproportion;
    const startY = 5; // За пределами экрана (высоко над доской)
    const startZ = (row - 1) * boardDisproportion;

    x1.position.set(startX, startY, startZ);
    x2.position.set(startX, startY, startZ);

    x1.rotation.x = Math.PI / 2;
    x1.rotation.z = Math.PI / 4;

    x2.rotation.x = Math.PI / 2;
    x2.rotation.z = -Math.PI / 4;

    scene.add(x1);
    scene.add(x2);

    // Флаг для предотвращения повторного воспроизведения звука
    let soundPlayed = false;

    // Анимация падения с отслеживанием
    gsap.to(x1.position, {
        y: boardOver,
        duration: 1,
        ease: "bounce.out",
        onUpdate: () => {
            if (!soundPlayed && x1.position.y <= boardOver + 0.2) { // Задаем небольшой "зазор" для точного момента
                stoneHitSound.play();
                soundPlayed = true;
            }
        }
    });
    gsap.to(x2.position, {
        y: boardOver,
        duration: 1,
        ease: "bounce.out"
    });
    return [x1, x2]
}

// Функция создания O с анимацией и звуком
function createOFalling(col, row) {
    const material = new THREE.MeshStandardMaterial({map: metalTexture});
    const geometry = new THREE.TorusGeometry(0.32, 0.12, 40, 60);

    const o = new THREE.Mesh(geometry, material);
    o.castShadow = true;  // Этот объект будет отбрасывать теньь

    // Начальная позиция
    const startX = (col - 1) * 1.07;
    const startY = 5; // За пределами экрана (высоко над доской)
    const startZ = (row - 1) * boardDisproportion + 0.05;

    o.position.set(startX, startY, startZ);
    o.rotation.x = Math.PI / 2;

    scene.add(o);

    // Флаг для предотвращения повторного воспроизведения звука
    let soundPlayed = false;

    // Анимация падения с отслеживанием
    gsap.to(o.position, {
        y: boardOver,
        duration: 1,
        ease: "bounce.out",
        onUpdate: () => {
            if (!soundPlayed && o.position.y <= boardOver + 0.2) {
                stoneHitSound.play();
                soundPlayed = true;
            }
        }
    });
    return [o];
}

function makeFiguresJump(winners) {
    setTimeout(function () {
        winners.forEach(figures => {
            figures.forEach(figure => {
                if (figure) {
                    // Анимация с использованием GSAP
                    gsap.to(figure.position, {
                        y: figure.position.y + 0.7, // Поднимаем
                        duration: 0.3, // Длительность подъема
                        ease: "power1.out", // Плавное ускорение
                        yoyo: true, // Возврат в начальное положение
                        repeat: 1 // Одна итерация (вверх и вниз)
                    });
                }
            })
        })
    }, 1000);
}

// Освещение
const ambientLight = new THREE.AmbientLight(0xCDC0B3, 0.85);
scene.add(ambientLight);

// Усиленное боковое освещение
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5); // Увеличиваем интенсивность
directionalLight.position.set(3, 5, 2); // Позиция под углом для более выразительного теневого эффекта
directionalLight.castShadow = true;
scene.add(directionalLight);


// Функция рендеринга
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}