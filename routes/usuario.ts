import app = require("teem");
import perfis = require("../models/perfil");
import Usuario = require("../models/usuario");
import etiqueta = require("../models/etiqueta");
import Contato = require("../models/contato");

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
				item: null,
				perfis: perfis.lista
			});
	}

    static async contatos(req: app.Request, res: app.Response) {
        let u = await Usuario.cookie(req);
        if (!u)
            res.redirect(app.root + "/acesso");
        else
            res.render("testamento/contatos", {
                titulo: "Cadastrar Contato",
                textoSubmit: "Criar",
                usuario: u,
                item: null,
                perfis: perfis.lista,
            });
    }

	static async testamentos(req: app.Request, res: app.Response) {
        let u = await Usuario.cookie(req);
        if (!u)
            res.redirect(app.root + "/acesso");
        else
            res.render("testamento/testamentos", {
                titulo: "Cadastrar Testamento",
                textoSubmit: "Criar",
                usuario: u,
                item: null,
                etiqueta: etiqueta.lista
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
