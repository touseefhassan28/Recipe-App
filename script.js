// API Key
const apiKey = '29ddc1895c664be4acdc4e3c61a623f1';

// DOM elements
const searchbox = document.querySelector('.searchbox');
const searchbtn = document.querySelector('.searchbtn');
const recipeContainer = document.querySelector('.recipe-container');
const closeBtn = document.querySelector('.close-btn');
const recipeDetailsContent = document.querySelector('.recipe-details-content');

// Function to get recipes. 
const fetchRecipes = async (query) => {

    // Check if the query results are already in local storage
    const cachedRecipes = localStorage.getItem(query);
    if (cachedRecipes) {
        displayRecipes(JSON.parse(cachedRecipes));
        return;
    }

    recipeContainer.innerHTML = `<h2>Searching Some Tasty Recipes .....</h2>`;
    const data = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&addRecipeInstructions=true&addRecipeInformation=true&fillIngredients=true`)
    const response = await data.json();

    // Display recipes
        recipeContainer.innerHTML = "";
        response.results.forEach(results => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe')
        recipeDiv.innerHTML = `
            <img src = "${results.image}">
            <h3>${results.title}</h3>        `

            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);


            //Adding event listner to View Recipe button.
            button.addEventListener('click', () => {
                openRecipePopup(results)
            })


            recipeContainer.appendChild(recipeDiv);
        })
    }
    // Function to open Recipe Popup
    const openRecipePopup = (results) => {
        const instructions = results.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join('');
        const ingredients = results.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');
        recipeDetailsContent.innerHTML = `
        <h2>${results.title}</h2>
        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>
        <h3>Preparation</h3>
        <ol>${instructions}</ol>
        `

        recipeDetailsContent.parentElement.style.display = "block";
    }

    // Close recipe details
    closeBtn.addEventListener('click', () => {
        recipeDetailsContent.parentElement.style.display = "none";
    });

    // Search button click event listener
    searchbtn.addEventListener('click', () => {
        const searchInput = searchbox.value.trim();
        fetchRecipes(searchInput);
    });