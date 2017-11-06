
class SnakePart {

    constructor(name, center, size, direction, program) {
        this.name = name;
        this.displacement = center;
        this.direction = direction;
        this.length = size[1];

        this.width = size[0];
        this.rectangle = new Rectangle(program);
        this.collisionBox = new Box(this.displacement, size);
    }

    draw(frame) {
        this.rectangle.draw(frame, this.width, this.length, this.displacement, this.direction);
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
        if(updateSize > 0)
            this.grow(speed);
        else
            this.shrink(speed);
            
        this.collisionBox = new Box(this.displacement, [this.width, this.length]);
    }
}
