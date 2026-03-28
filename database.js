const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const criarBanco = async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // Tabela incidentes

  await db.exec(`
    
    CREATE TABLE IF NOT EXISTS incidentes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_problema TEXT,                -- O que aconteceu (Buraco, luz, lixo...)
    localizacao TEXT,                  -- Onde aconteceu (Rua, bairro)
    descricao TEXT,                    -- Detalhes da reclamação
    prioridade TEXT,                   -- Baixa, média ou alta
    nome_solicitante TEXT,             -- Quem esta avisando
    data_registro TEXT,                -- Data em formato (ex: 29/02 29.01)
   hora_registro TEXT,                 -- Hora que foi registrado
    status_resolucao TEXT DEFAULT  'Pendente'
    )
    `);
  console.log("Banco de dados configurado: A tabela de resgistros está pronta");

  //Insert - C do CRUD - CREATE

  const checagem = await db.get(`SELECT COUNT (*) AS total FROM incidentes `);

  if (checagem.total === 0) {
    await db.exec(`
  INSERT INTO incidentes(tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro) VALUES
('Iluminação', 'Rua Celina, 1425, Bairro do Céu', 'Poste caindo', 'Alta', 'Viviane', '16/03', '15:10'),
('Falta de energia', 'Hospital JP2', 'Local na escuridão', 'Alta', 'Antonio Perna Quebrada', '16/03/2026', '22:15'),
('Vazamento de água', 'Rua das Camélias, 52', 'Vazamento de água constante próximo ao bueiro.', 'Alta', 'Julia Martins', '2026-03-16', '10:00')
 `);
  } else {
    console.log(`Banco pronto com ${checagem.total} de incidentes`);
  }

  /// Select - R do CRUD - CREATE

  const todosOsIncidentes = await db.all("SELECT * FROM incidentes");
  console.table(todosOsIncidentes);

  //---Exemplo de SELECT específico

  const chamadasViviane = await db.all(
    `SELECT * FROM incidentes WHERE nome_solicitante = "Viviane"`,
  );
  console.table(chamadasViviane);

  //UPDATE

  await db.run(`
  UPDATE incidentes 
  SET status_resolucao = "Em Análise"
  WHERE data_registro = "16/03/2026"
  `);

  console.log("Todas as reclamações do dia 16/03/2026 tiveram uma atualização");

  //DELETE

  await db.run(`DELETE from incidentes WHERE id = 2`);

  console.log("Registro do ID 2 removido");

  //Relatório/SELECT final

  const resultadoFinal = await db.all(`SELECT * FROM incidentes`);
  console.table(resultadoFinal);

  return db;
};

module.exports = { criarBanco };
