const {Schema,model} = require("mongoose")

const ExponseSchema = new Schema({
    date_Exponse : {
        type:Date,
        default : () => Date.now()
    },
    montant_Exponse: Number,
    supplier_name: String,
})


const ExponseModel =  model("exponse",ExponseSchema)
module.exports = ExponseModel