import findClosestTimelineMark from '../findClosestTimelineMark'

describe('findClosestTimelineMark', () => {
  it('returns the closest mark when time is exact match', () => {
    const marks = [
      { title: '0s', height: 10, position: 0, time: 0 },
      { title: '1s', height: 20, position: 1, time: 1000 },
      { title: '2s', height: 10, position: 2, time: 2000 },
    ]
    const time = 1000
    const expectedMark = { title: '1s', height: 20, position: 1, time: 1000 }

    const closestMark = findClosestTimelineMark(marks, time)

    expect(closestMark).toEqual(expectedMark)
  })

  it('returns the closest mark when time is not an exact match', () => {
    const marks = [
      { title: '0s', height: 10, position: 0, time: 0 },
      { title: '1s', height: 20, position: 1, time: 1000 },
      { title: '2s', height: 10, position: 2, time: 2000 },
    ]
    const time = 1500
    const expectedMark = { title: '1s', height: 20, position: 1, time: 1000 }

    const closestMark = findClosestTimelineMark(marks, time)

    expect(closestMark).toEqual(expectedMark)
  })

  it('returns the first mark when there are multiple equally close marks', () => {
    const marks = [
      { title: '0s', height: 10, position: 0, time: 0 },
      { title: '1s', height: 20, position: 1, time: 1000 },
      { title: '2s', height: 10, position: 2, time: 2000 },
    ]
    const time = 1500
    const expectedMark = { title: '1s', height: 20, position: 1, time: 1000 }

    const closestMark = findClosestTimelineMark(marks, time)

    expect(closestMark).toEqual(expectedMark)
  })
})
