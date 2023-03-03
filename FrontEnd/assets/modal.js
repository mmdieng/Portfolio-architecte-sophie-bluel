let modal=null;
const openModal=function(e){
    e.preventDefault();
    modal= document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", true);
    modal.addEventListener("click",closeModal);
    modal.querySelectorAll(".js-modal-close").forEach(close => {
        close.addEventListener("click",closeModal);
    });
    modal.querySelectorAll(".js-modal-stoppropagation").forEach(close => {
        close.addEventListener("click",stopPropagation);
    });
} 

const closeModal= function(e){
    if(modal===null)return;
    e.preventDefault();
    modal.style.display = "none";
    modal.removeAttribute("aria-modal");
    modal.setAttribute("aria-hidden", true);
    modal.querySelectorAll(".js-modal-close").forEach(close => {
        close.removeEventListener("click",closeModal);
    });
    modal.querySelectorAll(".js-modal-stoppropagation").forEach(close => {
        close.removeEventListener("click",stopPropagation);
    });
}

const stopPropagation = function(e){
    e.stopPropagation();
}

const createFigureInModal = function(figure,sectionGalleryModal) {
    const a = document.createElement("a");
    a.setAttribute('href',"editer");
    a.setAttribute('id-work',figure.getAttribute("work-id"));
    a.setAttribute('class',"a-modal-editer");
    a.innerHTML = "éditer";
    //a.setAttribute("style","text-decoration:none;color:black");
    a.addEventListener("click",function(e){e.preventDefault();});

    const supp = document.createElement("a");
    supp.setAttribute('href',"supprimer");
    supp.setAttribute('id-work',figure.getAttribute("work-id"));
    supp.setAttribute('class',"a-modal-supprimer");
    const i=document.createElement("i");
    i.setAttribute("class","fa-solid fa-trash-can");
    supp.appendChild(i);
    //supp.setAttribute("style","text-decoration:none;color:white;backgroundColor:black");
    const divSup = document.createElement("div");
    divSup.setAttribute("class","sup-work");
    divSup.appendChild(supp);
    supp.addEventListener("click", function(e){
        e.preventDefault();
        const idWork = supp.getAttribute("id-work");
        if (confirm("Voulez-vous supprimer cette photo ?") == true) {
            let token=window.localStorage.getItem("token");
            findByAttributeValue("work-id", idWork, "figure").forEach(async(fig) => {
                const reponse = await fetch('http://localhost:5678/api/works/'+idWork,{
                    method: "DELETE",
                    headers: {
                        Authorization:"Bearer "+token
                    }
                });
                if(reponse.ok){
                    fig.remove();
                }else{alert("Erreur");}
            });
        }
    });

    const figModal = figure.cloneNode(true);
    figModal.removeChild(figModal.lastElementChild);
    figModal.setAttribute("class","box-img");
    figModal.appendChild(divSup);
    figModal.appendChild(a);
    sectionGalleryModal.appendChild(figModal);
}

const fillModal= function(){
    const sectionGalleryModal = document.querySelector(".gallery-modal");
    sectionGalleryModal.innerHTML = "";
    document.querySelectorAll(".figures").forEach(figure => createFigureInModal(figure, sectionGalleryModal)); 
}

document.querySelectorAll(".js-modal").forEach(a=>{
    a.addEventListener("click",function(e){
        openModal(e);
        fillModal();
        //linkEventToModal();
        document.querySelectorAll(".modal-wrapper").forEach(m=>{
            m.style.display="none";
        });
        document.querySelector("#modal-wrapper1").style.display="block"; 
    });
});
window.addEventListener("keydown",function(e){
    if(e.key==="Escape"||e.key==="Esc")closeModal(e);
});

function findByAttributeValue(attribute, value, element_type){
    element_type = element_type || "*";
    let all = document.getElementsByTagName(element_type);
    let elements = [];
    for(var i = 0; i < all.length; i++){
        if(all[i].getAttribute(attribute) == value){
            elements.push(all[i]);
        }
    }
    return elements;
}

//récupérer les categories depuis l'API au format JSON
async function getCategories(){
    const reponse = await fetch('http://localhost:5678/api/categories');
    const categ = await reponse.json();
    return categ;
}

const  bt= document.getElementById("a-valider-photo");
const validers=document.querySelectorAll(".valider");
validers.forEach(inp => {
    inp.addEventListener("change",function(){
        bt.disabled = false;bt.style.backgroundColor="#1D6154";
        for(var i = 0; i < validers.length; i++){
            if(validers[i].value==""){
                bt.disabled = true;bt.style.backgroundColor="#a7a7a7";
                return;
            }
        }
    });
});

