// 1. Configuração das Gerências (Nomes devem ser IDÊNTICOS aos do CSV)
const infoGerencias = {
    "DS&IP": { pessoas: 9, brasao: "DS&IP.jpg" },
    "MPO": { pessoas: 16, brasao: "MPO.png" },
    "NDDC": { pessoas: 9, brasao: "NDDC.jpg" },
    "IBP": { pessoas: 6, brasao: "IBP.png" },
    "WHSL": { pessoas: 5, brasao: "WHSL.png" },
    "NDS": { pessoas: 13, brasao: "NDS.png" }
};

// 2. Função de Navegação (Movida para fora para garantir que funcione sempre)
function showTab(tabId) {
    console.log("Tentando abrir a aba:", tabId);
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// 3. Carregamento de Dados
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAtletas();
    carregarDadosCalendario();
});

async function carregarDadosAtletas() {
    try {
        const response = await fetch('tabela-atletas.csv');
        if (!response.ok) throw new Error("Arquivo atletas.csv não encontrado");
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
        if (!response.ok) throw new Error("Arquivo calendario.csv não encontrado");
        const data = await response.text();
        const lista = csvParaArray(data);
        renderCalendario(lista);
    } catch (err) {
        console.error("Erro ao carregar calendário:", err);
    }
}

// Função para lidar com CSVs que usam vírgula ou ponto-e-vírgula
function csvParaArray(txt) {
    const linhas = txt.split(/\r?\n/).filter(l => l.trim() !== '');
    if (linhas.length === 0) return [];
    
    // Detecta se o separador é vírgula ou ponto-e-vírgula
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

function renderRankings(dados) {
    const tbodyAtletas = document.getElementById('corpo-atletas');
    const tbodyGerencias = document.getElementById('corpo-gerencias');
    if (!tbodyAtletas || !tbodyGerencias) return;

    tbodyAtletas.innerHTML = '';
    // Ordena por TOTAL decrescente
    dados.sort((a, b) => Number(b.TOTAL || 0) - Number(a.TOTAL || 0));

    dados.forEach((atleta, i) => {
        if (!atleta.Atleta) return;
        tbodyAtletas.innerHTML += `
            <tr>
                <td>${i + 1}º</td>
                <td>${atleta.Atleta}</td>
                <td>${atleta.Gerência || atleta.Gerencia || "---"}</td>
                <td>${atleta.INTEGRAÇÃO || atleta.Integração || 0}</td>
                <td><strong>${atleta.TOTAL || 0}</strong></td>
            </tr>`;
    });

    // Ranking Gerências
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
        return { nome, media, brasao: info.brasao };
    }).sort((a, b) => b.media - a.media);

    tbodyGerencias.innerHTML = '';
    rankG.forEach((g, i) => {
        tbodyGerencias.innerHTML += `
            <tr>
                <td>${i + 1}º</td>
                <td>
                    <img src="${g.brasao}" style="width:30px; margin-right:10px; vertical-align:middle" onerror="this.style.display='none'">
                    ${g.nome}
                </td>
                <td><strong>${g.media}</strong></td>
            </tr>`;
    });
}

function renderCalendario(dados) {
    const tbody = document.getElementById('corpo-calendario');
    if (!tbody) return;
    tbody.innerHTML = '';

    dados.forEach(c => {
        if (!c.Atividade) return;
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
