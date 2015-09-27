---
layout: post
title: "Pagerank Visualization"
description: ""
category: "projects"
tags: []
customjs:
    - http://d3js.org/d3.v3.min.js
    - prvis/colorbrewer.js
    - prvis/generategraph.js
    - prvis/pagerank.js
    - prvis/d3graphmanager.js
    - prvis/d3mouse.js
    - prvis/d3vis.js
    - prvis/init.js
customstyles:
    - prvis/d3vis.css
---
{% include JB/setup %}

Pagerank is a well known graph algorithm that uses the links between nodes
in a directed graph to determine a node's reputation. Intuitively, if a node
is linked to by many high-reputation nodes, it also will have a high reputation.

While the formulation of reputation is intuitive, it is hard to intuitively
determine, given a graph structure, what the final Pagerank distribution will
look like. We also don't have a good sense of how adding links between pages
will change the Pagerank distribution.

To understand and visualize how Pagerank changes when the underlying network changes,
I implemented an interactive visualization of Pagerank. You can edit the graph and
watch how Pagerank changes instantaneously. In addition, you can actually watch
how the iterative algorithm actually computes the Pagerank for the network, as 
Pagerank "flows" along the edges between nodes.

### Editing the Graph ###

Create a random graph with <input id='numnodes' size='3' maxlength='4' value='10'> nodes:
<button id='generate' type="button" class="btn btn-default">Generate Random Graph</button>
<ul>
    <!--<li>The graph will automatically resize and update pagerank values when you update it.</li>-->
    <li>If a node is too small, hover over it to display the pagerank value</li>
    <li>To add a node, double click anywhere away from an existing node or edge.</li>
    <li>To add an edge, click and drag from the source node to the destination node.</li>
    <li>To delete an edge or node, click on the edge or node and press "Delete" or "Backspace"</li>
    <li>To reposition a node, alt-click the node and drag to its new position</li>
</ul>
<hr>

<div class='btn-group' data-toggle='buttons' id='animatetypes'>
<label class='btn btn-primary'>
    <input type='radio' name='animatetype' id='animatetypecolor' value='color'>Encode Pagerank with node color</label>
    </label>
<label class='btn btn-primary active'>
    <input type='radio' name='animatetype' id='animatetypesize' value='size'>Encode Pagerank with node size</label>
</div>

<button id='animate' type="button" class="btn btn-default">     Animate: Single Node with Pagerank</button>
<button id='equalanimate' type="button" class="btn btn-default">Animate: Uniform Distribution</button>

<div id='graph' width='100%'>
</div>

Iterations per second: <span id='intervaltext'></span>

<div id='intervalslider'></div>
<hr>
Alpha: <span id='alphatext'></span>

<div id='alphaslider'></div>
