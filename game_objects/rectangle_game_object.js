class RectangleGameObject{
    constructor(center, size, direction) {
        this.rectangle = new Rectangle('rectangle-vertex-shader', 'rectangle-fragment-shader');
        this.displacement = center;
        this.direction = direction;
        this.size = size;
        this.resized_size = vec2(this.size);
        

        this.rectangle.program.length = gl.getUniformLocation(this.rectangle.program, 'length');
        this.rectangle.program.width = gl.getUniformLocation(this.rectangle.program, 'width');
        this.rectangle.program.frequency = gl.getUniformLocation(this.rectangle.program, 'frequency');
        this.rectangle.program.end = gl.getUniformLocation(this.rectangle.program, 'end');
        this.rectangle.program.orientation = gl.getUniformLocation(this.rectangle.program, 'orientation');
        this.rectangle.program.offset = gl.getUniformLocation(this.rectangle.program, 'offset');

        this.rectangle.program.viewSize = gl.getUniformLocation(this.rectangle.program, 'viewSize');
        this.rectangle.program.displacement = gl.getUniformLocation(this.rectangle.program, 'displacement');
        this.collider = new Box(this.displacement, this.resized_size);
    }
    
    draw(frame) {
        this.rectangle.draw(frame, this.resized_size[0],this.resized_size[1] , this.displacement, this.direction);
    }

    move(direction, speed) {
        switch (direction) {
            case DIRECTION.EAST:
                speed = (speed * viewSize[1] / viewSize[0]);
                this.displacement[0] += speed;
                break;
            case DIRECTION.WEST:
                speed = (speed * viewSize[1] / viewSize[0]);
                this.displacement[0] -= speed;
                break;
            case DIRECTION.NORTH:
                this.displacement[1] += speed;
                break;
            case DIRECTION.SOUTH:
                this.displacement[1] -= speed;
                break;
        }

        if (isHorizontal(direction))
        {
            this.resized_size = vec2(this.size[1],this.size[0]);
            this.resized_size[0] *= viewSize[1] / viewSize[0];
        }
        else
        {
            this.resized_size = vec2(this.size[0],this.size[1]);
            this.resized_size[0] *= viewSize[1] / viewSize[0];
        }
        this.collider = new Box(this.displacement, this.resized_size);
    }
}