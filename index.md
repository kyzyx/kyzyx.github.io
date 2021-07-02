---
layout: page
title: Edward Zhang
customjs:
    - redirect.js
(*tagline: Supporting tagline*)
---
{% include JB/setup %}

<img src="{{ BASE_PATH }}/images/home/edzhang.jpg" class='img-left'/>

#### Research Scientist ####

#### Apple, Inc. ####

#### Email: <edzhang@cs.washington.edu> ####

<h2 style="clear: both"> About </h2>
I am currently a Research Scientist at Apple in Seattle. My research interests lie at the intersection of computer graphics and computer vision, with a focus on AR/VR applications.

Previously, I received my PhD from the [Paul G. Allen School of Computer Science and Engineering](http://www.cs.washington.edu) at the University of Washington,
supervised by [Brian Curless](http://homes.cs.washington.edu/~curless/) and [Michael Cohen](http://research.microsoft.com/en-us/um/people/cohen/).

I recieved my B.S.E. in Computer Science from Princeton University, where I did research with 
[Rebecca Fiebrink](http://www.cs.princeton.edu/~fiebrink/Rebecca_Fiebrink/welcome.html) and
[Szymon Rusinkiewicz](http://www.cs.princeton.edu/~smr/). 

## Research
My PhD research involved capturing lighting and reflectance in indoor scenes. Using this data we
can edit and rerender the scene with accurate illumination, shadows, and lighting effects.

Edward Zhang, Ricardo Martin-Brualla, Janne Kontkanen, Brian Curless. 2021. "No Shadow Left Behind: Removing Objects and their Shadows using Approximate Lighting and Geometry". <i>The IEEE Conference on Computer Vision and Pattern Recognition (CVPR) 2021</i><br>
[Project Page]({% post_url 2020-12-21-no-shadow-left-behind-removing-objects-and-their-shadows-using-approximate-lighting-and-geometry %}) | [Arxiv](https://arxiv.org/abs/2012.10565)

Edward Zhang, Michael F. Cohen, Brian Curless. 2018.  "Discovering Point Lights with Intensity Distance Fields". <i>The IEEE Conference on Computer Vision and Pattern Recognition (CVPR) 2018</i><br>
[Project Page]({% post_url 2018-03-28-discovering-point-lights-with-intensity-distance-fields %})

Edward Zhang, Michael F. Cohen, Brian Curless. 2016. "Emptying, Refurnishing, and Relighting Indoor Spaces". <i>ACM Transactions on Graphics (Proceedings of SIGGRAPH Asia 2016)</i> <br>
[Project Page]({% post_url 2016-09-27-emptying-refurnishing-and-relighting-indoor-spaces %})


## Blog
<ul class="posts">
  {% for post in site.posts limit:2 %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

