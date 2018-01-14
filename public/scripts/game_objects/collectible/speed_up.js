class SpeedUp extends Power {

    constructor(center) {
        super(center);
        this.leftPower = 100;
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