---
layout: post
title: "Emptying, Refurnishing, and Relighting Indoor Spaces"
description: ""
category: "research"
tags: []
---
{% include JB/setup %}

Paper at [SIGGRAPH Asia 2016](https://sa2016.siggraph.org/).

Edward Zhang, Michael F. Cohen, Brian Curless. 2016. "Emptying, Refurnishing, and Relighting Indoor Spaces". <i>ACM Transactions on Graphics (Proceedings of SIGGRAPH Asia 2016)</i>

Project webpage at [http://grail.cs.washington.edu/projects/emptying](http://grail.cs.washington.edu/projects/emptying)

##### TL;DR #####
Enable visually realistic edits to indoor scenes, like removing and inserting furniture.

## Abstract ##

{% include image.html image="emptying/emptying.jpg" %}

Visualizing changes to indoor scenes is important for many applications.
When looking for a new
place to live, we want to see how the interior looks not with the
current inhabitant's belongings, but with our own furniture.
Before purchasing a new sofa,
we want to visualize how it would look in our living room.
In this paper, we present a system that takes an RGBD scan of an indoor scene
and produces a scene model of the empty room, including light emitters, materials,
and the geometry of the non-cluttered room. Our system enables realistic
rendering not only of the empty room under the original lighting conditions, but
also with various scene edits, including adding furniture, changing the
material properties of the walls, and relighting. These types of scene edits
enable many mixed reality applications in areas such as real estate, furniture
retail, and interior design. Our system contains two novel technical
contributions: a 3D radiometric calibration process that recovers the appearance
of the scene in high dynamic range, and a global-illumination-aware inverse
rendering framework that simultaneously recovers reflectance properties of
scene surfaces and lighting properties for several light source types,
including generalized point and line lights.

{% include youtube_embed.html aspectratio="16by9" video="-SZ52mcUS2M" %}

## Technical Overview ##
This system was made up of a number of independent components. I'll go over these components briefly here.

{% include image.html image="emptying/overview.png" %}
* *Capture and Preprocessing:* We used the Project Tango tablet as our input device, capturing a handheld RGBD scan of the scene. Some fairly standard preprocessing of this data gives us a triangle mesh of the scene as well as camera poses for a set of color images (with autoexposure) of the scene. This process is detailed in my [Capturing Scenes with the Project Tango Tablet]({% post_url 2016-02-03-capturing-scenes-with-the-project-tango-tablet %}) post.
* *HDR Calibration:* If an area of an image is very bright compared to another area (e.g. a window compared to the rest of the room), cameras can't accurately represent the relative brightnesses in a single image - they are low dynamic range. However, with multiple images of the scene taken at different exposure levels, it's possible to recover accurate brightnesses in all regions of the scene. Having consistent, accurate measures of brightness is vital for inverse rendering to work. The process of obtaining a high dynamic range mesh is detailed in my [3D HDR Scene Capture]({% post_url 2016-02-02-3d-hdr-scene-capture %}) post.
* *Floorplan Estimation:* For our particular application, we want to identify the walls, floor, and ceiling. These are the things that we can't remove from the room, because they are the room! In this work, we use fairly strict assumptions on what shapes rooms can take (e.g. all surfaces are flat and at right angles to each other), but the outcomes of this step don't really affect the inverse 
rendering process.
* *Architectural Features:* This step involves identifying doorways and baseboards - things that can't be removed from the room, but don't really affect the shape of the room. This is a fairly minor step (and doesn't appear in the overview diagram), but it's pretty important for making our empty room renderings actually look like rooms instead of boxes.
* *Inverse Rendering:* The _rendering_ problem involves computing the appearance of a scene given the shape, surface properties (materials), and light emitters. In _inverse rendering_, we take the scene appearance and shape, and recovers the material and light emitter properties. In our work we assume that surfaces are diffuse and that the positions (but not intensities or angular distributions) of light sources are known. Unlike most traditional inverse rendering works, our method deals with local light sources (rather than distant light sources) and accounts for global illumination effects (such as color bleeding and shadows).
* *Re-rendering:* Our inverse rendering process gives us all the properties that we need to feed into a standard renderer such as [Pixar's Renderman](https://renderman.pixar.com/view/renderman), [Blender's Cycles](https://www.blender.org/features/cycles/), or, in our case, the Academy-Award-winning [PBRT](http://www.pbrt.org/). This means that it's easy to edit the scene by changing some of the properties that we've solved for, or inserting new objects, in a way that is physically accurate and self-consistent.

## Data ##
Several of our datasets with radiometric calibration can be viewed at [https://sketchfab.com/kyzyx/collections/hdr-room-scans](https://sketchfab.com/kyzyx/collections/hdr-room-scans).

## More Results ##
{% include image.html image="emptying/results.png" caption="Results from our system in four scenes. The first row is an unadjusted frame from the original input. The second row shows a synthetic rendering of the empty room from the same camera viewpoint and the same exposure. The third row inserts some synthetic objects into the scene. The fourth row shows a wider view of the entire relit mesh with baked global illumination at a suitable global exposure."%}
{% include image.html image="emptying/edits.png" caption="This figure shows how our scene model enables edits to the lighting and materials of the scene. These edits are shown in increments; the first column shows the input frame, while the second shows the refurnished room. The third column shows the walls repainted a different color.  The fourth column changes the lighting conditions, e.g. changing the time of day to sunset (top), or changing the position of the point light in the room (bottom)." %}

## Acknowledgements ##
We would like to thank Sameer Agarwal for his advice on optimization and Ceres
Solver. We also thank Pratheba Selvaraju for her assistance in
modelling the contents of refurnished scenes. These contents include 3D models
from [CGTrader](https://www.cgtrader.com) (users scopia, den\_krasik, buchak72, belgrade\_sim, peter\_janov)
and [Turbosquid](www.turbosquid.com) (user shop3ds). Several additional 3D models were obtained
from the [Stanford 3D Scanning Repository](http://graphics.stanford.edu/data/3Dscanrep/).

This work was supported by the NSF/Intel Visual and Experiential Computing Award
\#1538618, with additional support from Google, Microsoft, Pixar, and the
University of Washington Animation Research Labs.
