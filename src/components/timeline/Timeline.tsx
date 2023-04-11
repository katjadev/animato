import { MAX_DURATION } from '@animato/constants'
import { FC, useState } from 'react'

const Timeline: FC<{}> = () => {
  const [zoom, setZoom] = useState(60)
  const marks = Array.from(Array(MAX_DURATION * 10).keys())

  return (
    <svg width={`${MAX_DURATION * 10}rem`} height='3rem'>
      {marks.map((index) => (
        <g key={index}>
          <line 
            x1={`${index}.5rem`} 
            y1='3rem' 
            x2={`${index}.5rem`} 
            y2={index % 10 === 0 ? '1rem' : (index % 5 === 0 ? '1.5rem' : '2rem')} 
            stroke='black' 
          />
          {index % 10 === 0 && (
            <text 
              x={`${index}.5rem`}
              y="0.8rem"
              font-size="0.7rem"
              text-anchor="middle"
            >
              {index / 10 + 1}s
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

export default Timeline