'use strict';

class Perso {
    constructor(nom) {
        this.nom = nom;
        this.sante = this.initialSante = Math.round(Math.random() * 20 + 5);
        this.puissance = Math.round(Math.random() * 3 + 1);
    }

patate(cible) {
        let resultat = '';
        if (cible.sante > 0) {
            if (2 > Math.round(Math.random() * 10)) { // Probabilité de 20% de rater
                resultat += '<span style="color: #7f8c8d; font-style: italic;">⚪ ' + this.nom + ' a loupé son attaque contre ' + cible.nom + '</span><br>';
            } else {
                let estCritique = (Math.random() < 0.15);
                let degatsInfliges = estCritique ? this.puissance * 2 : this.puissance;

                let ciblePare = (Math.random() < 0.15);
                if (ciblePare) {
                    degatsInfliges = Math.floor(degatsInfliges / 2); // Les dégâts sont divisés par deux
                    resultat += '<span style="color: #2980b9; font-style: italic;">🛡️ ' + cible.nom + ' pare le coup de ' + this.nom + ' et réduit les dégâts de moitié !</span><br>';
                }

                if (estCritique && !ciblePare) {
                    resultat += '<span style="color: #e74c3c; font-weight: bold;">💥 COUP CRITIQUE ! ' + this.nom + ' frappe violemment ' + cible.nom + ' (+' + degatsInfliges + ' dégâts)</span><br>';
                } else if (estCritique && ciblePare) {
                    resultat += '<span style="color: #e74c3c; font-weight: bold;">💥 Coup critique amorti ! ' + this.nom + ' frappe ' + cible.nom + ' (+' + degatsInfliges + ' dégâts)</span><br>';
                } else if (!ciblePare) {
                    resultat += '<span style="color: #2c3e50;">⚔️ ' + this.nom + ' a frappé ' + cible.nom + '</span><br>';
                }

                cible.sante -= degatsInfliges;
            }
                if (estCritique) {
                    resultat += '<span style="color: #e74c3c; font-weight: bold;">💥 COUP CRITIQUE ! ' + this.nom + ' frappe violemment ' + cible.nom + ' (+' + degatsInfliges + ' dégâts)</span><br>';
                } else {
                    resultat += '<span style="color: #2c3e50;">⚔️ ' + this.nom + ' a frappé ' + cible.nom + '</span><br>';
                }
                cible.sante -= degatsInfliges;
            }

            if (1 > Math.round(Math.random() * 10)) { // Probabilité de 10% de se blesser soi-même
                resultat += '<span style="color: #d35400; font-weight: bold;">⚠️ ' + this.nom + ' se blesse lui-même !</span><br>';
                this.sante -= this.puissance;
            }
            
            if (Math.random() < 0.10 && this.sante > 0) {
                let soin = Math.round(Math.random() * 5 + 2);
                this.sante += soin;
                resultat += '<span style="color: #27ae60; font-weight: bold;">🧪 ' + this.nom + ' trouve une potion et récupère +' + soin + ' PV !</span><br>';
            }
            resultat += (cible.sante <= 0) ? '<span style="color: #c0392b; font-weight: bold;">💀 ' + cible.nom + ' est mort au combat !</span><br>' : '';
            resultat += (this.sante <= 0) ? '<span style="color: #c0392b; font-weight: bold;">💀 ' + this.nom + ' est mort au combat !</span><br>' : ''; 
        } else {
            resultat += '<span style="color: #95a5a6;">👻 ' + this.nom + ' essaye de frapper un cadavre...</span><br>';
        }

        return resultat;
    }

    histoire() {
        return 'Je suis ' + this.nom + ' j\'ai ' + this.sante + ' de santé et ' + this.puissance + ' de puissance.';
    }
}
