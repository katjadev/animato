import { render } from '@testing-library/react'
import TimelinePointer from '../TimelinePointer'

describe('TimelinePointer', () => {
  it('renders correctly', () => {
    const { container } = render(
      <TimelinePointer
        currentTime={0}
        currentPosition={0}
        scrollPosition={{ left: 0, top: 0 }}
        translations={{
          timelinePointerAriaLabel: 'Current time',
        }}
        onChangePosition={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
