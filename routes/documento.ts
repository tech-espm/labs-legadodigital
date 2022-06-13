﻿import app = require("teem");
import Documento = require("../models/documento");
import etiquetas = require("../models/etiqueta");
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
				etiquetas: etiquetas.lista
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
					etiquetas: etiquetas.lista
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
