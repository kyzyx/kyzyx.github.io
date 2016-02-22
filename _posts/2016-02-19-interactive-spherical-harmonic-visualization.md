---
layout: post
title: "Interactive Spherical Harmonic Visualization"
description: ""
category: 
tags: [interactive]
customjs:
    - https://cdnjs.cloudflare.com/ajax/libs/three.js/r74/three.min.js
    - threejs_trackballcontrols.js
    - sh/shpoly.js
    - sh/sh.js
customstyles:
    - sh/shtabs.css
    - sh/sliders.css
---
{% include JB/setup %}

Here's an interactive demo that lets you visualize spherical harmonics approximations, 
up to 5 bands. You can interactively slide the coefficients for the first three bands,
while the other two bands can be set using the manual text entry button.

Don't know what spherical harmonics are? Wait for the next post for a primer.

<script id="SHShapeVertexShader" type="x-shader/x-vertex">
        uniform float sh[36];
        uniform float shc[36];
        varying vec4 color;
        varying vec3 vnormal;
        void main() {
            vec3 p = position;
            float x2 = p.x*p.x;
            float y2 = p.y*p.y;
            float z2 = p.z*p.z;
            float r = 
                sh[0]*shc[0] +

                sh[1]*shc[1]*p.y +
                sh[2]*shc[2]*p.z +
                sh[3]*shc[3]*p.x +

                sh[4]*shc[4]*p.x*p.y +
                sh[5]*shc[5]*p.y*p.z +
                sh[6]*shc[6]*(3.*z2-1.) +
                sh[7]*shc[7]*p.x*p.z +
                sh[8]*shc[8]*(x2-y2) +

                sh[9]*shc[9]*p.y*(3.*x2-y2) +
                sh[10]*shc[10]*p.x*p.y*p.z +
                sh[11]*shc[11]*p.y*(5.*z2-1.) +
                sh[12]*shc[12]*p.z*(5.*z2-3.) +
                sh[13]*shc[13]*p.x*(5.*z2-1.) +
                sh[14]*shc[14]*p.z*(x2-y2) +
                sh[15]*shc[15]*p.x*(x2-3.*y2) +

                sh[16]*shc[16]*p.x*p.y*(x2-y2) +
                sh[17]*shc[17]*p.y*p.z*(3.*x2-y2) +
                sh[18]*shc[18]*p.x*p.y*(7.*z2-1.) +
                sh[19]*shc[19]*p.y*p.z*(7.*z2-3.) +
                sh[20]*shc[20]*(35.*z2*z2 - 30.*z2 + 3.) +
                sh[21]*shc[21]*p.x*p.z*(7.*z2-3.) +
                sh[22]*shc[22]*(x2-y2)*(7.*z2-1.) +
                sh[23]*shc[23]*p.x*p.z*(x2-3.*y2) +
                sh[24]*shc[24]*(x2*x2 - 6.*x2*y2 + y2*y2);
            gl_Position = projectionMatrix * modelViewMatrix * vec4( abs(r)*p, 1.0 );
            color = r>0.?vec4(1,0,0,1):vec4(0,1,0,1);
            vnormal = normal;
        }
  </script>
  <script id="SHVertexShader" type="x-shader/x-vertex">
        uniform vec3 sh[36];
        uniform float shc[36];
        varying vec4 color;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            vec3 p = position;
            float x2 = p.x*p.x;
            float y2 = p.y*p.y;
            float z2 = p.z*p.z;
            color = vec4((
            sh[0]*shc[0] +

            sh[1]*shc[1]*p.y +
            sh[2]*shc[2]*p.z +
            sh[3]*shc[3]*p.x +

            sh[4]*shc[4]*p.x*p.y +
            sh[5]*shc[5]*p.y*p.z +
            sh[6]*shc[6]*(3.*z2-1.) +
            sh[7]*shc[7]*p.x*p.z +
            sh[8]*shc[8]*(x2-y2) +

            sh[9]*shc[9]*p.y*(3.*x2-y2) +
            sh[10]*shc[10]*p.x*p.y*p.z +
            sh[11]*shc[11]*p.y*(5.*z2-1.) +
            sh[12]*shc[12]*p.z*(5.*z2-3.) +
            sh[13]*shc[13]*p.x*(5.*z2-1.) +
            sh[14]*shc[14]*p.z*(x2-y2) +
            sh[15]*shc[15]*p.x*(x2-3.*y2) +

            sh[16]*shc[16]*p.x*p.y*(x2-y2) +
            sh[17]*shc[17]*p.y*p.z*(3.*x2-y2) +
            sh[18]*shc[18]*p.x*p.y*(7.*z2-1.) +
            sh[19]*shc[19]*p.y*p.z*(7.*z2-3.) +
            sh[20]*shc[20]*(35.*z2*z2 - 30.*z2 + 3.) +
            sh[21]*shc[21]*p.x*p.z*(7.*z2-3.) +
            sh[22]*shc[22]*(x2-y2)*(7.*z2-1.) +
            sh[23]*shc[23]*p.x*p.z*(x2-3.*y2) +
            sh[24]*shc[24]*(x2*x2 - 6.*x2*y2 + y2*y2)
            ), 1);
        }
  </script>
  <script id="fragmentShader" type="x-shader/x-fragment">
        varying vec4 color;
        uniform float exposure;
        void main() {
            gl_FragColor = color/exposure;
        }
  </script>
  <script id="LitFragmentShader" type="x-shader/x-fragment">
        varying vec4 color;
        varying vec3 vnormal;
        void main() {
            vec3 lightd1 = 0.9*vec3(0.,0.,1.);
            vec3 lightd2 = 0.5*vec3(1.,0.,0.);
            vec3 lightd3 = 0.2*normalize(vec3(-1.,0.,-1.));
            float lv = 
                max(0., dot(lightd1, vnormal)) +
                max(0., dot(lightd2, vnormal)) +
                max(0., dot(lightd3, vnormal)) +
                0.15;
            gl_FragColor = color*lv;
        }
  </script>
