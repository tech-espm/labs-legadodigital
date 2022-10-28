import app = require("teem");
import Etiqueta = require("../models/etiqueta");
import Usuario = require("../models/usuario");

class EtiquetaRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("etiqueta/editar", {
				titulo: "Criar Etiqueta",
				textoSubmit: "Criar",
				usuario: u,
				item: null
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Etiqueta = null;
			if (isNaN(id) || !(item = await Etiqueta.obter(id, u.id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			else
				res.render("etiqueta/editar", {
					titulo: "Editar Etiqueta",
					usuario: u,
					item: item
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("etiqueta/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Etiquetas",
				datatables: true,
				usuario: u,
				lista: await Etiqueta.listar(u.id)
			});
	}
}

export = EtiquetaRoute;
