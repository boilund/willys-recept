class Ingredients extends Base {
    constructor(parent) {
        super();
        this.parent = parent;
        this.itemNutrients = {};
        this.coefficient = "";
        this.nutrientsList = [];
        this._quantity = '';
        this._name = '';

    }

    get name() {
        return this._name;
    }

    set name(val) {
        this._name = val;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(val) {
        this._quantity = val;
    }

    get unit() {
        return this._unit;
    }

    set unit(val) {
        this._unit = val;
    }

    keyup(event) {

        let that = this;
        let target = $(event.target);
        // ingredient name
        if (target.hasClass("names")) {
            var inputText = target.val();

            if (inputText) {
                if (inputText.toString().length >= 3) {
                    that.nutrientsList = [];
                    var list = that.search(that.parent.ingredientsOptions, inputText);
                    that.changeInput(event, list);
                } else {
                    that.nutrientsList = [];
                    $(".result").addClass("hidden");
                    target.parents(".card").removeClass("mob-card");
                }

            } else {
                target
                    .next()
                    .empty();
                //autocomplete list get deleted by deleting input text
            }

            that.name = target.val();
        }

        // ingredient quantity
        if (target.hasClass("quantity")) {
            that._quantity = target.val();

            if (isNaN(that._quantity) || that._quantity <= 0) {
                $(target.next()).removeClass("hidden");
                return;
            } else {
                $(target.next()).addClass("hidden");
            }
        }

    }



    click(event) {
        let that = this;
        let target = $(event.target);
        if (target.hasClass("ingredient-btn")) {
            that
                .parent
                .deleteIngr(that);
            that.inputLabel();

        }

    }

    inputLabel() {

        let inputs = $(".ingr-css");
        inputs.map((inpt) => {
                if (inpt.value !== "") {
                    $(".ingr-d-none").addClass("active highlight");
                }
            }

        )
    }


    change(event) {
        // ingredient unit
        let that = this;
        let target = $(event.target);
        if (target.hasClass("unit-select")) {
            that._unit = target.val();
            that.unitCalc(that._unit);
        }
    }

    export () {
        let returnInfo = [];
        let oneIngredient = {};
        let itemNutrients = {};

        itemNutrients = this.calcNurtrients();
        oneIngredient.name = this.name;
        oneIngredient.quantity = this._quantity;
        oneIngredient.unit = this._unit;
        returnInfo.push(oneIngredient);
        returnInfo.push(itemNutrients);
        return returnInfo;

    }

    search(jsonList, searchText) {
        if (searchText) {
            searchText = searchText.toLowerCase()
            let result = jsonList.filter(x => x.Namn.toLowerCase().includes(searchText));
            result.sort((a, b) => {
                return a
                    .Namn
                    .indexOf(searchText) < b
                    .Namn
                    .indexOf(searchText) ?
                    -1 :
                    1;
            })
            return result;

        }
    }

    setSearch(e, val) {
        let target = $(e.target).next();
        target.empty();
        $(e.target).val(val);

    }

    changeInput(e, list) {

        let that = this;
        let lockInput = e.target;
        let target = $(e.target).next();
        target = target.html("<div class='result> </div>")
        target.removeClass('hidden');
        for (let i = 0, len = list.length; i < len; i++) {
            let listText = list[i].Namn;
            target.parents(".card").addClass("mob-card");
            let node = $(`<a class='list-group-item list-group-item-action'>  ${listText}   </a>`);
            $(target).append(node);
            node.on("click", () => {
                that.setSearch(e, listText);
                that.name = listText;
                let item = list[i];
                that.getNutrients(item);
                target.addClass("hidden");
                target.parents(".card").removeClass("mob-card");
            });

            $("main").click(() => {
                if (that.nutrientsList.length === 0) {
                    $(lockInput).val("");
                    target.addClass("hidden");
                    target.parents(".card").removeClass("mob-card");
                }

            })

        }

    }

    //       autocomplete

    getNutrients(item) {
        let that = this;
        that.nutrientsList = item.Naringsvarden.Naringsvarde;
     }

    //unit calculation to 100g
    unitCalc(unit) {
        let that = this;
        switch (unit) {
            case 'st':
                that.coefficient = 0.5;
                break;
            case 'g':
                that.coefficient = 0.01;
                break;
            case 'kg':
                that.coefficient = 10;
                break;
            case 'ml':
                that.coefficient = 0.01;
                break;
            case 'dl':
                that.coefficient = 1;
                break;
            case 'tsk':
                that.coefficient = 0.05;
                break;
            case 'msk':
                that.coefficient = 0.15;
                break;
            case 'krm':
                that.coefficient = 0.01;
                break;
            default:

        }
    }

    calcNurtrients() {
        let that = this;
        let c = that.coefficient;
        let q = that._quantity;


        for (let nutrient of that.nutrientsList) {
            let value = nutrient
                .Varde
                .replace(/,/g, '.') / 1;
            if (nutrient.Namn === "Energi (kJ)") {
                that.itemNutrients.EnergyKJ = Math.round(value * c * (q / this.parent._portions));
            }
            if (nutrient.Namn === "Energi (kcal)") {
                that.itemNutrients.EnergyKCAL = Math.round(value * c * (q / this.parent._portions));
            }
            if (nutrient.Namn === "Fett") {
                that.itemNutrients.Fat = Math.round(value * c * (q / this.parent._portions));
            }
            if (nutrient.Namn === "Summa mättade fettsyror") {
                that.itemNutrients.TotalSaturatedFattyAcids = Math.round(value * c * (q / this.parent._portions) * 10) / 10;
            }
            if (nutrient.Namn === "Summa enkelomättade fettsyror") {
                that.itemNutrients.TotalMonounsaturatedFattyAcids = Math.round(value * c * (q / this.parent._portions) * 10) / 10;
            }
            if (nutrient.Namn === "Summa fleromättade fettsyror") {
                that.itemNutrients.TotalPolyunsaturatedFattyAcids = Math.round(value * c * (q / this.parent._portions) * 10) / 10;
            }
            if (nutrient.Namn === "Kolesterol") {
                that.itemNutrients.Cholesterol = Math.round(value * c * (q / this.parent._portions));
            }
            if (nutrient.Namn === "Kolhydrater") {
                that.itemNutrients.Carbohydrates = Math.round(value * c * (q / this.parent._portions));
            }
            if (nutrient.Namn === "Sackaros") {
                that.itemNutrients.Sucrose = Math.round(value * c * (q / this.parent._portions));
            }
            if (nutrient.Namn === "Protein") {
                that.itemNutrients.Protein = Math.round(value * c * (q / this.parent._portions));
            }
            if (nutrient.Namn === "Salt") {
                that.itemNutrients.Salt = Math.round(value * c * (q / this.parent._portions));
            }
        }
        return that.itemNutrients;

    }

}