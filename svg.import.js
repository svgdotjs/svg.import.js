// svg.import.js 0.1 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license

SVG.extend(SVG.Container, {
  // Add import method to container elements
  import: function(raw) {
    /* create temporary div to receive svg content */
    var well = document.createElement('div');
    
    /* properly close svg tags and add them to the DOM */
    well.innerHTML = raw.replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>');
    
    /* convert nodes to svg elements */
    this._convertNodes(well.childNodes, this, 0);
    
    /* mark temporary div for garbage collection */
    well = null;
    
    return this;
  }
  // Convert nodes to svg.js elements
, _convertNodes: function(nodes, context, level) {
    var i, l, n, key, attrs;
    
    for (i = 0, l = nodes.length; i < l; i++) {
      var element, type
        , child = nodes[i]
        , attr  = {};
      
      /* get node type */
      type = child.nodeName.toLowerCase();
      
      /*  objectify attributes */
      attrs = child.attributes || [];
      
      for (n = attrs.length - 1; n >= 0; n--)
        attr[attrs[n].nodeName] = attrs[n].nodeValue;
      
      /* create elements */
      switch(type) {
        case 'rect':
        case 'circle':
        case 'ellipse':
          element = context[type](0,0);
        break;
        case 'line':
          element = context.line(0,0,0,0);
        break;
        case 'text':
        case 'path':
        case 'polygon':
        case 'polyline':
          element = context[type]();
        break;
        case 'image':
          element = context.image(attr['xlink:href']);
        break;
        case 'g':
        case 'svg':
          if (type == 'svg' && level == 0) {
            this._convertNodes(child.childNodes, context, level + 1);
            return context;
          } else {
            element = context[type == 'g' ? 'group' : 'nested']();
            this._convertNodes(child.childNodes, element, level + 1);
          }
        break;
      };
      
      /* parse attributes */
      switch(type) {
        case 'circle':
          attr.rx = attr.r;
          attr.ry = attr.r;
          delete attr.r;
        break;
      };
      
      /* set attributes */
      if (element)
        element.attr(attr);
    };
    
    return context;
  }
  
});
