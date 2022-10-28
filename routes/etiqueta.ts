import app = require("teem");
import Contato = require("../models/contato");
import Usuario = require("../models/usuario");
import generos = require("../models/genero");

class EtiquetaRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("etiqueta/criar", {
				titulo: "Criar Etiqueta",
				textoSubmit: "Criar",
				usuario: u,
				generos: generos.lista,
				item: null
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Contato = null;
			if (isNaN(id) || !(item = await Contato.obter(id, u.id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			else
				res.render("etiqueta/gerenciar", {
					titulo: "Gerenciar Etiqueta",
					usuario: u,
					generos: generos.lista,
					item: item
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("etiqueta/gerenciar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Etiquetas",
				datatables: true,
				usuario: u,
				lista: await Contato.listar(u.id)
			});
	}
}

export = EtiquetaRoute;
