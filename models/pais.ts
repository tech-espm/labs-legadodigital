import app = require("teem");

interface Pais {
	idpais: number;
	nomepais: string;
}

class Pais {
	public static async listar(): Promise<Pais[]> {
		let lista: Pais[] = null;

		await app.sql.connect(async (sql) => {
			lista = await sql.query("select idpais, nomepais from pais order by idpais") as Pais[];
		});

		return (lista || []);
	}
}

export = Pais;
