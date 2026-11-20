'use strict';

document.addEventListener('DOMContentLoaded', function() {
    let lancer = document.querySelector('#lancer'),
        attaque = document.querySelector('#attaque'),
        auto = document.querySelector('#auto'),
        reset = document.querySelector('#reset'),
        resume = document.querySelector('#resume'),
        malik, valentin,
        tourDeCombat = 0,
        coupsCritiquesTotaux = 0,
        secondesCombat = 0,
        timerCombat = null,
        timerAuto = null,
        historiqueCombats = [],
        totalParties = 0,
        victoiresGlobales = {};

    auto.addEventListener('click', function() {
        if (timerAuto) {
            clearInterval(timerAuto);
            timerAuto = null;
            auto.textContent = 'Auto-Combat';
        } else {
            auto.textContent = 'Pause Auto';
            timerAuto = setInterval(() => {
                if (!attaque.disabled) {
                    attaque.click();
                } else {
                    clearInterval(timerAuto);
                    timerAuto = null;
                    auto.textContent = 'Auto-Combat';
                    auto.disabled = true;
                }
            }, 500);
        }

    let copier = document.querySelector('#copier');

    copier.addEventListener('click', function() {
        // innerText récupère uniquement le texte propre sans les balises HTML (<span>, <br>, etc.)
        let textePropre = resume.innerText; 
        
        navigator.clipboard.writeText(textePropre).then(() => {
            let texteOriginal = copier.textContent;
            copier.textContent = '✅ Copié !';
            setTimeout(() => {
                copier.textContent = texteOriginal;
            }, 1500);
        });
    });
    });

    document.addEventListener('keydown', function(event) {
        if (document.activeElement.tagName === 'INPUT') return;

        if ((event.key === 'Enter' || event.key === ' ') && !attaque.disabled) {
            event.preventDefault();
            attaque.click();
        }
    });

    reset.addEventListener('click', function() {
        clearInterval(timerCombat);
        malik = null;
        valentin = null;
        tourDeCombat = 0;
        secondesCombat = 0;
        attaque.disabled = true;
        resume.innerHTML = '<p>Jeu réinitialisé. Prêt pour un nouveau combat !</p>';
        clearInterval(timerAuto);
        timerAuto = null;
        auto.disabled = true;
        auto.textContent = 'Auto-Combat';
    });

lancer.addEventListener('click', function(){
        // Récupération des valeurs des inputs (avec des valeurs par défaut si c'est vide)
        let nomPerso1 = document.querySelector('#nom1').value.trim() || 'Malik';
        let nomPerso2 = document.querySelector('#nom2').value.trim() || 'Valentin';

        malik = new Perso(nomPerso1);
        valentin = new Perso(nomPerso2);
        
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

        auto.disabled = false;
        clearInterval(timerAuto);
        timerAuto = null;
        auto.textContent = 'Auto-Combat';
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

            if (malik.sante <= 0 || valentin.sante <= 0 || tourDeCombat >= 20) {
                attaque.disabled = true;
                clearInterval(timerCombat);

                // Message spécifique si le combat s'arrête à cause de la limite de tours
                if (tourDeCombat >= 20 && malik.sante > 0 && valentin.sante > 0) {
                    resume.innerHTML += '<p style="color: #e67e22; font-weight: bold;">⏱️ Limite de 20 tours atteinte ! Les combattants s\'effondrent d\'épuisement !</p>';
                }

                // Détermination du gagnant (celui qui a le plus de PV restants gagne aux points, sinon Match nul)
                let vainqueur = '';
                if (malik.sante > 0 && malik.sante > valentin.sante) {
                    vainqueur = malik.nom;
                } else if (valentin.sante > 0 && valentin.sante > malik.sante) {
                    vainqueur = valentin.nom;
                } else {
                    vainqueur = 'Match nul';
                }

                // Mise à jour des statistiques globales et de l'historique
                totalParties++;
                if (vainqueur !== 'Match nul') {
                    victoiresGlobales[vainqueur] = (victoiresGlobales[vainqueur] || 0) + 1;
                }

                historiqueCombats.unshift({
                    vainqueur: vainqueur,
                    tours: tourDeCombat,
                    temps: secondesCombat
                });

                let texteBilan = '<h4>🏆 Statistiques de session :</h4>';
                texteBilan += '<p>Parties jouées : <strong>' + totalParties + '</strong></p><ul>';
                for (let combattant in victoiresGlobales) {
                    texteBilan += '<li>' + combattant + ' : <strong>' + victoiresGlobales[combattant] + ' victoires</strong></li>';
                }
                texteBilan += '</ul>';

                texteBilan += '<h4>📜 Historique récent :</h4><ul>';
                historiqueCombats.slice(0, 3).forEach((h, index) => {
                    texteBilan += '<li>Partie ' + (index + 1) + ' : <strong>' + h.vainqueur + '</strong> (' + h.tours + ' tours, ' + h.temps + 's)</li>';
                });
                texteBilan += '</ul>';

                resume.innerHTML += '<p>Combat terminé en <strong>' + tourDeCombat + ' tours</strong>, <strong>' + coupsCritiquesTotaux + ' coup(s) critique(s)</strong> et en <strong>' + secondesCombat + ' secondes</strong> !</p>';
                resume.innerHTML += texteBilan;

                showWinner(vainqueur);
            }
        }
    });

function showWinner(winner) { 
        let messageFin = (winner === 'Match nul') 
            ? 'Match nul après ' + secondesCombat + ' secondes ! Voulez-vous rejouer ?' 
            : winner + ' a gagné en ' + secondesCombat + ' secondes ! Voulez-vous rejouer ?';

        setTimeout(function() { 
            if (confirm(messageFin)) { 
                lancer.click(); 
            } 
        }, 100); 
    }

    resume.innerHTML += '<p>Bienvenue dans le jeu de combat ! Appuyez sur "Lancer" pour commencer.</p>';
});