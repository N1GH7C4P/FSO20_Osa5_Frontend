import React, { useState,  useEffect } from 'react'

const Blog = ({ blog, removeFunction, likeBlog, checkAuthentication}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const [removable, setRemovable] = useState(false)
  const showWhenRemovable = { display: removable ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useEffect(() => {
    if(checkAuthentication(blog)) {
      setRemovable(true)
    }
    else{
      setRemovable(false)
    }
  },)

  return (
    <div style={blogStyle} className = 'blog'>
      <div id='blogHeader'>{blog.title} by {blog.author}</div>
      <div  style={hideWhenVisible}><button id='detailsButton' onClick={toggleVisibility}>Show details</button></div>
      <div style={showWhenVisible}> <button onClick={toggleVisibility}>Hide</button> </div>
      <div style={showWhenVisible}>{blog.url}</div>
      <div className='likes' style={showWhenVisible}>Likes: <span style={showWhenVisible}>{blog.likes}</span></div> 
      <div style={showWhenVisible}><button name = {blog.title} value={blog.id} id='likeButton' onClick={likeBlog}>Like</button></div>
      <div style={showWhenRemovable}><button name = {blog.title} value={blog.id} onClick={removeFunction}> Delete</button></div>
    </div>
  )
}

export default Blog