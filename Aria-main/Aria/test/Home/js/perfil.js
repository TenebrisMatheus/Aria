// ... (código existente) ...

document.addEventListener('DOMContentLoaded', function () {
    const userPhoto = document.getElementById('userPhoto');
    const userName = document.getElementById('userName');
    const signOutButton = document.getElementById('signOutButton');
    const backToHomeButton = document.getElementById('backToHomeButton');
    const editPhotoButton = document.getElementById('editPhotoButton');
    const photoInput = document.getElementById('photoInput');
    const profileCardUserName = document.getElementById('profileCardUserName');
    const profileCardPortfolio = document.getElementById('profileCardPortfolio');
    const profileCardWorkplaces = document.getElementById('profileCardWorkplaces');
    const profileCardSocialLink = document.getElementById('profileCardSocialLink');

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Usuário está autenticado, recupere informações do perfil
            const userId = user.uid;
            const db = firebase.firestore();

            db.collection('usuarios').doc(userId).get()
                .then(function (doc) {
                    if (doc.exists) {
                        const nomeUsuario = doc.data().nomeUsuario;
                        const portfolio = doc.data().portfolio || '';
                        const workplaces = doc.data().workplaces || '';
                        const socialLink = doc.data().socialLink || '';

                        // Atualize elementos HTML com informações do perfil
                        userName.textContent = nomeUsuario;
                        userPhoto.src = user.photoURL || '../IMG/UsuarioFoto.png';

                        // Preencha as informações do card de perfil
                        profileCardUserName.textContent = nomeUsuario;
                        profileCardPortfolio.textContent = portfolio;
                        profileCardWorkplaces.textContent = workplaces;
                        profileCardSocialLink.textContent = socialLink;

                        // Adicione um evento de clique para o botão de sair
                        signOutButton.addEventListener('click', function () {
                            firebase.auth().signOut().then(function () {
                                // Redirecione ou atualize a página após a saída
                                window.location.href = '../Login/login.html';
                            }).catch(function (error) {
                                console.error('Erro ao fazer logout:', error);
                            });
                        });

                        // Adicione um evento de clique para o botão de voltar para a home
                        backToHomeButton.addEventListener('click', function () {
                            window.location.href = '../Home/home_index.html';
                        });

                        // Adicione um evento de clique para o botão de editar foto
                        editPhotoButton.addEventListener('click', function () {
                            // Abra a caixa de seleção de arquivo ao clicar no botão
                            photoInput.click();
                        });

                        // Adicione um evento de mudança para a entrada de arquivo
                        photoInput.addEventListener('change', function (event) {
                            // Obtenha o arquivo selecionado pelo usuário
                            const newPhoto = event.target.files[0];

                            // Faça upload da nova foto para o armazenamento do Firebase
                            const storageRef = firebase.storage().ref();
                            const photoRef = storageRef.child(`fotosPerfil/${userId}`);
                            photoRef.put(newPhoto).then(function () {
                                // Obtenha a URL da nova foto após o upload
                                return photoRef.getDownloadURL();
                            }).then(function (photoUrl) {
                                // Atualize a foto de perfil no Firestore e na página
                                user.updateProfile({ photoURL: photoUrl }).then(function () {
                                    userPhoto.src = photoUrl;
                                    console.log('Foto de perfil atualizada com sucesso.');
                                }).catch(function (error) {
                                    console.error('Erro ao atualizar foto de perfil:', error);
                                });
                            }).catch(function (error) {
                                console.error('Erro ao fazer upload da nova foto:', error);
                            });
                        });

                    } else {
                        console.error('Usuário não encontrado no banco de dados.');
                    }
                })
                .catch(function (error) {
                    console.error('Erro ao recuperar informações do perfil:', error);
                });
        } else {
            console.error('Usuário não autenticado.');
        }
    });
});
