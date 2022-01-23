// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {setupServer} from 'msw/node'
import {handlers} from '../../test/server-handlers'
import Login from '../../components/login-submission'
import {rest} from 'msw'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.restoreHandlers())

test(`logging in displays the user's username`, async () => {
  const screen = render(<Login />)
  const {username, password} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(submitBtn(screen))

  await waitForElementToBeRemoved(screen.getByLabelText('loading...'))

  expect(screen.getByText(username)).toBeInTheDocument()
})

test('attempting to logging without a password shows an error', async () => {
  const screen = render(<Login />)

  userEvent.click(submitBtn(screen))

  await waitForElementToBeRemoved(screen.getByLabelText('loading...'))

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test('handles 500 error from server', async () => {
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: 'Unexpected Error'}))
      },
    ),
  )
  const screen = render(<Login />)

  userEvent.click(submitBtn(screen))

  await waitForElementToBeRemoved(screen.getByLabelText('loading...'))

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"Unexpected Error"`,
  )
})

function submitBtn(screen) {
  return screen.getByRole('button', {name: /submit/i})
}
