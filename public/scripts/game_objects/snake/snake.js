var dummyPart = { draw: function () { }, shrink: function () { } };
class Snake {

    constructor(name, startPoint, direction, color) {
        this.name = name;
        this.speed = snakeSpeed;
        this.color = color;
        this.dead = false;
        this.isUsingPower = false;

        var length = snakeInitialLength;
        var size = [snakeWidth, snakeInitialLength];
        var headSize = vec2(snakeHeadSize);
        var tailPos = vec2(startPoint);
        switch (direction) {
            case DIRECTION.EAST:
                tailPos[0] -= length / aspectRatio;
                size[1] /= aspectRatio;
                headSize[0] /= aspectRatio;
                break;
            case DIRECTION.WEST:
                tailPos[0] += length / aspectRatio;
                size[1] /= aspectRatio;
                headSize[0] /= aspectRatio;
                break;
            case DIRECTION.NORTH:
                tailPos[1] -= length;
                size[0] /= aspectRatio;
                headSize[0] /= aspectRatio;
                break;
            case DIRECTION.SOUTH:
                tailPos[1] += length;
                size[0] /= aspectRatio;
                headSize[0] /= aspectRatio;
                break;
        }

        this.parts = [new SnakePart("0", tailPos, size, direction)];
        this.i_first = 0;
        this.i_last = 0;

        this.head = new SnakeHead(startPoint, headSize, direction);
        this.head.changeDirection(direction);
        this.changingLength = this.parts[this.i_last].getLength();
    }

    draw(frame) {
        var color = this.color;
        this.parts.forEach(function (part) {
            part.draw(frame, color);
        });
        this.head.draw(frame, color);
    }

    getCollider() {
        return this.parts[this.i_first].collisionBox;
    }

    eachCollisionBox(func) {
        this.parts.forEach(function (part) {
            if (!func(part.collisionBox)) {
                return;
            }
        });
    }

    isFirstPartsCollisionBox(collisionBox) {
        if (collisionBox === this.parts[this.i_first].collisionBox)
            return true;
        return false;
    }

    usePower() {
        if (!!this.power && !this.isUsingPower) {
            this.power.usePower(this);
            this.isUsingPower = true;
            sendEvent("client-use-power", {index: playerIndex});
        }
    }

    stopUsingPower() {
        if (!!this.power) {
            this.isUsingPower = false;
            this.power.stop(this);
            sendEvent("client-stop-power", {index: playerIndex});
        }
    }

    update() {
        this.head.move(this.speed);

        this.parts[this.i_first].move(this.speed, 1);
        let length = this.parts[this.i_first].getLength();
        if (this.i_first !== this.i_last)
            length += this.parts[this.i_last].getLength();
        if (length >= this.changingLength)
            this.parts[this.i_last].move(this.speed, -1);

        if (this.parts[this.i_last].getLength() <= 0) {
            this.parts.splice(this.i_last, 1);
            this.i_first = this.parts.length - 1;
            this.changingLength = this.parts[this.i_last].getLength();
        }

        if (this.isUsingPower) {
            console.log(this.power.leftPower)
            let isFinished = !this.power.update();

            if(isFinished){
                this.power.stop(this);
                this.isUsingPower = false;
                this.power = null;
            }
        }
    }

    turn(isRight) {
        var direction;
        if (isRight)
            direction = this.parts[this.i_first].direction + 1;
        else {
            direction = this.parts[this.i_first].direction - 1;
            direction += DIRECTION.COUNT;
        }
        direction %= DIRECTION.COUNT;
        var startPoint = vec2(this.parts[this.i_first].center[0], this.parts[this.i_first].center[1]);
        var headStartPoint = vec2(startPoint);
        var size = [snakeWidth, snakeWidth * 2];
        {
            let constant = isPositiveDir(this.parts[this.i_first].direction) ? +1 / 2.0 : -1 / 2.0;
            if (isHorizontal(this.parts[this.i_first].direction)) {
                size[0] /= aspectRatio;
                startPoint[0] += (this.parts[this.i_first].getLength() - 2.0 * snakeWidth) * constant / aspectRatio;
                startPoint[1] += snakeWidth * (isPositiveDir(direction) ? +1 : -1);
                headStartPoint = vec2(startPoint);
                headStartPoint[1] += size[1] * (isPositiveDir(direction) ? +1 : -1);
            }
            else {
                size[1] /= aspectRatio;
                startPoint[0] += snakeWidth * (isPositiveDir(direction) ? +1 : -1) / aspectRatio;
                startPoint[1] += (this.parts[this.i_first].getLength() - 2.0 * snakeWidth) * constant;
                headStartPoint = vec2(startPoint);
                headStartPoint[0] += size[0] * (isPositiveDir(direction) ? +1 : -1);
            }
        }

        this.head.changeDirection(direction);
        this.head.setStartPoint(headStartPoint);
        if (this.i_last !== this.i_first)
            this.changingLength = this.changingLength - this.parts[this.i_first].getLength() - size[1];

        this.parts.push(new SnakePart("P_1", startPoint, size, direction));
        this.i_first = this.parts.length - 1;

    }
}
