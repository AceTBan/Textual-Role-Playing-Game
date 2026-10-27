'use strict';

document.addEventListener('DOMContentLoaded',function() {
    let lancer = document.querySelector('#lancer'),
        attaque = document.querySelector('#attaque'),
        resume = document.querySelector('#resume'),
        malik, valentin,
        tourDeCombat = 0,
        coupsCritiquesTotaux = 0; 

    lancer.addEventListener('click',function(){
        malik = new Perso('Malik');
        valentin = new Perso('Valentin');
        tourDeCombat = 0;
        coupsCritiquesTotaux = 0; // Remise à zéro
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

            //  2. On compte s'il y a eu des critiques dans ce tour
            if (resultatMalik.includes('💥')) coupsCritiquesTotaux++;
            if (resultatValentin.includes('💥')) coupsCritiquesTotaux++;

            resume.innerHTML += resultatMalik;
            resume.innerHTML += resultatValentin;
            resume.innerHTML += '<p>' + malik.nom + ' : ' + malik.sante + ' PV</p>';
            resume.innerHTML += '<p>' + valentin.nom + ' : ' + valentin.sante + ' PV</p>';

            if (malik.sante <= 0 || valentin.sante <= 0) {
                attaque.disabled = true;
                //  3. On affiche le bilan des critiques à la fin
                resume.innerHTML += '<p>Combat terminé en ' + tourDeCombat + ' tours avec <strong>' + coupsCritiquesTotaux + ' coup(s) critique(s)</strong> au total !</p>';
                showWinner();
            }
        }
    });

    function showWinner() { 
        let winner; 
        if (malik.sante > 0) { winner = 'Malik'; } 
        else if (valentin.sante > 0) { winner = 'Valentin'; } 
        else { winner = 'Aucun des deux !'; } 
        setTimeout(function() { 
            if (confirm(winner + ' a gagné ! Voulez-vous rejouer ?')) { 
                lancer.click(); 
            } 
        }, 100); 
    } 

    resume.innerHTML += '<p>Bienvenue dans le jeu de combat ! Appuyez sur "Lancer" pour commencer.</p>';
});