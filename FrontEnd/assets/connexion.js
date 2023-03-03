document.querySelector("#li-login").setAttribute("style", "font-weight: bolder;");
const btnSubmit=document.querySelector("#btn-submit");
btnSubmit.addEventListener("click",async function (event) {
    event.preventDefault();
    // Création de l’objet du nouvel avis.
    const login = {
        email: document.querySelector("[name=email]").value,
        password: document.querySelector("[name=password").value
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    // Récupération de la reponse
    if(reponse.ok){
        document.querySelector("#erreur-login").style.display = "none";
        const rep = await reponse.json();
        window.localStorage.setItem("userId",rep.userId);
        window.localStorage.setItem("token",rep.token);
        document.location.href='http://127.0.0.1:5500/';
    }else{
        document.querySelector("#erreur-login").style.display = "block";
        console.log("login ou mot de passe incorrecte.");
    }
});