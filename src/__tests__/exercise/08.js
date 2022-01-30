// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'
import {act} from 'react-dom/test-utils'

const Counter = () => {
  const {count, increment, decrement} = useCounter()

  return (
    <>
      <p>Counter: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </>
  )
}

test('exposes the count and increment/decrement functions', () => {
  render(<Counter />)

  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  const counter = screen.getByText(/counter/i)

  expect(counter.textContent).toMatchInlineSnapshot(`"Counter: 0"`)
  userEvent.click(increment)
  expect(counter.textContent).toMatchInlineSnapshot(`"Counter: 1"`)
  userEvent.click(decrement)
  expect(counter.textContent).toMatchInlineSnapshot(`"Counter: 0"`)
})

function setup(props) {
  const result = {}

  function TestComponent(props) {
    Object.assign(result, useCounter(props))

    return null
  }
  render(<TestComponent {...props} />)
  return result
}

test('using fake component', () => {
  let result = setup()

  expect(result.count).toEqual(0)
  act(() => {
    result.increment()
  })
  expect(result.count).toEqual(1)
  act(() => {
    result.decrement()
  })
  expect(result.count).toEqual(0)
})

test('allows customization of the initial count', () => {
  let result = setup({initialCount: 999})

  expect(result.count).toEqual(999)
})

test('allows customization of the step', () => {
  let result = setup({step: 5})

  expect(result.count).toEqual(0)

  act(() => {
    result.increment()
  })
  expect(result.count).toEqual(5)
  act(() => {
    result.decrement()
  })
  expect(result.count).toEqual(0)
})
/* eslint no-unused-vars:0 */
