var dummyPart = {draw:function(){}, shrink:function(){}};
class Snake {
    
    constructor( name, starPoint, direction) {
        this.name = name;
        this.speed = direction == DIRECTON.EAST ? 1.0 : -1.0;

        this.program = initShaders( gl, 'vertex-shader', 'fragment-shader' );
        this.program.length = gl.getUniformLocation( this.program, 'length' );
        this.program.width = gl.getUniformLocation( this.program, 'width' );
        this.program.frequency = gl.getUniformLocation( this.program, 'frequency' );
        this.program.end = gl.getUniformLocation( this.program, 'end' );
        this.program.orientation = gl.getUniformLocation( this.program, 'orientation' );
        this.program.frame = gl.getUniformLocation( this.program, 'frame' );

        this.program.viewSize = gl.getUniformLocation( this.program, 'viewSize' );
        this.program.displacement = gl.getUniformLocation( this.program, 'displacement' );

        this.head = new SnakePart( "P_1", starPoint, 0.02, direction, this.program);
        this.tail = this.head;
        this.parts = [this.head];
    }

    draw(frame) {
        this.parts.forEach(function(part) {
            part.draw(frame);
        });

        if(this.tail !== this.head)
            this.tail.draw(frame);
    }

    update() {
        this.head.grow(this.speed);
        this.tail.shrink(this.speed);
    }
}
