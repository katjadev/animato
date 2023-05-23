import { TimelineMark } from '@animato/types'

export default function findClosestTimelineMark(marks: TimelineMark[], time: number): TimelineMark {
  return marks.reduce(function(prev, current) {
    return (Math.abs(current.time - time) < Math.abs(prev.time - time)
      ? current 
      : prev)
  }, { title: '', height: 0, position: 0, time: 0 })
}
