var mongoose = require("mongoose");

var EmpleadoSchema = new mongoose.Schema({
    ci: String,
    nombre: String,
    usuario: String,
    empresa: String
});


module.exports = mongoose.model("Empleado", EmpleadoSchema);