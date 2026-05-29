import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import App from './App'

test('Work App Component without error', async () => {
  render(<App />)

  expect(
    await screen.findByText("I'm REACT_APP_TEXT from .env"),
  ).toBeInTheDocument()
})

test('Working Counter', async () => {
  const user = userEvent.setup()
  const { findByText, getByText } = render(<App />)
  expect(await findByText('count is: 0')).toBeInTheDocument()

  const button = getByText(/count is: \d/)

  await user.click(button)
  expect(getByText('count is: 1')).toBeInTheDocument()

  await user.click(button)
  expect(getByText('count is: 2')).toBeInTheDocument()

  await user.click(button)
  expect(getByText('count is: 3')).toBeInTheDocument()
})

test('working with msw', async () => {
  render(<App />)

  await waitFor(
    () => {
      expect(screen.getByText('MSW')).toBeInTheDocument()
      expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    },
    { timeout: 5000 },
  )
})
