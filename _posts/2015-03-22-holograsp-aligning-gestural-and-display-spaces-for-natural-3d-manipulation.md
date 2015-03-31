---
layout: post
title: "Holograsp: Aligning Gestural and Display Spaces for Natural 3D Manipulation"
description: ""
category: "Research"
tags: []
---
{% include JB/setup %}
Advisor: Szymon Rusinkiewicz

##### TL;DR #####
Jarvis from Iron Man! Use your hands to pick up and move virtual objects in front of your screen!

## Overview ##
3D graphics are an exciting and versatile method of visualization. However, with the standard
interfaces of mouse, keyboard, and 2D screen, interacting with 3D graphics is highly 
cumbersome and unintuitive. The ideal system would combine a 3D display with a spatially
accurate gesture system, so that the user could interact with the virtual object as if it were
a real one.

I've implemented several prototype versions of this system that successfully aligns the user's hand
and the 3D object in space. For display, I have used 3D monitors powered by Nvidia 3D Vision. For
input devices, the first iteration used the
[Intel Perceptual Computing SDK](https://software.intel.com/en-us/perceptual-computing-sdk)
while later versions used the [Leap Motion](https://www.leapmotion.com/).

The main focus of the prototypes have been for user studies to compare whether
the natural interaction and display is advantageous to users. Previous
in-air gestural systems have shown low accuracy compared to the mouse; 
however our results have suggested that, when coupled with
the 3D display space, gestural systems are much faster and more intuitive.

<div class='embed-responsive embed-responsive-4by3'>
<iframe src="https://www.youtube.com/embed/pIP1viF2VPE?start=180" class="embed-responsive-item"> </iframe>
</div>

##### Brief demo showing a simple 3D modelling system built on top of Holograsp #####

## System Implementation ##
Coming soon...

## User Study Results
Coming soon...
