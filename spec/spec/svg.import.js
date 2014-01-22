describe('Import', function() {
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('svg()', function() {
    
    it('stores imported element in an instance of SVG.ImportStore', function() {
      var store = draw.svg(rawSVG)
      expect(store instanceof SVG.ImportStore).toBe(true)
    })
    
    it('makes imported elements accessible in store with their ID', function() {
      var store = draw.svg(rawSVG)
      expect(!!store.get('line1234')).toBe(true)
      expect(!!store.get('rect1235')).toBe(true)
      expect(!!store.get('path1236')).toBe(true)
      expect(!!store.get('circle1237')).toBe(true)
      expect(!!store.get('polygon1238')).toBe(true)
    })
    
    it('typecasts imported elements correctly', function() {
      var store = draw.svg(rawSVG)
      expect(store.get('line1234') instanceof SVG.Line).toBe(true)
      expect(store.get('rect1235') instanceof SVG.Rect).toBe(true)
      expect(store.get('path1236') instanceof SVG.Path).toBe(true)
      expect(store.get('circle1237') instanceof SVG.Ellipse).toBe(true)
      expect(store.get('polygon1238') instanceof SVG.Polygon).toBe(true)
    })
    
    it('applies a passed block to every element in the structure', function() {
      var expected = ('line1234 rect1235 path1236 circle1237 polygon1238 use1239 Layer_1').split(' ')
        , ids = []
        , store = draw.svg(rawSVG, function() { ids.push(this.attr('id')) })
      
      expect(ids).toEqual(expected)
    })

    it('accepts individual svg nodes', function() {
      var store = draw.svg(rawSingle)

      expect(store.get('polygon1238') instanceof SVG.Polygon).toBe(true)
    })

    it('accepts individual svg nodes with closing tag', function() {
      var store = draw.svg(rawSingleClosing)

      expect(store.get('rect1235') instanceof SVG.Rect).toBe(true)
    })

    it('imports the use element correctly', function() {
      var store = draw.svg(rawSVG)
      
      expect(store.get('use1239') instanceof SVG.Use).toBe(true)
      expect(store.get('use1239').attr('xlink:href')).toBe('#' + store.polygon1238)
    })

    describe('parses transformation', function() {
      var store, poly

      beforeEach(function() {
        store = draw.svg(rawSVG)
        poly = SVG.get('polygon1238')
      })

      it('attribute', function() {
        var circle = SVG.get('circle1237')

        expect(circle.attr('transform')).toBe('rotate(45 80 120)')
        expect(circle.transform('rotation')).toBe(45)
      })
      it('rotate and rotation point', function() {
        expect(poly.transform('rotation')).toBe(45)
        expect(poly.transform('cx')).toBe(80)
        expect(poly.transform('cy')).toBe(120)
      })
      it('matrix', function() {
        expect(poly.transform('a')).toBe(-0.5)
        expect(poly.transform('b')).toBe(0)
        expect(poly.transform('c')).toBe(0)
        expect(poly.transform('d')).toBe(1.5)
        expect(poly.transform('e')).toBe(0)
        expect(poly.transform('f')).toBe(1)
      })
      it('scale', function() {
        expect(poly.transform('scaleX')).toBe(0.3)
        expect(poly.transform('scaleY')).toBe(0.5)
      })
      it('skewX', function() {
        expect(poly.transform('skewX')).toBe(-30)
      })
      it('skewY', function() {
        expect(poly.transform('skewY')).toBe(99.99999)
      })
      it('translate', function() {
        expect(poly.transform('x')).toBe(-10)
        expect(poly.transform('y')).toBe(655)
      })
    })
    
  })
  
})





