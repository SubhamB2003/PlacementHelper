import doneSound from '../assets/sounds/done.mp3';
import reactSounded from "../assets/sounds/react.wav";

export const successSound = () => {
    new Audio(doneSound).play();
}

export const reactSound = () => {
    new Audio(reactSounded).play();
}