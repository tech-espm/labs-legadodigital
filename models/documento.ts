import app = require("teem");
import Validacao = require("../utils/validacao");

interface Documento {
	id: number;
	idetiqueta: number;
	nome: string;
	descricao?: string;
	conteudo?: string;
	extensao?: string;

	idsContato?: number[];
}

class Documento {
    private static validar(documento: Documento, criacao: boolean): string {
		if (!documento)
			return "Documento inválido";

		documento.id = parseInt(documento.id as any);
		documento.idetiqueta = parseInt(documento.idetiqueta as any);

		if (!documento.nome || !(documento.nome = documento.nome.normalize().trim()) || documento.nome.length > 100)
			return "Nome inválido";

		if (documento.descricao && (documento.descricao = documento.descricao.normalize().trim()) && documento.descricao.length > 100)
			return "Descrição inválida";

		if (!documento.descricao)
			documento.descricao = null;

		if (!(documento.conteudo = documento.conteudo.normalize().trim()))
			return "Conteúdo inválido";

		return null;
	}

	public static async listar(idusuario: number): Promise<Documento[]> {
		let lista: Documento[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select d.id, d.idetiqueta, e.nome nomeetiqueta, d.nome, d.descricao from documento d inner join etiqueta e on e.id = d.idetiqueta where d.idusuario = ?", [idusuario]) as Documento[];
		});

		return (lista || []);
	}

    public static async obter(id: number, idusuario: number): Promise<Documento> {
		let lista: Documento[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select id, idetiqueta, nome, descricao, conteudo from documento where id = ? and idusuario = ?", [id, idusuario]) as Documento[];
		});

		return ((lista && lista[0]) || null);
	}

    public static async criar(documento: Documento, idusuario: number): Promise<string> {
		let res: string;
		if ((res = Documento.validar(documento, true)))
			return res;

		await app.sql.connect(async (sql) => {
			try {
				await sql.query("insert into documento (idusuario, idetiqueta, nome, descricao, conteudo, extensao) values (?, ?, ?, ?, ?, null)", [idusuario, documento.idetiqueta, documento.nome, documento.descricao, documento.conteudo]);
			} catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_NO_REFERENCED_ROW":
						case "ER_NO_REFERENCED_ROW_2":
							res = "Etiqueta ou usuário não encontrado";
							break;
						default:
							throw e;
					}
				} else {
					throw e;
				}
			}
		});

		return res;
	}
    
	public static async editar(documento: Documento, idusuario: number): Promise<string> {
		let res: string;
		if ((res = Documento.validar(documento, false)))
			return res;

		return await app.sql.connect(async (sql) => {
		
			await sql.query("update documento set idetiqueta = ?, nome = ?, descricao = ?, conteudo = ? where id = ? and idusuario = ?", [documento.idetiqueta, documento.nome, documento.descricao, documento.conteudo, documento.id, idusuario]);

			return (sql.affectedRows ? null : "Documento não encontrado");
		});
	}

	public static async excluir(id: number, idusuario: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			await sql.query("delete from documento where id = ? and idusuario = ?", [id, idusuario]);

			return (sql.affectedRows ? null : "Documento não encontrado");
		});
	}
}

export = Documento;