document.querySelector("#a-ajout-photo").addEventListener("click",async function(){
    document.querySelector("#modal-wrapper1").style.display="none";
    document.querySelector("#modal-wrapper2").style.display="block";
    document.querySelector("#div-ajout-img1").style.display="none";
    document.querySelector("#div-ajout-img2").style.display="flex";
    document.getElementById("form-modal-ajout").reset();
    const  bt= document.getElementById("a-valider-photo");
    bt.disabled = true;bt.style.backgroundColor="#a7a7a7";

    const categ = await getCategories();
    const catElem = document.getElementById("categorie");
    catElem.options.length=1;
    categ.forEach(c => {
        const opt = document.createElement("option");
        opt.setAttribute("value", c.id);
        opt.innerHTML = c.name;
        catElem.appendChild(opt);
    });
});
document.querySelector(".js-modal-fleche-g").addEventListener("click",function(){
    document.querySelector("#modal-wrapper1").style.display="block";
    document.querySelector("#modal-wrapper2").style.display="none";
});
document.querySelector("#a-form-ajout-photo").addEventListener("click",function (e) {
    e.preventDefault();
    document.querySelector("#file-img").click();
});
document.querySelector("#image-loader").addEventListener("click",function() {
    document.querySelector("#file-img").click();
});
document.querySelector("#file-img").addEventListener("change",function () {
    let validFileExtensions = ["image/jpg", "image/jpeg", "image/png"];
    let size=(this.files[0].size / (1024*1024)).toFixed(2); // size en MB;
    //const  bt= document.getElementById("a-valider-photo"); Déclaré a la ligne 127
    if(validFileExtensions.includes(this.files[0].type.toLowerCase())){
        if(size>4){
            this.value="";
            bt.disabled = true;bt.style.backgroundColor="#a7a7a7";
           alert("Image trop lourde."); 
           return;
        }
        document.querySelector("#div-ajout-img1").style.display="block";
        document.querySelector("#div-ajout-img2").style.display="none";
        readURL(this);
    }
    else {
        this.value="";
        bt.disabled = true;bt.style.backgroundColor="#a7a7a7";
        alert("Extension non supportée.("+ this.files[0].type +")");
    }
});

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        const img=document.querySelector("#image-loader");
        img.src =  e.target.result;
        document.getElementById("titre-img").value=input.files[0].name;
      };
      reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById("a-valider-photo").addEventListener("click",function (e) {
    e.preventDefault();
    const img=document.querySelector("#image-loader");
    img.alt =  document.getElementById("titre-img").value;
    document.getElementById("submit-form-modal-ajout").click();
});

document.getElementById("submit-form-modal-ajout").addEventListener("click",uploadImg); 

async function uploadImg(e) {
    e.preventDefault();
    let fd=new FormData();
    fd.append("image", document.querySelector("#file-img").files[0]);
    fd.append("title", document.querySelector("#titre-img").value);
    fd.append("category", document.querySelector("#categorie").value);
    
    let token=window.localStorage.getItem("token");
    let response = await fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            Authorization:"Bearer "+token
        },
        body: fd
    });
    const result = await response.json(); 
    if(response.ok){
        alert("Ajout avec succès!")
        document.querySelector("#div-ajout-img1").style.display="none";
        document.querySelector("#div-ajout-img2").style.display="flex";
        document.getElementById("form-modal-ajout").reset();
        bt.disabled = true;bt.style.backgroundColor="#a7a7a7";
    }
    else{
        alert("Ajout non réussit!");
        return;
    }
    
    const titre=document.getElementById("titre-img").value;
    const categorie=document.getElementById("categorie").value;
    const imageElement = document.createElement("img");
    imageElement.src = document.querySelector("#image-loader").src;
    imageElement.alt = titre;
    
    const titreElement = document.createElement("figcaption");
    titreElement.innerText = titre;
    const figure = document.createElement("figure");
    figure.setAttribute("work-id",result.id);
    figure.classList.add("category-id-"+categorie,"figures");
    figure.appendChild(imageElement);
    figure.appendChild(titreElement);
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.appendChild(figure);

    const sectionGalleryModal = document.querySelector(".gallery-modal");
    createFigureInModal(figure,sectionGalleryModal);
    linkEventToModal //gerer ca
    //closeModal(e);
};
