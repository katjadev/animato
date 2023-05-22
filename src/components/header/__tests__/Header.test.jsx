import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '../Header'

describe('Header', () => {
  it('renders the header', () => {
    render(
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

    const header = screen.getByRole('banner')

    expect(header).toBeInTheDocument()
  })
})