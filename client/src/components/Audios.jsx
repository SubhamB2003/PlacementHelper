import doneSound from '../assets/sounds/done.mp3';

export const successSound = () => {
    new Audio(doneSound).play();
}