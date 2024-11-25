import {createBoard, animate, renderer} from "./3d_board"
import {onMouseClick} from "./handlers"

const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

export function run(){
    document.addEventListener(touchEvent, onMouseClick, true);
    document.addEventListener('click', onMouseClick, false);
    document.body.appendChild(renderer.domElement);

    createBoard();
    animate();
}

