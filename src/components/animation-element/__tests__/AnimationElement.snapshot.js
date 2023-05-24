import { render } from '@testing-library/react'
import AnimationElement from '../AnimationElement'

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
}

const TEST_ID = 'test-id'
const TEST_ELEMENT = {
  id: TEST_ID,
  title: 'Animation Group',
  animations: [
    { id: 1, title: 'Animation 1' },
    { id: 2, title: 'Animation 2' },
  ],
}

describe('AnimationElement', () => {
  it('renders correctly', () => {
    const { container } = render(
      <AnimationElement 
        element={TEST_ELEMENT} 
        selected={false} 
        translations={translations}
      />
    )
    
    expect(container).toMatchSnapshot()
  })

  it('enders correctly when selected', () => {
    const { container } = render(
      <AnimationElement 
        element={TEST_ELEMENT} 
        selected={true} 
        translations={translations}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
