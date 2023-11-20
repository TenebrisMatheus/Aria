function toggleMenu() {
    var menuDropdown = document.getElementById("menuDropdown");
    menuDropdown.classList.toggle("show-menu");
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('Sair');

    logoutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            window.location.href = '../Login/login.html';
        }).catch((error) => {
            console.error('Erro ao encerrar a sessão: ', error);
        });
    });

    const userPhoto = document.getElementById('userPhoto');
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var userPhotoUrl = user.photoURL;
            if (userPhotoUrl) {
                userPhoto.style.backgroundImage = "url('" + userPhotoUrl + "')";
            } else {
                // Caso não haja foto do usuário, você pode definir uma imagem padrão
                userPhoto.style.backgroundImage = "url('../IMG/UsuarioFoto.png')";
            }
        } else {
            console.error('Usuário não autenticado.');
        }
    });

    const uploadForm = document.getElementById('upload-form');
    const mediaInput = document.getElementById('media');
    const categorySelect = document.getElementById('category');
    const mediaContainer = document.getElementById('media-container');

    // Configurar referências do Firebase
    const storage = firebase.storage();
    const firestore = firebase.firestore();

    // Função para recuperar e exibir mídias da categoria selecionada
    function showMedia(category) {
        mediaContainer.innerHTML = '';

        // Recuperar mídias do Firestore com base na categoria
        firestore.collection('media').where('category', '==', category).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const mediaData = doc.data();
                    const mediaElement = createMediaElement(mediaData.url);

                    mediaContainer.appendChild(mediaElement);
                });
            })
            .catch((error) => {
                console.error('Erro ao recuperar mídias:', error);
            });
    }

    // Adicionar evento de alteração à categoria para exibir mídias correspondentes
    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            const selectedCategory = categorySelect.value;
            showMedia(selectedCategory);
        });
    }

    // Adicionar lógica específica para cada página
    const currentPage = window.location.pathname;
    if (currentPage.includes('games_index.html')) {
        showMedia('games');
    } else if (currentPage.includes('cinema_index.html')) {
        showMedia('cinema');
    } else if (currentPage.includes('musica_index.html')) {
        showMedia('musica');
    }

    // Restante do código para o formulário de upload
    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const mediaFile = mediaInput.files[0];
            const category = categorySelect.value;

            if (mediaFile && category) {
                // Criar uma referência única para a mídia no Storage
                const mediaRef = storage.ref(`${category}/${mediaFile.name}`);

                // Fazer upload da mídia para o Storage
                mediaRef.put(mediaFile)
                    .then((snapshot) => {
                        // Obter a URL da mídia após o upload
                        return snapshot.ref.getDownloadURL();
                    })
                    .then((downloadURL) => {
                        // Registrar informações da mídia no Firestore
                        return firestore.collection('media').add({
                            category,
                            url: downloadURL,
                        });
                    })
                    .then(() => {
                        console.log('Mídia enviada com sucesso!');
                        // Limpar formulário após o envio
                        uploadForm.reset();
                    })
                    .catch((error) => {
                        console.error('Erro no envio da mídia:', error);
                    });
            } else {
                console.error('Por favor, escolha uma mídia e uma categoria.');
            }
        });
    }
});

// Função auxiliar para criar elementos de mídia (imagem, áudio, vídeo)
function createMediaElement(url) {
    const mediaElement = document.createElement('div');

    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;
        mediaElement.appendChild(audio);
    } else if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
        const video = document.createElement('video');
        video.controls = true;
        video.src = url;
        mediaElement.appendChild(video);
    } else {
        const image = document.createElement('img');
        image.src = url;
        mediaElement.appendChild(image);
    }

    return mediaElement;
  }
// Função para recuperar arquivos do Firebase Storage e criar cards

function displayFiles() {
  var cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = ''; // Limpar a lista de cards

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var filesRef = storage.ref('users/' + user.uid + '/files');
      filesRef.listAll().then(result => {
        result.items.forEach(item => {
          item.getDownloadURL().then(url => {
            item.getMetadata().then(metadata => {
              let arquivoconfig = user.uid + ".txt";

              if (metadata.name != arquivoconfig && (metadata.contentType.startsWith('image') || metadata.contentType.startsWith('video'))) {

                var cardAndButtonContainer = document.createElement('div');
                cardAndButtonContainer.classList.add('card-and-button-container');

                var card = document.createElement('div');
                card.classList.add('card');
                card.onclick = function () {
                  window.location.href = 'produto.html';
                };

                if (metadata.contentType.startsWith('image')) {
                  // Se for uma imagem, exibir miniatura
                  var cardImage = document.createElement('img');
                  cardImage.src = url;
                  cardImage.alt = 'Imagem do produto';
                  card.appendChild(cardImage);
                } else if (metadata.contentType.startsWith('video')) {
                  // Se for um vídeo, exibir um elemento de vídeo diretamente
                  var cardVideo = document.createElement('video');
                  cardVideo.src = url;
                  cardVideo.controls = true;
                  card.appendChild(cardVideo);
                }

                var cardContent = document.createElement('div');
                cardContent.classList.add('card-content');
                card.appendChild(cardContent);

                cardAndButtonContainer.appendChild(card);

                // Adicione o botão de remoção fora do card
                var removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.addEventListener('click', function () {
                  removeFile(user.uid, item.name);
                });
                cardAndButtonContainer.appendChild(removeButton);

                cardContainer.appendChild(cardAndButtonContainer);
              }
            });
          }).catch(error => {
            console.error('Erro ao recuperar metadados:', error);
          });
        });
      }).catch(error => {
        console.error('Erro ao recuperar arquivos:', error);
      });
    } else {
      console.error('Usuário não autenticado.');
    }
  });
}


