class RectangleGameObject {
    constructor(center, size, direction, color) {
        this.rectangle = new Rectangle('rectangle-vertex-shader', 'rectangle-fragment-shader');
        this.displacement = center;
        this.direction = direction;
        this.size = size;
        this.resized_size = vec2(this.size);

        this.rectangle.program.frequency = gl.getUniformLocation(this.rectangle.program, 'frequency');
        this.collider = new Box(this.displacement, this.resized_size);
    }

    draw(frame, color) {
        this.rectangle.draw(frame, this.resized_size[0], this.resized_size[1], this.displacement, this.direction, color);
    }

    move(direction, speed) {
        switch (direction) {
            case DIRECTION.EAST:
                speed /= aspectRatio;
                this.displacement[0] += speed;
                break;
            case DIRECTION.WEST:
                speed /= aspectRatio;
                this.displacement[0] -= speed;
                break;
            case DIRECTION.NORTH:
                this.displacement[1] += speed;
                break;
            case DIRECTION.SOUTH:
                this.displacement[1] -= speed;
                break;
        }

        // if (isHorizontal(direction)) {
        //     this.resized_size = vec2(this.size[1], this.size[0]);
        //     this.resized_size[1] /= aspectRatio;
        // }
        // else {
        //     this.resized_size = vec2(this.size[0], this.size[1]);
        //     this.resized_size[1] /= aspectRatio;
        // }
    }
}