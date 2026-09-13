/* =============================================================================
   ligar-eletroposto.js — põe os dados do caso dentro do mockup do eletroposto.

   A página é o arquivo do Stitch, intacto. O retorno aqui é sobre o capex do
   carregador, e a energia é insumo comprado da usina como unidade assinante.
   ========================================================================== */
(function () {
  'use strict';

  var c = B2W.ler();
  var F = B2W.fmt;
  var traco = '—';

  function semCaso(msg) {
    document.body.innerHTML =
      '<div style="min-height:100vh;display:grid;place-items:center;text-align:center;' +
      'font-family:Inter,system-ui,sans-serif;color:#B8BCCE;background:#0f1226;padding:32px">' +
      '<div><h1 style="font-family:Manrope,sans-serif;color:#F8F9FB;font-size:1.6rem;margin:0 0 12px">' +
      'Link inválido</h1><p>' + msg + '</p></div></div>';
  }
  if (!c) { semCaso('Este endereço não carrega os dados de nenhum caso. Peça um novo link.'); return; }
  if (!c.ep) {
    semCaso('Este caso não tem eletroposto. Marque o eletroposto no montador e gere o link de novo.');
    return;
  }

  var e = c.ep, t = c.cascata;
  var m = e.mensalAssinante;          // nesta página a usina é fornecedora
  var vi = e.viabIsolado;

  function põe(chave, texto) {
    var els = document.querySelectorAll('[data-f="' + chave + '"]');
    for (var i = 0; i < els.length; i++) els[i].textContent = texto;
  }
  function ou(v, f) {
    return (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) ? traco : f(v);
  }

  document.title = c.nome + ' · Eletroposto · B2W Invest';

  /* ------------------------------------------------------ topo e hero ---- */
  põe('chipGrupo', 'GRUPO ' + e.grupo + ' · ' +
    (e.grupo === 'B' ? 'BAIXA TENSÃO' : 'MÉDIA TENSÃO') +
    (e.cargaInstalada ? ' (' + F.nf1.format(e.cargaInstalada) + ' kW CA)' : ''));
  põe('chipHub', (c.local ? c.local.toUpperCase() + ' · ' : '') +
    'VAGA DC ' + F.nf.format(e.kwEfetivo) + 'kW');
  põe('chipConector', (e.conexao || 'conexão não informada'));
  põe('chipPistolas', F.nf.format(e.pistolas) + 'x PISTOLAS ATIVAS');

  /* --------------------------------------------- quatro parâmetros ------- */
  põe('potenciaSaida', F.nf.format(e.kwEfetivo));
  põe('notaPistolas', e.pistolas + ' pistolas em ' + e.carregadores +
    (e.carregadores === 1 ? ' carregador' : ' carregadores'));
  põe('recargasDia', F.nf.format(e.sessoes * e.pistolas));
  põe('notaRecargas', F.nf1.format(e.sessoes) + ' recargas por pistola');
  põe('minutosSessao', F.nf.format(e.tOcupacao));
  põe('notaSoC', 'SoC ' + F.nf.format(e.socIni) + '% a ' + F.nf.format(e.socFim) +
    '% de ' + F.nf1.format(e.bateria) + ' kWh');
  põe('kwhMes', F.nf.format(Math.round(e.vendidos)));
  põe('notaSplit', e.carregadores > 1
    ? F.nf.format(e.kwEfetivo) + 'kW × ' + e.carregadores
    : F.nf.format(e.kwEfetivo) + 'kW por unidade');
  põe('notaMono', e.limite
    ? 'limitado a ' + F.nf.format(e.limite) + 'kW' : F.nf.format(e.kw) + 'kW de placa');

  /* ------------------------------------------- cartão financeiro --------- */
  põe('receitaMes', F.brl.format(m.receita).replace(/,\d\d$/, ''));
  põe('precoVenda', F.brl.format(e.preco) + ' / kWh');
  põe('margemKwh', F.brl.format(e.margemKwh));
  põe('spread', e.preco ? 'Spread de ' + F.nf1.format(e.margemKwh / e.preco * 100) + '%' : traco);
  põe('yieldMes', e.capex ? F.pctMes(m.resultado / e.capex * 100) : traco);
  põe('notaPicos', 'Ocupação de ' + F.nf1.format(e.horasOcupada) + ' h por pistola ao dia');
  põe('chipPayback', vi && vi.payback !== null
    ? 'PAYBACK: ' + Math.round(vi.payback * 12) + ' MESES' : 'PAYBACK NÃO ATINGIDO');

  /* ------------------------------------------------ ficha técnica -------- */
  põe('chipModelo', 'MODELO: ' + (e.modelo || 'não informado'));
  põe('modeloCodigo', e.modelo || traco);
  põe('fichaSaida', F.nf.format(e.kwEfetivo) + ' kW DC' + (e.limite ? ' (limitado)' : ' contínuo'));
  põe('fichaEntrada', ou(e.cargaInstalada, function (x) {
    return F.nf1.format(x) + ' kW (' + (e.grupo === 'B' ? 'baixa tensão' : 'média tensão') + ')';
  }));
  põe('fichaConectores', e.pistolas + 'x CCS Tipo 2');
  põe('fichaEficiencia', F.nf1.format(e.eta * 100) + '% em carga total');
  põe('fichaPerda', e.eta ? F.nf1.format((1 / e.eta - 1) * 100) + '% calculada' : traco);

  /* ============================================== DRE do mês ============= */
  (function dre() {
    var box = document.getElementById('dreLinhas');
    if (!box) return;

    function linha(icone, cor, titulo, nota, valor, pct, negativo) {
      return '<div class="p-space-4 flex flex-col sm:flex-row sm:items-center justify-between ' +
        'gap-space-2 hover:bg-surface-raised transition-colors">' +
        '<div class="flex items-center gap-space-3">' +
        '<span class="material-symbols-outlined text-' + cor + ' text-[22px]">' + icone + '</span>' +
        '<div><span class="font-headline-sm text-headline-sm text-ink-primary font-bold">' + titulo + '</span>' +
        '<p class="font-body-sm text-body-sm text-ink-secondary">' + nota + '</p></div></div>' +
        '<div class="text-right">' +
        '<span class="font-metric-card text-metric-card text-' + cor + ' font-bold">' +
        (negativo ? '-' : '') + F.brl.format(valor) + '</span>' +
        '<p class="font-label-mono text-label-mono text-ink-muted">' + pct + '</p></div></div>';
    }

    var rec = m.receita || 1;
    var p = function (v) { return (v / rec * 100).toFixed(2).replace('.', ',') + '% da receita'; };

    var energiaNota = m.excedente > 0
      ? F.nf.format(Math.round(m.cobertos)) + ' kWh da usina a ' + F.brl4.format(m.precoEnergia) +
        ' e ' + F.nf.format(Math.round(m.excedente)) + ' kWh em tarifa cheia a ' + F.brl4.format(e.precoCheio)
      : F.nf.format(Math.round(m.cobertos)) + ' kWh a ' + F.brl4.format(m.precoEnergia) +
        ' (fator ' + F.nf1.format(1 / (e.eta || 1)) + ' de conversão)';

    var out = linha('add_circle', 'status-verified', '(+) Receita bruta de venda de energia',
      F.nf.format(Math.round(e.vendidos)) + ' kWh despachados × ' + F.brl.format(e.preco) +
      '/kWh cobrado no aplicativo', m.receita, '100,0% da receita', false);

    out += linha('remove_circle', 'status-provisional', '(-) Energia comprada',
      energiaNota, m.energia, '-' + p(m.energia).replace('% da receita', '%'), true);

    // A portagem da vaga é participação sobre a receita, e entra aqui junto com
    // plataforma e adquirência — não como despesa fixa do mês.
    out += linha('remove_circle', 'status-provisional',
      '(-) Plataforma, adquirência e portagem da vaga',
      'Split de ' + F.nf1.format(e.plataforma + e.pagamento + e.portagemPct) +
      '% sobre o faturamento bruto' +
      (e.portagemPct ? ', dos quais ' + F.nf1.format(e.portagemPct) +
        '% de participação do dono da vaga' : ''),
      m.taxas, '-' + p(m.taxas).replace('% da receita', '%'), true);

    var fixoRede = m.demanda + m.disponib;
    out += linha('remove_circle', 'status-provisional',
      e.grupo === 'A' ? '(-) Demanda contratada' : '(-) Custo de disponibilidade',
      e.grupo === 'A'
        ? F.nf.format(e.demanda) + ' kW contratados — a compensação de GD não abate demanda'
        : 'Piso do Grupo B: ' + B2W.const.DISPONIBILIDADE_KWH + ' kWh em tarifa cheia todo mês',
      fixoRede, '-' + p(fixoRede).replace('% da receita', '%'), true);

    var opex = m.fixos - fixoRede;
    out += linha('remove_circle', 'status-provisional', '(-) Opex do eletroposto',
      'Manutenção, seguro e operação do equipamento',
      opex, '-' + p(opex).replace('% da receita', '%'), true);

    box.innerHTML = out;

    põe('dreVolume', 'VOLUME BASE: ' + F.nf.format(Math.round(e.vendidos)) + ' kWh / MÊS');
    põe('dreResultado', F.brl.format(m.resultado));
    põe('dreNotaResultado', 'Margem líquida operacional de ' +
      F.nf1.format(m.resultado / rec * 100) + '% sobre a receita bruta total');
    põe('dreResultadoNota', e.vendidos
      ? F.brl.format(m.resultado / e.vendidos) + ' líquido / kWh vendido' : traco);
  })();

  /* ====================================== curva de ocupação (SVG 400x90) == */
  /* O modelo não distribui as recargas ao longo do dia: ele diz quantas horas
     a pistola fica presa. A barra mostra essa fração das 24 h — e a legenda
     abaixo do gráfico diz que a distribuição é premissa, não medição. */
  (function ocupacao() {
    var g = document.getElementById('curvaOcup');
    if (!g) return;
    var W = 400, H = 90, base = 72;
    var out = '';
    var frac = Math.max(0, Math.min(1, e.horasOcupada / 24));
    for (var h = 0; h <= 24; h += 2) {
      var x = (h / 24) * W;
      out += '<line x1="' + x.toFixed(1) + '" y1="' + base + '" x2="' + x.toFixed(1) +
        '" y2="' + (base + 4) + '" stroke="#282D4A" stroke-width="1"></line>';
    }
    out += '<rect x="0" y="30" width="' + W + '" height="' + (base - 30) +
      '" rx="6" fill="#0E1230" stroke="#1C2248"></rect>';
    out += '<rect x="0" y="30" width="' + (W * frac).toFixed(1) + '" height="' + (base - 30) +
      '" rx="6" fill="#00D4FF" opacity="0.85"></rect>';
    out += '<text x="6" y="22" fill="#00FFFF" font-family="JetBrains Mono" font-size="11" ' +
      'font-weight="700">' + F.nf1.format(e.horasOcupada) + ' h/dia ocupada</text>';
    out += '<text x="' + (W - 6) + '" y="22" fill="#5F6480" font-family="JetBrains Mono" ' +
      'font-size="10" text-anchor="end">' + F.nf.format(Math.round(frac * 100)) + '% do dia</text>';
    ['0h', '6h', '12h', '18h', '24h'].forEach(function (r, i) {
      out += '<text x="' + ((i / 4) * W).toFixed(1) + '" y="' + (base + 16) +
        '" fill="#5F6480" font-family="JetBrains Mono" font-size="9" text-anchor="' +
        (i === 0 ? 'start' : i === 4 ? 'end' : 'middle') + '">' + r + '</text>';
    });
    g.innerHTML = out;
  })();

  /* ================================ curva acumulada de retorno (500x130) == */
  (function amortizacao() {
    var g = document.getElementById('amortEp');
    if (!g || !vi) return;
    var W = 500, H = 130, ML = 6, MR = 6, MT = 14, MB = 22;
    var serie = vi.acumulado;
    var lo = Math.min.apply(null, serie.concat([-vi.capex]));
    var hi = Math.max.apply(null, serie);
    var amp = (hi - lo) || 1;
    var x = function (i) { return ML + (i / Math.max(1, serie.length - 1)) * (W - ML - MR); };
    var y = function (v) { return H - MB - ((v - lo) / amp) * (H - MT - MB); };

    var out = '<line x1="' + ML + '" y1="' + y(0).toFixed(1) + '" x2="' + (W - MR) +
      '" y2="' + y(0).toFixed(1) + '" stroke="#5F6480" stroke-dasharray="4,4" stroke-width="1"></line>';
    var d = serie.map(function (v, i) {
      return (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1);
    }).join(' ');
    out += '<path d="' + d + '" fill="none" stroke="#00FFFF" stroke-width="2.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"></path>';
    serie.forEach(function (v, i) {
      out += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="2.5" fill="#00FFFF"></circle>';
    });
    if (vi.payback !== null) {
      var xe = x(vi.payback);
      out += '<line x1="' + xe.toFixed(1) + '" y1="' + MT + '" x2="' + xe.toFixed(1) +
        '" y2="' + (H - MB) + '" stroke="#e9c349" stroke-width="1" stroke-dasharray="3,3"></line>';
      out += '<circle cx="' + xe.toFixed(1) + '" cy="' + y(0).toFixed(1) + '" r="4" fill="#e9c349"></circle>';
      out += '<text x="' + Math.min(xe + 8, W - 90).toFixed(1) + '" y="' + (MT + 10) +
        '" fill="#e9c349" font-family="JetBrains Mono" font-size="9">equilíbrio: ' +
        F.anos(vi.payback, c.horizonte) + '</text>';
    }
    out += '<text x="' + ML + '" y="' + (H - 6) + '" fill="#5F6480" font-family="JetBrains Mono" ' +
      'font-size="9">ano 1</text>';
    out += '<text x="' + (W - MR) + '" y="' + (H - 6) + '" fill="#5F6480" font-family="JetBrains Mono" ' +
      'font-size="9" text-anchor="end">ano ' + serie.length + '</text>';
    g.innerHTML = out;
  })();

  /* ================================================= viabilidade ========= */
  põe('capex', ou(e.capex, function (x) { return F.brl.format(x).replace(/,\d\d$/, ''); }));
  if (vi) {
    põe('roi', vi.roi === null ? traco : F.pct1(vi.roi * 100));
    põe('roiNota', F.brl.format(vi.total) + ' acumulados em ' + c.horizonte + ' anos');
    põe('tir', isNaN(vi.tir) ? traco : F.pct1(vi.tir * 100));
    põe('payback', F.anos(vi.payback, c.horizonte));
    põe('paybackNota', vi.payback !== null
      ? Math.round(vi.payback * 12) + ' meses em regime operacional estável'
      : 'não atingido no horizonte de ' + c.horizonte + ' anos');
  } else {
    ['roi', 'roiNota', 'tir', 'payback', 'paybackNota'].forEach(function (k) { põe(k, traco); });
  }

  /* =================================================== premissas ========= */
  põe('prPerda', e.eta ? F.nf1.format((1 / e.eta - 1) * 100) + '% sobre a saída (η ' +
    F.nf1.format(e.eta * 100) + '%)' : traco);
  põe('prFator', e.eta ? F.nf1.format(1 / e.eta) + ' kWh comprados por kWh vendido' : traco);
  põe('prEnergiaSessao', F.nf1.format(e.eSessao) + ' kWh úteis');
  põe('prTempo', F.nf.format(e.tCarga) + ' min + ' +
    F.nf.format(Math.max(0, e.tOcupacao - e.tCarga)) + ' min de manobra');
  põe('prEntrada', ou(e.cargaInstalada, function (x) { return F.nf1.format(x) + ' kW de carga instalada'; }));
  põe('prSessoes', F.nf1.format(e.sessoes) + ' sessões / pistola / dia');
  põe('prTaxas', F.nf1.format(e.plataforma + e.pagamento + e.portagemPct) +
    '% sobre a receita' + (e.portagemPct
      ? ' (inclui ' + F.nf1.format(e.portagemPct) + '% de portagem da vaga)' : ''));
  põe('prBateria', F.nf1.format(e.bateria) + ' kWh de bateria média');
  põe('prLimite', e.limite
    ? 'Limite de ' + F.nf.format(e.limite) + ' kW por software'
    : 'Sem limite de software: ' + F.nf.format(e.kw) + ' kW de placa');

  /* ==================================================== simulador ======== */
  põe('simRotuloRecargas', 'Recargas por dia (total de ' + e.pistolas + ' pistolas):');
  põe('simRecargas', F.nf.format(e.sessoes * e.pistolas) + ' recargas/dia');
  põe('simReceita', F.brl.format(m.receita));
  põe('simYield', e.capex ? F.pctMes(m.resultado / e.capex * 100) + ' a.m.' : traco);

  /* nomes do caso fictício, imagens mortas e a barra das três páginas —
     os três estão no motor, iguais para as três páginas. */
  B2W.trocarNomes(c);
  B2W.esconderImagensQuebradas();
  B2W.navegar(c, 'eletroposto');
})();
