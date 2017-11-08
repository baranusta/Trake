
class SnakeHead extends Rectangle{

    constructor(center, size, direction) {
        super('snake-head-vertex-shader', 'snake-head-fragment-shader');
        this.displacement = center;
        this.direction = direction;
        this.size = size;
        this.resized_size = vec2(this.size);
        

        this.program.length = gl.getUniformLocation(this.program, 'length');
        this.program.width = gl.getUniformLocation(this.program, 'width');
        this.program.frequency = gl.getUniformLocation(this.program, 'frequency');
        this.program.end = gl.getUniformLocation(this.program, 'end');
        this.program.orientation = gl.getUniformLocation(this.program, 'orientation');
        this.program.offset = gl.getUniformLocation(this.program, 'offset');

        this.program.viewSize = gl.getUniformLocation(this.program, 'viewSize');
        this.program.displacement = gl.getUniformLocation(this.program, 'displacement');
        this.collider = {};
    }

    draw(frame) {
        super.draw(frame, this.resized_size[0],this.resized_size[1] , this.displacement, this.direction);
    }

    move(direction, speed) {
        this.direction = direction;
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
