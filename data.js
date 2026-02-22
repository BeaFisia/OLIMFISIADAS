// 1. Número de atletas ativos por gerência e nome EXATO do arquivo do brasão
// [Inferência] Assumi a extensão .png. Altere se for .jpg ou .jpeg.
const infoGerencias = {
    "DS&IP": { pessoas: 9, brasao: "DS&IP.jpg" },
    "MPO": { pessoas: 16, brasao: "mpo.png" },
    "IBP": { pessoas: 6, brasao: "IBP.png" },
    "NDS": { pessoas: 13, brasao: "NDS.png" },
    "NDDC": { pessoas: 9, brasao: "nddc.jpg" },
    "WHSL": { pessoas: 5, brasao: "whsl.png" }
    // Adicione as demais gerências aqui, se houver
};

// 2. Pontuação dos Atletas (Extraído do seu CSV)
// O campo 'gerencia' está vazio. Você DEVE preenchê-lo com o nome exato da gerência.
const atletas = [
    { nome: "Beatriz Borges", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Luis Mattos", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Juan Tobón", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Camila Fernandes", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Yan Rodrigues", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Jacqueline Reis", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Raissa Pulz", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Caroline Todesquini", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Marcella Ferro", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Marcel Diz", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Debora Cristina", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Tatiane Vido", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Rafael Batista", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Vitor Cristofaro", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Mayara Marques", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Marcela Rodrigues", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Fabricio Cavalcante", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Beatriz de Oliveira", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Luana Cesar", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "William Guglielmi", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Tania Xavier", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Fernando Calixto", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Juliana Figueredo", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Edmilson Jr", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Denis Barbosa", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Giullya Midori", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Isabel Ramona", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Dani Voros", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Rayssa Kaoane", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Phillipe Lam Goy", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Tiago Lopes", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Gabriel Pacheco", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Gabriel Armoni", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Caio Moraes", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Luiz Prates", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Guilherme Medeiros", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Lucas Mendonça", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Luiz Gustavo Szolnoky", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Lucas Cardoso", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Carlos Eduardo Ribeiro", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Alberto Montenegro", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Carolina Spedo", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Thomas Sena Santos", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 },
    { nome: "Gilvan Junior Oliveira", gerencia: "", pontosIntegracao: 0, pontosTotal: 0 }
];

// 3. Calendário de Atividades
const calendario = [
    { data: "2026-03-05", nome: "Quiz DSM", tipo: "Simples", local: "Teams", descricao: "Quiz rápido sobre a empresa." },
    { data: "2026-03-20", nome: "Meme Friday", tipo: "Engajamento", local: "WhatsApp", descricao: "Compartilhar o melhor meme de trabalho." }
];
