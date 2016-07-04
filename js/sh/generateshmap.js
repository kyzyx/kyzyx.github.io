function generateSHMap(mapel, baseurl) {
    var horiz = [50, 110,
                 134, 195,
                 216, 280,
                 303, 365,
                 390, 450,
                 472, 535,
                 557, 617,
                 647, 702,
                 730, 788, 815];
    var vertinc = [28, 57];

    var zeros = "";
    var y = 47;
    var dargs = "?exposure=1&quaternion=0.1759,0.4247,0.8205,0.3399,3";
    for (var l = 0; l < 5; l++) {
        for (var m = -l; m <= l; m++) {
            var i = (horiz.length-1)/2 + 2*m - 1;
            var elt;
            var x1, x2, y1, y2;

            // Create main element
            x1 = horiz[i];
            x2 = horiz[i+1];
            y1 = y;
            y2 = y + vertinc[0] + vertinc[1];
            elt = document.createElement('area');
            elt.setAttribute('title', "SH Band " + l + ", index " + m);
            elt.setAttribute('href', baseurl + dargs + "&viewtype=2&sh=" + zeros + "1,1,1");
            elt.setAttribute('shape', 'rect');
            elt.setAttribute('coords', x1 + "," + y1 + "," + x2 + "," + y2);
            elt.setAttribute('target', '_self');
            mapel.appendChild(elt);

            // Create small sphere element
            x1 = x2;
            x2 = horiz[i+2];
            y2 = y + vertinc[0];
            elt = document.createElement('area');
            elt.setAttribute('title', "SH Band " + l + ", index " + m);
            elt.setAttribute('href', baseurl + dargs + "&viewtype=1&sh=" + zeros + "1,-1,0");
            elt.setAttribute('shape', 'rect');
            elt.setAttribute('coords', x1 + "," + y1 + "," + x2 + "," + y2);
            elt.setAttribute('target', '_self');
            mapel.appendChild(elt);

            zeros += "0,0,0,";
        }
        y += vertinc[0] + vertinc[1];
    }
};
