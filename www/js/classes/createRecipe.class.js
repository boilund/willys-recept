class CreateRecipe extends Base {
  constructor(app) {
    super();
    this.app = app;
    this.load().then((data) => {
      this.ingredientsOptions = data;
      this.imgUpload();
    });
    this.eventHandlers();
    this._stepsList = [];
    this._ingredientsList = [];
    this._ingredientsList.push(new Ingredients(this));
    this._categoriesList = [];
    this._nutrients = {};


  }

  get recipeTitle() {
    return this._recipeTitle;
  }

  set recipeTitle(val) {
    this._recipeTitle = val;
  }

  get portions() {
    return this._portions;
  }

  set portions(val) {
    this._portions = val;
  }

  get time() {
    return this._time;
  }

  set time(val) {
    this._time = val;
  }

  get img() {
    return this._img;
  }

  set img(val) {
    this._img = val;
  }





  //click add ingredients

  click(event) {
    let that = this;
    let target = $(event.target);
    if (target.hasClass("add-one")) {
      event.preventDefault();
      

      let ingredient = new Ingredients(this);
      //that.app.ingredient.createIngredient();
      that._ingredientsList.push(ingredient);
      $(".add-ingr").empty();
      that._ingredientsList.render(".add-ingr", "");

    }

    if (target.hasClass("upload-file-btn")) {












      this.fileSelectHandler(event);

    }

    if (target.hasClass("submint-btn")) {
      // that.calcPortionNutrition();
      let json = that.createRecipe();
      // console.log(json)
      that.saveRecipe(json);

    }



  }

  change(event) {
    this.labelCss(event);
    let target = $(event.target);
    if ((target).hasClass("portions")) {
      let that = this;
      that._portions = target.val();
    }

    if ((target).hasClass("form-check-input")) {
      let that = this;
      let category = target.val();
      that._categoriesList.push(category);
    }
    //console.log(this._categoriesList);

    //upload file
    if ((target).hasClass("fileUpload")) {
      //console.log("upload")
      this.fileSelectHandler(event);
    }
  }

  keyup(event) {
    this.labelCss(event);
    let target = $(event.target);

    //get recipe-title
    if (target.hasClass("recept-name")) {
      this._recipeTitle = target.val();
    }
    //get cooking time
    if (target.hasClass("time")) {
      this._time = target.val();
    }
  }



  // img upload start here
  imgUpload() {
    let that = this;
    that.uploadInit();
  }

  uploadInit() {
    //console.log("Upload Initialised");
    let that = this;
    let xhr = new XMLHttpRequest();
    if (xhr.upload) {
      //let fileDrag = $(".file-drag");
      let fileDrag = document.getElementById('file-drag');
      //console.log(fileDrag)
      fileDrag.addEventListener('dragover', (e) => {
        that.fileDragHover(e);
      })
      fileDrag.addEventListener('dragleave', (e) => {
        that.fileDragHover(e);
      })
      fileDrag.addEventListener('drop', (e) => {
        that.fileSelectHandler(e);
      })


      // File Drop
      //fileDrag.addEventListener('dragover', this.fileDragHover(this), false);
      // fileDrag.addEventListener('dragleave', fileDragHover, false);
      // fileDrag.addEventListener('drop', fileSelectHandler, false);
    }

  }

  fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    $(e.target).addClass("modal-body file-upload");

  }

  fileSelectHandler(event) {
    let that = this;
    // Fetch FileList object
    let files = event.target.files || event.dataTransfer.files;
    console.log(files)
    // Cancel event and hover styling
    that.fileDragHover(event);

    // // Process all File objects
    for (let i = 0, f; f = files[i]; i++) {
      that.parseFile(f);
      that.uploadFile(f);
    }
  }


  parseFile(file) {
    let that = this;
    console.log(file.name);
    // var fileType = file.type;
    // console.log(fileType);
    that._img = encodeURI(file.name);

    let isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(that._img);
    if (isGood) {
      //console.log("img")
      $("#uploader-start").addClass("hidden");
      $("#messages").append(
        '<strong>' + that._img + '</strong>'
      );
      $("#file-image").removeClass("hidden");
      $("#file-image").attr("src", '"./img/' + that._img + '"');
      //$("#file-image").src=URL.createObjectURL(file);

    } else {
      $('#notimage').removeClass('hidden');
      $('#file-upload-form').trigger("reset");
    }
  }

  uploadFile(file) {
    //console.log(file.size)
    let xhr = new XMLHttpRequest();

    // pBar = document.getElementById('file-progress'),
    let fileSizeLimit = 1024; // In MB
    if (xhr.upload) {


      // Check if file is less than x MB
      if (file.size <= fileSizeLimit * 1024 * 1024) {

        xhr.open('POST', document.getElementById('file-upload-form').action, true);
        xhr.setRequestHeader('X-File-Name', file.name);
        xhr.setRequestHeader('X-File-Size', file.size);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(file);
      } else {
        $("#messages").append(
          '<strong> Please upload a smaller file (< ' + fileSizeLimit + ' MB). </strong>'
        );

      }
    }
  }





  // fileDragHover(e, fileDrag) {
  //   //var fileDrag = document.getElementById('file-drag');
  //   //console.log("drag")
  //   // e.stopPropagation();
  //   // e.preventDefault();

  //   //fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');

  //   //fileDrag.addClass('modal-body file-upload');
  //   console.log(fileDrag)
  // }

  //img upload above


  createRecipe() {
    let newRecipe = {};
    let ingredents = this._ingredientsList.export();

    newRecipe.favorite = true;
    newRecipe.title = this._recipeTitle;
    //newRecipe.img =this._img;
    newRecipe.time = this._time;
    newRecipe.likes = 1;
    newRecipe.category = this._categoriesList;
    newRecipe.author = "Catarina Bennetoft";
    newRecipe.url = Date.now();
    newRecipe.defaultPortion = this._portions;
    newRecipe.ingredient = ingredents;
    newRecipe.instructions = this._stepsList.export();
    newRecipe.nutrition = this.calcPortionNutrition(ingredents);
    newRecipe.comments = [];
   


    return newRecipe;
  }

  calcPortionNutrition(ingredientsList) {
    let kj = 0;
    let kcal = 0;
    let fat = 0;
    let saturatedFat = 0;
    let carbohydrates = 0;
    let protein = 0;
    let salt = 0;

    ingredientsList.forEach((item) => {
      if (item.name) {
        //nList.push(item.itemNutrients)
        let l = item.itemNutrients;
        kj += l.EnergyKJ;
        kcal += l.EnergyKCAL;
        fat += l.Fat;
        saturatedFat += l.TotalMonounsaturatedFattyAcids + l.TotalPolyunsaturatedFattyAcids;
        carbohydrates += l.Carbohydrates;
        protein += l.Protein;
        salt += l.Salt;
      }
    });

    return {
      kj,
      kcal,
      fat,
      saturatedFat,
      carbohydrates,
      protein,
      salt
    }
  }



  deleteIngr(item) {
    let i = this._ingredientsList.indexOf(item);
    if (i > -1) {
      this._ingredientsList.splice(i, 1);
    }
    $("#addIngr").empty();
    this._ingredientsList.render("#addIngr", "");
  }

  deleteStep(item) {
    let i = this._stepsList.indexOf(item);
    if (i > -1) {
      this._stepsList.splice(i, 1);
    }
    $(".steps-here").empty();
    this._stepsList.render(".steps-here", "");
  }



  //method for control css when keyup
  labelCss(event) {
    var label = $(event.target).prev();
    if ($(event.target).val() === '') {
      $(label).removeClass('active highlight');
    } else {
      $(label).addClass('active highlight');
    }
  }




  //autocomplete
  load() {
    return $.getJSON('/json/food.json');
  }



  //       steps 

  eventHandlers() {
    let that = this;

    // press enter render step
    $(document).on("keyup", "#receptTextarea", function (e) {

      if (e.keyCode === 13) {
        let step = new Step($("#receptTextarea").val(), that);
        $("#receptTextarea").val('');
        that._stepsList.push(step);
        $(".steps-here").empty();
        that._stepsList.render(".steps-here", "");
      }
    })

    $(document).on("click", "#add-one-step", function () {
      let step = new Step($("#receptTextarea").val(), that);
      $("#receptTextarea").val('');
      that._stepsList.push(step);
      $(".steps-here").empty();
      that._stepsList.render(".steps-here", "");
    })




  }

  saveRecipe(json) {
    console.log('json to save', json)

    JSON._save("testCreate", json).then(()=>{
      console.log("saved!");
    });

    
  }







}