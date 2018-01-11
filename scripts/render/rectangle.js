class Rectangle {
    constructor(vertexShaderName, fragmenShaderName) {
        this.program = initShaders(gl, vertexShaderName, fragmenShaderName);

        this.program.viewSize = gl.getUniformLocation(this.program, 'viewSize');
        this.program.displacement = gl.getUniformLocation(this.program, 'displacement');
        this.program.orientation = gl.getUniformLocation(this.program, 'orientation');
        this.program.renderType = gl.getUniformLocation(this.program, 'renderType');
        this.program.offset = gl.getUniformLocation(this.program, 'offset');
        this.program.length = gl.getUniformLocation(this.program, 'length');
        this.program.width = gl.getUniformLocation(this.program, 'width');
        this.program.partHeadPos = gl.getUniformLocation(this.program, 'partHeadPos');
        this.program.color = gl.getUniformLocation(this.program, 'color');

        this.vao = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);

        let vertices = [
            vec2(0.5, 0.5),
            vec2(- 0.5, 0.5),
            vec2(0.5, -0.5),
            vec2(- 0.5, -0.5)
        ];

        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        this.vao_attr = gl.getAttribLocation(this.program, 'vPosition');
        this.tex_attr = gl.getAttribLocation(this.program, 'uvTexture');
        this.uSampler = gl.getAttribLocation(this.program, 'uSampler');

        let indices = [0, 1, 2, 2, 1, 3];
        this.ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.texture = null;
        this.textureOffset = 0;
    }

    addTexture(texture, textureCoordinates) {
        this.texture = texture;
        this.tex_CoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_CoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
            gl.STATIC_DRAW);
    }

    draw(frame, width, length, displacement, direction, color) {
        gl.useProgram(this.program);
        gl.uniform1i(this.program.orientation, isHorizontal(direction));
        gl.uniform1f(this.program.length, length);
        gl.uniform1f(this.program.width, width);

        gl.uniform2f(this.program.viewSize, viewSize[0], viewSize[1]);

        gl.uniform2f(this.program.displacement,
            displacement[0],
            displacement[1]
        );

        gl.uniform4f(this.program.color,
            color[0],
            color[1],
            color[2],
            color[3]
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.enableVertexAttribArray(this.vao_attr);
        gl.vertexAttribPointer(this.vao_attr, 2, gl.FLOAT, false, 0, 0);


        if (!!this.texture) {
            gl.uniform1i(this.program.renderType, 0);
            gl.activeTexture(gl.TEXTURE0);
            // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            // Tell the shader we bound the texture to texture unit 0
            //gl.uniform1i(this.uSampler, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_CoordBuffer);
            gl.enableVertexAttribArray(this.tex_attr);
            let textureIndex = 0;
            textureIndex += isHorizontal(direction) ? 2 : 0;
            textureIndex += isPositiveDir(direction) ? 0 : 1;
            gl.vertexAttribPointer(this.tex_attr, 2, gl.FLOAT, false, 0, 4 * 2 * textureIndex * 4);
        }
        else {
            gl.uniform1i(this.program.renderType, 1);
        }


        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
}
