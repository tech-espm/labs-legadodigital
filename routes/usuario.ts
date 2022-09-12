import app = require("teem");
import perfis = require("../models/perfil");
import Usuario = require("../models/usuario");
import generos = require("../models/genero");

class UsuarioRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("usuario/editar", {
				titulo: "Criar Usuário",
				textoSubmit: "Criar",
				usuario: u,
				generos: generos.lista,
				item: null,
				perfis: perfis.lista
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Usuario = null;
			if (isNaN(id) || !(item = await Usuario.obter(id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			else
				res.render("usuario/editar", {
					titulo: "Editar Usuário",
					usuario: u,
					item: item,
					generos: generos.lista,
					perfis: perfis.lista
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("usuario/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Usuários",
				datatables: true,
				usuario: u,
				lista: await Usuario.listar()
			});
	}
}

export = UsuarioRoute;
