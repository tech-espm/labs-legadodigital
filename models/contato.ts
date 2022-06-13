import app = require("teem");
import Validacao = require("../utils/validacao");

interface Contato {
    id: number;
    email: string;
    nome: string;
}

class Contato {
    private static validar(contato: Contato, criacao: boolean): string {
		if (!contato)
			return "Contato inválido";

		contato.id = parseInt(contato.id as any);

		if (criacao) {
			if (!Validacao.isEmail(contato.email = contato.email.normalize().trim().toLowerCase()) || contato.email.length > 100)
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
			lista = await sql.query("select id, email, nome from contato where idusuario = ?", [idusuario]) as Contato[];
		});

		return (lista || []);
	}

    public static async obter(id: number, idusuario: number): Promise<Contato> {
		let lista: Contato[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select id, email, nome from contato where id = ? and idusuario = ?", [id, idusuario]) as Contato[];
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
    
	public static async editar(contato: Contato, idusuario: number): Promise<string> {
		let res: string;
		if ((res = Contato.validar(contato, false)))
			return res;

		return await app.sql.connect(async (sql) => {
			await sql.query("update contato set nome = ?, email = ? where id = ? and idusuario = ?", [contato.nome, contato.email, contato.id, idusuario]);

			return (sql.affectedRows ? null : "Contato não encontrado");
		});
	}

	public static async excluir(id: number, idusuario: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			await sql.query("delete from contato where id = ? and idusuario = ?", [id, idusuario]);

			return (sql.affectedRows ? null : "Contato não encontrado");
		});
	}
}

export = Contato;
