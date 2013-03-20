// svg.import.js 0.5 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license
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
  // Convert nodes to svg.js elements
, _convertNodes: function(nodes, context, level, store, block) {
    var i, l, n, key, attrs
    
    for (i = 0, l = nodes.length; i < l; i++) {
      var element, type
        , child = nodes[i]
        , attr  = {}
      
      /* get node type */
      type = child.nodeName.toLowerCase()
      
      /*  objectify attributes */
      attrs = child.attributes || []
      
      for (n = attrs.length - 1; n >= 0; n--)
        attr[attrs[n].nodeName] = attrs[n].nodeValue
      
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
      }
      
      /* parse attributes */
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
        if (element.attr('id'))
          store[element.attr('id')] = element
        
        /* call block if given */
        if (typeof block == 'function')
          block.call(element)
      }
    }
    
    return context
  }
  
})
