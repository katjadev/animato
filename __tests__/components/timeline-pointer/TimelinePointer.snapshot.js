import { render } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'
import messages from '../../../src/messages/en.json'
import TimelinePointer from '../../../src/components/timeline-pointer/TimelinePointer'

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
        onChangePosition={() => {}}
      />
    </NextIntlProvider>
  )
  expect(container).toMatchSnapshot()
})
