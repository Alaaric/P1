const prixProduits = {
  "Pain au chocolat": 0.45,
  Croissant: 0.4,
  "Chausson aux pommes": 0.8,
  "Pain aux raisins": 0.75,
  Crepe: 1.0,
  Baguette: 0.7,
};

// Gestion du Local Storage
let panier = JSON.parse(localStorage.getItem("panier")) || [];

document.addEventListener("DOMContentLoaded", () => {
  panier.forEach((item) => ajouterArticlePanier(item, false));
});

function sauvegarderPanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

// Ajouter un produit au panier
function ajouterArticlePanier(item, shouldSave = true) {
  const existingItem = document.querySelector(
    `[data-produit="${item.produit}"]`
  );

  if (existingItem) {
    const nouvelleQuantite =
      parseInt(existingItem.dataset.quantite) + item.quantite;
    existingItem.dataset.quantite = nouvelleQuantite;
    const sousTotal = (item.prix * nouvelleQuantite).toFixed(2);
    existingItem.textContent = `${item.produit} - Quantité: ${nouvelleQuantite} - Prix: ${sousTotal}€`;
    panier = panier.map((p) =>
      p.produit === item.produit ? { ...p, quantite: nouvelleQuantite } : p
    );
  } else {
    const li = document.createElement("li");
    li.dataset.produit = item.produit;
    li.dataset.quantite = item.quantite;
    const sousTotal = (item.prix * item.quantite).toFixed(2);
    li.textContent = `${item.produit} - Quantité: ${item.quantite} - Prix: ${sousTotal}€`;
    document.getElementById("panierItems").appendChild(li);
    panier.push(item);
  }

  const totalDiv = document.querySelector(".total");
  const totalActuel = parseFloat(totalDiv.dataset.total || "0");
  const nouveauTotal = (totalActuel + item.prix * item.quantite).toFixed(2);
  totalDiv.textContent = `Total: ${nouveauTotal}€`;
  totalDiv.dataset.total = nouveauTotal;

  if (shouldSave) sauvegarderPanier();
}

// Fonction pour afficher une modale de confirmation de commande
function commander() {
  const modale = document.createElement("div");
  modale.classList.add("modale");
  modale.innerHTML = `
      <div class="modale-contenu">
        <h3>Commande passée !</h3>
        <p>Merci pour votre commande.</p>
        <button id="fermerModaleBtn">Fermer</button>
      </div>
    `;
  document.body.appendChild(modale);

  document.getElementById("fermerModaleBtn").addEventListener("click", () => {
    modale.remove();
    resetPanier();
  });
}

// Fonction pour réinitialiser le panier
function resetPanier() {
  panier = [];
  localStorage.removeItem("panier");
  document.getElementById("panierItems").innerHTML = "";
  const totalDiv = document.querySelector(".total");
  totalDiv.textContent = `Total: 0.00€`;
  totalDiv.dataset.total = 0;
}

// Gestion des événements
document.getElementById("ajouterPanierBtn").addEventListener("click", () => {
  const produit = document.getElementById("produit").value;
  const quantite = parseInt(document.getElementById("quantite").value);

  if (quantite > 0) {
    const prix = prixProduits[produit];
    ajouterArticlePanier({ produit, quantite, prix });
  } else {
    alert("Veuillez entrer une quantité valide.");
  }
});

document.getElementById("commander").addEventListener("click", (e) => {
  e.preventDefault();
  commander();
});
