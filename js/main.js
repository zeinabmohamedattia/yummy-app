var nameInput;
var emailInput;
var phoneInput;
var ageInput;
var passwordInput;
var repasswordInput;
var dataContainer = document.getElementById("dataContainer");

$(document).ready(() => {
    closeSideBar()

    searchByName("").then(() => {
        $(".loading").fadeIn(500)
        // $(".loading").addClass('bg-danger')
        $("body").css("overflow", "visible")

    })
})

// ----------------------------------------------SEARCH-------------------------------------------------------------

async function searchByName(term) {
    $(".loading").removeClass('d-none', 1000)
    // $(".loading").fadeIn(1000)

    $("body").css("overflow", "hidden")
    dataContainer.innerHTML = ``
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    let respone = await data.json();

    console.log(respone.meals)
    if (respone.meals.length != 0) {
        displayMeals(respone.meals)
    }
    // $(".loading").hide(500)
    $(".loading").addClass('d-none', 1000)
    // $(".loading").fadeOut(1000)

    $("body").css("overflow", "visible")


    return respone.meals
}

async function searchByLetter(letter) {
    $(".loading").removeClass('d-none', 1000)
    $("body").css("overflow", "hidden")
    dataContainer.innerHTML = ``
    if (letter == "") {
        letter = 'a';
    }
    console.log(letter)
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let respone = await data.json();
    console.log(respone.meals)
    if (respone.meals.length != 0) {
        displayMeals(respone.meals)
    }
    $(".loading").addClass('d-none', 1000)
    $("body").css("overflow", "visible")
    return respone.meals
}
function displayMeals(meals) {
    let container = ``;
    for (let i = 0; i < meals.length; i++) {
        container += `
                <div class="col-md-3">
                  <div  data-id="${meals[i].idMeal}" data-category="${meals[i].strCategory}" class="meal-content position-relative overflow-hidden rounded-2 ">
                        <img class="w-100" src="${meals[i].strMealThumb}" alt="meal image">
                        <div class="layer position-absolute d-flex align-items-center text-black p-2">
                            <h3>${meals[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
        `
    }

    dataContainer.innerHTML = container
    console.log('finish display')
    getId()

}

$('.search').on('click', function () {
    closeSideBar()
    $('#search').removeClass('d-none')
    $('#contact').addClass('d-none')
    $('body').css('overflow', 'hidden')
    dataContainer.innerHTML = ``
})

$('#searchName').on('keyup', function () {
    if (this.value == '') {
        dataContainer.innerHTML = ``
    } else {
        searchByName(this.value)
    }
})
$('#searchLetter').on('keyup', function () {

    searchByLetter(this.value)

})
// ----------------------------------------------DETAILS-------------------------------------------------------------

function getId() {
    let mealCards = document.querySelectorAll(".meal-content")
    for (let i = 0; i < mealCards.length; i++) {
        mealCards[i].addEventListener('click', function (e) {
            let id = mealCards[i].getAttribute('data-id');
            getDetailsById(id);
        })
    }
}

async function getDetailsById(Id) {
    closeSideBar()
    dataContainer.innerHTML = ``
    $(".loading").removeClass('d-none', 1000)


    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${Id}`);
    let respone = await data.json();
    ShowDetailsUi(respone.meals[0])
    console.log(respone)
    $(".loading").addClass('d-none', 1000)

}

function ShowDetailsUi(meal) {
    let ingredientsContainer = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsContainer += `<li class="alert alert-info p-1 m-2 ">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let allTags = meal.strTags?.split(",")
    // console.log(allTags)
    if (allTags == null) {
        allTags = []
    }

    let tagsContainer = ''
    for (let i = 0; i < allTags.length; i++) {
        tagsContainer += `
        <li class="alert alert-danger m-2 p-1">${allTags[i]}</li>`
    }
    displayDetailsPage(meal, ingredientsContainer, tagsContainer)
}


