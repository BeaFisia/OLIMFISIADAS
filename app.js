// 1. Mapeamento dos Brasões (Apenas para garantir o formato correto da imagem .jpg ou .png)
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

// 2. Função de Navegação (Botões)
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// 3. Carregamento Automático ao abrir a página
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

// 4. Conversor de CSV Super Robusto (Ignora erros de acento do Excel)
function csvParaArray(txt) {
    txt = txt.replace(/^\uFEFF/, ''); // Remove sujeira invisível do Excel
    const linhas = txt.split(/\r?\n/).filter(l => l.trim() !== '');
    if (linhas.length === 0) return [];
    
    const separador = linhas[0].includes(';') ? ';' : ',';
    const cabecalho = linhas[0].split(separador).map(h => h.trim().toUpperCase());
    
    return linhas.slice(1).map(linha => {
        const valores = linha.split(separador);
        let obj = {};
        
        cabecalho.forEach((h, i) => {
            // Identifica as colunas por fragmentos para driblar falhas de codificação do Excel
            let key = h;
            if (h.includes('ATL')) key = 'ATLETA';
            else if (h.includes('GER') || h.includes('NCIA')) key = 'GERENCIA';
            else if (h.includes('TOT')) key = 'TOTAL';
            else if (h.includes('INT')) key = 'INTEGRACAO';
            else if (h.includes('DAT')) key = 'DATA';
            else if (h.includes('ATIV')) key = 'ATIVIDADE';
            else if (h.includes('DESC')) key = 'DESCRICAO';
            else if (h.includes('PONT')) key = 'PONTUACAO';
            else if (h.includes('LOC')) key = 'LOCAL';
            else if (h.includes('STAT')) key = 'STATUS';

            let val = valores[i] ? valores[i].trim() : "";
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            obj[key] = val;
        });
        
        return obj;
    });
}

// 5. Renderização dos Rankings
function renderRankings(dados) {
    const tbodyAtletas = document.getElementById('corpo-atletas');
    const tbodyGerencias = document.getElementById('corpo-gerencias');
    if (!tbodyAtletas || !tbodyGerencias) return;

    // -- 5A. Renderizar Ranking Individual --
    tbodyAtletas.innerHTML = '';
    dados.sort((a, b) => Number(b.TOTAL || 0) - Number(a.TOTAL || 0));

    dados.forEach((atleta, i) => {
        if (!atleta.ATLETA) return;
        tbodyAtletas.innerHTML += `
            <tr>
                <td>${i + 1}º</td>
                <td>${atleta.ATLETA}</td>
                <td>${atleta.GERENCIA || "---"}</td>
                <td>${atleta.INTEGRACAO || 0}</td>
                <td><strong>${atleta.TOTAL || 0}</strong></td>
            </tr>`;
    });

    // -- 5B. Renderizar Ranking das Gerências (Cálculo Automático) --
    const statsGerencias = {};
    
    // Conta os pontos e a quantidade de atletas automaticamente lendo o CSV
    dados.forEach(a => {
        const g = a.GERENCIA;
        if (!g || g === "---") return;
        
        if (!statsGerencias[g]) {
            statsGerencias[g] = { pontosTotais: 0, quantidadeAtletas: 0 };
        }
        statsGerencias[g].pontosTotais += Number(a.TOTAL || 0);
        statsGerencias[g].quantidadeAtletas += 1;
    });

    // Calcula o Per Capita
    const rankG = Object.keys(statsGerencias).map(nome => {
        const stats = statsGerencias[nome];
        const media = (stats.pontosTotais / stats.quantidadeAtletas).toFixed(2);
        
        // Puxa a imagem se existir no mapeamento, senão deixa vazio
        const arquivoBrasao = imagensBrasoes[nome] || "";
        
        return { nome, media, brasao: arquivoBrasao };
    }).sort((a, b) => b.media - a.media);

    tbodyGerencias.innerHTML = '';
    rankG.forEach((g, i) => {
        const tagImagem = g.brasao !== "" 
            ? `<img src="${g.brasao}" alt="${g.nome}" style="width:30px; margin-right:10px; vertical-align:middle; border-radius:4px;">` 
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
        if (!c.ATIVIDADE) return;
        tbody.innerHTML += `
            <tr>
                <td>${c.DATA || ""}</td>
                <td>${c.ATIVIDADE || ""}</td>
                <td>${c.DESCRICAO || ""}</td>
                <td>${c.PONTUACAO || ""}</td>
                <td>${c.LOCAL || ""}</td>
                <td><span class="status-badge">${c.STATUS || "Agendado"}</span></td>
            </tr>`;
    });
}
