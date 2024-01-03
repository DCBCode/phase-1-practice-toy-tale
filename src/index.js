let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(data => {
    renderToys(data); // Call the renderToys function with the fetched data
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Define a function to handle the form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form input values
  const nameInput = document.querySelector("#toy-name").value;
  const imageInput = document.querySelector("#toy-image").value;

  // Create a new toy object
  const newToy = {
    name: nameInput,
    image: imageInput,
    likes: 0
  };

  // Make a POST request to create a new toy
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response data as needed
      console.log('New toy created:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Define a function to handle toy likes
function handleToyLikes(event) {
  const toyId = event.target.id;

  // Make a GET request to fetch the current toy likes
  fetch(`http://localhost:3000/toys/${toyId}`)
    .then(response => response.json())
    .then(toy => {
      // Get the current likes value
      const currentLikes = toy.likes;

      // Increment the likes value
      const newLikes = currentLikes + 1;

      // Make a PATCH request to update toy likes with the new value
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ likes: newLikes })
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data as needed
          console.log('Toy likes updated:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Define a function to render toys
function renderToys(toys) {
  const toyCollection = document.querySelector("#toy-collection");

  toys.forEach(toy => {
    // Create the card element
    const toyCard = document.createElement('div');
    toyCard.classList.add('card');

    // the name element
    const toyName = document.createElement('h2');
    toyName.textContent = toy.name;

    // Create the image element
    const toyImage = document.createElement('img');
    toyImage.src = toy.image;
    toyImage.classList.add('toy-avatar');

    // Create the like button
    const likeButton = document.createElement('button');
    likeButton.textContent = 'Like';
    likeButton.id = toy.id; // Assuming that each toy has an 'id' property

    // Append the name, image, and like button to the card
    toyCard.appendChild(toyName);
    toyCard.appendChild(toyImage);
    toyCard.appendChild(likeButton);

    // Append the card to the toy collection
    toyCollection.appendChild(toyCard);

    // Add a click event listener to the like button
    likeButton.addEventListener('click', handleToyLikes);
  });
}

// Add a submit event listener to the toy form
const toyForm = document.querySelector('.add-toy-form');
toyForm.addEventListener('submit', handleFormSubmit);