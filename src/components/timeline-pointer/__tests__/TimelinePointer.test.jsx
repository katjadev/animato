import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NextIntlProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import TimelinePointer from '../TimelinePointer'

describe('TimelinePointer', () => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter')
  const locale = 'en'
  useRouter.mockImplementationOnce(() => ({
    query: { locale: locale },
  }))

  it('renders a pointer', () => {
    render(
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

    const pointer = screen.getByRole('slider')

    expect(pointer).toBeInTheDocument()
  })

  it('does not calls onChangePosition when moved with mouse but isDragging = false', () => {
    const onChangePositionMock = jest.fn()
    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <TimelinePointer
          currentTime={0}
          currentPosition={0}
          scrollPosition={{ left: 0, top: 0 }}
          translations={{
            timelinePointerAriaLabel: 'Current time',
          }}
          onChangePosition={onChangePositionMock}
        />
      </NextIntlProvider>
    )

    const pointer = screen.getByRole('slider')
    fireEvent(
      pointer,
      new MouseEvent('mousemove', { clientX: 200, bubbles: true }),
    )

    expect(onChangePositionMock).toBeCalledTimes(0)
  })

  it('does not call onChangePosition when moved with mouse but mouse button is not pressed', () => {
    const onChangePositionMock = jest.fn()
    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <TimelinePointer
          currentTime={0}
          currentPosition={0}
          scrollPosition={{ left: 0, top: 0 }}
          translations={{
            timelinePointerAriaLabel: 'Current time',
          }}
          onChangePosition={onChangePositionMock}
        />
      </NextIntlProvider>
    )

    const pointer = screen.getByRole('slider')
    fireEvent(
      pointer,
      new MouseEvent('mousedown', { bubbles: true }),
    )
    fireEvent(
      pointer,
      new MouseEvent('mouseup', { bubbles: true }),
    )
    fireEvent(
      pointer,
      new MouseEvent('mousemove', { clientX: 200, bubbles: true }),
    )

    expect(onChangePositionMock).toBeCalledTimes(0)
  })

  it('calls onChangePosition when moved with mouse', () => {
    const onChangePositionMock = jest.fn()
    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <TimelinePointer
          currentTime={0}
          currentPosition={0}
          scrollPosition={{ left: 0, top: 0 }}
          translations={{
            timelinePointerAriaLabel: 'Current time',
          }}
          onChangePosition={onChangePositionMock}
        />
      </NextIntlProvider>
    )

    const pointer = screen.getByRole('slider')
    fireEvent(
      pointer,
      new MouseEvent('mousedown', { bubbles: true }),
    )
    fireEvent(
      pointer,
      new MouseEvent('mousemove', { clientX: 200, bubbles: true }),
    )

    expect(onChangePositionMock).toBeCalledTimes(1)
    expect(onChangePositionMock).toHaveBeenLastCalledWith(200)
  })

  it('calls onChangePosition when moved with mouse with scroll position', () => {
    const onChangePositionMock = jest.fn()
    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <TimelinePointer
          currentTime={0}
          currentPosition={0}
          scrollPosition={{ left: 200, top: 0 }}
          translations={{
            timelinePointerAriaLabel: 'Current time',
          }}
          onChangePosition={onChangePositionMock}
        />
      </NextIntlProvider>
    )

    const pointer = screen.getByRole('slider')
    fireEvent(
      pointer,
      new MouseEvent('mousedown', { bubbles: true }),
    )
    fireEvent(
      pointer,
      new MouseEvent('mousemove', { clientX: 200, bubbles: true }),
    )

    expect(onChangePositionMock).toBeCalledTimes(1)
    expect(onChangePositionMock).toHaveBeenLastCalledWith(400)
  })

  /*it('calls onChangePosition when moved with keyboard', () => {
    const onChangePositionMock = jest.fn()
    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <TimelinePointer
          currentTime={0}
          currentPosition={100}
          scrollPosition={{ left: 0, top: 0 }}
          markSize={1}
          timelineWidth={1000}
          translations={{
            timelinePointerAriaLabel: 'Current time',
          }}
          onChangePosition={onChangePositionMock}
        />
      </NextIntlProvider>
    )

    const pointer = screen.getByRole('slider')
    fireEvent(
      pointer,
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
    )

    expect(onChangePositionMock).toBeCalledTimes(1)
    expect(onChangePositionMock).toHaveBeenLastCalledWith(116)

    fireEvent(
      pointer,
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }),
    )

    expect(onChangePositionMock).toBeCalledTimes(2)
    expect(onChangePositionMock).toHaveBeenLastCalledWith(116)

    fireEvent(
      pointer,
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
    )

    expect(onChangePositionMock).toBeCalledTimes(3)
    expect(onChangePositionMock).toHaveBeenLastCalledWith(84)

    fireEvent(
      pointer,
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }),
    )

    expect(onChangePositionMock).toBeCalledTimes(4)
    expect(onChangePositionMock).toHaveBeenLastCalledWith(84)
  }) */
})