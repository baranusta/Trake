class SpeedUp extends Power {

    constructor(center) {
        super(center);
        this.color = vec4(0.0, 1.0, 0.0, 1.0);
        this.name = "Speed Up x3";
        this.setMax(100);
    }

    usePower(snake) {
        super.usePower(
            function () {
                snake.speed *= 3;
            },
            function () {
                snake.speed /= 3;

            })
    }

    stop(snake) {
        snake.speed /= 3;
    }
}