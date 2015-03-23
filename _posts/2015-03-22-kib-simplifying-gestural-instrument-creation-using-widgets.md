---
layout: post
title: "KIB: Simplifying Gestural Instrument Creation using Widgets"
description: "Simplifying gestural instrument creation using widgets"
category: "Research"
tags: []
---
{% include JB/setup %}
[Oral presentation at NIME 2013](http://www.nime.org/wp-publications/zhang2013/).

Edward Zhang and Rebecca Fiebrink. KIB: Simplifying Gestural Instrument Creation Using Widgets (Edward Zhang), In <i>Proceedings of the International Conference on New Interfaces for Musical Expression (NIME)</i>, 2013.

##### TL;DR #####
Mix and match individual gestural "widgets" to easily make
gestural digital musical instruments (DMIs) like in [V-Motion](https://vimeo.com/45417241).

## Overview ##
The most complicated and interesting part of digital musical instruments (DMIs)
is mapping the direct inputs from a controller to sound parameters for the
instrument. For gestural DMIs, there is often a large gap between interpreting
the raw data (e.g. 3D range images or coordinates of a joint) into more
meaningful gestures. Traditionally, this gap has been closed via machine learning,
which is often opaque to the user, or directly by implementing direct mappings
themselves, which is technically difficult and verbose.

Inspired by the [V-Motion](https://vimeo.com/45417241) system as well as
widget-based DMI design tools in the multitouch space such as [TouchOSC](http://hexler.net/software/touchosc), we
designed the Kinect Instrument Builder (KIB), a system that simplifies gestural
instrument creation by providing a set of widgets.
Each of these widgets represents an intuitive, high-level gesture that can
provide a continuous output (such as tracking the performer's arm "stretch")
or trigger a discrete event (such as a "punch"). While individually very simple,
combining multiple widgets can enable in complex interactions with the instrument
since many gestures are not independent.

<img src="https://raw.githubusercontent.com/kyzyx/KIB/master/Paper/figures/kib.png" />

## System Implementation ##
The Kinect Instrument Builder consists of two distinct components. The instrument
design interface is a web application that allows the user to rapidly construct a
widget-based instrument. The user can load the resulting instrument into the
performance interface, which will process gesture recognition for the widgets and
output OSC messages as appropriate. It will also display a visualization to
provide real-time
feedback to the performer and visual interest to the audience.

[Visit the instrument design interface](http://homes.cs.washington.edu/~edzhang/Interface/index.html)

[Project on Github](https://github.com/kyzyx/KIB)
