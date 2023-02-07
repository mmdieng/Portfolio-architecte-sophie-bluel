let modal=null;
const openModal=function(e){
    e.preventDefault();
    modal= document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", true);
    modal.addEventListener("click",closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click",closeModal);
    modal.querySelector(".js-modal-stoppropagation").addEventListener("click",stopPropagation);
} 

const closeModal= function(e){
    if(modal===null)return;
    e.preventDefault();
    modal.style.display = "none";
    modal.removeAttribute("aria-modal");
    modal.setAttribute("aria-hidden", true);
    modal.querySelector(".js-modal-close").removeEventListener("click",closeModal);
    modal.querySelector(".js-modal-stoppropagation").removeEventListener("click",stopPropagation);
}

const stopPropagation = function(e){
    e.stopPropagation();
}

document.querySelectorAll(".js-modal").forEach(a=>{
    a.addEventListener("click",openModal);
});
window.addEventListener("keydown",function(e){
    if(e.key==="Escape"||e.key==="Esc")closeModal(e);
})
