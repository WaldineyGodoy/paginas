/* =============================================================================
   ligar-hibrida.js — põe os dados do caso dentro do mockup da operação híbrida.

   Aqui os dois ativos têm o mesmo dono: a usina entrega a energia a preço de
   custo (Fio B + gestão) e o eletroposto vende ao motorista. O retorno responde
   pelos dois investimentos somados.
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
    semCaso('Este caso não tem eletroposto, então não há operação híbrida. ' +
            'Marque o eletroposto no montador e gere o link de novo.');
    return;
  }

  var u = c.usina, t = c.cascata, e = c.ep;
  var mCusto = e.mensalCusto;                 // energia a preço de custo
  var mAss = e.mensalAssinante;               // o mesmo mês, se fossem donos diferentes
  var vUsina = c.viab, vEp = e.viabIsolado, vUni = e.viabUnificada;

  function põe(chave, texto) {
    var els = document.querySelectorAll('[data-f="' + chave + '"]');
    for (var i = 0; i < els.length; i++) els[i].textContent = texto;
  }
  function ou(v, f) {
    return (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) ? traco : f(v);
  }

  document.title = c.nome + ' · Operação híbrida · B2W Invest';

  /* -------------------------------------------------------------- topo --- */
  põe('chipModalidade', [c.enquadramento, c.modalidade].filter(Boolean).join(' · ') +
    ' + carga local');
  põe('chipPrecoUsina', F.brl4.format(e.precoCusto) + '/kWh');
  põe('chipPrecoVenda', F.brl.format(e.preco) + '/kWh');

  /* ------------------------------------------------- cartão da usina ----- */
  põe('usinaIrradiancia', c.data.irradiancia
    ? 'Irradiância: ' + F.nf1.format(Number(c.data.irradiancia)) + ' kWh/m²/dia'
    : ou(u.porKwpAno, function (x) {
        return 'Produtividade: ' + F.nf.format(Math.round(x)) + ' kWh/kWp ao ano';
      }));
  põe('usinaKwp', ou(u.kwp, function (x) { return F.nf1.format(x); }));
  põe('usinaCA', ou(u.kwCA, function (x) { return F.nf1.format(x) + ' kW CA homologado'; }));
  põe('usinaMes', ou(u.medGer, function (x) { return F.nf.format(Math.round(x)); }));
  põe('usinaAno', F.nf.format(Math.round(u.anual)) + ' kWh / ano');
  põe('usinaModulos', (u.modulos ? F.nf.format(u.modulos) + ' módulos' : 'Módulos') +
    (u.moduloTec ? ' ' + u.moduloTec : '') + (u.ganhoBifacial ? ' bifaciais' : ''));

  /* -------------------------------------------- cartão do eletroposto ---- */
  põe('epNome', e.modelo || ('Eletroposto DC ' + F.nf.format(e.kwEfetivo) + 'kW'));
  põe('epPistolas', e.pistolas + ' pistolas simultâneas');
  põe('epMes', F.nf.format(Math.round(e.comprados)));
  põe('epRecargas', F.nf.format(e.sessoes * e.pistolas) + ' recargas / dia');
  põe('epPreco', F.brl.format(e.preco));

  /* ------------------------------------------- banner de sinergia -------- */
  var receitaUniMes = mCusto.receita + Math.max(0, u.medGer - e.comprados) * (t.liquida || 0);
  var resultadoUniMes = (typeof e.resultadoUnificadoMes === 'number')
    ? e.resultadoUnificadoMes : mCusto.resultado;
  var ganhoVsIsolado = mCusto.resultado - mAss.resultado;

  põe('sinergiaReceita', F.brl.format(receitaUniMes).replace(/,\d\d$/, ''));
  põe('sinergiaGanho', mAss.resultado
    ? '+' + F.nf1.format(ganhoVsIsolado / Math.abs(mAss.resultado) * 100) + '% vs. isolados'
    : traco);
  põe('sinergiaResultado', F.brl.format(resultadoUniMes).replace(/,\d\d$/, ''));
  põe('sinergiaMargem', receitaUniMes
    ? 'Margem ' + F.nf1.format(resultadoUniMes / receitaUniMes * 100) + '% líq.' : traco);
  põe('sinergiaMargemKwh', e.vendidos
    ? F.brl4.format(e.preco - e.precoCusto / (e.eta || 1)) : traco);
  põe('sinergiaYield', e.capexUnificado
    ? F.pctMes(resultadoUniMes / e.capexUnificado * 100) : traco);

  /* ------------------------------------------ balanço energético --------- */
  var consumoAno = e.comprados * 12;
  põe('balKwp', ou(u.kwp, function (x) { return F.nf1.format(x) + ' kWp'; }));
  põe('balGeracao', F.nf.format(Math.round(u.anual)));
  põe('balConsumo', F.nf.format(Math.round(consumoAno)));
  põe('balSessoes', F.nf.format(e.sessoes * e.pistolas) + ' sessões diárias');
  põe('balAutossuficiencia', consumoAno
    ? F.nf1.format(u.anual / consumoAno * 100) + '% AUTOSSUFICIENTE' : traco);
  põe('balSaldo', (u.anual - consumoAno >= 0 ? '+' : '') +
    F.nf.format(Math.round(u.anual - consumoAno)));

  /* ---- as 12 colunas: geração ao lado do consumo ---- */
  (function balanco() {
    var box = document.getElementById('balancoMeses');
    if (!box) return;
    var vals = u.serieGer;
    var comDado = vals.filter(function (x) { return x !== null; });
    if (!comDado.length) return;
    var teto = Math.max(Math.max.apply(null, comDado), e.comprados) * 1.08;

    box.innerHTML = vals.map(function (v, i) {
      var ger = v === null ? 0 : v;
      var hG = (ger / teto * 100).toFixed(1);
      var hC = (e.comprados / teto * 100).toFixed(1);
      var saldo = ger - e.comprados;
      var hS = (Math.abs(saldo) / teto * 100).toFixed(1);
      // Mês em que a usina não cobre o eletroposto: o excedente sai em tarifa
      // cheia, e a barra do saldo muda de cor para dizer isso.
      var corSaldo = saldo >= 0 ? 'bg-secondary' : 'bg-status-provisional';
      return '<div class="flex-1 flex flex-col items-center gap-1.5 group">' +
        '<div class="w-full flex items-end justify-center gap-1 h-56 relative pb-1">' +
        '<div class="w-3.5 bg-tertiary rounded-t relative flex flex-col justify-start items-center ' +
        'transition-all group-hover:brightness-125 shadow-sm" style="height: ' + hG +
        '%;" title="Solar: ' + F.nf.format(Math.round(ger)) + ' kWh">' +
        '<span class="font-label-mono text-[9px] text-ink-primary font-bold -top-4 absolute whitespace-nowrap">' +
        (ger / 1000).toFixed(1).replace('.', ',') + 'k</span></div>' +
        '<div class="w-3.5 bg-navy-accent rounded-t relative flex flex-col justify-start items-center ' +
        'opacity-90 transition-all group-hover:brightness-125" style="height: ' + hC +
        '%;" title="Eletroposto: ' + F.nf.format(Math.round(e.comprados)) + ' kWh"></div>' +
        '<div class="w-1 ' + corSaldo + ' rounded-t" style="height: ' + hS +
        '%;" title="Saldo: ' + (saldo >= 0 ? '+' : '') + F.nf.format(Math.round(saldo)) + ' kWh"></div>' +
        '</div><div class="flex flex-col items-center">' +
        '<span class="font-label-mono text-[11px] text-ink-primary font-semibold">' +
        String(u.rotulos[i]).toUpperCase() + '</span>' +
        '<span class="font-label-mono text-[9px] text-tertiary">' + F.nf.format(Math.round(ger)) + '</span>' +
        '<span class="font-label-mono text-[9px] text-ink-muted">' +
        F.nf.format(Math.round(e.comprados)) + '</span></div></div>';
    }).join('');
  })();

  /* ------------------- gráfico financeiro mensal (SVG 1200x210) ---------- */
  (function financeiro() {
    var g = document.getElementById('grafFinanceiro');
    if (!g) return;
    var W = 1200, H = 210, ML = 70, MR = 20, MT = 24, MB = 34;
    var n = u.serieGer.length || 12;
    var passo = (W - ML - MR) / n;
    var receitaEp = mCusto.receita;
    var recUsina = u.serieRec.map(function (r) { return r === null ? 0 : r; });
    var teto = Math.max(receitaEp, Math.max.apply(null, recUsina.concat([1]))) * 1.15;
    var y = function (v) { return H - MB - (v / teto) * (H - MT - MB); };

    var out = '';
    [0.25, 0.5, 0.75, 1].forEach(function (k) {
      var yy = y(teto * k);
      out += '<line x1="' + ML + '" y1="' + yy.toFixed(1) + '" x2="' + (W - MR) + '" y2="' + yy.toFixed(1) +
        '" stroke="#1C2248" stroke-dasharray="4,4"></line>' +
        '<text x="' + (ML - 10) + '" y="' + (yy + 4).toFixed(1) + '" fill="#5F6480" ' +
        'font-family="JetBrains Mono" font-size="10" text-anchor="end">R$ ' +
        F.nf.format(Math.round(teto * k / 1000)) + 'k</text>';
    });
    out += '<line x1="' + ML + '" y1="' + (H - MB) + '" x2="' + (W - MR) + '" y2="' + (H - MB) +
      '" stroke="#282D4A"></line>';

    // Barra: receita das recargas, constante todo mês.
    for (var i = 0; i < n; i++) {
      var cx = ML + i * passo + passo / 2;
      var yb = y(receitaEp);
      out += '<rect x="' + (cx - 14).toFixed(1) + '" y="' + yb.toFixed(1) + '" width="28" height="' +
        (H - MB - yb).toFixed(1) + '" rx="3" fill="#F26B00" opacity="0.85"></rect>';
      out += '<text x="' + cx.toFixed(1) + '" y="' + (yb - 6).toFixed(1) + '" fill="#FF9B52" ' +
        'font-family="JetBrains Mono" font-size="9" text-anchor="middle">R$ ' +
        (receitaEp / 1000).toFixed(1).replace('.', ',') + 'k</text>';
      out += '<text x="' + cx.toFixed(1) + '" y="' + (H - 12) + '" fill="#B8BCCE" ' +
        'font-family="JetBrains Mono" font-size="10" text-anchor="middle">' +
        String(u.rotulos[i] || '').toUpperCase() + '</text>';
    }
    // Linha: o que a usina rende vendendo o excedente a assinantes.
    var pts = recUsina.map(function (v, i) {
      return [ML + i * passo + passo / 2, y(v)];
    });
    if (pts.length > 1) {
      out += '<path d="' + pts.map(function (p2, i) {
        return (i ? 'L' : 'M') + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
      }).join(' ') + '" fill="none" stroke="#00FFFF" stroke-width="2.5" ' +
        'stroke-linecap="round" stroke-linejoin="round"></path>';
      pts.forEach(function (p2) {
        out += '<circle cx="' + p2[0].toFixed(1) + '" cy="' + p2[1].toFixed(1) +
          '" r="3" fill="#00FFFF"></circle>';
      });
    }
    g.innerHTML = out;
  })();

  /* -------------------------------------------- os três cenários --------- */
  function cenario(pref, capex, ind) {
    põe(pref + 'CapexChip', capex ? F.nf.format(Math.round(capex / 1000)) + 'k CAPEX' : traco);
    põe(pref + 'Capex', ou(capex, function (x) { return F.brl.format(x).replace(/,\d\d$/, ''); }));
    if (!ind) {
      [pref + 'Retorno', pref + 'Roi', pref + 'Tir', pref + 'Payback', pref + 'PaybackDesc']
        .forEach(function (k) { põe(k, traco); });
      return;
    }
    põe(pref + 'Retorno', F.brl.format(ind.total).replace(/,\d\d$/, ''));
    põe(pref + 'Roi', ind.roi === null ? traco : 'ROI ' + F.pct1(ind.roi * 100));
    põe(pref + 'Tir', isNaN(ind.tir) ? traco : F.pct1(ind.tir * 100));
    põe(pref + 'Payback', ind.payback === null ? traco : F.nf1.format(ind.payback));
    põe(pref + 'PaybackDesc', ind.paybackDesc === null
      ? 'Desc: não atingido' : 'Desc: ' + F.nf1.format(ind.paybackDesc) + ' anos');
  }
  cenario('cenUsina', u.investido, vUsina);
  cenario('cenEp', e.capex, vEp);
  cenario('cenHib', e.capexUnificado, vUni);

  /* --------------------------- enquadramento ---------------------------- */
  /* O mockup fala GD1 em cinco lugares. O caso pode ser GD2, e aí a usina paga
     Fio B — o oposto do que o texto afirma. */
  var enq = c.enquadramento || 'GD';
  põe('chipGeracaoGD', 'GERAÇÃO DEDICADA ' + enq);
  põe('chipCiclo', 'Ciclo horário: 24/7 com compensação ' + enq);
  põe('chipNorma', 'Norma ANEEL ' + enq);
  // O mockup trazia um "CCEE ID" inventado, com GD1 colado no fim. No lugar,
  // o que identifica o ativo de verdade: onde fica e sob que enquadramento.
  põe('chipRegistro', [c.local, c.concessionaria, enq].filter(Boolean).join(' · '));
  põe('chipAutossuficiente', consumoAno
    ? F.nf1.format(u.anual / consumoAno * 100) + '% autossuficiente' : '—');
  põe('cenUsinaTexto', 'Geração fotovoltaica dedicada de ' +
    ou(u.kwp, function (x) { return F.nf1.format(x) + ' kWp'; }) +
    ' comercializando créditos ' + enq + ' sem hub de carga local.');

  /* --------------------------- rodada de cotas --------------------------- */
  /* Cota = (investimento na usina + no eletroposto) ÷ número de cotas, e a
     projeção mensal segue a mesma divisão do resultado da operação unificada.
     O mockup trazia R$ 50.000 e 1,98% fixos, que não vinham de conta nenhuma. */
  var nCotas = Number(c.data.cotas) > 0 ? Number(c.data.cotas) : 10;
  var capexTotal = e.capexUnificado || 0;
  var valorCota = capexTotal ? capexTotal / nCotas : null;
  var rendaCota = resultadoUniMes / nCotas;
  var yieldUni = capexTotal ? resultadoUniMes / capexTotal * 100 : null;

  põe('cotasDisponiveis', nCotas + (nCotas === 1 ? ' COTA DISPONÍVEL' : ' COTAS DISPONÍVEIS'));
  põe('valorCota', ou(valorCota, function (x) { return F.brl.format(x); }));
  põe('projecaoCota', valorCota
    ? 'Projeção de ' + F.brl.format(rendaCota) + '/mês por cota'
    : traco);
  põe('yieldCota', yieldUni !== null ? F.pctMes(yieldUni) + ' a.m.' : traco);
  põe('amortizacaoCota', (vUni && vUni.payback !== null)
    ? Math.round(vUni.payback * 12) + ' meses' : traco);
  põe('rodadaTexto', 'Participações limitadas, com rendimento estimado de ' +
    (yieldUni !== null ? F.pctMes(yieldUni) + ' ao mês' : '—') +
    ' sobre ' + F.brl.format(capexTotal) + ' investidos nos dois ativos, divididos em ' +
    nCotas + (nCotas === 1 ? ' cota.' : ' cotas.'));

  /* ------------------- curvas comparativas de amortização ---------------- */
  (function amortizacao() {
    if (!vUni) return;
    var series = [
      { s: vUsina ? vUsina.acumulado : null, cor: '#F26B00', rot: 'Usina isolada' },
      { s: vEp ? vEp.acumulado : null, cor: '#6481BF', rot: 'Eletroposto isolado' },
      { s: vUni.acumulado, cor: '#00FFFF', rot: 'Operação unificada' }
    ].filter(function (x) { return x.s; });
    if (!series.length) return;

    var todos = [];
    series.forEach(function (x) { todos = todos.concat(x.s); });
    todos.push(-(e.capexUnificado || 0));
    var lo = Math.min.apply(null, todos), hi = Math.max.apply(null, todos);
    var amp = (hi - lo) || 1;

    ['amortHib1', 'amortHib2'].forEach(function (id) {
      var g = document.getElementById(id);
      if (!g) return;
      var W = 1000, H = 240, ML = 70, MR = 20, MT = 20, MB = 30;
      var n = series[0].s.length;
      var x = function (i) { return ML + (i / Math.max(1, n - 1)) * (W - ML - MR); };
      var y = function (v) { return H - MB - ((v - lo) / amp) * (H - MT - MB); };
      var out = '';
      [0, 0.25, 0.5, 0.75, 1].forEach(function (k) {
        var val = lo + amp * k, yy = y(val);
        out += '<line x1="' + ML + '" y1="' + yy.toFixed(1) + '" x2="' + (W - MR) + '" y2="' +
          yy.toFixed(1) + '" stroke="#1C2248" stroke-dasharray="4,4"></line>' +
          '<text x="' + (ML - 10) + '" y="' + (yy + 4).toFixed(1) + '" fill="#5F6480" ' +
          'font-family="JetBrains Mono" font-size="10" text-anchor="end">' +
          (val < 0 ? '-' : '') + 'R$ ' + F.nf.format(Math.abs(Math.round(val / 1000))) + 'k</text>';
      });
      out += '<line x1="' + ML + '" y1="' + y(0).toFixed(1) + '" x2="' + (W - MR) + '" y2="' +
        y(0).toFixed(1) + '" stroke="#5F6480" stroke-dasharray="5,5"></line>';
      series.forEach(function (serie) {
        var d = serie.s.map(function (v, i) {
          return (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1);
        }).join(' ');
        out += '<path d="' + d + '" fill="none" stroke="' + serie.cor + '" stroke-width="2.5" ' +
          'stroke-linecap="round" stroke-linejoin="round"></path>';
        serie.s.forEach(function (v, i) {
          out += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) +
            '" r="2.5" fill="' + serie.cor + '"></circle>';
        });
      });
      if (c.proj) {
        c.proj.forEach(function (pAno, i) {
          if (i % 2) return;
          out += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 10) + '" fill="#B8BCCE" ' +
            'font-family="JetBrains Mono" font-size="10" text-anchor="middle">' + pAno.ano + '</text>';
        });
      }
      g.innerHTML = out;
    });
  })();

  /* nomes do caso fictício, imagens mortas e a barra das três páginas —
     os três estão no motor, iguais para as três páginas. */
  B2W.trocarNomes(c);
  B2W.esconderImagensQuebradas();
  /* "Simular Cenário Integrado" leva à comparação dos três cenários, que é a
     simulação que a página tem. */
  var simular = document.getElementById('btnSimularHib');
  var cenarios = document.querySelector('[data-f="cenHibCapex"]');
  if (simular && cenarios) {
    simular.addEventListener('click', function () {
      (cenarios.closest('section') || cenarios).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  B2W.navegar(c, 'hibrida');
})();
