
class SnakePart extends Rectangle {

    constructor(name, center, size, direction) {
        super('snake-vertex-shader', 'snake-fragment-shader');
        this.program.length = gl.getUniformLocation(this.program, 'length');
        this.program.width = gl.getUniformLocation(this.program, 'width');
        this.program.end = gl.getUniformLocation(this.program, 'end');
        this.program.orientation = gl.getUniformLocation(this.program, 'orientation');
        this.program.offset = gl.getUniformLocation(this.program, 'offset');

        this.program.viewSize = gl.getUniformLocation(this.program, 'viewSize');
        this.program.displacement = gl.getUniformLocation(this.program, 'displacement');

        this.name = name;
        this.displacement = center;
        this.direction = direction;
        this.length = size[1];
        this.width = size[0];

        if (isHorizontal(direction))
        {
            this.length *= viewSize[1] / viewSize[0];
        }else
        {
            this.width *= viewSize[1] / viewSize[0];
        }
        
        this.collisionBox = new Box(this.displacement, size);
    }

    draw(frame) {

        gl.useProgram(this.program);
        {
            let end = vec2(0);
            let offset = frame;
            let constant = 1 / 2.0;
            if (!isPositiveDir(this.direction)) {
                offset *= -1;
                constant *= -1;
            }
            if (isHorizontal(this.direction)) {
                end[0] = this.displacement[0] - this.length * constant;
                end[1] = this.displacement[1];
            }
            else {
                end[1] = this.displacement[1] - this.length * constant;
                end[0] = this.displacement[0];
            }

            gl.uniform2f(this.program.end,
                end[0],
                end[1]
            );
            gl.uniform1i(this.program.offset, offset);
        }
        super.draw(frame, this.width, this.length, this.displacement, this.direction);
    }

    grow(speed) {
        this.length += speed;
    }

    shrink(speed) {
        this.length -= speed;
    }

    move(speed, updateSize) {
        switch (this.direction) {
            case DIRECTION.EAST:
                speed = (speed * viewSize[1] / viewSize[0]);
                this.displacement[0] += speed / 2.0;
                break;
            case DIRECTION.WEST:
                speed = (speed * viewSize[1] / viewSize[0]);
                this.displacement[0] -= speed / 2.0;
                break;
            case DIRECTION.NORTH:
                this.displacement[1] += speed / 2.0;
                break;
            case DIRECTION.SOUTH:
                this.displacement[1] -= speed / 2.0;
                break;
        }
        if (updateSize > 0)
            this.grow(speed);
        else
            this.shrink(speed);

        var boxSize;
        if (isHorizontal(this.direction))
        {
            boxSize = [this.length * viewSize[1] / viewSize[0], this.width];
        }
        else
        {
            boxSize = [this.width * viewSize[1] / viewSize[0], this.length];
        }
        console.log(boxSize);
        this.collisionBox = new Box(this.displacement, boxSize);
    }
}
