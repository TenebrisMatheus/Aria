document.addEventListener('DOMContentLoaded', function () {
    const mostrarSenhasCheckbox = document.getElementById('mostrarSenhas');
    const cadsenha1 = document.getElementById('cadSenha');
    const cadsenha2 = document.getElementById('cadConfirmaSenha');
    const nomeUsuario = document.getElementById('cadUsuario');
    const btncriar = document.querySelector("#btncriar");

    mostrarSenhasCheckbox.addEventListener('change', function () {
        if (mostrarSenhasCheckbox.checked) {
            cadsenha1.type = 'text';
            cadsenha2.type = 'text';
        } else {
            cadsenha1.type = 'password';
            cadsenha2.type = 'password';
        }
    });

    btncriar.addEventListener('click', clickCriar);

    function clickCriar() {
        const cademail = document.querySelector("#cadEmailInput").value;
        const cadsenha = document.querySelector("#cadSenha").value;
        const nomeUsuarioValue = nomeUsuario.value;

        const acceptTerms = document.getElementById('acceptTerms');

        if (acceptTerms.checked) {
            if (cadsenha1.value.trim() === cadsenha2.value.trim()) {
                if (!firebase.apps.length) {
                    firebase.initializeApp(config);
                }

                const db = firebase.firestore();

                db.collection('usuarios').where('nomeUsuario', '==', nomeUsuarioValue).get()
                    .then(function (querySnapshot) {
                        if (querySnapshot.empty) {
                            firebase.auth().createUserWithEmailAndPassword(cademail, cadsenha)
                                .then(function (userCredential) {
                                    const userId = userCredential.user.uid;
                                    db.collection('usuarios').doc(userId).set({
                                        nomeUsuario: nomeUsuarioValue,
                                        email: cademail
                                    })
                                        .then(function () {
                                            console.log('Nome de usuário adicionado com sucesso!');
                                            window.location.href = "../Home/home_index.html";
                                        })
                                        .catch(function (error) {
                                            console.error('Erro ao adicionar nome de usuário:', error);
                                        });
                                })
                                .catch(function (error) {
                                    console.error('Erro ao criar usuário:', error);
                                });
                        } else {
                            alert('Nome de usuário já em uso. Escolha outro.');
                        }
                    })
                    .catch(function (error) {
                        console.error('Erro ao verificar nome de usuário:', error);
                    });
            } else {
                alert('As senhas não coincidem. Verifique e tente novamente.');
            }
        } else {
            alert('Você deve aceitar os Termos de Uso e apertar o botão "Confirmar" para se cadastrar.');
        }
    }
});

function createAccountWithGoogle() {
    const acceptTerms = document.getElementById('acceptTerms');

    if (acceptTerms.checked) {
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const user = result.user;

                // Armazenar o e-mail no Local Storage
                localStorage.setItem('userEmail', user.email);

                console.log('Usuário logado:', user);
                window.location.href = "../Home/nomeUsuario.html";
            })
            .catch((error) => {
                console.error('Erro ao autenticar com o Google:', error);
            });
    } else {
        alert('Você deve aceitar os Termos de Uso para se cadastrar com o Google.');
    }
}

function createAccountWithGitHub() {
    const acceptTerms = document.getElementById('acceptTerms');

    if (acceptTerms.checked) {

        const provider = new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                console.log('Usuário logado:', user);
                window.location.href = '../Home/nomeUsuario.html';
            })
            .catch((error) => {
                console.error('Erro ao autenticar com o GitHub:', error);
            });
    } else {
        alert('Você deve aceitar os Termos de Uso para se cadastrar com o GitHub.');
    }
}