<div id="modalshform" class="modal fade" role="dialog">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal">&times;</button>
<h4 class="modal-title">Enter SH Coefficients</h4>
</div>
<div class="modal-body">
<p>Enter spherical harmonic coefficients separated by whitespace or commas</p>
<textarea class="form-control" rows="9" id="shcoeftextarea">
</textarea>
</div>
<div class="modal-footer">
<button type="submit" class="btn btn-default" data-dismiss="modal" onclick="submitSHCoefficients(document.getElementById('shcoeftextarea').value)">Submit</button>
<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
</div>
</div>

</div>
</div>
<div style="display:table; width:100%">
    <div style="display:table-row">
        <div id="canvascontainer" style="display:table-cell;width:50%"></div>
        <div id="controls" style="display:table-cell;width:50%;padding:0px 5px">
            <ul class="nav nav-tabs">
                <li class="active"><a class="redth" data-toggle="tab" href="#rsh">Red Channel</a></li>
                <li><a class="greenth" data-toggle="tab" href="#gsh">Green Channel</a></li>
                <li><a class="blueth" data-toggle="tab" href="#bsh">Blue Channel</a></li>
            </ul>

            <div class="tab-content">
                <div id="rsh" class="tab-pane fade in active">
                {% include sh/sliderpage.html %}
                </div>
                <div id="gsh" class="tab-pane fade">
                {% include sh/sliderpage.html %}
                </div>
                <div id="bsh" class="tab-pane fade">
                {% include sh/sliderpage.html %}
                </div>
            </div>
        </div>
    </div>
    <div style="display:table-row">
        <div id="hdr" style="padding:10px 5px;display:table-cell;width:50%">
            <table width="100%">
                <tr>
                    <td>Exposure: </td>
                    <td><input type="range" min="0.001" max="7" step="0.001" value="2" style="display:inline-block;width:100%" id="exposureslider" /></td>
                </tr>
            </table>
        </div>
        <div id="auxcontrols" style="padding:10px 5px;vertical-align:top;display:table-cell;width:50%">
            <input type="button" class="btn btn-info btn-large" data-toggle="modal" data-target="#modalshform" value="Manually input SH coefficients" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            Monochrome: <input type="checkbox" id="monochrome" />
            <br><br>
            Display type:
            <select class="form-control" id="shaderselect">
                <option>Diffuse Shaded Sphere</option>
                <option>Specular Shaded Sphere</option>
                <option>Varying Radius</option>
                <!--<option>Environment Cubemap</option>-->
            </select>
        </div>
    </div>
