
class SnakePart {

    constructor(name, center, width, length, direction, program) {
        this.name = name;
        this.displacement = vec2(0, 0);
        this.direction = direction;
        this.length = length;

        this.width = width;
        this.rectangle = new Rectangle(center, program);
    }

    draw(frame) {
        this.rectangle.draw(frame,this.width, this.length, this.displacement, this.direction);
    }

    grow(speed) {
        this.length += speed;
    }

    shrink(speed) {
        this.length -= speed;
    }

    move(speed){
        switch (this.direction) {
            case DIRECTION.EAST:
                this.displacement[0] += speed / 2.0;
                break;
            case DIRECTION.WEST:
                this.displacement[0] -= speed / 2.0;
                break;
            case DIRECTION.NORTH:
                this.displacement[1] += speed / 2.0;
                break;
            case DIRECTION.SOUTH:
                this.displacement[1] -= speed / 2.0;
                break;
        }
    }
}
