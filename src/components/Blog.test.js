import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'

describe('Blog tests', () => {

  const checkAuthentication = () => {
  }

  const blog = {
    title: 'Kimmon Blogi',
    author: 'Yomyssy',
    likes: '90',
    url: 'www.kimmonblogi.fi'
  }

  let component

  beforeEach(() => {

    const mockHandler = jest.fn()

    component = render(
    <Blog
        key={blog.id}
        blog={blog}
        removeFunction={mockHandler}
        likeBlog={mockHandler}
        checkAuthentication={checkAuthentication}
        toggleVisibility={mockHandler}
    />
  )
})

  test('Renders name & author.', () => {
    expect(component.container).toHaveTextContent('Kimmon Blogi')
    expect(component.container).toHaveTextContent('Yomyssy')
    expect(component.container).toHaveTextContent('90')
    expect(component.container).toHaveTextContent('www.kimmonblogi.fi')
    component.debug()
  })
  
  test('Does not render url & likes prematurely.', () => {
    const likes = component.getByText('90')
    const url = component.getByText('www.kimmonblogi.fi')
    expect(likes).toHaveStyle('display:none')
    expect(url).toHaveStyle('display:none')
  })

  test('Buttons are defined.', ()=> {
    const button = component.getByText('Show details')
    expect(button).not.toBeNull()
    console.log(prettyDOM(button))
  })

  test('Pressing show details button reveals url & likes.', ()=> {
    const button = component.getByText('Show details')
    fireEvent.click(button)
    const likes = component.getByText('90')
    const url = component.getByText('www.kimmonblogi.fi')
    expect(likes).not.toHaveStyle('display:none')
    expect(url).not.toHaveStyle('display:none')
  })

})

describe('Function calls test for blogs. Needs to be separate for reasons.', () => {

  test('Pressing like button twice results in 2 handler function calls.', () =>{  
    
    const checkAuthentication = () => {
    }

    const mockHandler = jest.fn()

    const blog = {
      title: 'Kimmon Blogi',
      author: 'Yomyssy',
      likes: '90',
      url: 'www.kimmonblogi.fi'
    }

    const component = render(
    <Blog
        key={blog.id}
        blog={blog}
        removeFunction={mockHandler}
        likeBlog={mockHandler}
        checkAuthentication={checkAuthentication}
        toggleVisibility={mockHandler}
    />
  )
    
    const button = component.getByText('Like')
    expect(button).not.toBeNull()
    console.log(prettyDOM(button))
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls.length).toBe(2)
  })

})