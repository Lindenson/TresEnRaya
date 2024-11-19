// Загрузка шрифта
const fontLoader = new THREE.FontLoader();
let loadedFont;
fontLoader.load('./font.json', (font) => {
    loadedFont = font; // Сохраняем шрифт для последующего использования
});

// Функция создания падающей надписи
function createFallingText(text) {
    if (!loadedFont) {
        console.error("Шрифт ещё не загружен!");
        return;
    }

    // Создаем геометрию текста
    const textGeometry = new THREE.TextGeometry(text, {
        font: loadedFont,
        size: 0.4,          // Размер текста
        height: 0.1,        // Глубина текста
        curveSegments: 12,  // Количество сегментов для сглаживания
        bevelEnabled: true, // Включаем скос
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });

    const textMaterial = new THREE.MeshStandardMaterial({map: metalTexture});
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Начальная позиция текста над доской
    textMesh.position.set(-0.7, 5, 2.4); // Центрируем по X и Z
    textMesh.rotation.x = -Math.PI / 4.5; // Немного наклоняем к зрителю
    scene.add(textMesh);

    let soundPlayed = false;	

    // Анимация падения текста
    gsap.to(textMesh.position, {
        y: -0.2,  // Конечная позиция на доске
        duration: 2,
        ease: "bounce.out", // Эффект упругого падения
        onUpdate: () => {
	        if (!soundPlayed) {
                textHitSound.play();
                soundPlayed = true;
        }
    }});
}
