import app = require("teem");
import Conteudo = require("../../models/conteudo");
import Usuario = require("../../models/usuario");

class ConteudoApiRoute {
	@app.http.post()
	@app.route.formData()
	public static async criar(req: app.Request, res: app.Response) {
		const u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const erro = await Conteudo.criar(req.body, u.id, req.uploadedFiles.arquivo);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}

	@app.http.post()
	@app.route.formData()
	public static async editar(req: app.Request, res: app.Response) {
		const u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const erro = await Conteudo.editar(req.body, u.id);

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

		const erro = await Conteudo.excluir(parseInt(req.query["id"] as string), u.id);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}
}

export = ConteudoApiRoute;
