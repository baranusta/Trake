
class SnakePart extends Rectangle {

    constructor(name, tail_pos, size, direction, color) {
        super('snake-vertex-shader', 'snake-fragment-shader');
        this.name = name;
        this.direction = direction;
        this.center = vec2(tail_pos);
        this.startPos = vec2(tail_pos);

        console.log(size);
        switch (this.direction) {
            case DIRECTION.EAST:
                this.center[0] = this.startPos[0] + size[1] / 2.0;
                this.startPos[0] += size[1];
                
                this.size = { 0: size[1], 1: size[0] };
                this.lengthVar = 0;
                this.widthVar = 1;
                break;
            case DIRECTION.WEST:
                this.center[0] = this.startPos[0] - size[1] / 2.0;
                this.startPos[0] -= size[1];
                this.size = { 0: size[1], 1: size[0] };
                this.lengthVar = 0;
                this.widthVar = 1;
                break;
            case DIRECTION.NORTH:
                this.center[1] = this.startPos[1] + size[1] / 2.0;
                this.startPos[1] += size[1];
                this.size = { 0: size[0], 1: size[1] };
                this.lengthVar = 1;
                this.widthVar = 0;
                break;
            case DIRECTION.SOUTH:
                this.center[1] = this.startPos[1] - size[1] / 2.0;
                this.startPos[1] -= size[1];
                this.size = { 0: size[0], 1: size[1] };
                this.lengthVar = 1;
                this.widthVar = 0;
                break;
        }
        this.collisionBox = new Box(this.center, this.size);

    }

    getLength() {
        if (isHorizontal(this.direction))
            return this.size[this.lengthVar] * aspectRatio;
        return this.size[this.lengthVar];
    }

    draw(frame, color) {

        gl.useProgram(this.program);
        {
            let offset = frame;
            if (!isPositiveDir(this.direction)) {
                offset *= -1;
            }

            gl.uniform2f(this.program.partHeadPos,
                this.startPos[0],
                this.startPos[1]
            );
            gl.uniform1i(this.program.offset, offset);
        }
        super.draw(frame, this.size[this.widthVar], this.size[this.lengthVar], this.center, this.direction, color);
    }

    grow(speed) {
        this.size[this.lengthVar] += speed;
        switch (this.direction) {
            case DIRECTION.EAST:
                this.startPos[0] += speed;
                break;
            case DIRECTION.WEST:
                this.startPos[0] -= speed;
                break;
            case DIRECTION.NORTH:
                this.startPos[1] += speed;
                break;
            case DIRECTION.SOUTH:
                this.startPos[1] -= speed;
                break;
        }
    }

    shrink(speed) {
        this.size[this.lengthVar] -= speed;

    }

    move(speed, updateSize) {
        switch (this.direction) {
            case DIRECTION.EAST:
                speed /= aspectRatio;
                this.center[0] += speed / 2.0;
                break;
            case DIRECTION.WEST:
                speed /= aspectRatio;
                this.center[0] -= speed / 2.0;
                break;
            case DIRECTION.NORTH:
                this.center[1] += speed / 2.0;
                break;
            case DIRECTION.SOUTH:
                this.center[1] -= speed / 2.0;
                break;
        }
        if (updateSize > 0)
            this.grow(speed);
        else
            this.shrink(speed);
    }
}
