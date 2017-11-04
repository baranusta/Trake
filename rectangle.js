class Rectangle {

    constructor(center, program) {
        this.program = program;

        this.vao = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);

        this.displacement = center;

        let vertices = [
            vec2(0.5 / 2, 0.5),
            vec2(- 0.5 / 2, 0.5),
            vec2(0.5 / 2, -0.5),
            vec2(- 0.5 / 2, -0.5)
        ];

        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        this.vao_attr = gl.getAttribLocation(this.program, 'vPosition');
        gl.enableVertexAttribArray(this.vao_attr);
        gl.vertexAttribPointer(this.vao_attr, 2, gl.FLOAT, false, 0, 0);

        let indices = [0, 1, 2, 2, 1, 3];
        this.ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    }

    draw(frame, width, length, displacement, direction) {
        gl.useProgram(this.program);

        gl.uniform1i(this.program.frame, frame);
        gl.uniform1i(this.program.orientation, isHorizontal(direction));

        gl.uniform1f(this.program.length, length);
        gl.uniform1f(this.program.width, width);

        gl.uniform2f(this.program.viewSize, viewSize[0], viewSize[1]);

        let temp_displacement = add(displacement, this.displacement);
        
        {
            let end = vec2(temp_displacement[0],temp_displacement[1]);
            let constant = isPositiveDir(direction) ? +1 / 2.0 : -1 / 2.0;
            if (isHorizontal(direction)) {
                end[0] -= length * constant;
            }
            else
                end[1] -= length * constant;

            gl.uniform2f(this.program.end,
                end[0],
                end[1]
            );
        }

        gl.uniform2f(this.program.displacement,
            temp_displacement[0],
            temp_displacement[1]
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.enableVertexAttribArray(this.vao_attr);
        gl.vertexAttribPointer(this.vao_attr, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
}
