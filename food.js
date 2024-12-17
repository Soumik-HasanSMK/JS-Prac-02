document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("button");
    const input = document.getElementById("item-name");

    button.addEventListener("click", () => {
        const foodName = input.value.trim();
        if (foodName) {
            fetchFoodData(foodName);
        } else {
            alert("Please enter a food name.");
        }
    });

    async function fetchFoodData(foodName) {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            displayFoodData(data);
        } catch (error) {
            console.error("Fetch error: ", error);
            alert("An error occurred while fetching the data.");
        }
    }

    function displayFoodData(data) {
        let container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '';
        } else {
            container = document.createElement('div');
            container.classList.add('container', 'mt-5');
            document.body.appendChild(container);
        }

        if (data.meals) {
            // Create a new row for each batch of 3 cards
            const row = document.createElement('div');
            row.classList.add('row', 'g-4'); // Added g-4 to give space between columns
            container.appendChild(row);

            data.meals.forEach((meal, index) => {
                const card = document.createElement('div');
                card.classList.add('col-md-4'); // Make each card take up 4 columns (3 items per row)
                card.style.backgroundColor = 'white';
                card.style.boxShadow = 'rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px';

                const cardContent = document.createElement('div');
                cardContent.classList.add('card', 'mb-3');

                const rowInner = document.createElement('div');
                rowInner.classList.add('row', 'g-0');

                const colImg = document.createElement('div');
                colImg.classList.add('col-md-4');

                const img = document.createElement('img');
                img.src = meal.strMealThumb;
                img.classList.add('img-fluid', 'rounded-start');
                img.alt = meal.strMeal;
                img.addEventListener('click', () => showMealDetails(meal));

                colImg.appendChild(img);

                const colBody = document.createElement('div');
                colBody.classList.add('col-md-8');

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = meal.strMeal;

                cardBody.appendChild(title);
                colBody.appendChild(cardBody);

                rowInner.appendChild(colImg);
                rowInner.appendChild(colBody);
                cardContent.appendChild(rowInner);
                card.appendChild(cardContent);

                row.appendChild(card); // Append the card to the row
            });
        } else {
            const noResults = document.createElement('p');
            noResults.textContent = "No results found.";
            container.appendChild(noResults);
        }
    }

    function showMealDetails(meal) {
        let ingredients = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                ingredients += `<li>${measure} ${ingredient}</li>`;
            }
        }

        const modalContent = `
            <div class="modal fade" id="mealModal" tabindex="-1" aria-labelledby="mealModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="mealModalLabel">${meal.strMeal}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
                            <p><strong>Category:</strong> ${meal.strCategory}</p>
                            <p><strong>Area:</strong> ${meal.strArea}</p>
                            <p><strong>Ingredients:</strong></p>
                            <ul>${ingredients}</ul>
                            <p>${meal.strInstructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalContent;
        document.body.appendChild(modalContainer);

        const modal = new bootstrap.Modal(modalContainer.querySelector('#mealModal'));
        modal.show();

        modalContainer.addEventListener('hidden.bs.modal', () => {
            modalContainer.remove();
        });
    }
});
