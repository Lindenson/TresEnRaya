// Заполнение доски крестиками и ноликами
createBoard();

// Добавляем слушатель события нажатия мыши
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
document.addEventListener(touchEvent, onMouseClick, true);
document.addEventListener('click', onMouseClick, false);


animate();