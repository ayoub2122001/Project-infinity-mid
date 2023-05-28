import React, { useEffect, useState } from 'react';
import "./Invoice.css";
import axios from 'axios';
import { useParams } from "react-router-dom";
const Invoice = () => {
  const date = new Date();
  const api = "http://localhost:8080";
  const { id } = useParams();
  const handlePrintInvoice = () => {
    const printContent = document.getElementById("invoice-content");
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    document.body.innerHTML = originalContent;
    window.print();    
  };
  useEffect(() => {
    axios
      .get(`${api}/api/articles`)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
    axios
      .get(`${api}/api/commandes/${id}`)
      .then((response) => {
        const { nom_client, date_livraison, date_commande, lignes_commande } =  response.data;
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }, [api, id]);

  const handlePrintDeliveryNote = () => {
    // Logique pour imprimer la note de livraison
    window.print();
  };
  return (
    <div className="invoice" id="invoice-content">
      <div className="invoice-header">
        <h2>Facture</h2>
        <span className="hide-url">Date: {date.toLocaleDateString()}</span>
      </div>
      <div className="invoice-details">
        <div>
          <h3>Client:</h3>
          <p>Nom du client</p>
          <p>Ville : Tanger, Code postal : 90000</p>
        </div>
        <div>
          <h3>Entreprise:</h3>
          <p> Infinity Media</p>
          <p>Adresse de l'entreprise</p>
          <p>Ville : Tanger, Code postal : 90000</p>
        </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Produit 1</td>
            <td>2</td>
            <td>10€</td>
            <td>20€</td>
          </tr>
          <tr>
            <td>Produit 2</td>
            <td>1</td>
            <td>15€</td>
            <td>15€</td>
          </tr>
          <tr>
            <td>Produit 3</td>
            <td>3</td>
            <td>5€</td>
            <td>15€</td>
          </tr>
        </tbody>
      </table>
      <div className="invoice-total">
        <strong>Total: 50€</strong>
      </div>
      <div className="invoice-buttons">
        <button onClick={handlePrintInvoice}>Imprimer Facture</button>
        <button onClick={handlePrintDeliveryNote}>Imprimer Note de Livraison</button>
      </div>
    </div>
  );
};

export default Invoice;

