
class SnakeHead extends RectangleGameObject {
    move(direction, speed) {
        this.direction = direction;
        super.move(direction, speed);
    }

    addTexture(texture) {

        const textureCoordinates = [
            // Top
            1.0, 0.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
            // Right
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            // Left
            0.0, 1.0,
            0.0, 0.0,
            1.0, 1.0,
            1.0, 0.0,
        ];

        this.rectangle.addTexture(texture, textureCoordinates);
    }
}
