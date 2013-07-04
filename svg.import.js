// svg.import.js 0.11 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license
;(function() {
  var convertNodes, objectifyAttributes, objectifyTransformations

  // Convert nodes to svg.js elements
  convertNodes = function(nodes, context, level, store, block) {
    var i, l, j, key, element, type, child, attr, transform, clips
    
    for (i = 0, l = nodes.length; i < l; i++) {
      child = nodes[i]
      attr  = {}
      clips = []
      
      /* get node type */
      type = child.nodeName.toLowerCase()
      
      /*  objectify attributes */
      attr = objectifyAttributes(child)
     
      /* create elements */
      switch(type) {
        case 'rect':
        case 'circle':
        case 'ellipse':
          element = context[type](0,0)
        break
        case 'line':
          element = context.line(0,0,0,0)
        break
        case 'text':
          if (child.childNodes.length == 0) {
            element = context[type](child.textContent)
  
          } else {
            var grandchild
  
            element = null
  
            for (j = 0; j < child.childNodes.length; j++) {
              grandchild = child.childNodes[j]
  
              if (grandchild.nodeName.toLowerCase() == 'tspan') {
                if (element === null)
                  /* first time through call the text() function on the current context */
                  element = context[type](grandchild.textContent)
  
                else
                  /* for the remaining times create additional tspans */
                  element
                    .tspan(grandchild.textContent)
                    .attr(objectifyAttributes(grandchild))
              }
            }
  
          }
        break
        case 'path':
        case 'polygon':
        case 'polyline':
          element = context[type]()
        break
        case 'image':
          element = context.image(attr['xlink:href'])
        break
        case 'g':
        case 'svg':
          element = context[type == 'g' ? 'group' : 'nested']()
          convertNodes(child.childNodes, element, level + 1, store, block)
        break
        case 'defs':
          convertNodes(child.childNodes, context.defs(), level + 1, store, block)
        break
        case 'use':
          element = context.use()
        break
        case 'clippath':
        case 'mask':
          element = context[type == 'mask' ? 'mask' : 'clip']()
          convertNodes(child.childNodes, element, level + 1, store, block)
        break
        case 'lineargradient':
        case 'radialgradient':
          element = context.defs().gradient(type.split('gradient')[0], function(stop) {
            for (var j = 0; j < child.childNodes.length; j++) {
              stop
                .at(objectifyAttributes(child.childNodes[j]))
                .style(child.childNodes[j].getAttribute('style'))
            }
          })
        break
        case '#comment':
        case '#text':
        case 'metadata':
        case 'desc':
          /* safely ignore these elements */
        break
        default:
          console.log('SVG Import got unexpected type ' + type, child)
        break
      }
      
      /* parse unexpected attributes */
      switch(type) {
        case 'circle':
          attr.rx = attr.r
          attr.ry = attr.r
          delete attr.r
        break
      }
      
      if (element) {
        /* parse transform attribute */
        transform = objectifyTransformations(attr.transform)
        delete attr.transform

        /* set attributes and transformations */
        element
          .attr(attr)
          .transform(transform)
  
        /* store element by id */
        if (element.attr('id'))
          store[element.attr('id')] = element
  
        /* now that we've set the attributes "rebuild" the text to correctly set the attributes */
        if (type == 'text')
          element.rebuild()
  
        /* call block if given */
        if (typeof block == 'function')
          block.call(element)
      }
    }
    
    return context
  }

  // Convert attributes to an object
  objectifyAttributes = function(child) {
    var i
      , attrs = child.attributes || []
      , attr  = {}
    
    /* gether attributes */
    for (i = attrs.length - 1; i >= 0; i--)
      attr[attrs[i].nodeName] = attrs[i].nodeValue
  
    return attr
  }

  // Convert transformations to an object
  objectifyTransformations = function(transform) {
    var i, t, v
      , trans = {}
      , list  = (transform || '').match(/[A-Za-z]+\([^\)]+\)/g) || []
      , def   = SVG.defaults.trans()

    /* gather transformations */
    for (i = list.length - 1; i >= 0; i--) {
      /* parse transformation */
      t = list[i].match(/([A-Za-z]+)\(([^\)]+)\)/)
      v = (t[2] || '').replace(/^\s+/,'').replace(/,/g, ' ').replace(/\s+/g, ' ').split(' ')

      /* objectify transformation */
      switch(t[1]) {
        case 'matrix':
          trans.a         = parseFloat(v[0]) || def.a
          trans.b         = parseFloat(v[1]) || def.b
          trans.c         = parseFloat(v[2]) || def.c
          trans.d         = parseFloat(v[3]) || def.d
          trans.e         = parseFloat(v[4]) || def.e
          trans.f         = parseFloat(v[5]) || def.f
        break
        case 'rotate':
          trans.rotation  = parseFloat(v[0]) || def.rotation
          trans.cx        = parseFloat(v[1]) || def.cx
          trans.cy        = parseFloat(v[2]) || def.cy
        break
        case 'scale':
          trans.scaleX    = parseFloat(v[0]) || def.scaleX
          trans.scaleY    = parseFloat(v[1]) || def.scaleY
        break
        case 'skewX':
          trans.skewX     = parseFloat(v[0]) || def.skewX
        break
        case 'skewY':
          trans.skewY     = parseFloat(v[0]) || def.skewY
        break
        case 'translate':
          trans.x         = parseFloat(v[0]) || def.x
          trans.y         = parseFloat(v[1]) || def.y
        break
      }
    }

    return trans
  }

  SVG.extend(SVG.Container, {
    // Add import method to container elements
    svg: function(raw, block) {
      /* create temporary div to receive svg content */
      var well = document.createElement('div')
        , store = {}
      
      /* properly close svg tags and add them to the DOM */
      well.innerHTML = raw
        .replace(/\n/, '')
        .replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>')
      
      /* convert nodes to svg elements */
      convertNodes(well.childNodes, this, 0, store, block)
      
      /* mark temporary div for garbage collection */
      well = null
      
      return store
    }
    
  })

}).call(this)