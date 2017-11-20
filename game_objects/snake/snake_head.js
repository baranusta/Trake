
class SnakeHead extends RectangleGameObject{
    move(direction, speed) {
        this.direction = direction;
        super.move(direction, speed);
    }
}
