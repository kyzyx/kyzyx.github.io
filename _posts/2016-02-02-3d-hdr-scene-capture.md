---
layout: post
title: "3D HDR Scene Capture"
description: ""
category: 
customjs: ["https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML"]
tags: [technical, research, tango]
---
{% include JB/setup %}

In this post, I'll show some of our scene capture results. I'll also briefly
talk about the exposure correction steps that went into these results.

These results were captured using Google's Project Tango Tablet. The 
characteristics of the Tango tablet and the basic capture process will
be described in the [next post]({% post_url 2016-02-03-capturing-scenes-with-the-project-tango-tablet %}).

These scans were all captured in about 10 minutes each. The results shown are
generated mostly automatically, with the only manual step being the removal of some
bad image frames (which could easily be done automatically).

## Results ##

The following results are all screenshots taken in Meshlab of colored meshes.
On the left is a view taken from inside the room, while the right has a top
view of the scene. Linear tonemapping is applied to the mesh colors, as well
as a gamma transform.

{% include image.html image="posts/hdrresults/results1.png" caption="Bedroom scene A, lit by window on overcast day. Mesh with 170K vertices." %}
{% include sketchfab_embed.html meshid="2f24eb9731e340598eb78f566fe87e05" %}

---

{% include image.html image="posts/hdrresults/results2.png" caption="Bedroom scene B, lit by incandescent light on ceiling. Mesh with 120K vertices. " %}
{% include sketchfab_embed.html meshid="b4330e7d02d041f9aaf95510757696e8" %}

---

{% include image.html image="posts/hdrresults/results3.png" caption="Office scene, lit by window on partly cloudy day and 4 incandescent lights on shelves. Mesh with 350K vertices." %}
{% include sketchfab_embed.html meshid="d004278acc204cc59da3c560c105e33e" %}

## High Dynamic Range ##

Note that all of our results are in high dynamic range.

{% include image.html image="posts/hdrresults/hdr.png" caption="Bedroom scene A, dynamic range. Left corresponds to a high exposure time, revealing detail beneath the desk. Right corresponds to a low exposure time, showing some detail out the window." %}

To obtain these results, we must perform radiometric calibration on the input frames. Without our radiometric calibration pipeline, we get low quality, low dynamic range meshes.

{% include image.html image="posts/hdrresults/noexp.png" caption="Bedroom scene A, without radiometric calibration. Note the obvious color discontinuties near the
window and on the floor." %}

{% include image.html image="posts/hdrresults/exp.png" caption="Bedroom scene A, with radiometric calibration. Some artifacts remain in the far corner, behind the computer monitor; these are due to inaccurate poses in the original input stream." %}

## Radiometric Calibration ##

The images provided by most cameras, including the Tango, usually have autoexposure and auto-white-balance applied for optimal image quality. Unfortunately, this results in inconsistent appearance when the images are combined on the scene geometry. Our problem is basically to undo autoexposure, i.e. obtain a per-frame exposure
time that lets us put the images into one common reference space.

Fortunately, this problem is fairly well understood in many contexts.
The formulation most similar to ours is the one commonly used in panorama stitching.

{% include image.html image="posts/hdrresults/panoramastitching.png" caption="In panorama stitching, multiple images, often with different exposures (top) need to be blended together (bottom). From Goldman & Chen 2005, <a href='http://grail.cs.washington.edu/projects/vignette/vign.iccv05.pdf'>http://grail.cs.washington.edu/projects/vignette/vign.iccv05.pdf</a>" %}

Exposure correction in panorama stitching goes something like this:

1. Find correspondences in the images.
2. Warp the images and project them into a new coordinate space so that
   correspondences overlap. This puts pixels of images into dense correspondence
3. Each set of pixels in the original images that map to the same warped
   coordinates should have the same "true" radiance value (which is unknown; any
   difference in pixel value should just be due to per-frame camera effects
   (i.e. exposure)
4. Jointly optimize both the set of "true" radiance values and the per-frame
   exposures by minimizing the difference between each original image pixel
   (tranformed by the frame's exposure) and its "true" radiance.

Mathematically,

* Let the camera response function $$f(b,t)$$ map radiance $$b$$ to
  a (0-255) pixel value given an exposure time $$t$$.
* Let frame $$i$$ have exposure time $$t_i$$
* Let point $$j$$ in the final panorama space have an unknown true
  radiance $$b_j$$. 
* Let $$x_{ij}$$ be the value of the pixel in image $$i$$ that maps to point $$j$$ 
  in the final panorama space.

Then we want to optimize &nbsp; $$\min_{t_i,b_j}\sum_{i,j}{(f(b_j,t_i) - x_{ij})^2}$$

Fun tidbit - this formulation is identical to the [Bundle Adjustment](https://en.wikipedia.org/wiki/Bundle_adjustment)
formulation used in Structure from Motion. This means we can use the many tools and methods used in
bundle adjustment to solve this optimization problem robustly and efficiently. In practice,
we just toss everything into [Ceres Solver](http://ceres-solver.org/) and let it work its magic.

Of course, we can't just directly apply the panorama stitching methods to our task.
With our moving camera, the parallax caused from nearby objects means that simple
image warps are not going to globally align our frames very effectively. Instead,
we make use of the scene geometry and camera poses we have.

Now, instead of warping images, we project them onto the scene geometry.
Each set of pixels in the original images that map to the same *mesh vertex*
should have the same "true" radiance value (given a Lambertian assumption).
Then we can proceed with the bundle adjustment as usual. In our results,
we have a simple linear camera response (after gamma correction) $$f(b,t) = tb$$,
and we just use the L2 norm as illustrated above.

One last detail: To make our solution cleaner, we want to throw away as many
bad correspondences as possible. Bad correspondences will usually occur near
depth discontinuities, where even minor misregistrations will put pixels from
one object onto another one. So when projecting, we mask out pixels near
edges to minimize this effect.

{% include image.html image="posts/hdrresults/edgemask.png" caption="Masking the pixels near edges reduces the number of bad correspondences. The edge mask is computed by thresholding the gradient magnitude." %}
