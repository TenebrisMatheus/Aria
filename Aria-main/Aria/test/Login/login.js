function togglePasswordVisibility(inputId) {
    var input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        document.querySelector(".password-toggle-icon i").classList.remove("bi-eye-slash");
        document.querySelector(".password-toggle-icon i").classList.add("bi-eye");
    } else {
        input.type = "password";
        document.querySelector(".password-toggle-icon i").classList.remove("bi-eye");
        document.querySelector(".password-toggle-icon i").classList.add("bi-eye-slash");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const btnEntrar = document.getElementById('btnentrar');
    const googleLogin = document.getElementById('google-login');
    const gitLogin = document.getElementById('git-login');
    btnEntrar.addEventListener('click', function () {
        const email = document.getElementById('inemail').value;
        const senha = document.getElementById('insenha').value;
    
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(function () {
                // Adicione um pequeno atraso (por exemplo, 500 ms) antes de verificar o usuário
                setTimeout(function () {
                    // Verificamos se o usuário concluiu o processo de criação de conta
                    const userId = firebase.auth().currentUser.uid;
                    const db = firebase.firestore();
    
                    db.collection('usuarios').doc(userId).get()
                        .then(function (doc) {
                            if (doc.exists) {
                                console.log('Usuário autenticado com sucesso.');
                                window.location.href = '../Home/home_index.html';
                            } else {
                                // Usuário não concluiu o processo de criação de conta
                                alert('Você ainda não completou o processo de criação de conta. Redirecionando para cadastro...');
                                window.location.href = '../Cadastro/cadastro.html';
                            }
                        })
                        .catch(function (error) {
                            console.error('Erro ao verificar usuário:', error);
                        });
                }, 500);
            })
            .catch(function (error) {
                console.error('Erro ao autenticar:', error);
                alert('Erro ao autenticar. Verifique seu email e senha e tente novamente.');
            });
    });
    

    googleLogin.addEventListener('click', function () {
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(function (result) {
                console.log('Usuário autenticado com sucesso:', result.user);
                window.location.href = "../Home/nomeUsuario.html";
            })
            .catch(function (error) {
                console.error('Erro ao autenticar com o Google:', error);
            });
    });

    gitLogin.addEventListener('click', function () {
        const provider = new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(function (result) {
                console.log('Usuário autenticado com sucesso:', result.user);
                window.location.href = "../Home/nomeUsuario.html";
            })
            .catch(function (error) {
                console.error('Erro ao autenticar com o GitHub:', error);
            });
    });
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Usuário autenticado, redirecione para a página principal
        window.location.href = '../Home/home_index.html';
    }
});