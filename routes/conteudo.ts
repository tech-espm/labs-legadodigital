import app = require("teem");
import Conteudo = require("../models/conteudo");
import Usuario = require("../models/usuario");

class UsuarioRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("conteudo/editar", {
				titulo: "Criar Conteúdo",
				textoSubmit: "Criar",
				usuario: u,
				item: null
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u) {
			res.redirect(app.root + "/login");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Conteudo = null;
			if (isNaN(id) || !(item = await Conteudo.obter(id, u.id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			else
				res.render("conteudo/editar", {
					titulo: "Editar Conteúdo",
					usuario: u,
					item: item
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("conteudo/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Conteúdos",
				datatables: true,
				usuario: u,
				lista: await Conteudo.listar(u.id)
			});
	}
}

export = UsuarioRoute;
