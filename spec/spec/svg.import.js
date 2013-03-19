describe('Import', function() {
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('svg()', function() {
    
    it('should store imported element in an object', function() {
      var store = draw.svg(rawSVG)
      expect(typeof store).toBe('object')
    })
    
    it('should make imported elements accessible in store with their ID', function() {
      var store = draw.svg(rawSVG)
      expect(!!store.line1234).toBe(true)
      expect(!!store.rect1235).toBe(true)
      expect(!!store.path1236).toBe(true)
      expect(!!store.circle1237).toBe(true)
      expect(!!store.polygon1238).toBe(true)
    })
    
    it('should typecast imported elements correctly', function() {
      var store = draw.svg(rawSVG)
      expect(store.line1234 instanceof SVG.Line).toBe(true)
      expect(store.rect1235 instanceof SVG.Rect).toBe(true)
      expect(store.path1236.child instanceof SVG.Path).toBe(true)
      expect(store.circle1237 instanceof SVG.Ellipse).toBe(true)
      expect(store.polygon1238.child instanceof SVG.Polygon).toBe(true)
    })
    
    it('should apply a passed block to every element in the structure', function() {
      var expected = ('line1234 rect1235 path1236 circle1237 polygon1238').split(' ')
        , ids = []
        , store = draw.svg(rawSVG, function() { ids.push(this.attr('id')) })
      
      expect(ids).toEqual(expected)
    })
    
  })
  
})