// 1. Configuração das Gerências
const infoGerencias = {
    "DS&IP": { pessoas: 9, brasao: "DS&IP.jpg" },
    "MPO": { pessoas: 16, brasao: "MPO.png" },
    "NDDC": { pessoas: 9, brasao: "NDDC.jpg" },
    "IBP": { pessoas: 6, brasao: "IBP.png" },
    "WHSL": { pessoas: 5, brasao: "WHSL.png" },
    "NDS": { pessoas: 13, brasao: "NDS.png" },
    "PRJ": { pessoas: 1, brasao: "" },
    "DIR": { pessoas: 1, brasao: "" }
};

// 2. Função de Navegação (Botões)
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// 3. Carregamento de Dados ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAtletas();
    carregarDadosCalendario();
});

async function carregarDadosAtletas() {
    try {
        const response = await fetch('tabela-atletas.csv');
        if (!response.ok) throw new Error("Arquivo tabela-atletas.csv não encontrado");
        const data = await response.text();
        const lista = csvParaArray(data);
        renderRankings(lista);
    } catch (err) {
        console.error("Erro ao carregar atletas:", err);
    }
}

async function carregarDadosCalendario() {
    try {
        const response = await fetch('tabela-calendario.csv');
        if (!response.ok) throw new Error("Arquivo tabela-calendario.csv não encontrado");
        const data = await response.text();
        const lista = csvParaArray(data);
        renderCalendario(lista);
    } catch (err) {
        console.error("Erro ao carregar calendário:", err);
    }
}

// 4. Conversor de CSV (com correção do bug do Excel)
function csvParaArray(txt) {
    // Remove o caractere invisível (BOM) que o Excel insere no começo do arquivo
    txt = txt.replace(/^\uFEFF/, '');
    
    const linhas = txt.split(/\r?\n/).filter(l => l.trim() !== '');
    if (linhas.length === 0) return [];
    
    const separador = linhas[0].includes(';') ? ';' : ',';
    const cabecalho = linhas[0].split(separador).map(h => h.trim());
    
    return linhas.slice(1).map(linha => {
        const valores = linha.split(separador);
        return cabecalho.reduce((obj, h, i) => {
            obj[h] = valores[i] ? valores[i].trim() : "";
            return obj;
        }, {});
    });
}

// 5. Renderização dos Rankings
function renderRankings(dados) {
    const tbodyAtletas = document.getElementById('corpo-atletas');
    const tbodyGerencias = document.getElementById('corpo-gerencias');
    if (!tbodyAtletas || !tbodyGerencias) return;

    // -- Ranking Individual --
    tbodyAtletas.innerHTML = '';
    dados.sort((a, b) => Number(b.TOTAL || 0) - Number(a.TOTAL || 0));

    dados.forEach((atleta, i) => {
        if (!atleta.Atleta) return; // Pula linhas vazias
        tbodyAtletas.innerHTML += `
            <tr>
                <td>${i + 1}º</td>
                <td>${atleta.Atleta}</td>
                <td>${atleta.Gerência || atleta.Gerencia || "---"}</td>
                <td>${atleta.INTEGRAÇÃO || atleta.Integração || 0}</td>
                <td><strong>${atleta.TOTAL || 0}</strong></td>
            </tr>`;
    });

    // -- Ranking Gerências --
    const somas = {};
    dados.forEach(a => {
        const g = a.Gerência || a.Gerencia;
        if (!g) return;
        if (!somas[g]) somas[g] = 0;
        somas[g] += Number(a.TOTAL || 0);
    });

    const rankG = Object.keys(somas).map(nome => {
        const info = infoGerencias[nome] || { pessoas: 1, brasao: "" };
        const media = (somas[nome] / info.pessoas).toFixed(2);
        return { nome, media, brasao: info.brasao.trim() };
    }).sort((a, b) => b.media - a.media);

    tbodyGerencias.innerHTML = '';
    rankG.forEach((g, i) => {
        // Só tenta mostrar a imagem se houver um nome de arquivo preenchido
        const tagImagem = g.brasao !== "" 
            ? `<img src="${g.brasao}" alt="Brasão" style="width:30px; margin-right:10px; vertical-align:middle">` 
            : ``;

        tbodyGerencias.innerHTML += `
            <tr>
                <td>${i + 1}º</td>
                <td>${tagImagem}${g.nome}</td>
                <td><strong>${g.media}</strong></td>
            </tr>`;
    });
}

// 6. Renderização do Calendário
function renderCalendario(dados) {
    const tbody = document.getElementById('corpo-calendario');
    if (!tbody) return;
    tbody.innerHTML = '';

    dados.forEach(c => {
        if (!c.Atividade) return; // Pula linhas vazias
        tbody.innerHTML += `
            <tr>
                <td>${c.Data || ""}</td>
                <td>${c.Atividade || ""}</td>
                <td>${c.Descrição || c.Descricao || ""}</td>
                <td>${c.Pontuação || c.Pontuacao || ""}</td>
                <td>${c.Local || ""}</td>
                <td><span class="status-badge">${c.Status || "Agendado"}</span></td>
            </tr>`;
    });
}
