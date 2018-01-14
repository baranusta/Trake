class PerminentSpeedUp extends Power {

    constructor(center) {
        super(center);
        this.color = vec4(1.0, 0.0, 0.0, 1.0);
    }

    apply(snake){
        snake.speed *= 3;
        return true;
    }

    usePower(snake) {
    }
}