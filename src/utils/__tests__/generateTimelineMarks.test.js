import { REM_TO_PX_COEFFICIENT, MAX_DURATION } from '@animato/constants'
import generateTimelineMarks from '../generateTimelineMarks'

describe('generateTimelineMarks', () => {
  it('generates correct timeline marks for zoom <= 15', () => {
    const zoom = 10
    
    const marks = generateTimelineMarks(zoom)

    expect(marks).toHaveLength(51)

    expect(marks[0].position).toBe(0)
    expect(marks[0].time).toBe(0)
    expect(marks[0].title).toBe('0m')

    expect(marks[10].position).toBe(107)
    expect(marks[10].time).toBe(60000)
    expect(marks[10].title).toBe('1m')

    expect(marks[50].position).toBe(533)
    expect(marks[50].time).toBe(300000)
    expect(marks[50].title).toBe('5m')
  })

  it('generates correct timeline marks for zoom <= 30', () => {
    const zoom = 25
    
    const marks = generateTimelineMarks(zoom)

    expect(marks).toHaveLength(301)

    expect(marks[0].position).toBe(0)
    expect(marks[0].time).toBe(0)
    expect(marks[0].title).toBe('0s')

    expect(marks[10].position).toBe(133)
    expect(marks[10].time).toBe(10000)
    expect(marks[10].title).toBe('10s')

    expect(marks[300].position).toBe(4000)
    expect(marks[300].time).toBe(300000)
    expect(marks[300].title).toBe('300s')
  })

  it('generates correct timeline marks for zoom > 30', () => {
    const zoom = 40
    
    const marks = generateTimelineMarks(zoom)

    expect(marks).toHaveLength(3001)

    expect(marks[0].position).toBe(0)
    expect(marks[0].time).toBe(0)
    expect(marks[0].title).toBe('0s')

    expect(marks[10].position).toBe(107)
    expect(marks[10].time).toBe(1000)
    expect(marks[10].title).toBe('1s')

    expect(marks[3000].position).toBe(32000)
    expect(marks[3000].time).toBe(300000)
    expect(marks[3000].title).toBe('300s')
  })

  it('generates correct timeline marks for zoom breakpoint', () => {
    const zoom = 15
    
    const marks = generateTimelineMarks(zoom)

    expect(marks).toHaveLength(51)

    expect(marks[0].position).toBe(0)
    expect(marks[0].time).toBe(0)
    expect(marks[0].title).toBe('0m')

    expect(marks[10].position).toBe(160)
    expect(marks[10].time).toBe(60000)
    expect(marks[10].title).toBe('1m')

    expect(marks[50].position).toBe(800)
    expect(marks[50].time).toBe(300000)
    expect(marks[50].title).toBe('5m')
  })
})
