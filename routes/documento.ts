import app = require("teem");
import Contato = require("../models/contato");
import Documento = require("../models/documento");
import Etiqueta = require("../models/etiqueta");
import Usuario = require("../models/usuario");

class DocumentoRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("documento/editar", {
				titulo: "Criar Documento",
				textoSubmit: "Criar",
				usuario: u,
				item: null,
				contatos: await Contato.listar(u.id),
				etiquetas: await Etiqueta.listar(u.id)
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Documento = null;
			if (isNaN(id) || !(item = await Documento.obter(id, u.id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			else
				res.render("documento/editar", {
					titulo: "Editar Documento",
					usuario: u,
					item: item,
					contatos: await Contato.listar(u.id),
					etiquetas: await Etiqueta.listar(u.id)
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("documento/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Documentos",
				datatables: true,
				usuario: u,
				lista: await Documento.listar(u.id)
			});
	}
}

export = DocumentoRoute;
