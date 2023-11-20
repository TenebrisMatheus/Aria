document.addEventListener('DOMContentLoaded', function () {
    const cadUsuario = document.getElementById('cadUsuario');
    const btnCriar = document.getElementById('btncriar');
    const messageContainer = document.getElementById('message-container');
    const message = document.getElementById('message');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Verificar se o usuário já tem um nome de usuário
            const db = firebase.firestore();
            const userId = user.uid;

            db.collection('usuarios').doc(userId).get()
                .then(function (doc) {
                    if (doc.exists) {
                        // Se o usuário já tiver um nome de usuário, redirecione para a página inicial
                        console.log('Usuário já tem um nome de usuário. Redirecionando para a página inicial.');
                        window.location.href = '../Home/home_index.html';
                    } else {
                        // Se o usuário não tiver um nome de usuário, continue com a lógica de criar
                        console.log('Usuário não tem um nome de usuário. Permitindo a criação.');
                        cadUsuario.addEventListener('input', habilitarBtn);

                        function habilitarBtn() {
                            const nomeUsuarioValue = cadUsuario.value.trim();
                            btnCriar.disabled = nomeUsuarioValue === "";
                        }

                        btnCriar.addEventListener('click', function () {
                            const nomeUsuarioValue = cadUsuario.value.trim();
                            const db = firebase.firestore();

                            // Verificar se o nome de usuário já existe
                            db.collection('usuarios').where('nomeUsuario', '==', nomeUsuarioValue).get()
                                .then(function (querySnapshot) {
                                    if (querySnapshot.empty) {
                                        // Se o nome de usuário não existe, adicione-o ao Firestore
                                        db.collection('usuarios').doc(userId).set({
                                            nomeUsuario: nomeUsuarioValue,
                                            email: user.email // Adicione o e-mail do usuário ao Firestore
                                        })
                                            .then(function () {
                                                console.log('Nome de usuário adicionado com sucesso!');
                                                // Redirecionar para a página principal (ajuste o caminho conforme necessário)
                                                window.location.href = '../Home/home_index.html';
                                            })
                                            .catch(function (error) {
                                                console.error('Erro ao adicionar nome de usuário:', error);
                                                mostrarMensagem('Erro ao adicionar nome de usuário: ' + error.message, 'error');
                                            });
                                    } else {
                                        // Se o nome de usuário já existe, exiba uma mensagem de erro
                                        mostrarMensagem('Este nome de usuário já existe. Por favor, escolha um diferente.', 'danger');
                                    }
                                })
                                .catch(function (error) {
                                    console.error('Erro ao verificar nome de usuário:', error);
                                });
                        });
                    }
                });
        } else {
            console.log('Usuário não autenticado. Redirecionando para a página de login.');
            // Se o usuário não estiver autenticado, redirecione para a página de login (ajuste o caminho conforme necessário)
            window.location.href = '../Login/login.html';
        }
    });

    function mostrarMensagem(mensagem, tipo) {
        message.innerHTML = mensagem;
        messageContainer.style.display = 'block';
        messageContainer.className = 'alert alert-' + tipo + ' alert-dismissible fade show';

        setTimeout(function () {
            messageContainer.style.display = 'none';
        }, 5000);
    }
});
