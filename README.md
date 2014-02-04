# svg.import.js

This is a plugin for the [svg.js](http://svgjs.com) library to import raw SVG data.

Svg.import.js is licensed under the terms of the MIT License.

## Warning
Form version 1.0.0 this plugin depends on [svg.parser.js plugin](https://github.com/wout/svg.parser.js).


## Usage


First included the [svg.parser.js plugin](https://github.com/wout/svg.parser.js), then include this plugin after including svg.js in your html document.

```javascript
var rawSvg = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="500px" height="500px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve"><line id="line1234" fill="none" stroke="#FF7BAC" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" x1="138.682" y1="250" x2="293.248" y2="95.433"/><rect id="rect1235" x="22.48" y="19.078" fill="#F7931E" stroke="#C1272D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="94.972" height="94.972"/><path id="path1236" opacity="0.5" fill="#29ABE2" d="M189.519,131.983c0,5.523-4.477,10-10,10H92.257c-5.523,0-10-4.477-10-10V53.659	c0-5.523,4.477-10,10-10h87.262c5.523,0,10,4.477,10,10V131.983z"/><circle id="circle1237" opacity="0.8" fill="#8CC63F" cx="201.603" cy="159.508" r="69.067"/><polygon id="polygon1238" fill="none" stroke="#8C6239" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" points="286.331,287.025 	227.883,271.365 212.221,212.915 255.009,170.127 313.459,185.789 329.119,244.237 "/></svg>'

var draw = SVG('drawing')

draw.svg(rawSvg)
```

## References
All imported elements with an id will be stored. The object with all stored elements is returned by the import method:

```javascript
var rawSvg = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="500px" height="500px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve"><line id="line1234" fill="none" stroke="#FF7BAC" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" x1="138.682" y1="250" x2="293.248" y2="95.433"/><rect id="rect1235" x="22.48" y="19.078" fill="#F7931E" stroke="#C1272D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="94.972" height="94.972"/><path id="path1236" opacity="0.5" fill="#29ABE2" d="M189.519,131.983c0,5.523-4.477,10-10,10H92.257c-5.523,0-10-4.477-10-10V53.659	c0-5.523,4.477-10,10-10h87.262c5.523,0,10,4.477,10,10V131.983z"/><circle id="circle1237" opacity="0.8" fill="#8CC63F" cx="201.603" cy="159.508" r="69.067"/><polygon id="polygon1238" fill="none" stroke="#8C6239" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" points="286.331,287.025 	227.883,271.365 212.221,212.915 255.009,170.127 313.459,185.789 329.119,244.237 "/></svg>'

var draw = SVG('drawing')

var store = draw.svg(rawSvg)

store.get('polygon1238').fill('#f06')
```

## Store object
The returned store object is an instance of `SVG.ImportStore`. This object has some methods of its own.

### get
Get an imported element by their id, if they have an id:

```javascript
var store = draw.svg(rawSvg)

store.get('polygon1238').fill('#f06')
```

Duplicate id's will get a random number appended and warnings about this will be logged to the console.

### roots
All root elements will be stored and can be retreived with the `roots()` method.

```javascript
var store = draw.svg(rawSvg)

store.roots() //-> returns an array with root nodes
```

The `roots()` method will also serve as an iterator if a function is passed as the first argument:

```javascript
var store = draw.svg(rawSvg)

store.roots(function() {
	console.log(this.type)
})
```

A word on "roots", typically there will be only one root, the `<svg>` tag. The great thing about this plugin is that you can also import partial svg like this:

```xml
<line id="line1234" fill="none" stroke="#FF7BAC" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" x1="138.682" y1="250" x2="293.248" y2="95.433"/>
<rect id="rect1235" x="22.48" y="19.078" fill="#F7931E" stroke="#C1272D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="94.972" height="94.972"/>
<path id="path1236" opacity="0.5" fill="#29ABE2" d="M189.519,131.983c0,5.523-4.477,10-10,10H92.257c-5.523,0-10-4.477-10-10V53.659	c0-5.523,4.477-10,10-10h87.262c5.523,0,10,4.477,10,10V131.983z"/><circle id="circle1237" opacity="0.8" fill="#8CC63F" cx="201.603" cy="159.508" r="69.067"/>
<g>
	<polygon id="polygon1238" fill="none" stroke="#8C6239" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" points="286.331,287.025 	227.883,271.365 212.221,212.915 255.009,170.127 313.459,185.789 329.119,244.237 "/>
</g>
```

In this case there are four roots, namely a `<line>`, `<rect>`, `<path>` and a `<g>` element.

### remove

The whole imported set of elements can be removed with just one method:

```javascript
var store = draw.svg(rawSvg)

store.remove()
```


## Block
If a block is passed as the second argument it will be applied to every element individually. This is particularly useful if you want to mark every element to make referencing easier:

```javascript
var id = 1
draw.svg(rawSvg, function(level) {
  this.data('import-id', 'element-' + id)
  id++
})
```

## Dependencies
This plugin depends on the [svg.parser.js plugin](https://github.com/wout/svg.parser.js).


## Test it yourself
You can go ahead and test the script yourself here:
http://svgjs.com/import

Just make sure you export plain SVG from programs like Inkscape or Illustrator.


## Important
This plugin is still under development and will be improved in the coming months.
Please report issues and suggestions are welcome too.

## To-do
- Importing text, defs and patterns properly
- Parse `data-` attributes