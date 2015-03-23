$(document).ready(function() {
    // Initialize system
    var sys = new VoronoiSystem($("#plane"), $("#slider"));
    sys.addHandlers();

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
        $("#boundsdialog").dialog("open");
    });

    // Animation
    var animated = false;
    var timeout = false;
    var t = 50;
    var dostep = function() {
        var v = sys.getline();
        var bounds = sys.bounds();
        var s = (bounds[2]-bounds[0])/$("#slider").slider("option","max");
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
    $("#pointdialog").dialog({
        autoOpen: false,
        height:500,
        width:400,
        modal: true,
        open: function() {
            $("#newpoints").get(0).value = "";
        },
        buttons: {
            "Add points": function() {
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
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        close: function() {
        }
    });
    $("#boundsdialog").dialog({
        autoOpen: false,
        height:500,
        width:400,
        modal: true,
        buttons: {
            "Update Bounds": function() {
                var b = [];
                b[0] = $("#xmin").get(0).value;
                b[1] = $("#ymin").get(0).value;
                b[2] = $("#xmax").get(0).value;
                b[3] = $("#ymax").get(0).value;
                sys.bounds(b);
                sys.update();
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        close: function() {
        }
    });

    $("#manual").click(function(e){
        $("#pointdialog").dialog("open");
    });

    // Initialize slider
    $("#slider").slider({
        min:0,
        max:200,
    });
    $("#slider").bind("slide", function(e, ui) {
        if (animated) $(".voronoianimate").click();
        var bounds = sys.bounds();
        var x = (bounds[2]-bounds[0])*ui.value/$("#slider").slider("option","max") + bounds[0];
        sys.slide(x);
    });
});
