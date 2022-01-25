// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import {useCurrentPosition} from 'react-use-geolocation'
import Location from '../../examples/location'

// 💰 Here's an example of how you use this:
// const {promise, resolve, reject} = deferred()
// promise.then(() => {/* do something */})
// // do other setup stuff and assert on the pending state
// resolve()
// await promise
// // assert on the resolved state

jest.mock('react-use-geolocation')

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 100,
      longitude: 999,
    },
  }

  let setPosition
  useCurrentPosition.mockImplementation(() => {
    const useState = React.useState()
    setPosition = useState[1]
    return [useState[0]]
  })

  render(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  await act(async () => {
    setPosition(fakePosition)
  })
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude: 100/i)).toBeInTheDocument()
  expect(screen.getByText(/longitude: 999/i)).toBeInTheDocument()
})

test('shows error message when it cannot get current position', async () => {
  const fakeError = {
    message: 'I cannot get the position',
  }

  let setCurrentPosition
  useCurrentPosition.mockImplementation(() => {
    const useState = React.useState([])
    setCurrentPosition = useState[1]
    return useState[0]
  })

  render(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  await act(async () => {
    setCurrentPosition([null, fakeError])
  })
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByRole('alert')).toHaveTextContent(fakeError.message)
})

/*
eslint
  no-unused-vars: "off",
*/
