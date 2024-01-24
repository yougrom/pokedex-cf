function showModal(pokemon) {
    // Get the header and body of bootstrap modal
    let modalBody = document.querySelector('.modal-body');
    let modalTitle = document.querySelector('.modal-title');
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