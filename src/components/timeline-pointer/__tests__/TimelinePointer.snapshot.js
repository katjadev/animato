import { render } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import TimelinePointer from '../TimelinePointer'

describe('TimelinePointer', () => {
  it('renders correctly', () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    const locale = 'en'
    useRouter.mockImplementationOnce(() => ({
      query: { locale: locale },
    }))
  
    const { container } = render(
      <NextIntlProvider messages={messages} locale={locale}>
        <TimelinePointer
          currentTime={0}
          currentPosition={0}
          scrollPosition={{ left: 0, top: 0 }}
          translations={{
            timelinePointerAriaLabel: 'Current time',
          }}
          onChangePosition={() => {}}
        />
      </NextIntlProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
