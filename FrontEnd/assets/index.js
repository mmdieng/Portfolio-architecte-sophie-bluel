// Récupération des travaux depuis la base de données
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

const sectionsGallery = document.querySelectorAll(".gallery");

const boutonFiltrers = document.querySelectorAll(".a-filtre");
let boutonclique = boutonFiltrers[0];
boutonFiltrers.forEach(boutonFiltrer => {
    boutonFiltrer.addEventListener("click", async function (e) {
        e.preventDefault();
        const idCategorie = boutonFiltrer.getAttribute("categorie");
        //remettre à jour l'ancien css
        boutonclique.setAttribute("style", "background-color: white; color:#1D6154;");
        boutonclique=boutonFiltrer;
        //changer le css
        boutonclique.setAttribute("style", "background-color: #1D6154; color:white;");

        let worksFiltrees = works;
        if(idCategorie!=0)worksFiltrees = works.filter(function (work) {
            return work.categoryId == idCategorie;
        });
        sectionsGallery.forEach(s=>{
            s.innerHTML = "";
        });

        for (let i = 0; i < worksFiltrees.length; i++) {
            const travail = worksFiltrees[i];
            let response = await fetch(worksFiltrees[i].imageUrl)
            const imageBlob = await response.blob();
            sectionsGallery.forEach(s=>{
                const imageObjectURL = URL.createObjectURL(imageBlob); 
                const figure = document.createElement("figure");
                const imageElement = document.createElement("img");
                imageElement.src = imageObjectURL;
                imageElement.alt = travail.title;
                const titreElement = document.createElement("figcaption");
                titreElement.innerText = travail.title;
                figure.appendChild(imageElement);
                figure.appendChild(titreElement);
                s.appendChild(figure);
            });
        }
    });
});
boutonclique.click();

