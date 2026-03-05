// 1. Configuração de Imagens (Brasões na Tabela de Ranking)
const imagensBrasoes = {
    "DS&IP": "DS&IP.jpg",
    "MPO": "MPO.png",
    "NDDC": "NDDC.jpg",
    "IBP": "IBP.png",
    "WHSL": "WHSL.png",
    "NDS": "NDS.png",
    "PRJ": "",
    "DIR": ""
};

// 2. Navegação entre Abas
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// 3. Inicialização Automática
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAtletas();
    carregarDadosCalendario();
});

// 4. Funções de Carga de Dados (Busca nos arquivos .csv do GitHub)
async function carregarDadosAtletas() {
    try {
        const response = await fetch('tabela-atletas.csv');
        if (!response.ok) throw new Error("CSV de Atletas não encontrado");
        const data = await response.text();
        const lista = csvParaArray(data);
        renderRankings(lista);
    } catch (err) {
        console.error("Erro Atletas:", err);
    }
}

async function carregarDadosCalendario() {
    try {
        const response = await fetch('tabela-calendario.csv');
        if (!response.ok) throw new Error("CSV de Calendário não encontrado");
        const data = await response.text();
        const lista = csvParaArray(data);
        renderCalendario(lista);
    } catch (err) {
        console.error("Erro Calendário:", err);
    }
}

// 5. Conversor de CSV (Tratamento para não quebrar com acentos do Excel)
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
            if (h.includes('ATL')) key = 'ATLETA';
            else if (h.includes('GER') || h.includes('NCIA')) key = 'GERENCIA';
            else if (h.includes('TOT')) key = 'TOTAL';
            else if (h.includes('INT')) key = 'INTEGRACAO';
            else if (h.includes('DAT')) key = 'DATA';
            else if (h.includes('ATIV')) key = 'ATIVIDADE';
            else if (h.includes('STAT')) key = 'STATUS';

            let val = valores[i] ? valores[i].trim() : "";
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            obj[key] = val;
        });
        return obj;
    });
}

// 6. Renderização das Tabelas
function renderRankings(dados) {
    const tbodyAtletas = document.getElementById('corpo-atletas');
    const tbodyGerencias = document.getElementById('corpo-gerencias');
    if (!tbodyAtletas || !tbodyGerencias) return;

    // --- Ranking Individual ---
    tbodyAtletas.innerHTML = '';
    dados.sort((a, b) => Number(b.TOTAL || 0) - Number(a.TOTAL || 0));

    dados.forEach((atleta, i) => {
        if (!atleta.ATLETA) return;
        tbodyAtletas.innerHTML += `
            <tr>
                <td>${i + 1}º</td>
                <td>${atleta.ATLETA}</td>
                <td>${atleta.GERENCIA || "---"}</td>
                <td><strong>${atleta.TOTAL || 0}</strong></td>
            </tr>`;
    });

    // --- Ranking Gerências (Cálculo Per Capita Automático) ---
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
        tbodyGerencias.innerHTML += `
            <tr>
                <td>${i + 1}º</td>
                <td>${imgTag}${g.nome}</td>
                <td><strong>${g.media}</strong></td>
            </tr>`;
    });
}

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
                <td>${c.LOCAL || "TBD"}</td>
                <td><span class="status-badge">${c.STATUS || "Agendado"}</span></td>
            </tr>`;
    });
}
