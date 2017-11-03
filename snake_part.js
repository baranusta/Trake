var DIRECTON = { EAST: 0, WEST: 1, NORTH: 2, SOUTH: 3 };
class SnakePart {

    constructor(name, center, width, direction, program) {
        this.name = name;
        this.speedY = 0.0;
        this.displacement = [0, 0];
        this.direction = direction;
        this.length = 0.7;

        this.width = width;
        this.rectangle = new Rectangle(center, program);
    }

    draw(frame) {
        this.rectangle.draw(frame,this.width, this.length, this.displacement, this.direction <= 1? 0:1);
    }

    grow(speed) {
        this.updateBody(speed);
    }

    shrink(speed) {
        this.updateBody(-1 * speed);
    }

    updateBody(speed) {
        switch (this.direction) {
            case DIRECTON.EAST:
                this.displacement[0] += speed / 2.0;
                this.length += speed;
                break;
            case DIRECTON.WEST:
                this.displacement[0] -= speed / 2.0;
                this.length += speed;
                break;
            case DIRECTON.NORTH:
                this.displacement[1] += speed / 2.0;
                this.length += speed;
                break;
            case DIRECTON.SOUTH:
                this.displacement[1] -= speed / 2.0;
                this.length += speed;
                break;
        }
    }
}
