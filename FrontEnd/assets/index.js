//récupérer les travaux depuis l'API au format JSON
async function getWorks(){
    // Récupération des travaux depuis l'API
   const reponse = await fetch('http://localhost:5678/api/works');
   const travaux = await reponse.json();
   return travaux;
}

//Afficher tous les travaux dans la sectionGallery
async function fillGallery(travaux,sectionGallery){
    sectionGallery.innerHTML = "";
    for (let i = 0; i < travaux.length; i++) {
        let response = await fetch(travaux[i].imageUrl)
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob); 
        const imageElement = document.createElement("img");
        imageElement.src = imageObjectURL;
        imageElement.alt = travaux[i].title;
        
        const titreElement = document.createElement("figcaption");
        titreElement.innerText = travaux[i].title;
        //id-work sert à savoir les figures filtrés à afficher
        const figure = document.createElement("figure");
        figure.setAttribute("work-id",travaux[i].id);
        figure.classList.add("category-id-"+travaux[i].categoryId,"figures");
        figure.appendChild(imageElement);
        figure.appendChild(titreElement);
        sectionGallery.appendChild(figure);
    }
}
const sectionGallery = document.querySelector(".gallery");
let travaux = await getWorks();
await fillGallery(travaux,sectionGallery);

const boutonFiltrers = document.querySelectorAll(".a-filtre");
let boutonclique = boutonFiltrers[0];
//verifier si l'utilisateur est logé grace au token
let token = window.localStorage.getItem("token");
if(token!==null){
    document.querySelector("#div-entete").setAttribute("style","display:block");
    document.querySelector("#nav-filtres").setAttribute("style","display:none");
    document.querySelector("#li-logout").setAttribute("style","display:block");
    document.querySelector("#li-login").setAttribute("style","display:none");
    document.querySelectorAll(".a-modifier").forEach(a => {
        a.style.display="block";
    });
}
document.querySelector("#li-logout").addEventListener("click",function(){
    token=null;
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("token");
    document.querySelector("#div-entete").setAttribute("style","display:none");
    document.querySelector("#nav-filtres").setAttribute("style","display:block");
    document.querySelector("#li-logout").setAttribute("style","display:none");
    document.querySelector("#li-login").setAttribute("style","display:block");
    document.querySelectorAll(".a-modifier").forEach(a => {
        a.style.display="none";
    });
});
boutonFiltrers.forEach(boutonFiltrer => {
    boutonFiltrer.addEventListener("click", async function (e) {
        e.preventDefault();
        const idCategorie = boutonFiltrer.getAttribute("categorie");
        //remettre à jour l'ancien css du bouton
        boutonclique.setAttribute("style", "background-color: white; color:#1D6154;");
        boutonclique=boutonFiltrer;
        //changer le css du bouton
        boutonclique.setAttribute("style", "background-color: #1D6154; color:white;");
        document.querySelectorAll(".figures").forEach(figure => {
            figure.setAttribute("style", "display:none;");
        });
        if(idCategorie==="0"){
            document.querySelectorAll(".figures").forEach(figure => {
                figure.setAttribute("style", "display:block;");
            });
        }else
            document.querySelectorAll(".category-id-"+idCategorie).forEach(figure => {
                figure.setAttribute("style", "display:block;");
            });
    });
});
boutonclique.click();
