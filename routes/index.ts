﻿import app = require("teem");
import Documento = require("../models/documento");
import generos = require("../models/genero");
import Pais = require("../models/pais");
import Usuario = require("../models/usuario");

class IndexRoute {
	public static async index(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else if (!u.admin)
			res.render("documento/listar", {
				layout: "layout-tabela",
				titulo: "Bem vindo! Seus documentos:",
				datatables: true,
				usuario: u,
				lista: await Documento.listar(u.id)
			});	
		else if(u.admin)
			res.render("usuario/listar", {
				layout: "layout-tabela",
				titulo: "Bem vindo, administrador! Usuários atuais do sistema:",
				datatables: true,
				usuario: u,
				lista: await Usuario.listar()
			});
		else
			res.render("index/index", {
				layout: "layout-sem-form",
				titulo: "Dashboard",
				usuario: u
			});
	}

	@app.http.all()
	public static async login(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u) {
			let mensagem: string = null;
	
			if (req.body.email || req.body.senha) {
				[mensagem, u] = await Usuario.efetuarLogin(req.body.email as string, req.body.senha as string, res);
				if (mensagem)
					res.render("index/login", {
						layout: "layout-externo",
						mensagem: mensagem
					});
				else
					res.redirect(app.root + "/");
			} else {
				res.render("index/login", {
					layout: "layout-externo",
					mensagem: null
				});
			}
		} else {
			res.redirect(app.root + "/");
		}
	}

	public static async acesso(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("index/acesso", {
				layout: "layout-sem-form",
				titulo: "Sem Permissão",
				usuario: u
			});
	}

	public static async perfil(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/");
		else
			res.render("index/perfil", {
				titulo: "Meu Perfil",
				usuario: u,
				generos: generos.lista,
				paises: await Pais.listar()
			});
	}

	public static async logout(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (u)
			await Usuario.efetuarLogout(u, res);
		res.redirect(app.root + "/");
	}
}

export = IndexRoute;