function displayDetailsPage(meal, ingredientsContainer, tagsContainer) {

    dataContainer.innerHTML = ``;

    let detailsContainer = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="meal image">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2 class="text-capitalize">instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder text-capitalize">area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder text-capitalize">category : </span>${meal.strCategory}</h3>
                <h3 class="text-capitalize">recipes :</h3>
                <ul class=" d-flex  flex-wrap  g-3">
                    ${ingredientsContainer}
                </ul>
                <h3 class="text-capitalize">tags :</h3>
                <ul class=" d-flex  flex-wrap  g-3">
                    ${tagsContainer}
                </ul>
                <a  href="${meal.strSource}" class="btn btn-success" target="_blank" >Source</a>
                <a  href="${meal.strYoutube}" class="btn btn-danger" target="_blank"  >Youtube</a>
            </div>`
    dataContainer.innerHTML = detailsContainer
}
// ----------------------------------------------CATEGORY-------------------------------------------------------------
function getCategory() {
    let mealCards = document.querySelectorAll(".meal-content")
    for (let i = 0; i < mealCards.length; i++) {
        mealCards[i].addEventListener('click', function (e) {
            let category = mealCards[i].getAttribute('data-category');
            // getDetailsById(id);
            getCategoryMeals(category)
            console.log(category)

        })
    }
}
async function getAllCategories() {
    dataContainer.innerHTML = ``
    $(".loading").removeClass('d-none')

    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let response = await data.json()
    console.log(response.categories)
    displayAllCategories(response.categories)
    $(".loading").addClass('d-none')

}
$('.categories').on('click', function () {
    closeSideBar()
    getAllCategories()
})


function displayAllCategories(categories) {
    let categoriesContainer = ``;

    for (let i = 0; i < categories.length; i++) {
        categoriesContainer += `
         <div class="col-md-3">
                <div  data-category="${categories[i].strCategory}" class="meal-content position-relative overflow-hidden rounded-2 ">
                    <img class="w-100" src="${categories[i].strCategoryThumb}" alt="" srcset="">
                    <div class="layer position-absolute text-center text-black p-2">
                        <h3>${categories[i].strCategory}</h3>
                        <p>${categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    dataContainer.innerHTML = categoriesContainer
    getCategory()

}
async function getCategoryMeals(category) {
    dataContainer.innerHTML = ``
    $(".loading").removeClass('d-none')

    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let response = await data.json()

    displayMeals(response.meals.slice(0, 20))
    $(".loading").addClass('d-none', 1000)
}
// ----------------------------------------------AREA-------------------------------------------------------------
function getArea() {
    let areaCards = document.querySelectorAll(".area-content")
    for (let i = 0; i < areaCards.length; i++) {
        areaCards[i].addEventListener('click', function (e) {
            let area = areaCards[i].getAttribute('data-area');
            getAreaMeals(area)
            console.log(area)
        })
    }
}
async function getAllAreas() {
    dataContainer.innerHTML = ``
    $(".loading").removeClass('d-none')

    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let respone = await data.json()
    console.log(respone.meals);

    displayALlAreas(respone.meals)
    $(".loading").addClass('d-none')


}
function displayALlAreas(areas) {
    let areasContainer = ``;

    for (let i = 0; i < areas.length; i++) {
        areasContainer += `
        <div class="col-md-3">
                <div  data-area="${areas[i].strArea}" class="area-content rounded-2 text-center ">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${areas[i].strArea}</h3>
                </div>
        </div>
        `
    }
    dataContainer.innerHTML = areasContainer
    getArea()
}
async function getAreaMeals(area) {
    dataContainer.innerHTML = ""
    $(".loading").removeClass('d-none')


    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let response = await data.json()
    displayMeals(response.meals.slice(0, 20))
    $(".loading").addClass('d-none')

}


$('.area').on('click', function () {
    closeSideBar()
    getAllAreas()
})

// ----------------------------------------------INGREDIENTS-------------------------------------------------------------

function getIngredients() {
    let ingredientsCards = document.querySelectorAll(".ingredients-content")
    for (let i = 0; i < ingredientsCards.length; i++) {
        ingredientsCards[i].addEventListener('click', function (e) {
            let ingredients = ingredientsCards[i].getAttribute('data-ingredients');
            getIngredientsMeals(ingredients)
            console.log(ingredients)
        })
    }
}

async function getAllIngredients() {
    dataContainer.innerHTML = ``
    $(".loading").removeClass('d-none')
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let respone = await data.json()
    console.log(respone.meals);
    displayIngredients(respone.meals.slice(0, 20))
    $(".loading").addClass('d-none')
}


function displayIngredients(ingredients) {
    let ingredientsContainer = ``;

    for (let i = 0; i < ingredients.length; i++) {
        ingredientsContainer += `
        <div class="col-md-3">
                <div data-ingredients="${ingredients[i].strIngredient}" class=" ingredients-content rounded-2 text-center ">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredients[i].strIngredient}</h3>
                        <p>${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    dataContainer.innerHTML = ingredientsContainer
    getIngredients()
}
async function getIngredientsMeals(ingredients) {
    dataContainer.innerHTML = ``
    $(".loading").removeClass('d-none')


    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    let response = await data.json()


    displayMeals(response.meals.slice(0, 20))
    $(".loading").addClass('d-none')


}

$('.ingredients').on('click', function () {
    closeSideBar()
    getAllIngredients()
})

// ----------------------------------------------CONTACT-------------------------------------------------------------
$('.contact').on('click', function () {
    closeSideBar()
    $('#contact').removeClass('d-none')
    $('#search').addClass('d-none')
    $('body').css('overflow', 'hidden')
    dataContainer.innerHTML = ``
})

$('#name').on('keyup', (e) => {
    nameInput = e.target.value;
    // setTimeout(() => enableBtn(), 0)
    isValidName(nameInput)
    enableBtn()
})
$('#email').on('keyup', (e) => {
    // setTimeout(() => enableBtn(), 0)
    emailInput = e.target.value
    isValidEmail(emailInput)
    enableBtn()

})
$('#phone').on('keyup', (e) => {
    // setTimeout(() => enableBtn(), 0)
    phoneInput = e.target.value
    isValidPhone(phoneInput)
    enableBtn()

})
$('#age').on('keyup', (e) => {
    // setTimeout(() => enableBtn(), 0)
    ageInput = e.target.value
    isValidAge(ageInput)
    enableBtn()

})
$('#password').on('keyup', (e) => {
    // setTimeout(() => enableBtn(), 0)
    passwordInput = e.target.value
    isValidPass(passwordInput)
    enableBtn()
})
$('#repassword').on('keyup', (e) => {
    // setTimeout(() => enableBtn(), 0)
    repasswordInput = e.target.value
    isValidRePass(repasswordInput)
    enableBtn()


})
// $('#contact input').on('keyup', e => {
//     enableBtn()

// })
function isValidName(inputname) {
    let regex = /^[a-zA-Z ]+$/

    if (regex.test(inputname)) {
        $('#invalidName').addClass("d-none").removeClass("d-block")
        return true;
    } else {
        $('#invalidName').removeClass("d-none").addClass("d-block")
        return false;
    }
}
function isValidEmail(email) {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (regex.test(email)) {
        $('#invalidEmail').addClass("d-none").removeClass("d-block")
        return true
    } else {
        $('#invalidEmail').removeClass("d-none").addClass("d-block")
        return false
    }
}
function isValidPhone(phone) {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if (regex.test(phone)) {
        $('#invalidPhone').addClass("d-none").removeClass("d-block")
        return true
    } else {
        $('#invalidPhone').removeClass("d-none").addClass("d-block")
        return false
    }
}
function isValidAge(age) {
    let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/
    if (regex.test(age)) {
        $('#invalidAge').addClass("d-none").removeClass("d-block")
        return true
    } else {
        $('#invalidAge').removeClass("d-none").addClass("d-block")
        return false
    }
}
function isValidPass(pass) {
    let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/
    if (regex.test(pass)) {
        $('#invaildPass').addClass("d-none").removeClass("d-block")
        return true
    } else {
        $('#invaildPass').removeClass("d-none").addClass("d-block")
        return false
    }
}
function isValidRePass() {
    if ($("#repassword").val() == $("#password").val()) {
        $('#invaildRePass').addClass("d-none").removeClass("d-block")
        return true
    } else {
        $('#invaildRePass').removeClass("d-none").addClass("d-block")
        return false
    }
}
function enableBtn() {
    if (isValidName(nameInput) && isValidEmail(emailInput) && isValidAge(ageInput) && isValidPass(passwordInput) && isValidPhone(phoneInput) && isValidRePass(repasswordInput)) {
        $('#submitBtn').removeAttr("disabled")
    } else {
        $('#submitBtn').attr("disabled", true)
    }
}
// ----------------------------------------------SIDEBAR-------------------------------------------------------------
$(".side-bar .control-icon").click((e) => {
    if ($(".side-bar").css("left") != "0px") {
        openSideBar()
    } else {
        closeSideBar()
    }
})
function closeSideBar() {
    let fullWidth = $(".side-bar .inner-nav").outerWidth()
    $(".side-bar").animate({
        left: -fullWidth
    }, 1000)
    $(".control-icon").removeClass("fa-x");
    $(".control-icon").addClass("fa-align-justify");
    $(".links li").animate({
        top: 300
    }, 500)
}
function openSideBar() {
    $(".side-bar").animate({
        left: 0
    }, 500)
    $(".control-icon").removeClass("fa-align-justify");
    $(".control-icon").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 150)
    }
}