/* create canavs */
var canvas = document.createElement('div')
canvas.id = 'canvas'
with (canvas.style) {
  width = '1px'
  height = '1px'
  overflow = 'hidden'
}
document.getElementsByTagName('body')[0].appendChild(canvas)
window.draw = SVG(canvas)

/* define some svg data */
window.rawSVG = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"    width="500px" height="500px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve"><line id="line1234" fill="none" stroke="#FF7BAC" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" x1="138.682" y1="250" x2="293.248" y2="95.433"/><rect id="rect1235" x="22.48" y="19.078" fill="#F7931E" stroke="#C1272D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="94.972" height="94.972"/><path id="path1236" opacity="0.5" fill="#29ABE2" d="M189.519,131.983c0,5.523-4.477,10-10,10H92.257c-5.523,0-10-4.477-10-10V53.659 c0-5.523,4.477-10,10-10h87.262c5.523,0,10,4.477,10,10V131.983z"/><circle id="circle1237" opacity="0.8" fill="#8CC63F" cx="201.603" cy="159.508" r="69.067" transform="rotate(45,80,120)"/><polygon id="polygon1238" fill="none" stroke="#8C6239" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" transform="rotate(45,80,120) matrix(-0.5, 0,0,1.5, 0,1) scale( 0.3, 0.5 ) skewX(-30) skewY(99.99999) translate(-10,   655)" points="286.331,287.025  227.883,271.365 212.221,212.915 255.009,170.127 313.459,185.789 329.119,244.237 "/><use id="use1239" x="100" y="100" xlink:href="#polygon1238" /></svg>'

/* single svg node, without closing tag */
window.rawSingle = '<polygon id="polygon1238" fill="none" stroke="#8C6239" stroke-width="20" stroke-linecap="round" stroke-miterlimit="10" transform="rotate(45,80,120) matrix(-0.5, 0,0,1.5, 0,1) scale( 0.3, 0.5 ) skewX(-30) skewY(99.99999) translate(-10,   655)" points="286.331,287.025  227.883,271.365 212.221,212.915 255.009,170.127 313.459,185.789 329.119,244.237 "/>'

/* single svg node with closing tag */
window.rawSingleClosing = '<rect id="rect1235" x="22.48" y="19.078" fill="#F7931E" stroke="#C1272D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="94.972" height="94.972"></rect>'

/* svg example from inkscape */
window.rawInkscapeSVG = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!-- Created with Inkscape (http://www.inkscape.org/) --><svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="744.09448819" height="1052.3622047" id="svg2" version="1.1" inkscape:version="0.48.2 r9819" sodipodi:docname="path.svg"> <defs id="defs4" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="1.1607422" inkscape:cx="202.69645" inkscape:cy="657.84284" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="960" inkscape:window-height="1152" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" /> <metadata id="metadata7"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"> <path style="fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M 25.845533,59.893732 180.05721,25.433022 237.7789,96.077478 24.984015,136.56881 159.38078,62.478286" id="path3083" inkscape:connector-curvature="0" /> </g></svg>'