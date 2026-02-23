// 1. Configuração das Gerências (Nomes dos arquivos DEVEM estar idênticos no GitHub)
const infoGerencias = {
    "DS&IP": { pessoas: 9, brasao: "DS&IP.jpg" }, // Dica: se falhar, renomeie a imagem para DSIP.jpg e mude aqui
    "MPO": { pessoas: 16, brasao: "MPO.png" },
    "NDDC": { pessoas: 9, brasao: "NDDC.jpg" },
    "IBP": { pessoas: 6, brasao: "IBP.png" },
    "WHSL": { pessoas: 5, brasao: "WHSL.png" },
    "NDS": { pessoas: 13, brasao: "NDS.png" },
    "PRJ": { pessoas: 1, brasao: "" },
    "DIR": { pessoas: 1, brasao: "" }
};

// 2. Função de Navegação
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// 3. Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAtletas();
    carregarDadosCalendario();
});

async function carregarDadosAtletas() {
    try {
        const response = await fetch('tabela-atletas.csv');
        if (!response.ok) throw new Error("Arquivo não encontrado");
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
        if (!response.ok) throw new Error("Arquivo não encontrado");
        const data = await response.text();
        const lista = csvParaArray(data);
        renderCalendario(lista);
    } catch (err) {
        console.error("Erro ao carregar calendário:", err);
    }
}

// 4. Conversor de CSV BLINDADO (Ignora acentos e maiúsculas/minúsculas das colunas do Excel)
function csvParaArray(txt) {
    txt = txt.replace(/^\uFEFF/, ''); // Remove lixo invisível do Excel
    const linhas = txt.split(/\r?\n/).filter(l => l.trim() !== '');
    if (linhas.length === 0) return [];
    
    const separador = linhas[0].includes(';') ? ';' : ',';
    
    // Normaliza o cabeçalho: "Gerência" vira "GERENCIA"
    const cabecalho = linhas[0].split(separador).map(h => 
        h.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase()
    );
    
    return linhas.slice(1).map(linha => {
        const valores = linha.split(separador);
        return cabecalho.reduce((obj, h, i) => {
            let val = valores[i] ? valores[i].trim() : "";
            // Tira aspas duplas se o Excel tiver colocado
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            obj[h] = val;
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
    // Como normalizamos, as chaves agora são todas maiúsculas e sem acento
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

    // -- Ranking Gerências --
    const somas = {};
    dados.forEach(a => {
        // Agora busca pela chave normalizada
        const g = a.GERENCIA;
        if (!g) return;
        
        // Garante que a escrita do CSV bate com a do nosso JavaScript
        // Se no CSV estiver "DS&IP", vai bater.
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
