import ItemNomeado = require("../data/itemNomeado");
import ListaNomeada = require("../data/listaNomeada");
import Etiqueta = require("../enums/etiqueta");
import Perfil = require("../enums/etiqueta");

// Manter sincronizado com enums/perfil.ts e sql/script.sql
const perfis = new ListaNomeada([
	new ItemNomeado(Etiqueta.Social, "Social"),
	new ItemNomeado(Etiqueta.Financeiro, "Financeiro"),
    new ItemNomeado(Etiqueta.Administrativo, "Administrativo"),
    new ItemNomeado(Etiqueta.Confidencial, "Confidencial"),
    new ItemNomeado(Etiqueta.Familiar, "Familiar")
]);

export = perfis;
