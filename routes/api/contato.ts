import app = require("teem");
import Contato = require("../../models/contato");
import Usuario = require("../../models/usuario");

class ContatoApiRoute {
	@app.http.post()
	public static async criar(req: app.Request, res: app.Response) {
		const u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const erro = await Contato.criar(req.body, u.id);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}

	@app.http.post()
	public static async editar(req: app.Request, res: app.Response) {
		const u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const erro = await Contato.editar(req.body, u.id);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}

	@app.http.delete()
	public static async excluir(req: app.Request, res: app.Response) {
		const u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const id = parseInt(req.query["id"] as string);

		if (isNaN(id)) {
			res.status(400).json("Id inválido");
			return;
		}

		const erro = await Contato.excluir(id, u.id);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}
}

export = ContatoApiRoute;
