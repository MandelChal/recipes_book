let recipes = [];
let timerInterval = null;
let remainingTime = 0;

async function fetchRecipes() {
    try {
        const response = await fetch('https://dummyjson.com/recipes');
        const data = await response.json();
        recipes = data.recipes;
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => showRecipeDetails(recipe);

        const img = document.createElement('img');
        img.src = recipe.image;
        img.alt = recipe.name;

        const title = document.createElement('h3');
        title.textContent = recipe.name;

        card.appendChild(img);
        card.appendChild(title);
        container.appendChild(card);
    });
}

function showRecipeDetails(recipe) {
    const container = document.getElementById('recipe-details');
    container.innerHTML = '';
    container.style.display = 'block';

    document.getElementById('recipes-container').style.display = 'none';
    document.getElementById('search').style.display = 'none'; // הסתרת שורת החיפוש

    const title = document.createElement('h2');
    title.textContent = recipe.name;

    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.name;

    const prepTime = document.createElement('p');
    prepTime.textContent = `זמן הכנה: ${recipe.prepTimeMinutes} דקות`;

    const cookTime = document.createElement('p');
    cookTime.textContent = `זמן בישול: ${recipe.cookTimeMinutes} דקות`;

    const ingredients = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredients.appendChild(li);
    });

    const instructions = document.createElement('div');
    recipe.instructions.forEach(instruction => {
        const p = document.createElement('p');
        p.textContent = instruction;
        instructions.appendChild(p);
    });

    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';

    const timerTitle = document.createElement('h3');
    timerTitle.textContent = '⏲️ טיימר';

    const timerInput = document.createElement('input');
    timerInput.type = 'number';
    timerInput.placeholder = 'הזן זמן בדקות';
    timerInput.id = 'timer-input';

    const startButton = document.createElement('button');
    startButton.textContent = 'התחל טיימר';
    startButton.onclick = () => confirmStartTimer();

    const stopButton = document.createElement('button');
    stopButton.textContent = 'עצור טיימר';
    stopButton.id = 'stop-button';
    stopButton.style.display = 'none';
    stopButton.onclick = () => stopTimer();

    const resumeButton = document.createElement('button');
    resumeButton.textContent = 'המשך טיימר';
    resumeButton.id = 'resume-button';
    resumeButton.style.display = 'none';
    resumeButton.onclick = () => resumeTimer();

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer';
    timerDisplay.id = 'timer-display';

    timerContainer.append(timerTitle, timerInput, timerDisplay, startButton, stopButton, resumeButton);

    const backButton = document.createElement('button');
    backButton.textContent = 'חזרה לרשימה';
    backButton.onclick = () => {
        container.style.display = 'none';
        document.getElementById('recipes-container').style.display = 'flex';
        document.getElementById('search').style.display = 'block'; // הצגת שורת החיפוש מחדש
        searchRecipes();  // קריאה לפונקציית החיפוש בעת חזרה לרשימת המתכונים
    };

    container.append(title, img, prepTime, cookTime, ingredients, instructions, timerContainer, backButton);
}

function confirmStartTimer() {
    if (timerInterval) {
        const confirmRestart = confirm('הטיימר כבר רץ. האם אתה בטוח שברצונך להתחיל מחדש?');
        if (!confirmRestart) {
            return;
        }
        clearInterval(timerInterval);
    }
    startTimer();
}

function startTimer() {
    const input = document.getElementById('timer-input');
    const display = document.getElementById('timer-display');
    const stopButton = document.getElementById('stop-button');
    const resumeButton = document.getElementById('resume-button');
    remainingTime = parseInt(input.value) * 60;

    if (isNaN(remainingTime) || remainingTime <= 0) {
        display.textContent = 'אנא הזן זמן תקין';
        return;
    }

    stopButton.style.display = 'inline'; // הצג את כפתור עצירת הטיימר
    resumeButton.style.display = 'none'; // הסתר את כפתור המשך הטיימר

    timerInterval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            display.textContent = 'הזמן נגמר!';
            stopButton.style.display = 'none'; // הסתר את כפתור עצירת הטיימר
            resumeButton.style.display = 'none'; // הסתר את כפתור המשך הטיימר
        }

        remainingTime--;
    }, 1000);
}

function stopTimer() {
    const display = document.getElementById('timer-display');
    const stopButton = document.getElementById('stop-button');
    const resumeButton = document.getElementById('resume-button');

    clearInterval(timerInterval);
    timerInterval = null;
    display.textContent = 'הטיימר נעצר';
    stopButton.style.display = 'none'; // הסתר את כפתור עצירת הטיימר
    resumeButton.style.display = 'inline'; // הצג את כפתור המשך הטיימר
}

function resumeTimer() {
    const display = document.getElementById('timer-display');
    const stopButton = document.getElementById('stop-button');
    const resumeButton = document.getElementById('resume-button');

    stopButton.style.display = 'inline'; // הצג את כפתור עצירת הטיימר
    resumeButton.style.display = 'none'; // הסתר את כפתור המשך הטיימר

    timerInterval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            display.textContent = 'הזמן נגמר!';
            stopButton.style.display = 'none'; // הסתר את כפתור עצירת הטיימר
            resumeButton.style.display = 'none'; // הסתר את כפתור המשך הטיימר
        }

        remainingTime--;
    }, 1000);
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', searchRecipes);
}

function searchRecipes() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm)
    );
    displayRecipes(filteredRecipes);
}

// Initialize the app
fetchRecipes();
setupSearch();
