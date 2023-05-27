const {Schema,model} = require("mongoose")

const IncomeSchema = new Schema({
    date_Income : {
        type:Date,
        default : () => Date.now()
    },
    montant_Income: Number,
    costumer_name: String,
})

const RevenuModel =  model("incomes",IncomeSchema);
module.exports = RevenuModel;