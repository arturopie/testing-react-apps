// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'

window.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
}

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}
// 💰 Here's an example of how you use this:
// const {promise, resolve, reject} = deferred()
// promise.then(() => {/* do something */})
// // do other setup stuff and assert on the pending state
// resolve()
// await promise
// // assert on the resolved state

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 100,
      longitude: 999,
    },
  }
  const {promise, resolve} = deferred()
  window.navigator.geolocation.getCurrentPosition.mockImplementation(success =>
    promise.then(() => success(fakePosition)),
  )

  render(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  await act(async () => {
    resolve()
    await promise
  })
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude: 100/i)).toBeInTheDocument()
  expect(screen.getByText(/longitude: 999/i)).toBeInTheDocument()
})

/*
eslint
  no-unused-vars: "off",
*/
