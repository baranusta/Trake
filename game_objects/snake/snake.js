var dummyPart = { draw: function () { }, shrink: function () { } };
class Snake {

    constructor(name, startPoint, direction) {
        this.name = name;
        this.speed = 0.002;


        var length = snakeInitialLength;
        var center = vec2(startPoint);
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
        this.parts = [new SnakePart("0", center, [snakeWidth, length], direction)];
        this.i_first = 0;
        this.i_last = 0;
        this.head = new SnakeHead(startPoint, [0.1, 0.1], direction);
        this.head.move(direction,0);
        this.changingLength = this.parts[this.i_last].length;
    }

    draw(frame) {
        //this.head.draw(frame);
        this.parts.forEach(function (part) {
            part.draw(frame);
        });
    }

    getCollider() {
        return this.head.collider;
    }

    eachCollisionBox(func) {
        if(!func(this.head.collider))
            return;

        this.parts.forEach(function (part) {
            if (!func(part.collisionBox)) {
                return;
            }
        });
    }

    isFirstPartsCollisionBox(collisionBox) {
        if (this.head.collider === collisionBox || collisionBox === this.parts[this.i_first].collisionBox)
            return true;
        if (this.parts.length >= 2 && collisionBox === this.parts[this.i_first - 1].collisionBox)
            return true;
        return false;
    }

    update() {
        this.head.move(this.parts[this.i_first].direction, this.speed);

        this.parts[this.i_first].move(this.speed, 1);
        let length = this.parts[this.i_first].length;
        if(this.i_first !== this.i_last)
            length += this.parts[this.i_last].length;
        if(length > this.changingLength)
            this.parts[this.i_last].move(this.speed, -1);
            
        if (this.parts[this.i_last].length <= 0) {
            this.parts.splice(this.i_last, 1);
            this.i_first--;
            this.changingLength = this.parts[this.i_last].length;
        }
    }

    turn(isRight) {

        if((isHorizontal(this.parts[this.i_first].direction) && this.parts[this.i_first].length < snakeWidth * 2 / aspectRatio)
            || this.parts[this.i_first].length < snakeWidth * 2)
        {
            return;
        }
            
        var direction;
        if (isRight)
            direction = this.parts[this.i_first].direction + 1;
        else {
            direction = this.parts[this.i_first].direction - 1;
            direction += DIRECTION.COUNT;
        }
        direction %= DIRECTION.COUNT;
        var startPoint = vec2(this.parts[this.i_first].displacement[0], this.parts[this.i_first].displacement[1]);

        {
            let constant = isPositiveDir(this.parts[this.i_first].direction) ? +1 / 2.0 : -1 / 2.0;
            if (isHorizontal(this.parts[this.i_first].direction)) {
                startPoint[0] += (this.parts[this.i_first].length + 2.0 * snakeWidth / aspectRatio) * constant;
                startPoint[1] -= snakeWidth * (isPositiveDir(direction) ? +1  : -1);
            }
            else{
                startPoint[0] -= snakeWidth * (isPositiveDir(direction) ? +1 : -1) / aspectRatio;
                startPoint[1] += (this.parts[this.i_first].length + 2.0 * snakeWidth) * constant;           
            }
        }



        if(true){
            
            if(this.i_last !== this.i_first)
            this.changingLength = this.changingLength - this.parts[this.i_first].length;

            this.parts.push(new SnakePart("P_1", startPoint, [snakeWidth, 0.0], direction));
            this.i_first = this.parts.length - 1;
        
        }
    }
}
