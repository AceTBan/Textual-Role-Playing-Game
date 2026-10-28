'use strict';

document.addEventListener('DOMContentLoaded',function() {
    let lancer = document.querySelector('#lancer'),
        attaque = document.querySelector('#attaque'),
        resume = document.querySelector('#resume'),
        malik, valentin,
        tourDeCombat = 0,
        coupsCritiquesTotaux = 0,
        secondesCombat = 0,     //   Variable pour compter le temps
        timerCombat = null;     //   Variable pour stocker l'intervalle du timer

    lancer.addEventListener('click',function(){
        malik = new Perso('Malik');
        valentin = new Perso('Valentin');
        tourDeCombat = 0;
        coupsCritiquesTotaux = 0;
        secondesCombat = 0;     // Remise à zéro du chrono

        //   Gestion du chronomètre (lance les secondes)
        clearInterval(timerCombat);
        timerCombat = setInterval(() => {
            secondesCombat++;
        }, 1000);

        resume.innerHTML = '<p>' + malik.histoire() + '</p>';
        resume.innerHTML = '<p>' + valentin.histoire() + '</p>' + resume.innerHTML;
        attaque.disabled = false; // Activation du bouton "attaque"
    });

    attaque.addEventListener('click', function() {
        if (malik && valentin) {
            tourDeCombat++;
            resume.innerHTML += '<p><strong>--- Tour n° ' + tourDeCombat + ' ---</strong></p>';

            let resultatMalik = malik.patate(valentin);
            let resultatValentin = valentin.patate(malik);

            if (resultatMalik.includes('💥')) coupsCritiquesTotaux++;
            if (resultatValentin.includes('💥')) coupsCritiquesTotaux++;

            resume.innerHTML += resultatMalik;
            resume.innerHTML += resultatValentin;
            resume.innerHTML += '<p>' + malik.nom + ' : ' + malik.sante + ' PV</p>';
            resume.innerHTML += '<p>' + valentin.nom + ' : ' + valentin.sante + ' PV</p>';

            if (malik.sante <= 0 || valentin.sante <= 0) {
                attaque.disabled = true; // Désactivation du bouton
                clearInterval(timerCombat); //   On stoppe le chrono à la fin du combat

                //   Affichage du bilan complet avec le temps écoulé
                resume.innerHTML += '<p>Combat terminé en <strong>' + tourDeCombat + ' tours</strong>, <strong>' + coupsCritiquesTotaux + ' coup(s) critique(s)</strong> et en <strong>' + secondesCombat + ' secondes</strong> !</p>';
                showWinner();
            }
        }
    });

    function showWinner() { 
        let winner; 
        if (malik.sante > 0) { 
            winner = 'Malik'; 
        } else if (valentin.sante > 0) { 
            winner = 'Valentin'; 
        } else { 
            winner = 'Aucun des deux !'; 
        } 
        setTimeout(function() { 
            if (confirm(winner + ' a gagné en ' + secondesCombat + ' secondes ! Voulez-vous rejouer ?')) { 
                lancer.click(); 
            } 
        }, 100); 
    } 

    resume.innerHTML += '<p>Bienvenue dans le jeu de combat ! Appuyez sur "Lancer" pour commencer.</p>';
});