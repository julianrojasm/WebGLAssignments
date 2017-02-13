/**
 * Created by Julian on 12/12/2016.
 */

    var gL;
    var shaderProgram;

    var triangleVertexPositionBuffer;
    var triangleIndexBuffer;
    var triangleNormalBuffer;
    var triangleTangentBuffer;
    var triangleBitangentBuffer;


    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    var vertices = [
    0, 1, 0,            //v0
    -.25, 0, 0,         //v1
    0.25, 0, 0 ];       //v2

    var indices =  [
        0, 1 , 2
    ];

    var texCoords = [
        0, 0,           //uv0
        0.25, 1,        //uv1
        0.5, 0          //uv2
    ];


//added for normal.png file
    var imageDictionary = {};
    var imagecount = 0;

//for eye vector
//     var cameraRadius = 1.5;
//     var eye = [
//         0, 0, 1.5
//     ];



    var tangents = [];
    var bitangents = [];
    var normals = [];

    var deltaPos1 = vec3.create();
    var deltaPos2 = vec3.create();

    var deltaUV1 = vec2.create();
    var deltaUV2 = vec2.create();
    var normal = vec3.create();
    var tangent = vec3.create();
    var bitangent = vec3.create();



    //var texture;

    function getNormal()
    {
        deltaPos1 = vec3.fromValues( vertices[3] - vertices[0], vertices[4] - vertices[1], vertices[5] - vertices[2] );
        console.log(deltaPos1);

        deltaPos2 = vec3.fromValues( vertices[6] - vertices[0], vertices[7] - vertices[1], vertices[8] - vertices[2] );
        //console.log(deltaPos2);


        vec3.cross(normal,deltaPos2, deltaPos1);

        //console.log(normal[0]);
        //console.log(deltaPos1);




        //console.log(normal);

        normals.push(normal[0]);
        normals.push(normal[1]);
        normals.push(normal[2]);
        normals.push(normal[0]);
        normals.push(normal[1]);
        normals.push(normal[2]);
        normals.push(normal[0]);
        normals.push(normal[1]);
        normals.push(normal[2]);

        //console.log(normals);
    }
    //deltaUV1 = uv1-uv0;
    //deltaUV2 = uv2-uv0;
    function getUvs()
    {
        deltaUV1 = vec2.fromValues(texCoords[2] - texCoords[0], texCoords[3] - texCoords[1] );

        console.log("delta1: " + deltaUV1);

        deltaUV2 = vec2.fromValues(texCoords[4] - texCoords[0], texCoords[5] - texCoords[1] );
        console.log("delta2: " + deltaUV2);
    }

    function getTanBitan()
    {
        var r = ( 1.0 / ( ( deltaUV1[0] * deltaUV2[1] )  - ( deltaUV1[1] * deltaUV2[0] ) ) );
        console.log("r: " + r);

        //tangent = (deltaPos1 * deltaUV2[1] - deltaPos2 * deltaUV1[1]) * r;
        tangent[0] = (deltaPos1[0] * deltaUV2[1] - deltaPos2[0] * deltaUV1[1]) * r;
        tangent[1] = (deltaPos1[1] * deltaUV2[1] - deltaPos2[1] * deltaUV1[1]) * r;
        tangent[2] = (deltaPos1[2] * deltaUV2[1] - deltaPos2[2] * deltaUV1[1]) * r;

        console.log("tangent: " + tangent);
        //bitangent = ( deltaPos2 * deltaUV1[0] - deltaPos1 * deltaUV2[0]) * r;

        bitangent[0] = ( deltaPos2[0] * deltaUV1[0] - deltaPos1[0] * deltaUV2[0]) * r;
        bitangent[1] = ( deltaPos2[1] * deltaUV1[0] - deltaPos1[1] * deltaUV2[0]) * r;
        bitangent[2] = ( deltaPos2[2] * deltaUV1[0] - deltaPos1[2] * deltaUV2[0]) * r;

        console.log("bitangent: " + bitangent);


        tangents.push(tangent[0]);
        tangents.push(tangent[1]);
        tangents.push(tangent[2]);
        tangents.push(tangent[0]);
        tangents.push(tangent[1]);
        tangents.push(tangent[2]);
        tangents.push(tangent[0]);
        tangents.push(tangent[1]);
        tangents.push(tangent[2]);
        bitangents.push(bitangent[0]);
        bitangents.push(bitangent[1]);
        bitangents.push(bitangent[2]);
        bitangents.push(bitangent[0]);
        bitangents.push(bitangent[1]);
        bitangents.push(bitangent[2]);
        bitangents.push(bitangent[0]);
        bitangents.push(bitangent[1]);
        bitangents.push(bitangent[2]);

        console.log(normals);
        console.log(tangents);
        console.log(bitangents);
    }

    function initGL(canvasId) {
        try {
            gL = canvasId.getContext("experimental-webgl");
            gL.viewportWidth = canvasId.width;
            gL.viewportHeight = canvasId.height;
        } catch (e) {
            if (!gL) {
                alert("Could not initialize webGL");
            }
        }
    }

    function getShader(gl, id) {

        var shaderScript = document.getElementById(id);

        if (!shaderScript) {
            alert("No shaderscript found!");
            return null;
        }
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            //alert("Fragment created!");
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
            //alert("Vertex created!");
        } else {
            alert("No shader created!");
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("DID NOT COMPILE!");
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }


    function initShader() {
        var vertexShader = getShader(gL, "vertex-shader-code");
        var fragmentShader = getShader(gL, "fragment-shader-code");


        shaderProgram = gL.createProgram();
        gL.attachShader(shaderProgram, vertexShader);
        gL.attachShader(shaderProgram, fragmentShader);
        gL.linkProgram(shaderProgram);

        if (!gL.getProgramParameter(shaderProgram, gL.LINK_STATUS)) {
            alert("could not initialize shader!");
        }


        //for the Vertex Shader
        shaderProgram.positionAttribute = gL.getAttribLocation(shaderProgram, "position");      //0
        shaderProgram.tangentAttribute = gL.getAttribLocation(shaderProgram, "tangent");        //1
        shaderProgram.bitangentAttribute = gL.getAttribLocation(shaderProgram, "bitangent");    //2
        shaderProgram.normalAttribute = gL.getAttribLocation(shaderProgram, "normal");          //3
        shaderProgram.texCoordAttribute = gL.getAttribLocation(shaderProgram, "texCoord");      //4

        shaderProgram.texCoordFlagUniform = gL.getUniformLocation(shaderProgram, "texCoordFlag");
        shaderProgram.modelMatrixUniform = gL.getUniformLocation(shaderProgram, "modelMatrix");
        shaderProgram.viewProjectionMatrixUniform = gL.getUniformLocation(shaderProgram, "viewProjectionMatrix");
        shaderProgram.normalMatrixUniform = gL.getUniformLocation(shaderProgram, "normalMatrix");

        //for testing color in each triangle
        shaderProgram.ambientColorUniform = gL.getUniformLocation(shaderProgram, "uAmbientColor");


        //for the Fragment Shader
        //shaderProgram.diffuseMapUniform = gL.getUniformLocation(shaderProgram, "diffuseMap");
        shaderProgram.normalMapUniform = gL.getUniformLocation(shaderProgram, "normalMap");



        shaderProgram.I0Uniform = gL.getUniformLocation(shaderProgram, "I0");
        shaderProgram.eyeUniform = gL.getUniformLocation(shaderProgram, "eye");
        shaderProgram.lUniform = gL.getUniformLocation(shaderProgram, "L");
        shaderProgram.kdUniform = gL.getUniformLocation(shaderProgram, "kd");

        shaderProgram.ksUniform = gL.getUniformLocation(shaderProgram, "ks");
        shaderProgram.shininessUniform = gL.getUniformLocation(shaderProgram, "shininess");


    }

    function setMatrixUniforms() {

        gL.useProgram(shaderProgram);
        gL.uniformMatrix4fv(shaderProgram.viewProjectionMatrixUniform, false, pMatrix);
        gL.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mvMatrix);

        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, mvMatrix);
        gL.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);
}


    function drawScene()
    {
        gL.viewport(0, 0, gL.viewportWidth, gL.viewportHeight);
        gL.clear(gL.COLOR_BUFFER_BIT | gL.DEPTH_BUFFER_BIT);

        if (triangleVertexPositionBuffer == null || triangleIndexBuffer == null || triangleNormalBuffer == null) {
            return;
        }

        mat4.perspective(pMatrix, 45, gL.viewportWidth / gL.viewportHeight, 0.1, 100.0);

        gL.useProgram(shaderProgram);

        initialAngle = 0;
        stepAngle = 7.2;

        //TEXTUREEEEEEE
        //var normalTexture = imageDictionary["normal2.jpg"];
         var normalTexture = imageDictionary["normal.png"];
        //console.log("NormalTexture: " + normalTexture);
        gL.activeTexture(gL.TEXTURE0 + 1);
        gL.bindTexture(gL.TEXTURE_2D, normalTexture);



        for ( i = 0; i < 50; i++) {

            mat4.identity(mvMatrix);
            mat4.translate(mvMatrix, mvMatrix, [0, 0, -20]);
            mat4.scale(mvMatrix, mvMatrix, [10, 10, 3]);
            mat4.rotate(mvMatrix, mvMatrix, initialAngle, [0, 0, 1]);


            initialAngle += stepAngle;

            gL.enableVertexAttribArray(shaderProgram.positionAttribute);
            gL.enableVertexAttribArray(shaderProgram.normalAttribute);
            gL.enableVertexAttribArray(shaderProgram.tangentAttribute);
            gL.enableVertexAttribArray(shaderProgram.bitangentAttribute);
            gL.enableVertexAttribArray(shaderProgram.texCoordAttribute);

            //console.log(shaderProgram.positionAttribute);   //0
            //console.log(shaderProgram.bitangentAttribute);  //2
            //console.log(shaderProgram.tangentAttribute);    //1
            //console.log(shaderProgram.normalAttribute);     //3

            //console.log("vertices: " + vertices.length);
            //console.log("indices: " + indices.length);
            //console.log("normals: " + normals.length);
            //console.log("tangents: " + tangents.length);
            //console.log("bitangents: " + bitangents.length);

            gL.uniform3f(shaderProgram.ambientColorUniform, colors[3*i], colors[3*i + 1], colors[3*i + 2]);
            gL.uniform3f(shaderProgram.I0Uniform, 1, 1, 1);
            gL.uniform3f(shaderProgram.eyeUniform, 0, 0, 1.5);
            gL.uniform4f(shaderProgram.lUniform, 0, 0, 100, 1);
            gL.uniform3f(shaderProgram.kdUniform, 1, 1, 1);
            gL.uniform3f(shaderProgram.ksUniform, 0, 0, 0);

            gL.uniform1f(shaderProgram.shininessUniform, 10);

            gL.uniform1i(shaderProgram.texCoordFlagUniform, 1);

            //texture
            gL.uniform1i(shaderProgram.normalMapUniform, 1);


            //position
            gL.bindBuffer(gL.ARRAY_BUFFER, triangleVertexPositionBuffer);
            gL.vertexAttribPointer(shaderProgram.positionAttribute, triangleVertexPositionBuffer.itemSize, gL.FLOAT, false, 0, 0);
            //normal
            gL.bindBuffer(gL.ARRAY_BUFFER, triangleNormalBuffer);
            gL.vertexAttribPointer(shaderProgram.normalAttribute, triangleNormalBuffer.itemSize, gL.FLOAT, false, 0, 0);
            //tangent
            gL.bindBuffer(gL.ARRAY_BUFFER, triangleTangentBuffer);
            gL.vertexAttribPointer(shaderProgram.tangentAttribute, triangleTangentBuffer.itemSize, gL.FLOAT, false, 0, 0);
            //bitangent
            gL.bindBuffer(gL.ARRAY_BUFFER, triangleBitangentBuffer);
            gL.vertexAttribPointer(shaderProgram.bitangentAttribute, triangleBitangentBuffer.itemSize, gL.FLOAT, false, 0, 0);

            //texCoord
            gL.bindBuffer(gL.ARRAY_BUFFER, triangleTexCoordBuffer);
            gL.vertexAttribPointer(shaderProgram.texCoordAttribute, triangleTexCoordBuffer.itemSize, gL.FLOAT, false, 0, 0);

            //gL.uniformMatrix4fv(shaderProgram.viewProjectionMatrixUniform, false, pMatrix);
            //gL.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mvMatrix);

            setMatrixUniforms();
            gL.bindBuffer(gL.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
            gL.drawElements(gL.TRIANGLES, triangleIndexBuffer.numItems, gL.UNSIGNED_SHORT, 0);

        }
        //console.log(triangleIndexBuffer.length);
    }

    var colors = [];

    for(i = 0; i < 50; i++)
    {
        colors[3*i] = Math.random();
        colors[3*i + 1] = Math.random();
        colors[3*i + 2] = Math.random();
    }

    function triangle()
    {



        ///POSITION
        triangleVertexPositionBuffer = gL.createBuffer();
        gL.bindBuffer(gL.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gL.bufferData(gL.ARRAY_BUFFER,  new Float32Array(vertices), gL.STATIC_DRAW);

        triangleVertexPositionBuffer.itemSize = 3;
        triangleVertexPositionBuffer.numItems = vertices.length / 3;

        //console.log(vertices.length);

        //NORMALS
        triangleNormalBuffer = gL.createBuffer();
        gL.bindBuffer(gL.ARRAY_BUFFER, triangleNormalBuffer);
        gL.bufferData(gL.ARRAY_BUFFER,  new Float32Array(normals), gL.STATIC_DRAW);

        triangleNormalBuffer.itemSize = 3;
        triangleNormalBuffer.numItems = normals.length / 3;

        //console.log(normals.length);

        //TANGENTS
        triangleTangentBuffer = gL.createBuffer();
        gL.bindBuffer(gL.ARRAY_BUFFER, triangleTangentBuffer);
        gL.bufferData(gL.ARRAY_BUFFER,  new Float32Array(tangents), gL.STATIC_DRAW);

        triangleTangentBuffer.itemSize = 3;
        triangleTangentBuffer.numItems = tangents.length / 3;

        //console.log(tangents.length);


        //BITANGENTS
        triangleBitangentBuffer = gL.createBuffer();
        gL.bindBuffer(gL.ARRAY_BUFFER, triangleBitangentBuffer);
        gL.bufferData(gL.ARRAY_BUFFER,  new Float32Array(bitangents), gL.STATIC_DRAW);

        triangleBitangentBuffer.itemSize = 3;
        triangleBitangentBuffer.numItems = bitangents.length / 3;

        //console.log(bitangents.length);


        //TEXTURE COORDINATES
        triangleTexCoordBuffer = gL.createBuffer();
        gL.bindBuffer(gL.ARRAY_BUFFER, triangleTexCoordBuffer);
        gL.bufferData(gL.ARRAY_BUFFER, new Float32Array(texCoords), gL.STATIC_DRAW);

        triangleTexCoordBuffer.itemSize = 2;
        triangleTexCoordBuffer.numItems = texCoords.length / 2;



        ///INDEX
        triangleIndexBuffer = gL.createBuffer();
        gL.bindBuffer(gL.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
        gL.bufferData(gL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gL.STATIC_DRAW);

        triangleIndexBuffer.itemSize = 1;
        triangleIndexBuffer.numItems = indices.length;




        //console.log(triangleVertexPositionBuffer.itemSize);
        //console.log(triangleVertexPositionBuffer.numItems);
        //console.log(triangleIndexBuffer.itemSize);
        //console.log(triangleIndexBuffer.numItems);



    }


    function tick() {
        requestAnimFrame(tick);
        //console.log(imagecount);
        if(imagecount == 0) {
            drawScene();
        }
    }

    function main()
    {
        var canvasId = document.getElementById("Canvas");

        initGL(canvasId);
        initShader();
        getNormal();
        getUvs();
        getTanBitan();


        //normalTex = createTextureFrom2DImageNew(gL,"normal2.jpg");
         normalTex = createTextureFrom2DImageNew(gL,"normal.png");

        //console.log(normals.length);
        //console.log(tangents.length);
        //console.log(bitangents.length);


        triangle();

        gL.clearColor(0.0, 0.3, 0.0, 1.0);
        gL.enable(gL.DEPTH_TEST);


        tick();

        //drawScene();

    }

function createTextureFrom2DImageNew(gL,textureFileName)
{
    function completeTexture(imgData)
    {
        gL.bindTexture(gL.TEXTURE_2D, tex);
        gL.pixelStorei(gL.UNPACK_FLIP_Y_WEBGL,true);
        gL.texImage2D(gL.TEXTURE_2D, 0, gL.RGBA, gL.RGBA, gL.UNSIGNED_BYTE, imgData);
        gL.texParameteri(gL.TEXTURE_2D, gL.TEXTURE_MAG_FILTER, gL.LINEAR);
        gL.texParameteri(gL.TEXTURE_2D, gL.TEXTURE_MIN_FILTER, gL.LINEAR_MIPMAP_LINEAR);
        gL.texParameteri(gL.TEXTURE_2D, gL.TEXTURE_WRAP_S, gL.REPEAT);//gL.CLAMP_TO_EDGE
        gL.texParameteri(gL.TEXTURE_2D, gL.TEXTURE_WRAP_T, gL.REPEAT);//gL.CLAMP_TO_EDGE
        gL.generateMipmap(gL.TEXTURE_2D);
        gL.bindTexture(gL.TEXTURE_2D, null);
    }
    function isPowerOfTwo(x) {
        return (x & (x - 1)) == 0;
    }
    function nextHighestPowerOfTwo(x) {
        --x;
        for (var i = 1; i < 32; i <<= 1) {
            x = x | x >> i;
        }
        return x + 1;
    }

    if (textureFileName){
        //console.log(textureFileName);
        var tex=imageDictionary[textureFileName];
        if (tex) return tex;
        tex = gL.createTexture();
        imageDictionary[textureFileName] = tex;
        tex.width = 0; tex.height = 0;
        var img = new Image();
        imagecount++;
        img.onload = function(){
            //console.log("image loaded. Size: "+img.width+"x"+img.height);
            if (!isPowerOfTwo(img.width) || !isPowerOfTwo(img.height)) {
                // Scale up the texture to the next highest power of two dimensions.
                var canvas = document.createElement("canvas");
                canvas.width = nextHighestPowerOfTwo(img.width);
                canvas.height = nextHighestPowerOfTwo(img.height);
                //console.log(canvas.width+"x"+canvas.height);
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                img = canvas;
            }
            completeTexture(img);
            tex.complete = true;
            imagecount--;
        };
        img.onerror = function() {
            console.log("ERROR: "+textureFileName+" does not exist or can not load.");
            imagecount--;
        };
        img.src = textureFileName;
        return tex;
    }
    else {
        console.log("ERROR: Texture File does not exist.");
        return null;
    }
}





















































