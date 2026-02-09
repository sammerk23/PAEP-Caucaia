DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_usuario') THEN
        CREATE TYPE tipo_usuario AS ENUM (
            'ADMIN',
            'PROFESSOR',
            'RESPONSAVEL',
            'ALUNO' 
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario   SERIAL PRIMARY KEY,
    nome         VARCHAR(150) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    senha        VARCHAR(255) NOT NULL,
    tipo_usuario tipo_usuario NOT NULL 
);

CREATE TABLE IF NOT EXISTS administrador (
    id_admin INT PRIMARY KEY REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS professor (
    id_professor INT PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    disciplina_foco VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS turma (
    id_turma SERIAL PRIMARY KEY,
    serie VARCHAR(50) NOT NULL,    
    sigla CHAR(1) NOT NULL,        
    ano_letivo INT NOT NULL,       
    id_professor_responsavel INT,  
    
    CONSTRAINT fk_turma_professor
        FOREIGN KEY (id_professor_responsavel)
        REFERENCES professor(id_professor)
        ON UPDATE CASCADE
        ON DELETE SET NULL 
);

CREATE TABLE IF NOT EXISTS aluno (
    id_aluno INT PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    matricula INT UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL CHECK (data_nascimento <= CURRENT_DATE),
    id_turma INT REFERENCES turma(id_turma) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS responsavel (
    id_responsavel INT PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    endereco VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS responsavel_aluno (
    id_responsavel INT REFERENCES responsavel(id_responsavel) ON DELETE CASCADE,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    parentesco VARCHAR(20), 
    PRIMARY KEY (id_responsavel, id_aluno)
);

CREATE TABLE IF NOT EXISTS disciplina (
    id_disciplina SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL, 
    codigo VARCHAR(20) NOT NULL UNIQUE, 
    carga_horaria INT NOT NULL, 
    descricao TEXT 
);

CREATE TABLE IF NOT EXISTS evento (
    id_evento SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL, 
    data_evento DATE NOT NULL,
    descricao TEXT, 
    localizacao VARCHAR(100),
    id_criador INT REFERENCES usuario(id_usuario) ON DELETE SET NULL -- ID de quem criou o evento.
);

CREATE TABLE IF NOT EXISTS nota (
    id_nota SERIAL PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_disciplina INT NOT NULL,
    valor DECIMAL(4, 2) NOT NULL,
    CONSTRAINT check_nota_valida CHECK (valor >= 0.00 AND valor <= 10.00),
    CONSTRAINT fk_nota_aluno 
		FOREIGN KEY (id_aluno) 
        REFERENCES aluno(id_aluno) 
		ON DELETE CASCADE,
    CONSTRAINT fk_nota_disciplina 
		FOREIGN KEY (id_disciplina) 
        REFERENCES disciplina(id_disciplina) 
		ON DELETE CASCADE,
    bimestre INT CHECK (bimestre IN (1, 2, 3, 4)),
    data_lancamento DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS frequencia (
    id_frequencia SERIAL PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_disciplina INT NOT NULL,
    data_aula DATE NOT NULL DEFAULT CURRENT_DATE,
    presente BOOLEAN DEFAULT FALSE, -- TRUE = Veio, FALSE = Faltou
    CONSTRAINT fk_freq_aluno 
		FOREIGN KEY (id_aluno) 
        REFERENCES aluno(id_aluno) 
		ON DELETE CASCADE,
    CONSTRAINT fk_freq_disciplina 
		FOREIGN KEY (id_disciplina) 
        REFERENCES disciplina(id_disciplina) 
		ON DELETE CASCADE
);