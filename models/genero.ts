import ItemNomeado = require("../data/itemNomeado");
import ListaNomeada = require("../data/listaNomeada");
import Genero = require("../enums/genero");

// Manter sincronizado com enums/perfil.ts e sql/script.sql
const generos = new ListaNomeada([
	new ItemNomeado(Genero.Feminino, "Feminino"),
	new ItemNomeado(Genero.Masculino, "Masculino"),
	new ItemNomeado(Genero.Outros, "Outros"),
	new ItemNomeado(Genero.Prefiro, "Prefiro não informar"),
]);

export = generos;
