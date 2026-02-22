// Função para trocar as abas
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    renderCalendario();
    renderRankings();
});

// Calcula Status Baseado na Data
function getStatus(dataAtividade) {
    const hoje = new Date().toISOString().split('T')[0];
    if (dataAtividade < hoje) return '<span class="status-done">Done</span>';
    if (dataAtividade === hoje) return '<span class="status-progress">In Progress</span>';
    return '<span class="status-not-started">Not Started</span>';
}

// Renderiza o Calendário
function renderCalendario() {
    const tbody = document.getElementById('corpo-calendario');
    calendario.sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordena por data

    calendario.forEach(ativ => {
        // Converte formato YYYY-MM-DD para DD/MM/YYYY
        const dataFormatada = ativ.data.split('-').reverse().join('/');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td><strong>${ativ.nome}</strong><br><small>(${ativ.tipo})</small></td>
            <td>${ativ.descricao}</td>
            <td>${ativ.local}</td>
            <td>${getStatus(ativ.data)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Renderiza os Rankings (Individuais e Gerências)
function renderRankings() {
    // 1. Ordenar e Renderizar Atletas (Maior para Menor)
    const atletasOrdenados = [...atletas].sort((a, b) => b.pontos - a.pontos);
    const tbodyAtletas = document.getElementById('corpo-atletas');
    
    atletasOrdenados.forEach((atleta, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}º</td>
            <td>${atleta.nome}</td>
            <td>${atleta.gerencia}</td>
            <td>${atleta.pontos}</td>
        `;
        tbodyAtletas.appendChild(tr);
    });

    // 2. Calcular e Renderizar Gerências
    const somaGerencias = {};
    
    // Somar pontos por gerência
    atletas.forEach(atleta => {
        if (!somaGerencias[atleta.gerencia]) somaGerencias[atleta.gerencia] = 0;
        somaGerencias[atleta.gerencia] += atleta.pontos;
    });

    // Calcular "Per Capita" e colocar em array
    const rankingGerencias = Object.keys(somaGerencias).map(gerencia => {
        const totalPontos = somaGerencias[gerencia];
        const numAtletas = infoGerencias[gerencia] || 1; // Evita divisão por zero
        const pontosPerCapita = (totalPontos / numAtletas).toFixed(2);
        return { gerencia, pontosPerCapita: parseFloat(pontosPerCapita) };
    });

    // Ordenar gerências
    rankingGerencias.sort((a, b) => b.pontosPerCapita - a.pontosPerCapita);

    const tbodyGerencias = document.getElementById('corpo-gerencias');
    rankingGerencias.forEach((g, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}º</td>
            <td>${g.gerencia}</td>
            <td>${g.pontosPerCapita}</td>
        `;
        tbodyGerencias.appendChild(tr);
    });
}
