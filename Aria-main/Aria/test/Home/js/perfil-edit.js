// perfil-edit.js

document.addEventListener('DOMContentLoaded', function () {
    const editUserName = document.getElementById('editUserName');
    const editPortfolio = document.getElementById('editPortfolio');
    const editWorkplaces = document.getElementById('editWorkplaces');
    const editSocialLink = document.getElementById('editSocialLink');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const errorMessageContainer = document.getElementById('errorMessage');

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;
            const db = firebase.firestore();

            // Recupere as informações atuais do perfil
            db.collection('usuarios').doc(userId).get()
                .then(function (doc) {
                    if (doc.exists) {
                        // Preencha os campos do formulário com as informações atuais
                        const nomeUsuarioAtual = doc.data().nomeUsuario;
                        const portfolio = doc.data().portfolio || '';
                        const workplaces = doc.data().workplaces || '';
                        const socialLink = doc.data().socialLink || '';

                        editUserName.value = nomeUsuarioAtual;
                        editPortfolio.value = portfolio;
                        editWorkplaces.value = workplaces;
                        editSocialLink.value = socialLink;

                        // Adicione um evento de clique para o botão "Salvar Alterações"
                        saveChangesButton.addEventListener('click', function () {
                            const novoNomeUsuario = editUserName.value.trim();

                            // Verifique se o novo nome de usuário é diferente do atual
                            if (novoNomeUsuario !== nomeUsuarioAtual) {
                                // Verifique se o novo nome de usuário já existe
                                db.collection('usuarios').where('nomeUsuario', '==', novoNomeUsuario).get()
                                    .then(function (querySnapshot) {
                                        if (querySnapshot.empty) {
                                            // Se o nome de usuário não existe, atualize as informações do perfil no Firestore
                                            atualizarPerfil(db, userId, novoNomeUsuario);
                                        } else {
                                            // Se o nome de usuário já existe, exiba uma mensagem de erro
                                            exibirMensagemDeErro('Este nome de usuário já existe. Por favor, escolha um diferente.');
                                        }
                                    })
                                    .catch(function (error) {
                                        console.error('Erro ao verificar nome de usuário:', error);
                                        exibirMensagemDeErro('Erro ao verificar nome de usuário.');
                                    });
                            } else {
                                // Se o nome de usuário não foi alterado, atualize as informações do perfil no Firestore
                                atualizarPerfil(db, userId, novoNomeUsuario);
                            }
                        });
                    } else {
                        console.error('Usuário não encontrado no banco de dados.');
                    }
                })
                .catch(function (error) {
                    console.error('Erro ao recuperar informações do perfil:', error);
                    exibirMensagemDeErro('Erro ao recuperar informações do perfil.');
                });
        } else {
            console.error('Usuário não autenticado.');
        }
    });

    function atualizarPerfil(db, userId, novoNomeUsuario) {
        // Atualize as informações do perfil no Firestore
        db.collection('usuarios').doc(userId).update({
            nomeUsuario: novoNomeUsuario,
            portfolio: editPortfolio.value,
            workplaces: editWorkplaces.value,
            socialLink: editSocialLink.value
        })
            .then(function () {
                console.log('Informações do perfil atualizadas com sucesso!');
                // Redirecione de volta para a página de perfil após salvar as alterações
                window.location.href = 'perfil.html';
            })
            .catch(function (error) {
                console.error('Erro ao atualizar informações do perfil:', error);
                exibirMensagemDeErro('Erro ao atualizar informações do perfil.');
            });
    }

    function exibirMensagemDeErro(mensagem) {
        errorMessageContainer.textContent = mensagem;
        errorMessageContainer.style.display = 'block';
    }
});
