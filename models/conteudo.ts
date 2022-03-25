import app = require("teem");

export = class Conteudo {
	public id: number;
	public nome: string;
	public descricao: string;
	public criacao: string;

	private static validar(conteudo: Conteudo): string {
		if (!conteudo)
			return "Conteúdo inválido";

		conteudo.nome = (conteudo.nome || "").normalize().trim();
		if (conteudo.nome.length < 3 || conteudo.nome.length > 100)
			return "Nome inválido";

		conteudo.descricao = (conteudo.descricao || "").normalize().trim();
		if (conteudo.descricao.length > 1000000)
			return "Descrição inválida";

		return null;
	}

	public static listar(idusuario: number): Promise<Conteudo[]> {
		return app.sql.connect(async (sql) => {
			return (await sql.query("select id, nome, date_format(criacao, '%d/%m/%Y') criacao from conteudo where idusuario = ?", [idusuario])) as Conteudo[] || [];
		});
	}

	public static obter(id: number, idusuario: number): Promise<Conteudo> {
		return app.sql.connect(async (sql) => {
			const lista = (await sql.query("select id, nome, descricao, date_format(criacao, '%d/%m/%Y') from conteudo where id = ? and idusuario = ?", [id, idusuario])) as Conteudo[];
			return (lista && lista[0]) || null;
		});
	}

	public static criar(conteudo: Conteudo, idusuario: number, arquivo?: app.UploadedFile): Promise<string> {
		const erro = Conteudo.validar(conteudo);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			await sql.beginTransaction();

			await sql.query("insert into conteudo (idusuario, nome, descricao, criacao) values (?, ?, ?, now())", [idusuario, conteudo.nome, conteudo.descricao]);

			const id = await sql.scalar("select last_insert_id()") as number;

			if (arquivo)
				await app.fileSystem.saveUploadedFile("dados/" + id, arquivo);

			await sql.commit();

			return null;
		});
	}

	public static editar(conteudo: Conteudo, idusuario: number): Promise<string> {
		const erro = Conteudo.validar(conteudo);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			await sql.query("update conteudo set nome = ?, descricao = ? where id = ? and idusuario = ?", [conteudo.nome, conteudo.descricao, conteudo.id, idusuario]);
			return (sql.affectedRows ? null : "Conteúdo não encontrado");
		});
	}

	public static excluir(id: number, idusuario: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			await sql.beginTransaction();

			await sql.query("delete from conteudo where id = ? and idusuario = ?", [id, idusuario]);
			if (!sql.affectedRows)
				return "Conteúdo não encontrado";

			if (await app.fileSystem.exists("dados/" + id))
				await app.fileSystem.deleteFile("dados/" + id);

			await sql.commit();

			return null;
		});
	}
};
