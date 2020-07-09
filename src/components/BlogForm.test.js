import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'


describe('BlogForm tests', () => {

    beforeEach(() => {
        
        const mockHandler = jest.fn()

        const blogForm = () => (
            <BlogForm
            title = {newTitle}
            author = {newAuthor}
            url = {newUrl}
            likes = {newLikes}
            titleHandler = {handleTitleChange}
            authorHandler = {handleAuthorChange}
            urlHandler = {handleUrlChange}
            likesHandler = {handleLikesChange}
            addFunction = {addBlog}
            />
        )
    })

    test('Submitted data is valid.', () => {

    })

    

})