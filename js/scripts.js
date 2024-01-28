'use strict';
// IIFE containing repository of pokemons and functions to access them
const pokemonRepository = (function () {

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

  function addButtonEventListener(button, pokemon) {
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
  }

 //function to add one pokemon to list displayed on websites DOM
  function addListItem(pokemon) {
    let pokemonCard = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    // Added Bootstrap utility class to list element
    listItem.classList.add('list-group-item');
    listItem.classList.add('col-12');
    listItem.classList.add('col-sm-6');
    listItem.classList.add('col-md-4');
    listItem.classList.add('col-xl-3');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('main-button', 'btn', 'btn-lg', 'btn-outline-secondary', 'btn-block', 'shadow-sm');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
    listItem.appendChild(button);
    pokemonCard.appendChild(listItem);
    addButtonEventListener(button, pokemon);
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
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

  // Code cf
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrlFront = details.sprites.front_default;
      item.imageUrlBack = details.sprites.back_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }

  //show a modal on top of list of pokemons that displays the details of the clicked pokemon
  // code from video cf
  function showModal(pokemon) {
    let allTypesPokemon = '';

    for (let i = 0; i < pokemon.types.length; i++) {
      allTypesPokemon = pokemon.types[i].type.name + ' ' + allTypesPokemon;
    }

    // Get the header and body of bootstrap modal
    let modalTitle = $(".modal-title");
    let modalBody = $(".modal-body");

    modalTitle.empty();
    modalBody.empty();

    let nameElement = $('<h1>' + pokemon.name + '</h1>');
    let imageElementFront = $('<img class="modal-img" style="width:50%">');
    imageElementFront.attr('src', pokemon.imageUrlFront);
    let imageElementBack = $('<img class="modal-img" style="width:50%">');
    imageElementBack.attr('src', pokemon.imageUrlBack);
    let heightElement = $('<p>' + 'Height : ' + pokemon.height + '</p>');
    let typesElement = $('<p>' + 'Types : ' + allTypesPokemon + '</p>');

    modalTitle.append(nameElement);
    modalBody.append(imageElementFront);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(typesElement);
  }

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
