import app = require("teem");
import { randomBytes } from "crypto";
import appsettings = require("../appsettings");
import DataUtil = require("../utils/dataUtil");
import GeradorHash = require("../utils/geradorHash");
import intToHex = require("../utils/intToHex");
import Perfil = require("../enums/perfil");
import Validacao = require("../utils/validacao");

interface Contato{
    id: number;
    idUsuario: number;
    email: string;
    nome: string;

}

class Contato{
    private static validar(contato: Contato, criacao: boolean): string {
		if (!contato)
			return "Usuário inválido";

		contato.id = parseInt(contato.id as any);

		if (criacao) {
			// Limita o e-mail a 85 caracteres para deixar 15 sobrando, para tentar evitar perda de dados durante a concatenação da exclusão
			if (!contato.email || !Validacao.isEmail(contato.email = contato.email.normalize().trim().toLowerCase()) || contato.email.length > 85)
				return "E-mail inválido";
		} else {
			if (isNaN(contato.id))
				return "Id inválido";
		}

		if (!contato.nome || !(contato.nome = contato.nome.normalize().trim()) || contato.nome.length > 100)
			return "Nome inválido";

		return null;
	}

	public static async listar(idusuario: number): Promise<Contato[]> {
		let lista: Contato[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select c.id, c.idusuario, c.email, u.nome from contato c inner join usuario u on u.id = c.idusuario where c.idusuario = ? order by u.email asc", [idusuario]) as Contato[];
		});

		return (lista || []);
	}

    public static async obter(id: number, idusuario: number): Promise<Contato> {
		let lista: Contato[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select c.id, c.email, c.nome, c.idusuario from contato c inner join usuario u on u.id = c.idusuario where c.id = ? and u.id = ?", [id, idusuario]) as Contato[];
		});

		return ((lista && lista[0]) || null);
	}

    public static async criar(contato: Contato, idusuario: number): Promise<string> {
		let res: string;
		if ((res = Contato.validar(contato, true)))
			return res;

		await app.sql.connect(async (sql) => {
			try {
				await sql.query("insert into contato (email, nome, idusuario) values (?, ?, ?)", [contato.email, contato.nome, idusuario]);
			} catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_DUP_ENTRY":
							res = `O e-mail ${contato.email} já está em uso`;
							break;
						case "ER_NO_REFERENCED_ROW":
						case "ER_NO_REFERENCED_ROW_2":
							res = "Perfil não encontrado";
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
    
	public static async editar(contato: Contato): Promise<string> {
		let res: string;
		if ((res = Contato.validar(contato, false)))
			return res;

		return await app.sql.connect(async (sql) => {
			await sql.query("update contato set nome = ?, where id = ?", [contato.nome, contato.id]);

			return (sql.affectedRows ? null : "Contato não encontrado");
		});
	}

	public static async excluir(id: number): Promise<string> {

		return app.sql.connect(async (sql) => {
			// Utilizar substr(email, instr(email, ':') + 1) para remover o prefixo, caso precise desfazer a exclusão (caso
			// não exista o prefixo, instr() vai retornar 0, que, com o + 1, faz o substr() retornar a própria string inteira)
			await sql.query("update contato set email = concat('@', id, ':', email), where id = ?", [id]);

			return (sql.affectedRows ? null : "Contato não encontrado");
		});
	}
}

export = Contato;