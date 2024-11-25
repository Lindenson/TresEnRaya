import * as THREE from 'three';
import {move} from "./logic";
import {board, camera} from "./3d_board";

// Raycaster и вектор для хранения позиции курсора
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Обработчик нажатия мыши
function onMouseClick(event) {
    // Преобразование позиции курсора из экранных координат в нормализованные координаты устройства (от -1 до +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Определяем пересечение луча с объектом (доской)
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(board);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const localPoint = board.worldToLocal(intersect.point); // Получаем точку на доске в локальных координатах

        // Определяем ячейку 3x3
        const cellSize = 3.2 / 3; // Размер одной ячейки
        const row = Math.floor((localPoint.z + 3.2 / 2) / cellSize);
        const col = Math.floor((localPoint.x + 3.2 / 2) / cellSize);

        move(col, row);
    }
}

export {
    onMouseClick
}