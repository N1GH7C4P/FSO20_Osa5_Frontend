import React, { useState, useRef, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { ErrorNotification, SuccessNotification } from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle ] = useState('')
  const [newAuthor, setNewAuthor ] = useState('')
  const [newUrl, setNewUrl ] = useState('')
  const [newLikes, setNewLikes ] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out: ', username)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <div>
        <button type="submit">logout</button>
      </div>
    </form>
  )

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


  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>login</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  
  const rows = () =>
    blogs.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        removeFunction={removeBlog}
        likeBlog={likeBlog}
        checkAuthentication={checkAuthentication}
      />
    )

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        const sortedBlogs = initialBlogs.sort((a,b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }  }, [])

  const removeBlog = (event) => {
    event.preventDefault()
    if(window.confirm(`Poistetaanko ${event.target.name}?`)){
      blogService
        .remove(event.target.value)
        .then(setBlogs(blogs.filter(blog => blog.id !== event.target.value)))
      setSuccessMessage(`${event.target.name} poistettiin tietokannasta.`)
      setErrorMessage(null)
    }
  }

  const checkAuthentication = (element) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if(element.user.username === user.username) {
        return true
      }
      else{
        return false
      }
    }
  }

  const likeBlog = (event) => {
    event.preventDefault()

    console.log(event.target.name)
    const oldBlog = blogs.find(blog => blog.title === event.target.name)

    const blogObject = {
      title: oldBlog.title,
      author: oldBlog.author,
      url: oldBlog.url,
      likes: oldBlog.likes+1,
      user: oldBlog.user,
      id: oldBlog.id,
    }

    blogService
      .update(blogObject.id,blogObject)
    const blogToRemove = blogs.find(blog => blog.id === blogObject.id)
    const index = blogs.indexOf(blogToRemove)
    blogs.splice(index,1,blogObject)
    setSuccessMessage(`Blogista "${blogObject.title}" tykätty <3`)
  }

  const addBlog = (event) => {
    blogFormRef.current.toggleVisibility()
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    }
    if(blogs.find(blog => blog.title === newTitle)){
      const oldBlog = blogs.find(blog => blog.title === newTitle)
      if(window.confirm(`${newTitle} on jo luettelossa. Haluatko korvata blogin?`)){
        const updatedBlogObject = {
          title: newTitle,
          author: newAuthor,
          url: newUrl,
          likes: newLikes,
          id: oldBlog.id
        }

        blogService
          .update(updatedBlogObject.id,updatedBlogObject)
          .catch(error => {
            setErrorMessage(error)
          })

        const blogToRemove = blogs.find(blog => blog.id === updatedBlogObject.id)
        const index = blogs.indexOf(blogToRemove)
        blogs.splice(index,1,updatedBlogObject)
        setNewTitle('')
        setNewAuthor('')
        setNewLikes('')
        setNewUrl('')
        setSuccessMessage(`Blogin "${updatedBlogObject.title}" tiedot päivitettiin.`)
      }
    }
    else{
      blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          setNewLikes('')
          setSuccessMessage(`${returnedBlog.title} lisättiin blogilistalle.`)
        })
        .catch(error => {
          console.log(error.response.data)
          setErrorMessage(error.response.data)
        })
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }
  const handleLikesChange = (event) => {
    setNewLikes(event.target.value)
  }

  return (
    <div>

      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />

      <h1>Blogilista</h1>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            {blogForm()}
          </Togglable>
          {logoutForm()}
        </div>
      }
      {rows()}
    </div>
  )
}

export default App