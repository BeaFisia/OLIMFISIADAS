const imagensBrasoes = {
    "DS&IP": "DS&IP.jpg",
    "MPO": "MPO.png",
    "NDDC": "NDDC.jpg",
    "IBP": "IBP.png",
    "WHSL": "WHSL.png",
    "NDS": "NDS.png",
    "DIR": "OLIM LOGO.jpg"
};

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
        window.scrollTo(0, 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAtletas();
    carregarDadosCalendario();
    carregarDadosComite();
});

async function carregarDadosAtletas() {
    try {
        const response = await fetch('tabela-atletas.csv');
        const data = await response.text();
        renderRankings(csvParaArray(data));
    } catch (err) { console.error(err); }
}

async function carregarDadosCalendario() {
    try {
        const response = await fetch('tabela-calendario.csv');
        const data = await response.text();
        renderCalendario(csvParaArray(data));
    } catch (err) { console.error(err); }
}

async function carregarDadosComite() {
    try {
        const response = await fetch('comite.csv');
        if (!response.ok) return;
        const data = await response.text();
        renderComite(csvParaArray(data));
    } catch (err) { console.error(err); }
}

function csvParaArray(txt) {
    txt = txt.replace(/^\uFEFF/, '');
    const linhas = txt.split(/\r?\n/).filter(l => l.trim() !== '');
    if (linhas.length === 0) return [];
    const separador = linhas[0].includes(';') ? ';' : ',';
    const cabecalhoOriginal = linhas[0].split(separador).map(h => h.trim().toUpperCase());
    return linhas.slice(1).map(linha => {
        const valores = linha.split(separador);
        let obj = {};
        cabecalhoOriginal.forEach((h, i) => {
            let key = h;
            if (h.includes('ATL') || h.includes('NOM')) key = 'NOME';
            else if (h.includes('GER') || h.includes('NCIA')) key = 'GERENCIA';
            else if (h.includes('TOT')) key = 'TOTAL';
            else if (h.includes('DAT')) key = 'DATA';
            else if (h.includes('ATIV')) key = 'ATIVIDADE';
            else if (h.includes('STAT')) key = 'STATUS';
            else if (h.includes('PAP') || h.includes('CARG')) key = 'PAPEL';
            // NOVAS COLUNAS DO CALENDÁRIO AQUI:
            else if (h.includes('DESC') || h.includes('LOC')) key = 'DESCRICAO';
            else if (h.includes('PONT')) key = 'PONTUACAO';

            let val = valores[i] ? valores[i].trim() : "";
            obj[key] = val;
        });
        return obj;
    });
}

function renderRankings(dados) {
    const tbodyAtletas = document.getElementById('corpo-atletas');
    const tbodyGerencias = document.getElementById('corpo-gerencias');
    if (!tbodyAtletas || !tbodyGerencias) return;

    tbodyAtletas.innerHTML = '';
    dados.sort((a, b) => Number(b.TOTAL || 0) - Number(a.TOTAL || 0));
    dados.forEach((atleta, i) => {
        if (!atleta.NOME) return;
        tbodyAtletas.innerHTML += `<tr><td>${i + 1}º</td><td>${atleta.NOME}</td><td>${atleta.GERENCIA || "---"}</td><td><strong>${atleta.TOTAL || 0}</strong></td></tr>`;
    });

    const stats = {};
    dados.forEach(a => {
        const g = a.GERENCIA;
        if (!g || g === "---") return;
        if (!stats[g]) stats[g] = { pontos: 0, count: 0 };
        stats[g].pontos += Number(a.TOTAL || 0);
        stats[g].count += 1;
    });

    const rankG = Object.keys(stats).map(nome => {
        const media = (stats[nome].pontos / stats[nome].count).toFixed(2);
        return { nome, media, brasao: imagensBrasoes[nome] || "" };
    }).sort((a, b) => b.media - a.media);

    tbodyGerencias.innerHTML = '';
    rankG.forEach((g, i) => {
        const imgTag = g.brasao ? `<img src="${g.brasao}" style="width:25px; margin-right:8px; vertical-align:middle;">` : "";
        tbodyGerencias.innerHTML += `<tr><td>${i + 1}º</td><td>${imgTag}${g.nome}</td><td><strong>${g.media}</strong></td></tr>`;
    });
}

// CALENDÁRIO ATUALIZADO
function renderCalendario(dados) {
    const tbody = document.getElementById('corpo-calendario');
    if (!tbody) return;
    tbody.innerHTML = '';
    dados.forEach(c => {
        if (!c.ATIVIDADE) return;
        tbody.innerHTML += `
            <tr>
                <td>${c.DATA || ""}</td>
                <td>${c.ATIVIDADE || ""}</td>
                <td>${c.DESCRICAO || "---"}</td>
                <td>${c.PONTUACAO || "---"}</td>
                <td><span class="status-badge">${c.STATUS || "Agendado"}</span></td>
            </tr>`;
    });
}

function renderComite(dados) {
    const tbody = document.getElementById('corpo-comite');
    if (!tbody) return;
    tbody.innerHTML = '';
    dados.forEach(m => {
        if (!m.NOME) return;
        tbody.innerHTML += `<tr><td>${m.NOME}</td><td>${m.GERENCIA || ""}</td><td>${m.PAPEL || "Organizador"}</td></tr>`;
    });
}
