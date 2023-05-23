import parseProjectData from '../parseProjectData'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}))

describe('parseProjectData', () => {
  it('should parse project data and return elements', () => {
    const data = '<svg><rect id="rect1" /><circle id="circle1" /></svg>'
    const { elements } = parseProjectData(data)

    expect(elements).toHaveLength(2)
    expect(elements[0].id).toBe('rect1')
    expect(elements[0].title).toBe('rect')
    expect(elements[0].children).toHaveLength(0)

    expect(elements[1].id).toBe('circle1')
    expect(elements[1].title).toBe('circle')
    expect(elements[1].children).toHaveLength(0)
  })

  it('should generate unique IDs for elements without ID attributes', () => {
    const data = '<svg><rect /><circle /></svg>'
    const { elements } = parseProjectData(data)

    expect(elements[0].id).toBe('mocked-uuid')
    expect(elements[1].id).toBe('mocked-uuid')
  })

  it('should handle nested elements', () => {
    const data = '<svg><g><rect /><circle /></g></svg>'
    const { elements } = parseProjectData(data)

    expect(elements).toHaveLength(1)
    expect(elements[0].title).toBe('g')
    expect(elements[0].children).toHaveLength(2)
    expect(elements[0].children[0].title).toBe('rect')
    expect(elements[0].children[1].title).toBe('circle')
  })

  it('should return animation list', () => {
    const data = `<svg xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect id="test-element-1" />
      <circle id="test-element-2" data-title="custom-title" />
      <circle />
      <animate xlink:href="#test-element-1" data-title="color" id="test-color-animation" attributeName="fill" values="#02122e; #2f61a6; #8be0f9; #8be0f9; #02122e" keyTimes="0; 0.25; 0.5; 0.75; 1" dur="10s"/>
      <animate xlink:href="#test-element-1" attributeName="fill" />
      <animateTransform xlink:href="#test-element-2" data-title="scale" id="test-scale-animation" attributeName="transform" type="scale" values="0.5; 1.5; 0.5" keyTimes="0; 0.5; 1" dur="10s"/>
    </svg>`
    const { animations } = parseProjectData(data)

    expect(animations).toHaveLength(2)

    expect(animations[0].id).toBe('test-element-1')
    expect(animations[0].title).toBe('rect')
    expect(animations[0].animations).toHaveLength(2)
    expect(animations[0].animations[0].id).toBe('test-color-animation')
    expect(animations[0].animations[0].title).toBe('color')
    expect(animations[0].animations[0].duration).toBe(10)
    expect(animations[0].animations[0].values).toEqual(['#02122e', '#2f61a6', '#8be0f9', '#8be0f9', '#02122e'])
    expect(animations[0].animations[0].keyframes).toHaveLength(5)
    expect(animations[0].animations[0].keyframes[0]).toEqual({ time: 0 })
    expect(animations[0].animations[0].keyframes[1]).toEqual({ time: 2500 })
    expect(animations[0].animations[0].keyframes[2]).toEqual({ time: 5000 })
    expect(animations[0].animations[0].keyframes[3]).toEqual({ time: 7500 })
    expect(animations[0].animations[0].keyframes[4]).toEqual({ time: 10000 })

    expect(animations[1].id).toBe('test-element-2')
    expect(animations[1].title).toBe('custom-title')
    expect(animations[1].animations).toHaveLength(1)
    expect(animations[1].animations[0].id).toBe('test-scale-animation')
    expect(animations[1].animations[0].title).toBe('scale')
    expect(animations[1].animations[0].duration).toBe(10)
    expect(animations[1].animations[0].values).toEqual(['0.5', '1.5', '0.5'])
    expect(animations[1].animations[0].keyframes).toHaveLength(3)
    expect(animations[1].animations[0].keyframes[0]).toEqual({ time: 0 })
    expect(animations[1].animations[0].keyframes[1]).toEqual({ time: 5000 })
    expect(animations[1].animations[0].keyframes[2]).toEqual({ time: 10000 })
  })

  it('should return default values for empty data', () => {
    const data = ''
    const { elements, animations, duration } = parseProjectData(data)

    expect(elements).toHaveLength(0)
    expect(animations).toHaveLength(0)
    expect(duration).toBe(0)
  })
})
