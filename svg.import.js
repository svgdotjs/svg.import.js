// svg.import.js 0.6 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license
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
    this._convertNodes(well.childNodes, this, 0, store, block)
    
    /* mark temporary div for garbage collection */
    well = null
    
    return store
  }

  // Private: convert attributes to an object
, _objectifyAttributes: function(child) {
    var n
      , attrs = child.attributes || []
      , attr  = {}

    for (n = attrs.length - 1; n >= 0; n--)
      attr[attrs[n].nodeName] = attrs[n].nodeValue

    return attr
  }

  // Private: convert nodes to svg.js elements
, _convertNodes: function(nodes, context, level, store, block) {
    var i, l, j, key, element, type, child, attr, clips
    
    for (i = 0, l = nodes.length; i < l; i++) {
      child = nodes[i]
      attr  = {}
      clips = []
      
      /* get node type */
      type = child.nodeName.toLowerCase()
      
      /*  objectify attributes */
      attr = this._objectifyAttributes(child)
     
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
                    .attr(this._objectifyAttributes(grandchild))
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
          this._convertNodes(child.childNodes, element, level + 1, store, block)
        break
        case 'defs':
          var j, grandchild, node, name

          for (j = 0; j < child.childNodes.length; j++) {
            grandchild = child.childNodes[j]
            name = grandchild.nodeName.toLowerCase()

            if (name == 'clippath' || name == 'mask') {
              node = this.defs()
                .put(name == 'mask' ? new SVG.Mask : new SVG.Clip)
                .attr(this._objectifyAttributes(grandchild))

              this._convertNodes(grandchild.childNodes, node, level + 1, store, block)
            }
          }
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
        /* set attributes */
        element.attr(attr)

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
  
})
