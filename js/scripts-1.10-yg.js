'use strict';

// IIFE containing repository of pokemons and functions to access them
const pokemonRepository = (function () {

  //show a modal on top of list of pokemons that displays the details of the clicked pokemon

  function showModal(title, text, imgurl, types) {
    console.log(imgurl);
    let modalContainer = document.querySelector('#modal-container');
  
    // Clear all existing modal content
    modalContainer.innerHTML = '';
  
    let modal = document.createElement('div');
    modal.classList.add('modal');
  
    // Add the new modal content
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);
  
    let titleElement = document.createElement('h1');
    titleElement.innerText = title;

    let contentElement = document.createElement('p');
    contentElement.innerText = 'Height: ' + text;
         
    let pokemonTypes = document.createElement('p');
    pokemonTypes.innerText = 'Types: ';

    types.forEach(function (current, index) {
        // Create a span for each type
        let newType = document.createElement('span');
        newType.innerText = current.type.name;
        
        // Append the type span to the p element
        pokemonTypes.appendChild(newType);

        // Add a comma and a space after each type except the last
        if (index < types.length - 1) {
            pokemonTypes.appendChild(document.createTextNode(', '));
        }
    });

    let imageElement = document.createElement('img');
    imageElement.setAttribute('src', imgurl);
    imageElement.setAttribute('width', '50%');
    imageElement.setAttribute('height', 'auto');
    imageElement.setAttribute('alt', 'Pokemon image');
  
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(imageElement);
    modal.appendChild(contentElement);
    modal.appendChild(pokemonTypes);
    modalContainer.appendChild(modal);
    
    modalContainer.classList.add('is-visible');

    modalContainer.addEventListener('click', (e) => {
      // Since this is also triggered when clicking INSIDE the modal
      // We only want to close if the user clicks directly on the overlay
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
  }

  // Close modal
  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.remove('is-visible');
  }

  window.addEventListener('keydown', (e) => {
    let modalContainer = document.querySelector('#modal-container');
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();  
    }
  });

  document.querySelector('#show-modal').addEventListener('click', () => {
    showModal('Modal title', 'This is the modal content!');
  });

  const pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //function to return the array pokemonList
  function getAll() {
    return pokemonList;
  }

  // function to add new pokemon to pokemonList
  function add(pokemon) {
    if (
      typeof pokemon === 'object' && 'name' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.log('Error: Invalid input. Please provide an object with "name", "height", and "types" properties.');
    }
  }

  // Define the showDetails function in an accessible scope
  function showDetails(pokemon) {
    console.log(pokemon);
  }

  function addButtonEventListener(button, pokemon) {
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
  }

  function addListItem(pokemon) {
    let pokemonCard = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('main-button');
    listItem.appendChild(button);
    pokemonCard.appendChild(listItem);
    addButtonEventListener(button, pokemon);
  }

  //a subset of available pokemons defined by offset and limit is loaded from API
  //loaded pokemons are then added to array pokemonList
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  // Code
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
      showModal(pokemon.name, pokemon.height, pokemon.imageUrl, pokemon.types);
    });
  }

  // code from video cf ====================================================================================================
  function showModal(pokemon) { 
    // Get the header and body of bootstrap modal
    let modalTitle = document.querySelector('.modal-title');
    let modalBody = document.querySelector('.modal-body');
    let modalHeader = document.querySelector('.modal-header');
  
    modalTitle.empty();
    modalBody.empty();

    let nameElement = $('<h1>' + pokemon.name + '</h1>');
    let imageElementFront = $('<img class="modal-img" style="width:50%">');
    imageElementFront.attr('src', pokemon.imageUrlFront);
    let imageElementBack = $('<img class="modal-img" style="width:50%">');
    imageElementBack.attr('src', pokemon.imageUrlBack);
    let heightElement = $('<p>' + 'Height : ' + pokemon.height + '</p>');
    let weightElement = $('<p>' + 'Weight : ' + pokemon.weight + '</p>');
    let typesElement = $('<p>' + 'Types : ' + pokemon.types + '</p>');

    modalTitle.append(nameElement);
    modalBody.append(imageElementFront);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(weightElement);
    modalBody.append(typesElement);
  }
  // ====================================================================================================


  return {
    add,
    getAll,
    loadList,
    addListItem,
    loadDetails,
    showDetails
  };
})();

pokemonRepository.loadList().then(function () {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});