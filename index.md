---
layout: page
title: Edward Zhang
(*tagline: Supporting tagline*)
---
{% include JB/setup %}

<img src="{{ BASE_PATH }}/images/home/edzhang.jpg" class='img-left'/>

#### Graduate Student ####

#### Computer Science and Engineering ####

#### University of Washington ####

#### Email: <edzhang@cs.washington.edu> ####

<h2 style="clear: both"> About </h2>
I'm a PhD student in [Computer Science and Engineering](http://www.cs.washington.edu) at the University of Washington,
supervised by [Brian Curless](http://homes.cs.washington.edu/~curless/) and [Michael Cohen](http://research.microsoft.com/en-us/um/people/cohen/).
I'm broadly interested in computer graphics and vision; I also have interests in interfaces for 3D interaction.

I recieved my B.S.E. in Computer Science from Princeton University, where I did research with 
[Rebecca Fiebrink](http://www.cs.princeton.edu/~fiebrink/Rebecca_Fiebrink/welcome.html) and
[Szymon Rusinkiewicz](http://www.cs.princeton.edu/~smr/). 

## Research
My current research involves capturing lighting and reflectance in indoor scenes. Using this data we
can edit and rerender the scene with accurate illumination, shadows, and lighting effects.

## Blog
<ul class="posts">
  {% for post in site.posts limit:2 %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

