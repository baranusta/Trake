
var DIRECTION = { EAST: 0, WEST: 2, NORTH: 3, SOUTH: 1, COUNT: 4 }
isHorizontal = function (direction) {
    return direction % 2 == 0 ? 1 : 0;
}
isPositiveDir = function (direction) {
    return direction == DIRECTION.NORTH || direction == DIRECTION.EAST ? true : false;
}