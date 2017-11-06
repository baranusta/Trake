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
        this.program.offset = gl.getUniformLocation(this.program, 'offset');

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
        this.parts = [new SnakePart("0", center, [0.02, length], direction, this.program)];
        this.i_head = 0;
        this.i_tail = 0;
    }

    draw(frame) {
        this.parts.forEach(function (part) {
            part.draw(frame);
        });
    }

    getCollider(){
        return new Box(this.parts[this.i_head].displacement, [0.02,this.parts[this.i_head].length]);
    }

    eachCollisionBox(func){
        this.parts.forEach(function (part) {
            if(!func(part.collisionBox))
            {
                return;
            }
        });
    }

    isFirstPartsCollisionBox(collisionBox){
        return collisionBox === this.parts[this.i_head].collisionBox
    }

    update() {
        this.parts[this.i_head].move(this.speed, 1);
        this.parts[this.i_tail].move(this.speed, -1);
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
        var startPoint = vec2(this.parts[this.i_head].displacement[0], this.parts[this.i_head].displacement[1]);

        {
            let constant = isPositiveDir(this.parts[this.i_head].direction) ? +1 / 2.0 : -1 / 2.0;
            if (isHorizontal(this.parts[this.i_head].direction)) {
                startPoint[0] += this.parts[this.i_head].length * constant;
            }
            else
                startPoint[1] += this.parts[this.i_head].length * constant;
        }
        this.parts.push(new SnakePart("P_1", startPoint, [0.02, 0.0], direction, this.program));
        this.i_head = this.parts.length - 1;
    }
}
