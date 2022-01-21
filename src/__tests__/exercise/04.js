// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import {build, fake} from '@jackfranklin/test-data-bot'

test('submitting the form calls onSubmit with username and password', () => {
  const handleSubmit = jest.fn()
  const screen = render(<Login onSubmit={handleSubmit} />)

  const {username, password} = loginFormBuilder()
  userEvent.type(screen.getByRole('textbox', {name: /username/i}), username)
  userEvent.type(screen.getByLabelText(/password/i), password)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  expect(handleSubmit).toHaveBeenLastCalledWith({
    username,
    password,
  })
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

const loginFormBuilder = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

/*
eslint
  no-unused-vars: "off",
*/
