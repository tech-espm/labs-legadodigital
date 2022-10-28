import app = require("teem");
import Validacao = require("../utils/validacao");

interface Etiqueta {
    id: number;
    nome: string;
}

class Etiqueta {
    private static validar(etiqueta: Etiqueta, criacao: boolean): string {
		if (!etiqueta)
			return "Etiqueta inválida";

		etiqueta.id = parseInt(etiqueta.id as any);

		if (!criacao) {
			if (isNaN(etiqueta.id))
				return "Id inválido";
		}

		if (!etiqueta.nome || !(etiqueta.nome = etiqueta.nome.normalize().trim()) || etiqueta.nome.length > 100)
			return "Nome inválido";

		return null;
	}

	public static async listar(idusuario: number): Promise<Etiqueta[]> {
		let lista: Etiqueta[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select id, nome from etiqueta where idusuario = ? order by nome asc", [idusuario]) as Etiqueta[];
		});

		return (lista || []);
	}

    public static async obter(id: number, idusuario: number): Promise<Etiqueta> {
		let lista: Etiqueta[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select id, nome from etiqueta where id = ? and idusuario = ?", [id, idusuario]) as Etiqueta[];
		});

		return ((lista && lista[0]) || null);
	}

    public static async criar(etiqueta: Etiqueta, idusuario: number): Promise<string> {
		let res: string;
		if ((res = Etiqueta.validar(etiqueta, true)))
			return res;

		await app.sql.connect(async (sql) => {
			try {
				await sql.query("insert into etiqueta (nome, idusuario) values (?, ?)", [etiqueta.nome, idusuario]);
			} catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_NO_REFERENCED_ROW":
						case "ER_NO_REFERENCED_ROW_2":
							res = "Usuário não encontrado";
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
    
	public static async editar(etiqueta: Etiqueta, idusuario: number): Promise<string> {
		let res: string;
		if ((res = Etiqueta.validar(etiqueta, false)))
			return res;

		return await app.sql.connect(async (sql) => {
			await sql.query("update etiqueta set nome = ? where id = ? and idusuario = ?", [etiqueta.nome, etiqueta.id, idusuario]);

			return (sql.affectedRows ? null : "Etiqueta não encontrada");
		});
	}

	public static async excluir(id: number, idusuario: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			try {
				await sql.query("delete from etiqueta where id = ? and idusuario = ?", [id, idusuario]);

				return (sql.affectedRows ? null : "Etiqueta não encontrada");
			} catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_ROW_IS_REFERENCED":
						case "ER_ROW_IS_REFERENCED_2":
							return "A etiqueta é referenciada por um ou mais documentos";
						default:
							throw e;
					}
				} else {
					throw e;
				}
			}
		});
	}
}

export = Etiqueta;
