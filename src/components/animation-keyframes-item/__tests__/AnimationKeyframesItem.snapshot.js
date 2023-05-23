import { render } from '@testing-library/react'
import AnimationKeyframesItem from '../AnimationKeyframesItem'

describe('AnimationKeyframesItem', () => {
  it('renders correctly without previous keyframe', () => {
    const keyframe = { time: 1000 }

    const { container } = render(<AnimationKeyframesItem keyframe={keyframe} />)
    
    expect(container).toMatchSnapshot()
  })

  it('renders correctly with previous keyframe', () => {
    const keyframe = { time: 1000 }
    const prevKeyframe = { time: 500 }
    
    const { container } = render(
      <AnimationKeyframesItem 
        keyframe={keyframe} 
        prevKeyframe={prevKeyframe} 
      />
    )
    expect(container).toMatchSnapshot()
  })
})
