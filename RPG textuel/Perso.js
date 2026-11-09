'use strict';

class Perso {
    constructor(nom) {
        this.nom = nom;
        this.sante = this.initialSante = Math.round(Math.random() * 20 + 5);
        this.puissance = Math.round(Math.random() * 3 + 1);
        this.niveau = 1; // Niveau de départ
        this.xp = 0;     // Expérience de départ
    }

    // Méthode pour gagner de l'XP et monter de niveau
    gagnerXp(montant) {
        let messageXp = '';
        this.xp += montant;
        if (this.xp >= 10) { // Seuil de niveau fixé à 10 points d'XP
            this.niveau++;
            this.xp -= 10;
            this.puissance += 1; // +1 de puissance permanente par niveau !
            this.initialSante += 5; // +5 PV max
            this.sante = this.initialSante; // Restauration partielle/totale en cadeau
            messageXp += '<br><span style="color: #8e44ad; font-weight: bold;">⭐ NIVEAU SUPÉRIEUR ! ' + this.nom + ' passe au niveau ' + this.niveau + ' ! (Puissance et PV max augmentés)</span>';
        }
        return messageXp;
    }

patate(cible) {
        let resultat = '';
        if (cible.sante > 0) {
            //  Si le perso a moins de 50% de sa santé initiale, il entre en "Mode Rage" (+1 de puissance)
            let bonusRage = (this.sante <= (this.initialSante / 2)) ? 1 : 0;
            let puissanceEffective = this.puissance + bonusRage;

            if (bonusRage > 0 && Math.random() < 0.3) {
                resultat += '<span style="color: #e67e22; font-weight: bold;">🔥 ' + this.nom + ' entre en mode RAGE (Puissance augmentée) !</span><br>';
            }

            if (2 > Math.round(Math.random() * 10)) { // Probabilité de 20% de rater
                resultat += '<span style="color: #7f8c8d; font-style: italic;">⚪ ' + this.nom + ' a loupé son attaque contre ' + cible.nom + '</span><br>';
            } else {
                let estCritique = (Math.random() < 0.15);
                let degatsInfliges = estCritique ? puissanceEffective * 2 : puissanceEffective;

                // 🛡️ Chance de parade (15%)
                let ciblePare = (Math.random() < 0.15);
                if (ciblePare) {
                    degatsInfliges = Math.max(1, Math.floor(degatsInfliges / 2));
                    resultat += '<span style="color: #2980b9; font-style: italic;">🛡️ ' + cible.nom + ' pare le coup et réduit les dégâts !</span><br>';
                }else {
                    // Gain d'XP si l'attaque touche et blesse
                    resultat += this.gagnerXp(3);
                }

                if (estCritique) {
                    resultat += '<span style="color: #e74c3c; font-weight: bold;">💥 COUP CRITIQUE RAGE ! ' + this.nom + ' frappe ' + cible.nom + ' (' + degatsInfliges + ' dégâts)</span><br>';
                } else if (!ciblePare) {
                    resultat += '<span style="color: #2c3e50;">⚔️ ' + this.nom + ' a frappé ' + cible.nom + ' (' + degatsInfliges + ' dégâts)</span><br>';
                }
                cible.sante -= degatsInfliges;
            }

            if (1 > Math.round(Math.random() * 10)) { // Probabilité de 10% de se blesser soi-même
                resultat += '<span style="color: #d35400; font-weight: bold;">⚠️ ' + this.nom + ' se blesse lui-même !</span><br>';
                this.sante -= this.puissance;
            }

            if (Math.random() < 0.10 && this.sante > 0) { // 10% de trouver une potion
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
