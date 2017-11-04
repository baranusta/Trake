var dummyPart = { draw: function () { }, shrink: function () { } };
class Snake {

    constructor(name, startPoint, direction) {
        this.name = name;
        this.speed = 0.002;

        this.program = initShaders(gl, 'vertex-shader', 'fragment-shader');
        this.program.length = gl.getUniformLocation(this.program, 'length');
        this.program.width = gl.getUniformLocation(this.program, 'width');
        this.program.frequency = gl.getUniformLocation(this.program, 'frequency');
        this.program.end = gl.getUniformLocation(this.program, 'end');
        this.program.orientation = gl.getUniformLocation(this.program, 'orientation');
        this.program.frame = gl.getUniformLocation(this.program, 'frame');

        this.program.viewSize = gl.getUniformLocation(this.program, 'viewSize');
        this.program.displacement = gl.getUniformLocation(this.program, 'displacement');

        var length = 0.7;
        var center = startPoint;
        switch (direction) {
            case DIRECTION.EAST:
                center[0] -= length / 2.0;
                break;
            case DIRECTION.WEST:
                center[0] += length / 2.0;
                break;
            case DIRECTION.NORTH:
                center[1] -= length / 2.0;
                break;
            case DIRECTION.SOUTH:
                center[1] += length / 2.0;
                break;
        }
        this.parts = [new SnakePart("0", center, 0.02, length, direction, this.program)];
        this.i_head = 0;
        this.i_tail = 0;
    }

    draw(frame) {
        this.parts.forEach(function (part) {
            part.draw(frame);
        });
    }

    updatePart(index, func){
        if(isHorizontal(this.parts[index].direction))
        {
            let speed = this.speed * viewSize[1]/viewSize[0]
            this.parts[index].move(speed);
            func(speed);
        }
        else
        {
            this.parts[index].move(this.speed);
            func(this.speed);
        }
    }

    update() {
        if(isHorizontal(this.parts[this.i_head].direction))
        {
            let speed = this.speed * viewSize[1]/viewSize[0]
            this.parts[this.i_head].move(speed);
            this.parts[this.i_head].grow(speed);
        }
        else
        {
            this.parts[this.i_head].move(this.speed);
            this.parts[this.i_head].grow(this.speed);
        }
        if(isHorizontal(this.parts[this.i_tail].direction))
        {
            let speed = this.speed * viewSize[1]/viewSize[0]
            this.parts[this.i_tail].move(speed);
            this.parts[this.i_tail].shrink(speed);
        }
        else
        {
            this.parts[this.i_tail].move(this.speed);
            this.parts[this.i_tail].shrink(this.speed);
        }
        if (this.parts[this.i_tail].length <= 0) {
            this.parts.splice(this.i_tail, 1);
            this.i_head--;
        }
    }

    turn(isRight) {
        var direction;
        if (isRight)
            direction = this.parts[this.i_head].direction + 1;
        else {
            direction = this.parts[this.i_head].direction - 1;
            direction += DIRECTION.COUNT;
        }

        direction %= DIRECTION.COUNT;
        var startPoint = add(this.parts[this.i_head].rectangle.displacement, this.parts[this.i_head].displacement);

        {
            let constant = isPositiveDir(this.parts[this.i_head].direction) ? +1 / 2.0 : -1 / 2.0;
            if (isHorizontal(this.parts[this.i_head].direction)) {
                startPoint[0] += this.parts[this.i_head].length * constant;
            }
            else
                startPoint[1] += this.parts[this.i_head].length * constant;
        }
        this.parts.push(new SnakePart("P_1", startPoint, 0.02, 0.0, direction, this.program));
        this.i_head = this.parts.length - 1;
    }
}
