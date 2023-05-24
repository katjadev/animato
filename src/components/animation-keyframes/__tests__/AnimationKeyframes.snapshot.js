import { render } from '@testing-library/react'
import AnimationKeyframes from '../AnimationKeyframes'

const TEST_ELEMENT = {
  id: 'test-id',
  title: 'test',
  animations: [
    { 
      id: '1', 
      keyframes: [
        { time: 0 }, 
        { time: 1000 },
        { time: 2000 },
      ],
    },
  ],
}

describe('AnimationKeyframes', () => {
  it('renders correctly', () => {
    const { container } = render(<AnimationKeyframes element={TEST_ELEMENT} selected={false} />)
    
    expect(container).toMatchSnapshot()
  })

  it('enders correctly when selected', () => {
    const { container } = render(<AnimationKeyframes element={TEST_ELEMENT} selected={true} />)

    expect(container).toMatchSnapshot()
  })
})
