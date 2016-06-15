(function() {
    var root = "http://www.cs.princeton.edu/~edwardz";
    var uwroot = "http://homes.cs.washington.edu/~edzhang";
    var personalroot = "http://ed.ilogues.com";

    if (document.referrer.startsWith(root)) {
        var subpage = document.referrer.substring(root.length);
        if (subpage == "" || subpage == "/" || subpage.startsWith("/index")) return;
        else if (subpage == "/voronoi/voronoi.html") window.location.href = personalroot + "/projects/2015/03/22/interactive-javascript-voronoi-diagrams";
        else window.location.href = uwroot+subpage;
    }
})();
