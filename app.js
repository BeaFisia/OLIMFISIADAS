// Configuração das Gerências (Ajuste os nomes das fotos aqui)
const infoGerencias = {
    "DS&IP": { pessoas: 9, brasao: "DS&IP.jpg" },
    "MPO": { pessoas: 14, brasao: "MPO.jpg" },
    "NDDC": { pessoas: 6, brasao: "NDDC.jpg" }
};

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});

async function carregarDados() {
    try {
        // LER ATLETAS E RANKINGS
        const resAtletas = await fetch('tabela-atletas.csv');
        const csvAtletas = await resAtletas.text();
        const listaAtletas = csvParaArray(csvAtletas);
        renderRankings(listaAtletas);

        // LER CALENDÁRIO
        const resCal = await fetch('tabela-calendario.csv');
        const csvCal = await resCal.text();
        const listaCal = csvParaArray(csvCal);
        renderCalendario(listaCal);
    } catch (erro) {
        console.error("Erro ao ler arquivos CSV. Verifique se os nomes no GitHub estão corretos.", erro);
    }
}

// Função mágica que transforma o CSV em dados que o código entende
function csvParaArray(txt) {
    const linhas = txt.split('\n').filter(l => l.trim() !== '');
    const cabecalho = linhas[0].split(',');
    return linhas.slice(1).map(linha => {
        const valores = linha.split(',');
        return cabecalho.reduce((obj, h, i) => {
            obj[h.trim()] = valores[i]?.trim();
            return obj;
        }, {});
    });
}

function renderRankings(dados) {
    const tbodyAtletas = document.getElementById('corpo-atletas');
    const tbodyGerencias = document.getElementById('corpo-gerencias');
    
    // 1. Ranking Individual
    tbodyAtletas.innerHTML = '';
    const atletasOrdenados = dados.sort((a, b) => Number(b.TOTAL) - Number(a.TOTAL));
    
    atletasOrdenados.forEach((atleta, i) => {
        tbodyAtletas.innerHTML += `
            <tr>
                <td>${i+1}º</td>
                <td>${atleta.Atleta}</td>
                <td>${atleta.Gerência}</td>
                <td>${atleta.INTEGRAÇÃO}</td>
                <td><strong>${atleta.TOTAL}</strong></td>
            </tr>`;
    });

    // 2. Ranking Gerências (Soma e Média)
    const somas = {};
    dados.forEach(a => {
        if(!somas[a.Gerência]) somas[a.Gerência] = 0;
        somas[a.Gerência] += Number(a.TOTAL);
    });

    const rankG = Object.keys(somas).map(g => {
        const info = infoGerencias[g] || { pessoas: 1, brasao: "default.jpg" };
        return { nome: g, media: (somas[g] / info.pessoas).toFixed(2), brasao: info.brasao };
    }).sort((a, b) => b.media - a.media);

    tbodyGerencias.innerHTML = '';
    rankG.forEach((g, i) => {
        tbodyGerencias.innerHTML += `
            <tr>
                <td>${i+1}º</td>
                <td><img src="${g.brasao}" style="width:30px; vertical-align:middle; margin-right:10px;">${g.nome}</td>
                <td><strong>${g.media}</strong></td>
            </tr>`;
    });
}

function renderCalendario(dados) {
    const tbody = document.getElementById('corpo-calendario');
    tbody.innerHTML = '';
    dados.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.Data}</td>
                <td>${c.Atividade}</td>
                <td>${c.Descrição}</td>
                <td>${c.Pontuação}</td>
                <td>${c.Local}</td>
                <td>${c.Status || 'Agendado'}</td>
            </tr>`;
    });
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
