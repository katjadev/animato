import { render } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Header
        title='Test Project'
        isAuthenticated={true}
        translations={{
          profile: 'Profile',
          undo: 'Undo',
          redo: 'Redo',
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
