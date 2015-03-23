---
layout: post
title: "Interactive Javascript Voronoi Diagrams"
description: ""
category: "projects"
tags: []
customjs:
    - http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
    - https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js
    - https://cdn.rawgit.com/google/closure-library/master/closure/goog/base.js
    - voronoi/geometry.js
    - voronoi/voronoi.js
    - voronoi/interaction.js
    - voronoi/init.js
customstyles:
    - http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/ui-lightness/jquery-ui.css
---
{% include JB/setup %}

<div id="pointdialog" title="Add points">
<p>Type in one point on each line, with the two coordinates separated
by whitespace. Invalid lines will be ignored.</p>
<br>
<textarea id="newpoints" rows="10" cols="30"></textarea>
</div>

<div id="boundsdialog" title="Update bounds">
<label for="xmin">Xmin:</label>
<input type="text" id="xmin" size='2'/>
<label for="xmax">Xmax:</label>
<input type="text" id="xmax" size='2'/>

<label for="ymin">Ymin:</label>
<input type="text" id="ymin" size='2'/>
<label for="ymax">Ymax:</label>
<input type="text" id="ymax" size='2'/>
</div>

Fortune's Algorithm is a sweepline algorithm for computing the
[Voronoi Diagram](http://en.wikipedia.org/wiki/Voronoi_diagram) of a set of points.
I implemented an interactive Javascript version of this algorithm for the final
project in my Theory of Algorithms (COS423) class at Princeton.

You can add points to the diagram in several different methods. You can also
watch the execution of the algorithm interactively, controlling the sweepline
position with the slider, or just animate the sweepline process.

Note that sometimes floating point error causes strange behavior with large
numbers of points.

[Jump to development notes](#notes)

<input type="button" id="updatebounds" value = "Update Bounds">
<input type="button" class="voronoianimate" value="Animate sweep line">
<div width="100%">
<div style="padding:10px 0px">
<div id="slider"></div>
</div>
<canvas id="plane" style="width: 100%; border: 1px solid black;"></canvas><br>
</div>

<u>Step 1: Input: </u>
There are three ways of generating input:
<ul>
    <li> Generating random points: <input id="numpts" value="10" size="2"/> <input id="rand" type="button" value="Generate Random Points"> </li>
    <li> Manually entering a list of coordinates: <input id="manual" type="button" value="Manually enter points"></li>
    <li> Clicking on the plane to add points </li>
</ul>
<hr>
<u>Step 2: Running the algorithm</u>
There are several ways of viewing the algorithm in progress. The easiest way is to run the animation.
<ul>
    <li> Animate the sweep line from left to right:
    <input type="button" class="voronoianimate" value="Animate sweep line">
    </li>
    <li> Drag the sweep line back and forth using the slider underneath the viewport </li>
    <li> Step from event to event in the priority queue
    <input type="button" id="step" value="Next event"></li>
    <li> Go straight to the complete Voronoi Diagram
    <input type="button" id="complete" value="Compute Voronoi Diagram"> </li>
    <li> Go back to the beginning of the algorithm <input type="button" id="restart" value="Restart"></li>
</ul>
<hr>
<table><tr>
        <td valign='top'> Event queue:</td><td> Beach line: </td>
    </tr><tr><td>
    <textarea id="evtq" rows="10" cols="50"></textarea></td><td>
    <textarea id="beach" rows="10" cols="50"></textarea></td></tr></table>


## <a name="notes"></a>Overview ##
This interactive javascript implementation of Fortune's algorithm uses
a left to right sweep line algorithm to generate a Voronoi Diagram using
parabolic arcs.

It provides several methods for generating points, allowing
user specified points entered textually as a list or visually on the plane,
as well as randomly generating points in the unit square. 

We provide interactive control of the sweep line allowing the user to see
the parabolic arcs constituting the "beach line" as they sweep out the
partial voronoi diagram; to the left of the beach line is the voronoi
diagram so far. The sweep line can be animated to move from left to right,
or can be dragged back and forth by the user using a slider underneath the
plane. The user can manually set the bounds of the view plane using the
controls above the plane. 

More detailed information about the workings of the algorithm can be
seen in the textboxes at the bottom right of the page, showing the
priority queue of potential sweep line events and the current arcs

There are two cases in which this implementation will err: the
obvious one is when the first two input points have the same
x-coordinate (which results in no beach line intersection for the
second one). The other case(s) are occasionally seen when dealing
with large numbers of randomly generated points, where we see
floating point error come into play when e.g. detecting arc events
or when intersecting arcs. This may cause two points which should be
coincident to be sensed as different points, or vice versa.


This project is implemented entirely in javascript. My implementation of
Fortune's algorithm relies on the data structures provided by Google's
<a href='http://code.google.com/p/closure-library/'>Closure</a>
javascript library. I also use <a href='http://www.jquery.com'>jQuery</a>
and <a href='http://www.jqueryui.com'>jQueryUI</a> libraries to provide
the interaction widgets as well as helper functions for event handling.

-----------------------------------------------------------------------------

## Implementation Notes ##

### Fortune's Algorithm ###
<ul>
    <li> <b> Data Structures: </b> The two core data structures in Fortune's
    Algorithm are the Sweep Line Priority Queue and the Beach Line Tree
    <ul>
        <li> The sweep line priority queue contains event objects. These
        objects contain an x-coordinate of the event, a type (either a SITE
        event or an ARC event), and a reference to a point or arc object
        depending on which type of event it is. <br>This is implemented as
        a Closure Priority Queue, which uses a standard heap implementation.
        </li>
        <li> The beach line tree maintains a sorted list of the arcs in
        the beach line. The tree key is actually a pseudo-index, since
        what we need for the beach line is essentially a random-access
        linked list of arcs. Thus, we take the first two elements to
        have indices e.g. -2<sup>13</sup>, 2<sup>13</sup>; then when
        we insert a new node between two existing nodes we simply take the
        index halfway in between the two existing indices (going to
        floating point indices if necessary), and new nodes at the "ends
        of the linked list" just get a new power of 2 as an index. <br>
        This allows easy retrieval of nodes by index, while still keeping
        the sorted order of nodes in a binary tree form so that
        our beach intersection is efficient <br>
        We could implement a comparator to directly index based on the arc,
        but this method turns out to be simpler.
        <br> This is implemented as a Closure AVL tree,
        which suffices as a Balanced Binary Search Tree. </li>
    </ul>
    One rather important and complex data structure stores the information
    about a parabolic arc. This data structure contains the following data
    elements: <ul>
        <li>The coordinates of the point that is the focus of the parabola
        (i.e. the point that generated the arc)</li>
        <li>A pseudo-index into the beach line for this arc</li>
        <li>References to the next and previous arcs in the beach line
        to keep the linked-list linear time traversal </li>
        <li> An index into the array of diagram edges (see below). This
        index represents the edge being traced out by the upper breakpoint
        of the arc</li>
        <li>A static key used as a hash of this arc. This is simply
        implemented as a string containing the concatenation of the points
        that generated the previous arc, this arc, and next arc. </li>
    </ul>
    There are two supplementary data structures used for this algorithm:
    <ul>
        <li>A hash table that maps a parabolic arc segment to the
        corresponding potential event in the Sweep Line priority queue.
        This is used to make deletion of invalid arc events efficient. <br>
        This is implemented as a Closure HashMap</li>
        <li>An array of edges in the final voronoi diagram. Array elements
        have two properties: one is a pair of edge endpoints and the other
        is the pair of points that the edge bisects. This is used to store
        the output of the algorithm (both partial and final)</li>
    </ul>
    </li>
    <li> <b> Geometry Module: </b>
    A separate geometry module was necessary to abstract out the
    difficult math. This contained simple primitives such as line segment
    intersection and distance functions. There were two nontrivial functions
    in this module:
    <ul>
        <li>Calculating the circumcircle of three points, in order to
        determine when an arc would disappear (resulting in an ARC event).
        </li>
        <li>
        Calculating the center of a circle tangent to a vertical line and
        intersecting two arbitray points. This was necessary in order to
        calculate the breakpoints between two adjacent arcs (since
        the center of this circle would be equidistant from the sweep line
        and the two points generating the parabolic arcs)
        </li>
    </ul>
    </li>
    <li> <b> Algorithm Implementation </b>
    The main function in this implementation processes a single event from
    the Sweep Line priority queue. It examines events from the top of the
    queue, discarding previously invalidated ones. Once it finds a valid
    event, it proceeds as described in <a href='http://www.cs.princeton.edu/courses/archive/spring12/cos423/bib/vor.pdf'>Barr et al</a>. 

 In processing
    SITE events (hitting a new point), there are two subtleties -
    searching the beach requires reaching into the "private" variables of
    the AVL tree for efficient binary search to determine where to insert
    the new arc for the new point, and keeping the sorted-linked-list
    structure while constructing the three new arcs requires some
    careful initialization. 


    Processing ARC events was a little more tricky because the edges of
    the diagram needed to be tracked. This is achieved by keeping track
    of the edges being traced out by the beach line. 


    A few edge cases needed to be taken into account when considering
    potential arc events. There are four edge cases for arc events:
    the most common is that an arc's generating point is in front of (i.e.
    has a greater x coordinate than) both of its neighbors, so that
    the arc never actually disappears and therefore does not generate an
    arc event. We also disregard events with three adjacent
    collinear sites, since the bisectors for these sites will never
    intersect. If the potential event would take place at a location that
    the sweep line has already passed, then it is certainly invalid, and
    finally if the circumcenter of three points does not actually lie
    at the intersection of the three parabolas (an odd geometric case that
    was only caught with visual debugging) then it is a false event as well.
    </li>
</ul>

### Graphical Output and Interaction ###
<ul>
    <li>Graphics primitives involved drawing circles, points, parabolic
    arcs, and lines onto a canvas. Drawing parabolic arcs was an
    interesting task since the HTML5 canvas only provides a quadratic bezier
    curve drawing function, and we used
    <a href='http://alecmce.com/as3/parabolas-and-quadratic-bezier-curves'>
    http://alecmce.com/as3/parabolas-and-quadratic-bezier-curves</a> as a
    reference for this. Two edge cases for parabolic arcs were
    endpoints with the same y-coordinate as the focus, which required us to
    slightly perturb each endpoint for the quadratice bezier curve to
    render properly, and a degenerate arc, which is simply a line. 


    The same object responsible for these primitives also maintains the
    list of points on the canvas as well as the location of the sweep line.
    </li>
    <li> Interaction code was very straightforward using jQuery and
    jQueryUI. The slider element and the overlay for entering a list
    of points were jQueryUI widgets</li>
    <li>
    Drawing the partial diagram on the left of the beach line was the
    hardest part of the visualization, since it was not described in the
    readings. The way in which we constructed the edges (one endpoint at a
    time) allows us to loop through the break points on the beach line
    and connect them with the appropriate edge endpoints as they trace out
    the edges; however, for an edge that is being traced out in both
    directions, we have to keep a reference between the arcs that are
    tracing out the edge so we can draw the partial edge. Any remaining
    edges already have both endpoints determined so those are easy to draw.
    </li>
</ul>
Note that sliding the slider leftwards usually results in completely
recalculating the voronoi diagram up to that point, since there is no
simple way to reverse the sweep line.

