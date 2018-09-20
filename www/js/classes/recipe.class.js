class Recipe extends Base {
  constructor(app) {
    super();
    this.app = app;
  }

  saveRecipeInfo(ingrediens, instructions) {
    this.ingrediens = ingrediens.map((x) => `<li class="list-group-item border-0 pl-0 pb-0 pt-2">${x.quantity} ${x.unit} ${x.name}</li>`);
    this.instructions = instructions.map((x) => `<li class="list-group-item border-0 pl-0 pb-0">${x}</li>`);
  }

  varyLikes() {
    this.favorite ? this.likes-- : this.likes++;
    this.favorite = !this.favorite; // "toggle"
  }

  click2(e) {
    $(e.target).hasClass('comments-btn') && $('.comments').toggle();
    $(e.target).hasClass('fa-print') && window.print();
    if ($(e.target).hasClass('fa-heart')) {
      this.varyLikes();
      this.app.myPage.pickCards();
      this.app.popState.startPage();
      this.app.popState.recipe();
    }
  }

  showMore(page) {
    page === 'startPage' && $('.recipeCard:hidden').slice(0, this.app.startPage.sliceNr).show(10);
    page === 'myPage' && $('.recipeCard:hidden').slice(0, this.app.myPage.slice).show(10);
    $('.recipeCard:hidden').length == 0 && $('.more-btn').hide();
  }

  // start-page cards
  click3(e) {
    if ($(e.target).hasClass('fa-heart')) {
      this.varyLikes();
      this.app.recipes.sort((a, b) => b.likes - a.likes);
      this.app.myPage.pickCards();
      $('.main-contents').empty();
      this.app.startPage.render('.main-contents', 4);
      this.showMore('startPage');
    }
  }

  // mina-favoriter cards
  click4(e) {
    if ($(e.target).hasClass('fa-heart')) {
      this.varyLikes();
      this.app.myPage.pickCards();
      this.app.popState.myPage();
      this.showMore('myPage');
    }
  }

  // mina-recept cards
  click5(e) {
    if ($(e.target).hasClass('fa-heart')) {
      this.varyLikes();
      this.app.myPage.pickCards();

      $('.favorite-cards').empty();
      this.app.myPage.myFavorites.render('.favorite-cards', '4');

      $('.my-cards').empty();
      this.app.myPage.myRecipes.render('.my-cards', '5');
      this.showMore('myPage');
    }
  }

}