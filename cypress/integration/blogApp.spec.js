  describe('Blog app', function() {
    beforeEach(function() {

      const user = {
        name: 'Kimmo Polojärvi',
        username: 'yomyssy',
        password: 'salaisuus' 
      }

      cy.request('POST', 'http://localhost:3001/api/testing/reset')
      cy.request('POST', 'http://localhost:3001/api/users', user)
      cy.visit('http://localhost:3000')
    })
  
    it('Login from is shown', function() {
      cy.contains('login')
    })

    describe('Login',function() {
      it('succeeds with correct credentials', function() {
        cy.contains('login').click()
        cy.get('#username').type('yomyssy')
        cy.get('#password').type('salaisuus')
        cy.get('#login-button').click()
        cy.contains('Kimmo Polojärvi logged in')
      })
  
      it('fails with wrong credentials', function() {
        cy.contains('login').click()
        cy.get('#username').type('yomyssy')
        cy.get('#password').type('salaisuusu')
        cy.get('#login-button').click()
        cy.contains('wrong credentials')
      })
    })

    describe.only('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'yomyssy', password: 'salaisuus' })
      })
  
      it('A blog can be created', function() {
        cy.contains('new blog').click()
        cy.get('#titleInput').type('Testi blogi')
        cy.get('#authorInput').type('Matti Meikäläinen')
        cy.get('#urlInput').type('www.testausblogi.fi')
        cy.get('#likesInput').type('666')
        cy.get('#submitButton').click()
        cy.contains('Testi blogi lisättiin blogilistalle.')
        cy.contains('Testi blogi by Matti Meikäläinen')
      })
      
    })
    describe.only('When there is one blog posted', function() {
      beforeEach(function() {
        cy.login({ username: 'yomyssy', password: 'salaisuus' })
        cy.createBlog({
          title:'testi blogi',
          author:'Matti Meikäläinen',
          url:'www.testausblogi.fi',
          likes:666
        })
    })
    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.contains('Show details').click()
      cy.get('#likeButton').click()
      cy.contains('667')
    })
    it('A blog can be removed by its uploader', function(){
      cy.contains('Show details').click()
      cy.contains('Delete').click()
      cy.get('#blogHeader').should('not.exist')
    })
  })
  describe.only('When there are multiple blogs posted', function() {
    beforeEach(function() {
      cy.login({ username: 'yomyssy', password: 'salaisuus' })
      cy.createBlog({
        title:'Blog A',
        author:'A',
        url:'www.a.fi',
        likes:6
      })
      cy.createBlog({
        title:'Blog B',
        author:'B',
        url:'www.B.fi',
        likes:3
      })
      cy.createBlog({
        title:'Blog C',
        author:'C',
        url:'www.c.fi',
        likes:12
      })
    })
  it('Blogs are ordered by number of likes.', function(){
      cy.contains('Blog A').parent().find('#detailsButton').as('buttonA').click()
      cy.contains('Blog B').parent().find('#detailsButton').as('buttonB').click()
      cy.contains('Blog C').parent().find('#detailsButton').as('buttonC').click()
      cy.get('.likes').then( likes => {
        cy.wrap(likes[0]).contains(12)
        cy.wrap(likes[1]).contains(6)
        cy.wrap(likes[2]).contains(3)
      })
    })
  })
})