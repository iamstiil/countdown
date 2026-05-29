import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import App from './App'

const renderAt = (search: string) => {
  window.history.replaceState({}, '', `/${search}`)
  return render(<App />)
}

test('shows landing page when no date search param is provided', async () => {
  renderAt('')

  expect(
    await screen.findByRole('heading', { name: /create a countdown/i }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText(/target date/i)).toBeInTheDocument()
})

test('shows countdown when date search param is provided', async () => {
  const future = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  renderAt(`?date=${encodeURIComponent(future)}&title=Launch`)

  expect(
    await screen.findByRole('heading', { name: 'Launch' }),
  ).toBeInTheDocument()
  expect(screen.getByText(/seconds/i)).toBeInTheDocument()
})

test('landing page builds a share link when a future date is entered', async () => {
  const user = userEvent.setup()
  renderAt('')

  const dateInput = await screen.findByLabelText(/target date/i)
  const titleInput = screen.getByLabelText(/^title/i)

  await user.clear(dateInput)
  await user.type(dateInput, '2099-01-01T12:00')
  await user.type(titleInput, 'Party')

  expect(
    await screen.findByRole('link', { name: /start countdown/i }),
  ).toBeInTheDocument()
})
