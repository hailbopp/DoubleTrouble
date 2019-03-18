import * as DoubleTrouble from 'DoubleTrouble';

const injectionPoint = document.getElementById('doubletroubleApp');
if(!injectionPoint) {
    throw new Error("Could not find an element with id `doubletroubleApp`!");
}
DoubleTrouble.init(injectionPoint);