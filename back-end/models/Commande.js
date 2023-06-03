const {Schema,model} = require("mongoose")
const Article = require('./Article')
const CommandeSchema = new Schema({
    id : {
        type : Number,
        required: true,
        unique:true,
    },
    nom_client: String,
    date_commande: {
        type:Date,
        default : () => Date.now()
    },
    date_livraison: {
        type : Date
    },
    montant_total: Number,
    status: String,
    lignes_commande: [{
        id_article: 
        {
          type: Schema.Types.ObjectId,
          ref: 'Article'
        },
        quantite: Number,
        montant_ligne: Number
      }],
})

const CommandeModel =  model("commande",CommandeSchema);
module.exports = CommandeModel;