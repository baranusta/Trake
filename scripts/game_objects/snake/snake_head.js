
class SnakeHead extends RectangleGameObject {
    constructor(startPoint, size, direction) {
        super(startPoint,size,direction);
        if(isHorizontal(direction))
            super.move(this.direction, -size[0]/2);
        else
            super.move(this.direction, -size[1]/2);
    }

    move(speed) {
        super.move(this.direction, speed);
    }

    changeDirection(direction){
        this.direction = direction;
    }

    setStartPoint(startPoint){
        this.displacement = vec2(startPoint);

        console.log(this.resized_size);
        if(isHorizontal(this.direction))
            super.move(this.direction, (-this.resized_size[0]/2)*aspectRatio );
        else
            super.move(this.direction, -this.resized_size[1]/2);
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
