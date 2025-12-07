$(document).ready(function() {
    var w = $('#graph').width();
    var h = w;
    var svg;
    var container = d3.select('#graph')
      .append('svg')
      .attr('id', 'svg_area')
      .attr('width', w)
      .attr('height', h);

    svg = container.append('svg:g')
      .attr('width', w)
      .attr('height', h);
    
    var nodes = [
            {id: 0, size: 40},
            {id: 1, size: 40},
            {id: 2, size: 40},
            {id: 3, size: 40}
    ];
    var edges = [
            {source: nodes[0], target: nodes[1]},
            {source: nodes[1], target: nodes[0]},
            {source: nodes[1], target: nodes[2]},
            {source: nodes[2], target: nodes[3]},
            {source: nodes[3], target: nodes[2]}
    ];
    r = Renderer(svg, nodes, edges);
    var prm = null;
    // Initialize slider for alpha
    $('#alphaslider').slider({
        min:0,
        max:1,
        value:0.2,
        step: 0.05,
        tooltip:'hide',
    }).on('slide', function(ev) {
        if (prm) {
            var v = $('#alphaslider').slider('getValue')
            prm.updateAlpha(v);
            if (!prm.isRunning()) {
                prm.init();
                prm.converge();
            }
        }
        $('#alphatext').html(v);
    });
    $('#alphatext').html($('#alphaslider').slider('getValue'));
    // Initialize slider for update rate
    $('#intervalslider').slider({
        min:0.5,
        max:3,
        value:1.5,
        step:0.5,
        tooltip:'hide',
    }).on('slide', function(ev,ui) {
        var v = $('#intervalslider').slider('getValue');
        if (prm) prm.updateIterRate(1000/v);
        $('#intervaltext').html(v);
    });
    $('#intervaltext').html($('#intervalslider').slider('getValue'));
    prm = Pagerank(svg, r, $('#alphaslider').slider('getValue'), 1000/$('#intervalslider').slider('getValue'));

    // Buttons update pageranks
    d3.select('#animate').on('click', function() {
        prm.init(r.getGraphManager().getNode(0));
        prm.animate();
    });
    d3.select('#equalanimate').on('click', function() {
        prm.init();
        prm.animate();
    });
    d3.select('#generate').on('click', function() {
        var n = parseInt($('#numnodes').val());
        if (n < 2) n = 10;
        if (n > 9999) n = 9999;
        var g = GenerateGraph(n);
        r.cleanup();
        svg.remove();
        svg = container.append('svg:g')
          .attr('width', w)
          .attr('height', h);
        r = Renderer(svg, g);
        prm = Pagerank(svg, r, $('#alphaslider').slider('getValue'), 1000/$('#intervalslider').slider('getValue'));
        prm.init();
        prm.converge();
        r.getEventManager().setPageRankManager(prm);
    });


    prm.init();
    prm.converge();
    r.getEventManager().setPageRankManager(prm);

    $('#animatetypes input[type=radio]').on('change', function() {
            var newval = $('#animatetypes input[type=radio]:checked').val();
            if (newval == 'color') {
                prm.useSize(false);
                prm.useColors(true);
            }
            else if (newval == 'size') {
                prm.useSize(true);
                prm.useColors(false);
            }
    });
});
