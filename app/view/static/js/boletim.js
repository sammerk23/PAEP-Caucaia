const ALUNOS = [
  {
    id: 1,
    nome: "José Ferreira da Silva Ramos",
    matricula: "202600123",
    curso: "Ensino Fundamental II",
    serie: "9º",
    turma: "A",
    anoLetivo: 2026,
    disciplinas: {
      "Biologia":   [[8.0, 2], [9.0, 0], [8.0, 1], [8.5, 0]],
      "Física":     [[4.5, 2], [6.0, 1], [5.5, 0], [6.5, 1]],
      "Geografia":  [[9.5, 1], [9.0, 0], [9.5, 0], [10.0, 0]],
      "História":   [[8.5, 0], [8.0, 0], [8.5, 1], [9.0, 0]],
      "Português":  [[8.0, 0], [7.5, 1], [8.0, 0], [8.5, 0]],
      "Matemática": [[5.5, 3], [6.0, 1], [6.5, 0], [6.0, 2]],
      "Química":    [[6.0, 1], [6.5, 0], [7.0, 0], [6.0, 1]],
      "Sociologia": [[10.0, 1], [9.0, 0], [10.0, 0], [10.0, 0]],
      "Literatura": [[9.0, 2], [8.5, 1], [8.5, 0], [8.5, 0]]
    }
  }
];

const ID_SELETOR = "js-seletor-aluno";
const ID_CONTEUDO = "js-boletim-conteudo";

function cor(nota){
  if (nota == null) return null;
  if (nota < 6) return "vermelho";
  if (nota === 6) return "laranja";
  return "verde";
}

function montarBoletim(aluno){
  let reprovadas = 0;

  const disciplinas = Object.keys(aluno.disciplinas)
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map(nome => {
      const bimestres = aluno.disciplinas[nome].map(([nota, faltas]) => ({
        nota, faltas, cor: cor(nota)
      }));

      const notas = bimestres.filter(b => b.nota != null).map(b => b.nota);
      const totalFaltas = bimestres.reduce((soma, b) => soma + b.faltas, 0);
      const media = notas.length
        ? Math.round((notas.reduce((s, n) => s + n, 0) / notas.length) * 10) / 10
        : null;

      if (media != null && media < 6) reprovadas++;

      return {
        disciplina: nome,
        bimestres,
        media,
        mediaCor: cor(media),
        totalFaltas,
        frequencia: Math.max(0, 100 - totalFaltas)
      };
    });

  return {
    aluno,
    disciplinas,
    situacao: reprovadas === 0 ? "Aprovado" : `Em recuperação (${reprovadas})`
  };
}

const formatarNota = n => n == null ? "—" : n.toFixed(1).replace(".", ",");

const etiquetaNota = (n, cor) =>
  n == null ? "" : `<span class="nota nota--${cor}">${formatarNota(n)}</span>`;

function carregarAlunos(){
  const seletor = document.getElementById(ID_SELETOR);
  seletor.innerHTML = ALUNOS.map(a => `<option value="${a.id}">${a.nome}</option>`).join("");
  seletor.onchange = () => carregarBoletim(seletor.value);
  if (ALUNOS.length) carregarBoletim(ALUNOS[0].id);
}

function carregarBoletim(id){
  const conteudo = document.getElementById(ID_CONTEUDO);
  const aluno = ALUNOS.find(a => a.id === Number(id));

  if (!aluno){
    conteudo.innerHTML = '<div class="mensagem">Aluno não encontrado.</div>';
    return;
  }

  const b = montarBoletim(aluno);
  const a = b.aluno;

  const linhas = b.disciplinas.map(d => {
    const colunas = d.bimestres.map(bim => `
        <td class="tabela-notas__celula">${etiquetaNota(bim.nota, bim.cor)}</td>
        <td class="tabela-notas__celula">${bim.faltas}</td>`).join("");
    return `
      <tr>
        <td class="tabela-notas__celula tabela-notas__celula--disciplina">${d.disciplina}</td>${colunas}
        <td class="tabela-notas__celula">${etiquetaNota(d.media, d.mediaCor)}</td>
        <td class="tabela-notas__celula">${d.totalFaltas}</td>
        <td class="tabela-notas__celula">${d.frequencia}%</td>
      </tr>`;
  }).join("");

  conteudo.innerHTML = `
    <div class="boletim-quadro">

      <div class="dados-aluno">
        <div class="dados-aluno__coluna">
          <div><b class="dados-aluno__rotulo">Nome:</b> ${a.nome} &nbsp;&nbsp; <b class="dados-aluno__rotulo">Matrícula:</b> ${a.matricula}</div>
          <div><b class="dados-aluno__rotulo">Série:</b> ${a.serie} &nbsp;&nbsp; <b class="dados-aluno__rotulo">Turma:</b> ${a.turma}</div>
        </div>
        <div class="dados-aluno__coluna">
          <div><b class="dados-aluno__rotulo">Curso:</b> ${a.curso}</div>
          <div><b class="dados-aluno__rotulo">Ano Letivo:</b> ${a.anoLetivo}</div>
        </div>
      </div>

      <div class="boletim-quadro__scroll">
        <table class="tabela-notas">
          <thead>
            <tr>
              <th class="tabela-notas__th tabela-notas__th--disciplina" rowspan="2">Disciplina</th>
              <th class="tabela-notas__th" colspan="2">1º Bimestre</th>
              <th class="tabela-notas__th" colspan="2">2º Bimestre</th>
              <th class="tabela-notas__th" colspan="2">3º Bimestre</th>
              <th class="tabela-notas__th" colspan="2">4º Bimestre</th>
              <th class="tabela-notas__th" rowspan="2">Média</th>
              <th class="tabela-notas__th" rowspan="2">Total de<br>Faltas</th>
              <th class="tabela-notas__th" rowspan="2">Freq (%)</th>
            </tr>
            <tr>
              <th class="tabela-notas__th tabela-notas__th--sub">Nota</th>
              <th class="tabela-notas__th tabela-notas__th--sub">Falta</th>
              <th class="tabela-notas__th tabela-notas__th--sub">Nota</th>
              <th class="tabela-notas__th tabela-notas__th--sub">Falta</th>
              <th class="tabela-notas__th tabela-notas__th--sub">Nota</th>
              <th class="tabela-notas__th tabela-notas__th--sub">Falta</th>
              <th class="tabela-notas__th tabela-notas__th--sub">Nota</th>
              <th class="tabela-notas__th tabela-notas__th--sub">Falta</th>
            </tr>
          </thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>

      <div class="legenda">
        <span class="legenda__item"><span class="legenda__cor legenda__cor--verde"></span>Acima da média</span>
        <span class="legenda__item"><span class="legenda__cor legenda__cor--laranja"></span>Média</span>
        <span class="legenda__item"><span class="legenda__cor legenda__cor--vermelho"></span>Abaixo da Média</span>
        <div class="legenda__situacao"><b class="legenda__situacao-rotulo">Situação:</b> ${b.situacao}</div>
      </div>

    </div>`;
}

carregarAlunos();
