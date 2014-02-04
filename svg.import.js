// svg.import.js 1.0.1 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license
;(function() {

  // Convert nodes to svg.js elements
  function convertNodes(nodes, context, level, store, block) {
    var i, l, j, key, element, type, child, attr, transform, clips
    
    for (i = 0, l = nodes.length; i < l; i++) {
      child = nodes[i]
      attr  = {}
      clips = []
      
      /* get node type */
      type = child.nodeName.toLowerCase()
      
      /*  objectify attributes */
      attr = SVG.parse.attr(child)
     
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
          if (child.childNodes.length < 2) {
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
                    .attr(SVG.parse.attr(grandchild))
              }
            }
  
          }
        break
        case 'path':
          element = context.path(attr['d'])
        break
        case 'polygon':
        case 'polyline':
          element = context[type](attr['points'])
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
                .at({ offset: 0 })
                .attr(SVG.parse.attr(child.childNodes[j]))
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
        transform = SVG.parse.transform(attr.transform)
        delete attr.transform

        /* set attributes and transformations */
        element
          .attr(attr)
          .transform(transform)
  
        /* store element by id */
        if (element.attr('id'))
          store.add(element.attr('id'), element, level == 0)

        /* now that we've set the attributes "rebuild" the text to correctly set the attributes */
        if (type == 'text')
          element.rebuild()
  
        /* call block if given */
        if (typeof block == 'function')
          block.call(element, level)
      }
    }
    
    return context
  }

  SVG.extend(SVG.Container, {
    // Add import method to container elements
    svg: function(raw, block) {
      /* create temporary div to receive svg content */
      var well = document.createElement('div')
        , store = new SVG.ImportStore
      
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

  SVG.ImportStore = function() {
    this._importStoreRoots = new SVG.Set
    this._importStore = {}
  }

  SVG.extend(SVG.ImportStore, {
    add: function(key, element, root) {
      /* store element in local store object */
      if (key) {
        if (this._importStore[key]) {
          var oldKey = key
          key += Math.round(Math.random() * 1e16)
          console.warn('Encountered duplicate id "' + oldKey + '". Changed store key to "' + key + '".')
        }

        this._importStore[key] = element
      }

      /* add element to root set */
      if (root === true)
        this._importStoreRoots.add(element)

      return this
    }
    /* get array with root elements */
  , roots: function(iterator) {
      if (typeof iterator == 'function') {
        this._importStoreRoots.each(iterator)

        return this
      } else {
        return this._importStoreRoots.valueOf()
      }
    }
    /* get an element by id */
  , get: function(key) {
      return this._importStore[key]
    }
    /* remove all imported elements */
  , remove: function() {
      return this.roots(function() {
        this.remove()
      })
    }

  })

}).call(this);