// Função para remover um arquivo do Firebase Storage
function removeFile(userId, fileName) {
  var fileRef = storage.ref('users/' + userId + '/files/' + fileName);

  fileRef.delete().then(() => {
    console.log('Arquivo removido com sucesso.');
    displayFiles(); // Atualizar a exibição após a remoção
  }).catch(error => {
    console.error('Erro ao remover arquivo:', error);
  });
}

// Chamar a função de exibição ao carregar a página
document.addEventListener('DOMContentLoaded', displayFiles);


/*Não seu como adpatar
function toggleMenu() {
    var menuDropdown = document.getElementById("menuDropdown");
    menuDropdown.classList.toggle("show-menu");
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('Sair');

    logoutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            window.location.href = '../Login/login.html';
        }).catch((error) => {
            console.error('Erro ao encerrar a sessão: ', error);
        });
    });

    const userPhoto = document.getElementById('userPhoto');
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var userPhotoUrl = user.photoURL;
            if (userPhotoUrl) {
                userPhoto.style.backgroundImage = "url('" + userPhotoUrl + "')";
            } else {
                // Caso não haja foto do usuário, você pode definir uma imagem padrão
                userPhoto.style.backgroundImage = "url('../IMG/UsuarioFoto.png')";
            }
        } else {
            console.error('Usuário não autenticado.');
        }
    });

    const uploadForm = document.getElementById('upload-form');
    const mediaInput = document.getElementById('media');
    const categorySelect = document.getElementById('category');
    const mediaContainer = document.getElementById('media-container');

    // Configurar referências do Firebase
    const storage = firebase.storage();
    const firestore = firebase.firestore();

    // Função para recuperar e exibir mídias da categoria selecionada
    function showMedia(category) {
        mediaContainer.innerHTML = '';

        // Recuperar mídias do Firestore com base na categoria
        firestore.collection('media').where('category', '==', category).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const mediaData = doc.data();
                    const mediaElement = createMediaElement(mediaData.url);

                    mediaContainer.appendChild(mediaElement);
                });
            })
            .catch((error) => {
                console.error('Erro ao recuperar mídias:', error);
            });
    }

    // Adicionar evento de alteração à categoria para exibir mídias correspondentes
    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            const selectedCategory = categorySelect.value;
            showMedia(selectedCategory);
        });
    }

    // Adicionar lógica específica para cada página
    const currentPage = window.location.pathname;
    if (currentPage.includes('games.html')) {
        showMedia('games');
    } else if (currentPage.includes('cinema.html')) {
        showMedia('cinema');
    } else if (currentPage.includes('musica.html')) {
        showMedia('musica');
    }

    // Restante do código para o formulário de upload
    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const mediaFile = mediaInput.files[0];
            const category = categorySelect.value;

            if (mediaFile && category) {
                // Criar uma referência única para a mídia no Storage
                const mediaRef = storage.ref(`${category}/${mediaFile.name}`);

                // Fazer upload da mídia para o Storage
                mediaRef.put(mediaFile)
                    .then((snapshot) => {
                        // Obter a URL da mídia após o upload
                        return snapshot.ref.getDownloadURL();
                    })
                    .then((downloadURL) => {
                        // Registrar informações da mídia no Firestore
                        return firestore.collection('media').add({
                            category,
                            url: downloadURL,
                        });
                    })
                    .then(() => {
                        console.log('Mídia enviada com sucesso!');
                        // Limpar formulário após o envio
                        uploadForm.reset();
                    })
                    .catch((error) => {
                        console.error('Erro no envio da mídia:', error);
                    });
            } else {
                console.error('Por favor, escolha uma mídia e uma categoria.');
            }
        });
    }
});

// Função auxiliar para criar elementos de mídia (imagem, áudio, vídeo)
function createMediaElement(url) {
    const mediaElement = document.createElement('div');

    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;
        mediaElement.appendChild(audio);
    } else if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
        const video = document.createElement('video');
        video.controls = true;
        video.src = url;
        mediaElement.appendChild(video);
    } else {
        const image = document.createElement('img');
        image.src = url;
        mediaElement.appendChild(image);
    }

    return mediaElement;
}
*/