</div>
<script type="text/javascript">
var animate = function () {
    requestAnimationFrame(animate);
    controls.update();
};

var render = function () {
    // Update SH coefficients
    renderer.render(scene, camera);
};

var container = document.getElementById("canvascontainer");
var w = container.offsetWidth;
var h = container.offsetHeight;

var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000); 
camera.position.z = 3;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(w,w); // Square viewport
renderer.setClearColor(0x113377,1);

var controls = new THREE.TrackballControls(camera, container);
controls.rotateSpeed = 4.0;
controls.zoomSpeed = 1.2;
controls.noZoom = false;
controls.noPan = true;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

var sh = SH(scene);
init(scene);

controls.addEventListener( 'change', render );
container.appendChild(renderer.domElement);

// Set up SH coefficient slider events
var slidercontainers = Array(3);
slidercontainers[0] = document.getElementById("rsh");
slidercontainers[1] = document.getElementById("gsh");
slidercontainers[2] = document.getElementById("bsh");
var sliderarrays = Array(3);
for (var i = 0; i < 3; i++) {
    sliderarrays[i] = Array(9).fill(0);
    sliderarrays[i][0] = 1;
    updateSliderValues(slidercontainers[i], sliderarrays[i], -1);
    var updatefn = (function(idx) {
        return function() {
            sh.updateChannelSHCoefs(sliderarrays[idx], idx);
            if (sh.isMonochrome()) {
                for (var j = 0; j < 3; j++) {
                    if (j != idx) {
                        updateSliderValues(slidercontainers[j], sliderarrays[idx], -1);
                        sliderarrays[j] = sliderarrays[idx].slice(0);
                    }
                    sh.updateChannelSHCoefs(sliderarrays[j], j);
                }
            }
            render();
        };
    })(i);
    populateSliders(slidercontainers[i], sliderarrays[i], updatefn);
}

// Set up exposure slider events
document.getElementById("exposureslider").oninput = function(e) {
    var exposure = parseFloat(document.getElementById("exposureslider").value);
    exposure = remap(exposure);
    sh.updateExposure(exposure);
    render();
};

// Set up material change
document.getElementById("shaderselect").onchange = function(e) {
    var mat = document.getElementById("shaderselect").selectedIndex;
    if (mat == 2) {
        $("#monochrome").prop("checked", true);
        $("#monochrome").trigger("change");
        $("#monochrome").attr("disabled", true);

    } else {
        $("#monochrome").attr("disabled", false);
    }
    sh.switchMaterial(mat);
    render();
};

// Set up text entry of coefficients
$("#modalshform").on("shown.bs.modal", function() { $("#shcoeftextarea").focus()});
var submitSHCoefficients = function(s) {
    var arr = $.trim(s).split(/,?\s+/).map(parseFloat);
    for (var i = 0; i < 3; i++) {
        updateSliderValues(slidercontainers[i], arr, i);
        for (var j = 0; j < 9; j++) {
            sliderarrays[i][j] = arr[3*j+i];
        }
        sh.updateChannelSHCoefs(sliderarrays[i], i);
    }
    render();
};

// Set up monochrome
$("#monochrome").on("change", function(e) {
    sh.setMonochrome(this.checked);
    for (var j = 1; j < 3; j++) {
        updateSliderValues(slidercontainers[j], sliderarrays[0], -1);
        sliderarrays[j] = sliderarrays[0].slice(0);
    }
    render();
});

render();
animate();
</script>

There are several different visualization modes:

- The default view is a diffuse sphere lit by the spherical function as an environment map
- Spherical function as an intensity image on a sphere (or, a specular sphere lit by the spherical function as an environment map)
- Spherical function as the radius of a shape. This is the only mode that will let you see negative values, which are shown as green. Positive values are shown in red.
- Cubemap of the spherical function (to be implemented)
