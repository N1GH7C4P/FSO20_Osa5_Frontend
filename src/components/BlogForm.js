import React from 'react'

const BlogForm = ({ title, author, likes, url, titleHandler, authorHandler, likesHandler, urlHandler, addFunction }) => {
  return (
    <form onSubmit={addFunction}>
      <div>Blog title:  </div>
      <input id='titleInput'
        value={title}
        onChange={titleHandler}
      />
      <div>Author: </div>
      <input id='authorInput'
        value={author}
        onChange={authorHandler}
      />
      <div>Blog url:  </div>
      <input id='urlInput'
        value={url}
        onChange={urlHandler}
      />
      <div>likes: </div>
      <input id='likesInput'
        value={likes}
        onChange={likesHandler}
      />
      <div>
        <button id='submitButton' type="submit">tallenna</button>
      </div>
    </form>
  )
}

export default BlogForm