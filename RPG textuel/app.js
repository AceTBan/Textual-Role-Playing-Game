'use strict';

document.addEventListener('DOMContentLoaded',function() {
    let lancer = document.querySelector('#lancer'),
        attaque = document.querySelector('#attaque'),
        resume = document.querySelector('#resume'),
        malik, valentin,
        tourDeCombat = 0,
        coupsCritiquesTotaux = 0,
        secondesCombat = 0,
        timerCombat = null,
        historiqueCombats = []; //  Tableau pour stocker l'historique des parties

    lancer.addEventListener('click',function(){
        malik = new Perso('Malik');
        valentin = new Perso('Valentin');
        tourDeCombat = 0;
        coupsCritiquesTotaux = 0;
        secondesCombat = 0;

        clearInterval(timerCombat);
        timerCombat = setInterval(() => {
            secondesCombat++;
        }, 1000);

        resume.innerHTML = '<p>' + malik.histoire() + '</p>';
        resume.innerHTML = '<p>' + valentin.histoire() + '</p>' + resume.innerHTML;
        attaque.disabled = false;
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
                attaque.disabled = true;
                clearInterval(timerCombat);

                // Détermination du gagnant pour l'historique
                let vainqueur = (malik.sante > 0) ? 'Malik' : (valentin.sante > 0) ? 'Valentin' : 'Match nul';
                
                // ajoute le combat terminé dans l'historique
                historiqueCombats.unshift({
                    vainqueur: vainqueur,
                    tours: tourDeCombat,
                    temps: secondesCombat
                });

                // Construction du texte de l'historique
                let texteHistorique = '<h4>📜 Historique des combats :</h4><ul>';
                historiqueCombats.slice(0, 3).forEach((h, index) => { // On garde les 3 derniers
                    texteHistorique += '<li>Partie ' + (index + 1) + ' : Victoire de <strong>' + h.vainqueur + '</strong> (' + h.tours + ' tours, ' + h.temps + 's)</li>';
                });
                texteHistorique += '</ul>';

                resume.innerHTML += '<p>Combat terminé en <strong>' + tourDeCombat + ' tours</strong>, <strong>' + coupsCritiquesTotaux + ' coup(s) critique(s)</strong> et en <strong>' + secondesCombat + ' secondes</strong> !</p>';
                resume.innerHTML += texteHistorique; //  Affichage de l'historique dans le résumé

                showWinner(vainqueur);
            }
        }
    });

    function showWinner(winner) { 
        setTimeout(function() { 
            if (confirm(winner + ' a gagné en ' + secondesCombat + ' secondes ! Voulez-vous rejouer ?')) { 
                lancer.click(); 
            } 
        }, 100); 
    } 

    resume.innerHTML += '<p>Bienvenue dans le jeu de combat ! Appuyez sur "Lancer" pour commencer.</p>';
});