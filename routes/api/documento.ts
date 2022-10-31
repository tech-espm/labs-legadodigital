import app = require("teem");
import Documento = require("../../models/documento");
import Usuario = require("../../models/usuario");

const tamanhoMaximoArquivo = 50 * 1024 * 1024;

class DocumentoApiRoute {
	@app.http.post()
	@app.route.formData(tamanhoMaximoArquivo)
	public static async criar(req: app.Request, res: app.Response) {
		const u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const erro = await Documento.criar(req.body, req.uploadedFiles.arquivo, u.id);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}

	@app.http.post()
	@app.route.formData(tamanhoMaximoArquivo)
	public static async editar(req: app.Request, res: app.Response) {
		const u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const erro = await Documento.editar(req.body, req.uploadedFiles.arquivo, u.id);

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

		const erro = await Documento.excluir(id, u.id);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}
}

export = DocumentoApiRoute;
