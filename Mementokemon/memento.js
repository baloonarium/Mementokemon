
window.onload =  jeu;

const debug = true
var tempsEcoule = false;
var interval;

var audioVictoire = new Audio('sons/victoire.mp3')

var audioMain = new Audio('sons/game.mp3')
var audioPerdu = new Audio('sons/defaite.mp3')




//MES PARAMS

var DELAI_RETOUR = 300 //ms avant de retourner les cartes
var BONUS_TIME = 3
var INIT_TIME = 60
var VOLUME = 5


var temps = INIT_TIME;

class Pokemon {
    constructor(nom, imageVisible, imageCache, id){
        this.nom = nom;
        this.imageVisible = imageVisible;
        this.imageCache = imageCache;
        this.id = id;
    }

}

const pokemonNames = ['pikachu', 'carapuce', 'bulbizar', 'salameche','miaous','rondoudou','abra','boustiflor','ectoplasma','doduo']

var tableauPokemonJeu = []

pokemonNames.forEach((poke, i) => {
    tableauPokemonJeu.push(new Pokemon(poke, `images/${poke}.png`, 'images/pokeball.png', i))
})
pokemonNames.forEach((poke, i) => {
    tableauPokemonJeu.push(new Pokemon(poke+ '2', `images/${poke}.png`, 'images/pokeball.png', i))
})

var score = 0;
const nbPoke = tableauPokemonJeu.length;

function jeu() {

    audioVictoire.pause();
    audioPerdu.pause();
    musique();
    tempsEcoule=false
    temps = INIT_TIME;
    timer();    

    document.getElementById("volume").addEventListener("input", (e) => {
        VOLUME = e.target.value;
        volume();
    })
    console.log(VOLUME)
    document.getElementById("delaiRetour").addEventListener("input", (e) => {
        DELAI_RETOUR = e.target.value;
    })
    document.getElementById("bonusTime").addEventListener("input", (e) => {
        BONUS_TIME = e.target.value;
    })
    document.getElementById("initTime").addEventListener("input", (e) => {
        INIT_TIME = e.target.value;
    })
    //Supression bouton demarrer
    afficherCartesCache(tableauPokemonJeu);

    document.getElementById("btnJouer").style = 'display: none'
  




}



function afficherCartesCache(tableauPokemonJeu) {

    let tirages = 0

        //recuperaction de la divCartes
        const divCartes = document.getElementById("divCartes")
        divCartes.innerHTML=''

        tableauPokemonJeu = melanger(tableauPokemonJeu);
        var premierTirage;

        //On affiche toutes les cartes faces cachée
        for(i = 0; i < tableauPokemonJeu.length; i++) {

            //creation affichage carte
            var carteCache = document.createElement("img");
            carteCache.setAttribute("id", tableauPokemonJeu[i].nom);
            carteCache.setAttribute("src", tableauPokemonJeu[i].imageCache);
            carteCache.setAttribute("style", "width : 100px");
            carteCache.setAttribute("style", "height : 100px");
            carteCache.setAttribute("class","carte");
            carteCache.setAttribute("duoId", tableauPokemonJeu[i].id)
            carteCache.addEventListener("click", (e)=>{

                var audioBruit = new Audio('sons/bruit.mp3')
                audioBruit.play()

                if(!tempsEcoule){
                    if(e.target.src.includes('pokeball')){
                    tirages++
    
                    //SECURITE POUR NE PAS RETOURNER + DE 2 CARTES
                    if(tirages<=2){
                        retournerCarte(e.target)
                    }

                    //PREMIER TIRAGE
                    if(tirages == 1) {
                        premierTirage = e.target;
                    } 

                    //DEUXIEME TIRAGE
                    if(tirages == 2){

                        //SI LES CARTES CORRESPONDENT
                        if (premierTirage.getAttribute('duoId') === e.target.getAttribute('duoId')) {
                            console.log("%cIT's a MATCH !",'color:green')
                            score += 2;
                            tirages = 0
                            temps += BONUS_TIME

                            var pokeName = e.target.id;

                            if(pokeName.includes('2')){
                                pokeName= pokeName.slice(0,-1)
                             }
                            var audio  = new Audio(`sons/${pokeName}.mp3`)
                            audio.play();

                            //VICTOIRE
                            if(score == nbPoke){

                            temps = 0;
                            document.getElementById("btnJouer").style = 'display:'
                            clearInterval(interval);

                            audioVictoire.play()
                            }
                        }
                        //LOOSER
                        else{
                            setTimeout(function(){
                                retournerCarte(premierTirage)
                                retournerCarte(e.target)
                                tirages = 0;
    
                            },DELAI_RETOUR)
    
                        }
                        
                    } 
                }
                    
                } 
            })
            
            //affectation dans la page html

            divCartes.appendChild(carteCache);         
            
        }

}

function retournerCarte(carte) {

    let pokeName = carte.id

    //SI LA CARTE EST
     if(carte.id.includes('2')){
        pokeName= carte.id.slice(0,-1)
     }
     if(debug){
         console.log('%cDEBUG : Carte retournée :', 'color:purple')
         console.log(carte)
     }

    // SI LA CARTE EST FACE CACHEE
    if(carte.src.includes('pokeball')){
        carte.setAttribute("src", `images/${pokeName}.png`)
    }
    //SI LA CARTE EST FACE VISIBLE
    else{
        carte.setAttribute("src", `images/pokeball.png`)
    }

    if(tempsEcoule){

        var audioBruit = new Audio('sons/bruit.mp3')
        audioBruit.play()

    }
    
}



function  timer() {


    timer = document.getElementById("timer");
    temps = INIT_TIME;
    timer.innerHTML = temps;


    interval = setInterval(() => {
        
        temps --;
        timer.innerHTML = temps;

        
        
        
        if (temps == 0) {

            setTimeout(function(){
                afficherToutesLesCartes()

            },DELAI_RETOUR)

            tempsEcoule = true;
            clearInterval(interval);

            
            audioPerdu.play();

        }


    }, 1000);



}

function melanger(tableau) {
    var i, j, tmp;
    for (i = tableau.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = tableau[i];
        tableau[i] = tableau[j];
        tableau[j] = tmp;
    }
    return tableau
}




function afficherToutesLesCartes(){

    document.getElementById("btnJouer").style = 'display:'

    let cartes = document.getElementsByClassName('carte')
    let count = 0
    for (const carte of cartes) {
        if(carte.src.includes("pokeball")){

            count++
            setTimeout(() => {
                retournerCarte(carte)
                
            }, 300*count);

            
        }
        
    }

}


function musique() {

    audioMain.play();


}

function volume(e) {

    
    var niveau = VOLUME;

    if (niveau < 10) {

        niveau = '0.' + niveau
    } else {

        niveau = 1;

    }


    console.log(niveau);

    audioVictoire.volume = niveau;
    audioPerdu.volume = niveau ;
    audioMain.volume = niveau
    audioBruit.volume = niveau

}