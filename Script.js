const SearchBox = document.querySelector('.SearchBox');
const SearchBtn = document.querySelector('.SearchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

document.addEventListener("DOMContentLoaded", function() {
  const SearchBox = document.querySelector('.SearchBox');
  const suggestionDiv = document.getElementById("suggestion");
  const itemList = [
      "cake",
      "sandwich",
      "paneer",
      "pizza",
      "egg",
      "milk"
  ];

  SearchBox.addEventListener("input", function() {
      const searchTerm = SearchBox.value.toLowerCase();
      const suggestion = getSuggestion(searchTerm, itemList);
      suggestionDiv.textContent = suggestion;
  });

  function getSuggestion(searchTerm, itemList) {
      for (const item of itemList) {
          const lowerItem = item.toLowerCase();
          if (lowerItem.startsWith(searchTerm)) {
              return item;
          }
      }
      return "";
  }
});

// function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    
    recipeContainer.innerHTML = "";
    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
          <img src="${meal.strMealThumb}">
          <h3>${meal.strMeal}</h3>
          <p><span>${meal.strArea}</span> Dish</p>
          <p> Belong to <span>${meal.strCategory}<span> Category</p>
      `

      const button = document.createElement('button');
      button.textContent = "View Recipes";
      recipeDiv.appendChild(button);

      const newVideoButton = document.createElement('button');
      newVideoButton.textContent = "View Video";
      recipeDiv.appendChild(newVideoButton);

      // adding addEventListener to recipe button
      button.addEventListener('click',() => {
        openRecipePopup(meal);
      });

        // Adding event listener to the new video button to open the YouTube URL
      newVideoButton.addEventListener('click', () => {
        if (meal.strYoutube) {
          window.open(meal.strYoutube, '_blank');
        } else {
          alert('No YouTube video available for this recipe.');
        }
      });

      recipeContainer.appendChild(recipeDiv);
  });  
} catch (error) {
  recipeContainer.innerHTML = "<h2>sorry this Recipes is note Found...</h2>";  
} 
}

// function to fetch ingredient and measurement
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for(let i=1; i<=20; i++){
    const ingredient = meal[`strIngredient${i}`];
    if(ingredient){
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`
    }
    else{
      break;
    }
  }
  return ingredientsList;
}
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
      <h2 class="recipeName">${meal.strMeal}</h2>
      <h3>Ingredents:</h3>
      <ul class="ingredientsList">${fetchIngredients(meal)}</ul>
      <div class="recipeInstructions">
      <h3>Instructions :</h3>
      <p>${meal.strInstructions}</p>
      </div>
  `

  recipeDetailsContent.parentElement.style.display = "block";
};


recipeCloseBtn.addEventListener('click',() => {
  recipeDetailsContent.parentElement.style.display="none";
});

SearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = SearchBox.value.trim();
    if(!searchInput){
      recipeContainer.innerHTML = `<h2>Type The Main in the search box.</h2>`;
      return;
    }
    fetchRecipes(searchInput);
});

