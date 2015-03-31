$(document).ready(function() {
    // Initialize system
    var sys = new VoronoiSystem($("#plane"), $("#slider"));
    sys.addHandlers();

    // Set click handlers
    $("#rand").click(function(e){
        var n = parseInt($("#numpts").get(0).value);
        if (n < 2) return;
        sys.randomPoints(n);
        refresh();
        sys.voronoi();
    });
    $("#step").click(function(e){
        sys.step();
    });
    $("#complete").click(function(e){
        sys.complete();
    });
    $("#restart").click(function(e){
        sys.voronoi();
        var b = [];
        b[0] = $("#xmin").get(0).value;
        b[1] = $("#ymin").get(0).value;
        b[2] = $("#xmax").get(0).value;
        b[3] = $("#ymax").get(0).value;
        sys.bounds(b);
        sys.update();
    });
    $("#updatebounds").click(function(e){
        $("#boundsdialog").modal("show");
    });

    // Animation
    var animated = false;
    var timeout = false;
    var t = 50;
    var dostep = function() {
        var v = sys.getline();
        var bounds = sys.bounds();
        var s = (bounds[2]-bounds[0])/$("#slider").slider("getAttribute","max");
        if (!sys.slide(v+s)) {
            $(".voronoianimate").get(0).value = "Animate sweep line";
            clearTimeout(timeout);
            animated = false;
            return false;
        }
        timeout = setTimeout(dostep, t);
        animated = true;
        return true;
    };
    $(".voronoianimate").click(function(e){
        if (animated) {
            $(".voronoianimate").get(0).value = "Animate sweep line";
            clearTimeout(timeout);
            animated = !animated;
        }
        else {
            if (dostep()) {
                $(".voronoianimate").get(0).value = "Stop sweep line animation";
            }
        }
    });
    $("#pointdialog").modal({show:false})
    .on('show.bs.modal', function() {
        $("#newpoints").get(0).value = "";
    });
    $("#addpointsbutton").on('click', function() {
        var lines = $("#newpoints").get(0).value.split("\n");
        sys.randomPoints(0);
        for (var i = 0; i < lines.length; ++i) {
            var coords = $.trim(lines[i]).split(" ");
            if (coords.length < 2) continue;
            var x = parseFloat(coords[0]);
            if (x != x) continue;
            var y = parseFloat(coords[1]);
            if (y != y) continue;
            sys.addPoint(x,y);
        }
        refresh();
        sys.voronoi();
        $("#pointdialog").modal('hide');
    });
    $("#closepointsdialog").on('click', function() {
        $("#pointdialog").modal('hide');
    });
    $("#boundsdialog").modal({show:false});
    $("#updateboundsbutton").on('click', function() {
        var b = [];
        b[0] = $("#xmin").get(0).value;
        b[1] = $("#ymin").get(0).value;
        b[2] = $("#xmax").get(0).value;
        b[3] = $("#ymax").get(0).value;
        sys.bounds(b);
        sys.update();
        $("#boundsdialog").modal('hide');
    });
    $("#closeboundsdialog").on('click', function() {
        $("#boundsdialog").modal('hide');
    });

    $("#manual").click(function(e){
        $("#pointdialog").modal("show");
    });

    // Initialize slider
    $("#slider").slider({
        min:0,
        max:200,
        tooltip:'hide',

    });
    $("#slider").on("slide", function(e) {
        if (animated) $(".voronoianimate").click();
        var bounds = sys.bounds();
        var x = (bounds[2]-bounds[0])*$("#slider").slider("getValue")/$("#slider").slider("getAttribute","max") + bounds[0];
        sys.slide(x);
    });

    sys.randomPoints(100);

    var refresh = function() {
        sys.resize();
        sys.fitBounds();
        var b = sys.bounds();
        $("#xmin").get(0).value = b[0];
        $("#ymin").get(0).value = b[1];
        $("#xmax").get(0).value = b[2];
        $("#ymax").get(0).value = b[3];
        sys.update();
    };
    refresh();
    sys.voronoi();
    sys.complete();

});
