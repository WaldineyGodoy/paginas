/* =============================================================================
   ligar-usina.js — põe os dados do caso dentro do mockup da usina.

   A página é o arquivo do Stitch, intacto. Este script só escreve nela:
     * cada <span data-f="chave"> recebe o valor do caso;
     * os blocos repetidos (12 barras, 12 linhas, cascata, radar) são
       redesenhados com a MESMA marcação do mockup, agora a partir dos dados;
     * a foto aérea do hero vira o satélite das coordenadas do caso.

   Valor que o caso não traz vira travessão. Nunca zero: zero afirmaria uma
   medição que não existe.
   ========================================================================== */
(function () {
  'use strict';

  var c = B2W.ler();
  var F = B2W.fmt;

  /* Sem caso no link a página não pode continuar mostrando os números do
     mockup como se fossem de alguém. */
  if (!c) {
    document.body.innerHTML =
      '<div style="min-height:100vh;display:grid;place-items:center;text-align:center;' +
      'font-family:Inter,system-ui,sans-serif;color:#B8BCCE;background:#0f1226;padding:32px">' +
      '<div><h1 style="font-family:Manrope,sans-serif;color:#F8F9FB;font-size:1.6rem;margin:0 0 12px">' +
      'Link inválido</h1><p>Este endereço não carrega os dados de nenhuma usina. ' +
      'Peça um novo link a quem enviou o original.</p></div></div>';
    return;
  }

  var u = c.usina, t = c.cascata, v = c.viab;

  /* ---------- escrita nos campos marcados ---------- */
  function põe(chave, texto) {
    var els = document.querySelectorAll('[data-f="' + chave + '"]');
    for (var i = 0; i < els.length; i++) els[i].textContent = texto;
  }
  var traco = '—';
  function ou(valor, formata) {
    return (valor === null || valor === undefined || (typeof valor === 'number' && isNaN(valor)))
      ? traco : formata(valor);
  }

  /* ====================================================== HERO ============ */
  /* O mockup escreve "Usina Solar Fotovoltaica" + nome. Quando o nome do caso
     ja' comeca com "Usina", o hero saía "Usina Solar Fotovoltaica Usina
     Demonstração". Nesse caso o prefixo some. */
  var prefixo = /^usina/i.test(c.nome) ? '' : 'Usina Solar Fotovoltaica';
  põe('tituloPrefixo', prefixo);
  põe('nome', c.nome);
  document.title = c.nome + ' · B2W Invest';

  // Sem código de registro inventado: o que identifica o ativo aqui é onde ele
  // fica e de que tamanho é.
  põe('codigo', [c.local, ou(u.kwp, function (x) { return F.nf1.format(x) + ' kWp'; })]
    .filter(Boolean).join(' · '));

  põe('localLinha', [c.local,
    c.concessionaria ? 'Conexão ' + c.concessionaria : null,
    c.enquadramento ? 'Marco legal ' + c.enquadramento : null].filter(Boolean).join(' · '));

  põe('badgeCA', ou(u.kwCA, function (x) { return F.nf1.format(x) + ' kW CA'; }));
  põe('badgeKwp', ou(u.kwp, function (x) { return F.nf1.format(x) + ' kWp instalados'; }));
  põe('badgeOverload', ou(u.fdiEfetivo, function (x) {
    return 'Overload CC/CA ' + F.nf1.format(x) + 'x';
  }));

  põe('coordenadas', (c.lat !== null && c.lng !== null)
    ? F.grauDMS(c.lat, 'N', 'S') + ' ' + F.grauDMS(c.lng, 'L', 'O') : traco);

  // O slug não traz irradiância em todos os casos; a produtividade específica
  // sai da própria geração e diz a mesma coisa: quanto o sol dali entrega.
  põe('irradiacao', c.data.irradiancia
    ? 'Irradiação solar global: ' + F.nf1.format(Number(c.data.irradiancia)) + ' kWh/m²/dia'
    : ou(u.porKwpAno, function (x) {
        return 'Produtividade: ' + F.nf.format(Math.round(x)) + ' kWh por kWp ao ano';
      }));

  var enqTxt = c.enquadramento
    ? (c.ehGD1 ? 'GD1 · ISENTA DE FIO B' : 'GD2 · LEI 14.300 COM FIO B PROGRESSIVO')
    : 'ENQUADRAMENTO NÃO INFORMADO';
  põe('chipEnquadramento', ' ' + enqTxt);
  põe('botaoEnquadramento', c.enquadramento
    ? c.enquadramento + ' · ' + (c.ehGD1 ? 'isenta de Fio B' : 'Lei 14.300 (Fio B)')
    : 'Enquadramento não informado');

  põe('receitaAno', ou(u.receitaAno, function (x) { return F.brl.format(x); }));
  põe('receitaMes', ou(u.medRec, function (x) { return F.brl.format(x) + ' méd./mês'; }));
  põe('geracaoAno', u.anual ? F.nf.format(Math.round(u.anual)) : traco);
  põe('geracaoMedia', ou(u.medGer, function (x) {
    return 'Média mensal: ' + F.nf.format(Math.round(x)) + ' kWh em ' + u.meses.length + ' meses projetados';
  }));
  põe('yieldMes', ou(u.medRen, function (x) { return F.pctMes(x); }));
  põe('yieldNota', ou(u.medRec, function (x) {
    return 'Receita líquida de ' + F.brl.format(x) + '/mês';
  }));

  /* ================================================== HARDWARE =========== */
  põe('moduloNome', u.moduloModelo || (u.wModulo ? 'Módulo de ' + F.nf.format(u.wModulo) + ' W' : traco));
  põe('moduloChip', [u.wModulo ? F.nf.format(u.wModulo) + 'W' : null, u.moduloTec].filter(Boolean).join(' · ') || traco);
  põe('moduloQtd', ou(u.modulos, function (x) { return F.nf.format(x) + ' unidades'; }));
  põe('moduloEfic', u.moduloTec || traco);
  põe('moduloBifacial', ou(u.ganhoBifacial, function (x) { return '+' + F.nf1.format(x) + '% adicional'; }));
  põe('moduloGarantia', ou(u.albedo, function (x) { return 'Albedo do solo: ' + F.nf1.format(x * 100) + '%'; }));
  põe('moduloTag', ou(u.kwp, function (x) { return F.nf1.format(x) + ' kWp NO ARRANJO'; }));

  põe('inversorNome', u.inversorModelo || (u.kwCA ? 'Inversor de ' + F.nf1.format(u.kwCA) + ' kW' : traco));
  põe('inversorCC', ou(u.kwp, function (x) { return F.nf.format(Math.round(x * 1000)) + ' Wp'; }));
  põe('inversorMppt', ou(u.qtdInv, function (x) { return F.nf.format(x) + (x === 1 ? ' unidade' : ' unidades'); }));
  põe('inversorEfic', ou(u.clipagem, function (x) { return F.nf1.format(x) + '%'; }));
  põe('inversorIp', ou(u.kwCA, function (x) { return F.nf1.format(x) + ' kW CA'; }));
  põe('inversorFdi', ou(u.fdiEfetivo, function (x) { return 'FDI ' + F.nf1.format(x) + 'x'; }));

  /* ---------- curva do dia ---------- */
  var picoCC = u.kwp ? u.kwp * 0.82 : null;   // meio-dia limpo, não STC
  põe('curvaLegDC', ou(u.kwp, function (x) { return 'Geração CC (' + F.nf1.format(x) + ' kWp)'; }));
  põe('curvaLegCA', ou(u.kwCA, function (x) { return 'Teto do inversor (' + F.nf1.format(x) + ' kW CA)'; }));
  põe('curvaLegClip', ou(u.clipagem, function (x) { return 'Perda por clipagem (' + F.nf1.format(x) + '%)'; }));
  põe('curvaLegOver', ou(u.ganhoBifacial, function (x) { return 'Ganho bifacial (+' + F.nf1.format(x) + '%)'; }));
  põe('curvaEixoTopo', ou(u.kwp, function (x) { return F.nf1.format(x) + ' kWp'; }));
  põe('curvaEixoCA', ou(u.kwCA, function (x) { return F.nf1.format(x) + ' kW CA'; }));
  põe('curvaEixo50', ou(u.kwp, function (x) { return F.nf.format(Math.round(x * 0.5)) + ' kW'; }));
  põe('curvaEixo25', ou(u.kwp, function (x) { return F.nf.format(Math.round(x * 0.25)) + ' kW'; }));
  põe('curvaPico', ou(picoCC, function (x) { return 'PICO CC: ' + F.nf1.format(x) + ' kW'; }));
  põe('curvaClipTag', ou(u.clipagem, function (x) { return F.nf1.format(x) + ' % (energia cortada)'; }));
  põe('curvaRatio', ou(u.fdiEfetivo, function (x) { return F.nf1.format(x) + ' : 1'; }));
  põe('curvaRatioNota', (u.kwp && u.kwCA)
    ? F.nf1.format(u.kwp) + ' kWp CC para ' + F.nf1.format(u.kwCA) + ' kW CA' : traco);
  põe('curvaGanho', ou(u.ganhoBifacial, function (x) { return '+' + F.nf1.format(x) + '%'; }));
  põe('curvaClip', ou(u.clipagem, function (x) { return F.nf1.format(x) + '%'; }));

  /* ================================================ GRÁFICO 12 MESES ===== */
  var CW = 1140, BASE = 335, TOPO = 55;
  var X0 = 88, PASSO = 85, LARG = 34;
  var cx = function (i) { return X0 + i * PASSO + LARG / 2; };

  function svgTxt(x, y, txt, cor, tam, peso, anc) {
    return '<text fill="' + cor + '" font-family="JetBrains Mono" font-size="' + tam +
      '" font-weight="' + (peso || 600) + '" text-anchor="' + (anc || 'middle') +
      '" x="' + x + '" y="' + y + '" filter="url(#glow)">' + txt + '</text>';
  }

  (function grafico() {
    var g = document.getElementById('graf12');
    if (!g) return;
    var vals = u.serieGer, recs = u.serieRec, rens = u.serieRen;
    var comDado = vals.filter(function (x) { return x !== null; });
    if (!comDado.length) { g.innerHTML = svgTxt(CW / 2, 200, 'Geração mensal não informada', '#5F6480', 14, 500); return; }

    var maxGer = Math.max.apply(null, comDado);
    var topoEscala = Math.ceil(maxGer / 5000) * 5000 || maxGer;
    var yGer = function (val) { return BASE - (val / topoEscala) * (BASE - TOPO); };

    var out = '';
    // Grade e escala em kWh, com a marca de reais à direita.
    for (var k = 4; k >= 1; k--) {
      var val = topoEscala * k / 4, yy = BASE - (BASE - TOPO) * k / 4;
      out += '<line stroke="#1C2248" stroke-dasharray="4,4" x1="65" x2="1100" y1="' + yy + '" y2="' + yy + '"></line>';
      out += '<text fill="#5F6480" font-family="JetBrains Mono" font-size="11" text-anchor="end" x="52" y="' +
        (yy + 4) + '">' + F.nf.format(Math.round(val / 1000)) + 'k kWh</text>';
    }
    out += '<line stroke="#282D4A" stroke-width="1.5" x1="65" x2="1100" y1="' + BASE + '" y2="' + BASE + '"></line>';

    // Barras de geração, com o valor por cima.
    vals.forEach(function (val, i) {
      if (val === null) return;
      var y = yGer(val);
      out += '<rect fill="url(#barGrad)" height="' + (BASE - y).toFixed(1) + '" rx="4" width="' + LARG +
        '" x="' + (X0 + i * PASSO) + '" y="' + y.toFixed(1) + '"></rect>';
      out += svgTxt(cx(i), (y - 7).toFixed(1), F.nf.format(Math.round(val)), '#00FFFF', 10);
    });

    // Curva da receita, na faixa de cima, e a da rentabilidade, na de baixo.
    function faixa(serie, yIni, yFim) {
      var f = serie.filter(function (x) { return x !== null; });
      if (!f.length) return null;
      var lo = Math.min.apply(null, f), hi = Math.max.apply(null, f), amp = (hi - lo) || 1;
      return function (val) { return yFim - ((val - lo) / amp) * (yFim - yIni); };
    }
    var yRec = faixa(recs, 45, 150);
    var yRen = faixa(rens, 228, 300);

    function curva(serie, yFn, cor, grad, tracejado) {
      if (!yFn) return '';
      var pts = [];
      serie.forEach(function (val, i) { if (val !== null) pts.push([cx(i), yFn(val)]); });
      if (pts.length < 2) return '';
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ',' + p[1].toFixed(1); }).join(' ');
      return '<path d="' + d + '" fill="none" stroke="url(#' + grad + ')" stroke-linecap="round" ' +
        'stroke-linejoin="round" stroke-width="' + (tracejado ? '2.5" stroke-dasharray="3,3' : '3.5') + '"></path>';
    }
    out += curva(recs, yRec, '#F26B00', 'lineGrad', false);
    out += curva(rens, yRen, '#6FE9F0', 'yieldGrad', true);

    // Pontos e rótulos das duas curvas.
    var iPico = vals.indexOf(maxGer);
    recs.forEach(function (val, i) {
      if (val === null || !yRec) return;
      var y = yRec(val), ehPico = i === iPico;
      out += '<circle cx="' + cx(i) + '" cy="' + y.toFixed(1) + '" fill="#F26B00" r="' +
        (ehPico ? 6 : 4) + '" stroke="' + (ehPico ? '#FFFFFF' : '#050505') + '" stroke-width="' +
        (ehPico ? 2.5 : 2) + '"></circle>';
      out += svgTxt(cx(i), (y - (ehPico ? 11 : 10)).toFixed(1),
        F.brl.format(val).replace(/,\d\d$/, ''), ehPico ? '#FFFFFF' : '#FF9B52', 10, ehPico ? 700 : 600);
    });
    rens.forEach(function (val, i) {
      if (val === null || !yRen) return;
      var y = yRen(val);
      out += '<circle cx="' + cx(i) + '" cy="' + y.toFixed(1) + '" fill="#6FE9F0" r="3.5" stroke="#0E1230" stroke-width="1.5"></circle>';
      out += svgTxt(cx(i), (y - 10).toFixed(1), F.pctMes(val), '#6FE9F0', 9.5);
    });

    // Eixo dos meses.
    u.rotulos.forEach(function (m, i) {
      out += '<text fill="#B8BCCE" font-family="JetBrains Mono" font-size="12" font-weight="600" ' +
        'text-anchor="middle" x="' + cx(i) + '" y="362">' + String(m).toUpperCase() + '</text>';
    });

    // Pastilha do mês de pico, sobre a barra mais alta.
    if (iPico >= 0) {
      var xb = Math.min(Math.max(cx(iPico) - 54, 65), 1100 - 108);
      out += '<rect fill="#1C2248" height="24" rx="5" stroke="#F26B00" stroke-width="1" width="108" x="' + xb + '" y="8"></rect>';
      out += '<text fill="#FF9B52" font-family="JetBrains Mono" font-size="10" font-weight="700" ' +
        'text-anchor="middle" x="' + (xb + 54) + '" y="24">PICO: ' + String(u.rotulos[iPico]).toUpperCase() + '</text>';
    }
    g.innerHTML = out;

    // Faixa de destaques acima do gráfico.
    var iVale = vals.indexOf(Math.min.apply(null, comDado));
    põe('picoValor', F.nf.format(Math.round(maxGer)) + ' kWh');
    põe('picoReceita', recs[iPico] !== null && recs[iPico] !== undefined
      ? 'Receita: ' + F.brl.format(recs[iPico]) : traco);
    põe('valeValor', F.nf.format(Math.round(vals[iVale])) + ' kWh');
    põe('valeReceita', recs[iVale] !== null && recs[iVale] !== undefined
      ? 'Receita: ' + F.brl.format(recs[iVale]) : traco);
    põe('disponibilidade', u.meses.length + ' meses projetados');
  })();

  põe('tarifaLiquida', ou(t.liquida, function (x) { return F.brl4.format(x); }));
  põe('tarifaCheia', ou(t.tarifa, function (x) { return F.brl4.format(x); }));
  põe('rotuloTarifaLiq', 'Tarifa líquida' + (c.enquadramento ? ' ' + c.enquadramento : ''));
  põe('rotuloYield', 'Média dos meses projetados');
  põe('baseTarifaria', (c.concessionaria && t.tarifa !== null)
    ? 'Tarifa base ' + c.concessionaria + ': ' + F.brl4.format(t.tarifa) + ' / kWh' : traco);
  põe('chipGraf', [c.enquadramento, c.modalidade].filter(Boolean).join(' · ') || traco);

  /* ------------------------------- tabela dos 12 meses ------------------- */
  (function tabela() {
    var tb = document.getElementById('tab12');
    if (!tb) return;
    var td = 'class="py-space-3 px-space-4"';
    var linhas = u.meses.map(function (m, i) {
      var g = u.serieGer[i], r = u.serieRec[i], p = u.serieRen[i];
      return '<tr class="hover:bg-surface-raised transition-colors">' +
        '<td class="py-space-3 px-space-4 font-semibold text-ink-primary">' + m.m + '</td>' +
        '<td class="py-space-3 px-space-4 text-tertiary">' + (g === null ? traco : F.nf.format(Math.round(g)) + ' kWh') + '</td>' +
        '<td ' + td + '>' + ou(t.tarifa, function (x) { return F.brl4.format(x); }) + '</td>' +
        '<td class="py-space-3 px-space-4 text-ink-primary">' + ou(t.liquida, function (x) { return F.brl4.format(x); }) + '</td>' +
        '<td class="py-space-3 px-space-4 text-right font-bold text-secondary">' + (r === null ? traco : F.brl.format(r)) + '</td>' +
        '<td class="py-space-3 px-space-4 text-right text-status-verified">' + (p === null ? traco : F.pctMes(p)) + '</td></tr>';
    }).join('');
    linhas += '<tr class="bg-surface-container-high/40 font-bold text-ink-primary">' +
      '<td class="py-space-3 px-space-4">Total / média no ano</td>' +
      '<td class="py-space-3 px-space-4 text-tertiary">' + F.nf.format(Math.round(u.anual)) + ' kWh</td>' +
      '<td ' + td + '>' + ou(t.tarifa, function (x) { return F.brl4.format(x); }) + '</td>' +
      '<td ' + td + '>' + ou(t.liquida, function (x) { return F.brl4.format(x); }) + '</td>' +
      '<td class="py-space-3 px-space-4 text-right text-secondary">' + ou(u.receitaAno, function (x) { return F.brl.format(x); }) + '</td>' +
      '<td class="py-space-3 px-space-4 text-right text-status-verified">' + ou(u.medRen, function (x) { return F.pctMes(x) + ' a.m.'; }) + '</td></tr>';
    tb.innerHTML = linhas;
  })();

  /* ==================================================== CASCATA ========== */
  (function cascata() {
    var box = document.getElementById('cascataItens');
    if (!box || t.tarifa === null) return;

    var itens = [
      { n: 1, rot: 'Tarifa cheia da concessionária' + (c.concessionaria ? ' (' + c.concessionaria + ')' : ''),
        v: t.tarifa, sinal: '', cor: 'tertiary', destaque: true },
      { n: 2, rot: 'Desconto garantido ao assinante', v: t.descR, sinal: '- ', cor: 'secondary' }
    ];
    if (!c.ehGD1) itens.push({ n: itens.length + 1, rot: 'Fio B / TUSD (Lei 14.300)', v: t.fioB, sinal: '- ', cor: 'primary-container' });
    if (c.ehCompartilhada && t.tributos !== null) {
      itens.push({ n: itens.length + 1, rot: 'ICMS, PIS e COFINS', v: t.tributos, sinal: '- ', cor: 'navy-accent' });
    }
    itens.push({ n: itens.length + 1, rot: 'Gestão, billing e O&M B2W', v: t.gestR, sinal: '- ', cor: 'chart-discount' });
    itens.push({ n: itens.length + 1, rot: 'Tarifa líquida repassada ao investidor',
                 v: t.liquida, sinal: '+ ', cor: 'status-verified', final: true });

    box.innerHTML = itens.map(function (it) {
      if (it.v === null || it.v === undefined) return '';
      var pctv = t.tarifa ? (it.v / t.tarifa) * 100 : 0;
      var larg = Math.max(0, Math.min(100, pctv));
      var pctTxt = (it.sinal === '- ' ? '-' : it.final ? '+' : '') + F.nf1.format(pctv) + '%';
      var barra = it.final
        ? '<div class="h-full bg-gradient-to-r from-status-verified to-tertiary rounded-full transition-all" style="width: ' + larg.toFixed(2) + '%;"></div>'
        : '<div class="h-full bg-' + it.cor + ' rounded-full transition-all" style="width: ' + larg.toFixed(2) + '%;"></div>';
      return '<div class="flex flex-col gap-1.5">' +
        '<div class="flex justify-between items-baseline font-label-mono text-body-sm">' +
        '<span class="' + (it.destaque || it.final ? 'text-ink-primary font-semibold' : 'text-ink-secondary') +
        ' flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-' + it.cor + '"></span>' +
        it.n + '. ' + it.rot + '</span>' +
        '<span class="text-' + it.cor + ' font-bold">' + it.sinal + F.brl4.format(it.v) +
        ' / kWh <span class="text-ink-muted text-body-sm font-normal">(' + pctTxt + ')</span></span></div>' +
        '<div class="w-full h-3 rounded-full bg-surface-container-high overflow-hidden' +
        (it.sinal === '- ' ? ' flex justify-end' : '') + '">' + barra + '</div></div>';
    }).join('');

    põe('baseCem', t.tarifa !== null ? 'Base 100 kWh = ' + F.brl.format(t.tarifa * 100) : traco);
    põe('aproveitamento', ou(t.aproveitamento, function (x) { return 'Aproveitamento líquido: ' + F.nf1.format(x) + '%'; }));
    põe('tituloAuditoria', 'Auditoria de preço por kWh' + (c.enquadramento ? ' · ' + c.enquadramento : ''));

    // Tabela de componentes, mesma conta em forma de linha.
    var ct = document.getElementById('compTab');
    if (ct) {
      ct.innerHTML = itens.map(function (it) {
        if (it.v === null || it.v === undefined) return '';
        var pctv = t.tarifa ? (it.v / t.tarifa) * 100 : 0;
        return '<tr class="border-b border-border-subtle/40">' +
          '<td class="py-space-3 px-space-4 text-ink-secondary">' + it.rot + '</td>' +
          '<td class="py-space-3 px-space-4 text-right font-label-mono text-ink-primary">' +
          it.sinal + F.brl4.format(it.v) + '</td>' +
          '<td class="py-space-3 px-space-4 text-right font-label-mono text-ink-muted">' +
          F.nf1.format(pctv) + '%</td></tr>';
      }).join('');
    }
  })();

  /* ====================================================== RADAR ========== */
  /* Seis eixos do hexágono do mockup, centro 170,150 e raio 110. Quatro deles
     saem da cascata; os dois últimos são o aproveitamento líquido e a parcela
     que sobra depois dos tributos. Nenhum compara com "o mercado": esse número
     não existe em lugar nenhum que eu possa citar. */
  (function radar() {
    var g = document.getElementById('radarB2W');
    if (!g || t.tarifa === null) return;
    var cxr = 170, cyr = 150, raio = 110;
    var frac = function (x) { return x === null ? 0 : Math.max(0, Math.min(1, x / t.tarifa)); };
    var eixos = [
      frac(t.liquida),
      frac(t.descR),
      c.ehGD1 ? 0 : frac(t.fioB),
      frac(t.gestR),
      t.tributos !== null ? 1 - frac(t.tributos) : 1,
      t.aproveitamento !== null ? t.aproveitamento / 100 : 0
    ];
    var pts = eixos.map(function (f, i) {
      var ang = -Math.PI / 2 + i * (Math.PI / 3);
      var r = 0.15 + f * 0.85;   // nada colapsa no centro
      return [(cxr + Math.cos(ang) * raio * r).toFixed(1), (cyr + Math.sin(ang) * raio * r).toFixed(1)];
    });
    var poly = pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
    var out = '<polygon fill="url(#radarGradB2W)" points="' + poly + '" stroke="#00FFFF" stroke-width="2.5"></polygon>';
    pts.forEach(function (p) {
      out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" fill="#00FFFF" r="3.5"></circle>';
    });
    g.innerHTML = out;
  })();

  /* ============================================ MEMÓRIA DE CÁLCULO ======= */
  põe('memoriaChip', [c.enquadramento, c.modalidade].filter(Boolean).join(' · ') || traco);
  põe('memGeracao', ou(u.medGer, function (x) { return F.nf.format(Math.round(x)) + ' kWh'; }));
  põe('memDivisao', u.anual ? F.nf.format(Math.round(u.anual)) + ' ÷ ' + u.meses.length : traco);
  põe('memRepasse', ou(u.medRec, function (x) { return F.brl.format(x); }));
  põe('memAnual', ou(u.receitaAno, function (x) { return F.brl.format(x); }));
  põe('memData', c.custoMensal > 0
    ? 'Antes de ' + F.brl.format(c.custoMensal) + '/mês de custo' : 'Sem custos mensais no caso');

  /* ================================================= VIABILIDADE ========= */
  põe('investimento', ou(u.investido, function (x) { return F.brl.format(x); }));
  põe('investimentoRodape', ou(u.investido, function (x) { return F.brl.format(x); }));
  põe('investPorKwp', ou(u.porKwp, function (x) { return F.brl.format(x) + ' / kWp'; }));

  if (v) {
    põe('tir', isNaN(v.tir) ? traco : F.pct1(v.tir * 100) + ' a.a.');
    põe('tirNota', ou(u.medRen, function (x) { return F.pctMes(x) + ' a.m. médio'; }));
    põe('payback', F.anos(v.payback, c.horizonte));
    põe('paybackNota', v.payback !== null
      ? Math.round(v.payback * 12) + ' meses completos' : 'não atingido no horizonte');
    põe('paybackDesc', F.anos(v.paybackDesc, c.horizonte));
    põe('paybackDescNota', 'Descontado a ' + F.nf1.format(c.inflacao * 100) + '% a.a.');
    põe('roi', v.roi === null ? traco : F.pct1(v.roi * 100));
    põe('roiNota', F.brl.format(v.total) + ' líquido em ' + c.horizonte + ' anos');
  } else {
    ['tir', 'tirNota', 'payback', 'paybackNota', 'paybackDesc', 'paybackDescNota', 'roi', 'roiNota']
      .forEach(function (k) { põe(k, traco); });
  }

  põe('notaAtlas', c.data.irradiancia
    ? 'Irradiância média do local, da climatologia NASA POWER.'
    : 'Geração projetada pela irradiância do CEP do caso.');

  /* O radar e a memória citavam 15% de desconto fixo. Os dois passam a dizer o
     que o caso traz. */
  põe('radarAtratividade', ou(t.descP, function (x) { return F.nf1.format(x) + '% off'; }));
  põe('memoriaRodape',
    'Cálculo com o desconto comercial garantido ao assinante de ' +
    (t.descP !== null ? F.nf1.format(t.descP) + '%' : '—') +
    (c.ehGD1 ? ', sem Fio B por ser GD1' :
      (t.fioB !== null ? ', a retenção de Fio B de ' + F.brl4.format(t.fioB) + '/kWh' : '')) +
    (t.gestP !== null ? ' e a taxa de gestão de ' + F.nf1.format(t.gestP) + '%' : '') + '.');
  põe('tituloContrato', 'Contrato vinculado com assinantes');

  põe('valorAgregado', c.data.inclusosValor
    ? 'VALOR AGREGADO: ' + F.brl.format(Number(c.data.inclusosValor)) + ' (INCLUSO)'
    : 'ITENS INCLUSOS NO INVESTIMENTO');

  /* ================================================== FOTO DO HERO ====== */
  /* O hero mostra a foto real da usina (usina-hero.jpg). O mapa de satelite
     saiu a pedido: a foto vende melhor que o terreno visto de cima. */

  /* ============================================ CURVA DO DIA ============= */
  /* Geometria do mockup: viewBox 1000x340, faixa util de x=70 a 940, e a
     escala vertical em que 112,5 kWp caía em y=50 e 75 kW em y=120 — ou seja,
     zero em y=260. Mantida, agora alimentada pelo arranjo do caso.

     A curva é um dia de céu limpo idealizado (meio seno das 5h30 às 18h30)
     escalado pelo arranjo. Não prevê um dia específico: mostra onde a potência
     encosta no teto do inversor e quanto fica acima dele. */
  (function curvaDoDia() {
    var g = document.getElementById('curvaDia');
    if (!g) return;
    if (!u.kwp || !u.kwCA) { g.innerHTML = ''; return; }

    var XI = 70, XF = 940, Y0 = 260, TOPOY = 50;
    var topo = Math.max(u.kwp, u.kwCA * 1.05);
    var yy = function (p) { return Y0 - (p / topo) * (Y0 - TOPOY); };
    var hI = 5.5, hF = 18.5;
    var xx = function (h) { return XI + ((h - hI) / (hF - hI)) * (XF - XI); };
    var picoCC2 = u.kwp * 0.82;
    var pot = function (h) {
      var f = Math.sin(Math.PI * (h - 6) / 12);
      return f > 0 ? picoCC2 * Math.pow(f, 1.15) : 0;
    };

    var passos = [];
    for (var h = hI; h <= hF + 0.001; h += 0.25) passos.push(h);

    var out = '';
    function grade(pp, cor, tracejado, largura) {
      var y = yy(pp).toFixed(1);
      return '<line x1="' + XI + '" y1="' + y + '" x2="' + XF + '" y2="' + y +
        '" stroke="' + cor + '" stroke-width="' + (largura || 1) + '" stroke-dasharray="' + tracejado + '"></line>';
    }
    function rotEixo(pp, txt, cor) {
      return '<text x="60" y="' + (yy(pp) + 4).toFixed(1) + '" fill="' + cor +
        '" font-family="JetBrains Mono" font-size="11" font-weight="600" text-anchor="end">' + txt + '</text>';
    }
    out += grade(u.kwp, '#1C2248', '4,4');
    out += rotEixo(u.kwp, F.nf1.format(u.kwp) + ' kWp', '#6FE9F0');
    out += grade(u.kwp * 0.5, '#1C2248', '4,4');
    out += rotEixo(u.kwp * 0.5, F.nf.format(Math.round(u.kwp * 0.5)) + ' kW', '#5F6480');
    out += grade(u.kwp * 0.25, '#1C2248', '4,4');
    out += rotEixo(u.kwp * 0.25, F.nf.format(Math.round(u.kwp * 0.25)) + ' kW', '#5F6480');
    out += '<line x1="' + XI + '" y1="' + Y0 + '" x2="' + XF + '" y2="' + Y0 +
      '" stroke="#282D4A" stroke-width="1.5"></line>';
    out += rotEixo(0, '0 kW', '#5F6480');

    var d = passos.map(function (h, i) {
      return (i ? 'L' : 'M') + xx(h).toFixed(1) + ',' + yy(pot(h)).toFixed(1);
    }).join(' ');
    out += '<path d="' + d + ' L' + xx(hF).toFixed(1) + ',' + Y0 + ' L' + xx(hI).toFixed(1) + ',' + Y0 +
      ' Z" fill="url(#overloadGainGrad)"></path>';

    // O pedaço que passa do teto do inversor é a energia cortada.
    var acima = passos.filter(function (h) { return pot(h) > u.kwCA; });
    if (acima.length) {
      var h1 = acima[0], h2 = acima[acima.length - 1];
      var dc = 'M' + xx(h1).toFixed(1) + ',' + yy(u.kwCA).toFixed(1) +
        acima.map(function (h) { return ' L' + xx(h).toFixed(1) + ',' + yy(pot(h)).toFixed(1); }).join('') +
        ' L' + xx(h2).toFixed(1) + ',' + yy(u.kwCA).toFixed(1) + ' Z';
      out += '<path d="' + dc + '" fill="url(#clippingHatch)" stroke="#E25454" stroke-width="1.5"></path>';
      out += '<text x="' + ((xx(h1) + xx(h2)) / 2).toFixed(1) + '" y="' + (yy(u.kwCA) - 8).toFixed(1) +
        '" fill="#E25454" font-family="JetBrains Mono" font-size="11" font-weight="700" text-anchor="middle" ' +
        'filter="url(#dropShadowCurva)">' +
        (u.clipagem !== null ? F.nf1.format(u.clipagem) + '% cortados no ano' : 'energia cortada') + '</text>';
    }

    out += grade(u.kwCA, '#e9c349', '6,3', 1.5);
    out += rotEixo(u.kwCA, F.nf1.format(u.kwCA) + ' kW CA', '#e9c349');

    out += '<path d="' + d + '" fill="none" stroke="url(#dcLineGrad)" stroke-width="3" ' +
      'stroke-linecap="round" stroke-linejoin="round" filter="url(#dropShadowCurva)"></path>';
    out += '<text x="' + xx(12).toFixed(1) + '" y="' + (yy(picoCC2) - 12).toFixed(1) +
      '" fill="#6FE9F0" font-family="JetBrains Mono" font-size="11" font-weight="700" text-anchor="middle" ' +
      'filter="url(#dropShadowCurva)">PICO CC: ' + F.nf1.format(picoCC2) + ' kW</text>';

    [6, 8, 10, 12, 14, 16, 18].forEach(function (h) {
      out += '<text x="' + xx(h).toFixed(1) + '" y="' + (Y0 + 22) +
        '" fill="#B8BCCE" font-family="JetBrains Mono" font-size="11" text-anchor="middle">' +
        String(h).padStart(2, '0') + ':00</text>';
    });
    g.innerHTML = out;
  })();

  /* ======================================= FOTO, STATUS E ESTÁGIOS ====== */
  (function fotoStatusEstagios() {
    var est = B2W.estagioDe(c);
    var CORES = ['text-status-verified', 'text-tertiary', 'text-secondary', 'text-primary-container',
                 'text-ink-muted', 'text-ink-primary', 'text-ink-secondary'];
    function pinta(el, cor) {
      if (!el) return;
      CORES.forEach(function (k) { el.classList.remove(k); });
      el.classList.add(cor);
    }

    /* Foto do topo: o visualizador diz de onde ela vem — link https ou arquivo
       nesta pasta (ex.: fotos/santa-maria.jpg). Qualquer outra coisa mantém a
       foto padrão, para o slug não virar porta de conteúdo arbitrário. */
    var foto = document.querySelector('img[src="usina-hero.jpg"]');
    var src = String(c.data.foto || '').trim();
    if (foto && src && (/^https:\/\/[^\s"'<>]+$/i.test(src) || /^[\w\-\/]+\.(jpe?g|png|webp|avif)$/i.test(src))) {
      foto.src = src;
    }

    /* Status sobre a foto e selo ao lado do código: sem etapa informada a
       página não afirma fase nenhuma. */
    var hudValor = document.getElementById('hudValor');
    var caixaHud = hudValor ? hudValor.parentElement.parentElement : null;
    var selo = document.querySelector('[data-f="badgeOperacao"]');
    var caixaSelo = selo ? selo.parentElement : null;
    if (!est) {
      if (caixaHud) caixaHud.style.display = 'none';
      if (caixaSelo) caixaSelo.style.display = 'none';
    } else {
      if (hudValor) {
        document.getElementById('hudRotulo').textContent = 'status da usina';
        hudValor.textContent = est.hud;
        pinta(hudValor, 'text-' + est.cor);
        var ico = document.getElementById('hudIcone');
        if (ico) { ico.textContent = est.icone; pinta(ico, 'text-' + est.cor); }
      }
      if (selo) {
        selo.textContent = est.selo;
        caixaSelo.classList.remove('bg-status-verified/15');
        caixaSelo.classList.add('bg-' + est.cor + '/15');
        pinta(caixaSelo, 'text-' + est.cor);
      }
    }

    põe('ctaTexto', est && est.i === 3 && est.situacao.tipo === 'ok'
      ? 'Ativo real homologado, gerando energia limpa com receita mensal previsível e governança ponta a ponta B2W Invest.'
      : 'Ativo real' + (est ? ' ' + est.frase : '') +
        ', com receita mensal prevista a partir do início da geração e governança ponta a ponta B2W Invest.');

    /* Linha do tempo: as quatro etapas ficam; cada uma mostra a situação
       escolhida no visualizador — concluída, iniciada (com o percentual, que
       também preenche a barra do topo do cartão) ou provisionada (começa em
       N dias). */
    var grid = document.getElementById('estagiosGrid');
    if (!grid) return;
    var etapas = B2W.etapasDe(c);
    var atual = est ? est.i : -1;
    var COR = ['tertiary', 'secondary', 'primary-container', 'status-verified'];
    var CATEGORIA = ['REGULATÓRIO', 'OBRAS CIVIS', 'TESTES E VISTORIA', 'OPERAÇÃO'];
    var PONTO = function (cor) {
      return '<span class="inline-block w-1.5 h-1.5 rounded-full bg-' + cor + ' animate-pulse mr-1"></span>';
    };

    for (var i = 0; i < grid.children.length && i < 4; i++) {
      var card = grid.children[i];
      var s = etapas ? etapas[i] : null;
      var tipo = s ? s.tipo : 'indefinido';
      var gerando = i === 3 && tipo === 'ok';

      // Destaque (anel) só na etapa em curso; provisionada e sem dado ficam apagadas.
      card.classList.remove('ring-1', 'ring-status-verified/30', 'border-status-verified/50', 'opacity-60');
      card.classList.add('border-border-subtle/60');
      if ((i === atual && tipo === 'iniciado') || gerando) {
        card.classList.remove('border-border-subtle/60');
        card.classList.add('ring-1', 'ring-' + COR[i] + '/30', 'border-' + COR[i] + '/50');
      }
      if (tipo === 'previsto' || tipo === 'indefinido') card.classList.add('opacity-60');

      var barra = card.firstElementChild;
      if (barra && barra.classList.contains('absolute')) {
        barra.style.width = tipo === 'ok' ? '100%'
          : tipo === 'iniciado' ? (s.pct ? s.pct + '%' : '100%') : '0%';
      }

      var etiqueta = card.querySelector('.uppercase.tracking-wider');
      if (etiqueta) {
        etiqueta.innerHTML = gerando ? PONTO(COR[i]) + 'ATIVA AGORA'
          : tipo === 'iniciado' ? PONTO(COR[i]) + (s.pct ? 'EM ANDAMENTO' : 'ATIVA AGORA')
          : CATEGORIA[i];
      }

      var sub = card.querySelector('h3 + span');
      if (sub && tipo !== 'ok') sub.textContent = sub.textContent.replace(/\s*Concluíd[oa]s?$/, '');

      var lista = card.querySelector('.border-t.gap-space-2');
      var itens = lista ? lista.children : [];
      for (var j = 0; j < itens.length && tipo !== 'ok'; j++) {
        var icone = itens[j].children[0], texto = itens[j].children[1];
        if (!icone || !texto) continue;
        // Numa etapa iniciada, o que se refere a etapa anterior ("... Concluída") segue feito.
        if (tipo === 'iniciado' && /Concluída$/.test(texto.textContent)) continue;
        icone.className = 'material-symbols-outlined text-[18px] ' +
          (tipo === 'iniciado' ? 'text-' + COR[i] : 'text-ink-muted');
        icone.textContent = tipo === 'iniciado' ? 'schedule' : 'radio_button_unchecked';
        texto.className = tipo === 'iniciado' ? 'text-ink-primary font-medium' : 'text-ink-secondary font-medium';
      }

      var rodape = card.lastElementChild;
      var rotulo = rodape && rodape.children[0], valor = rodape && rodape.children[1];
      if (!rotulo || !valor) continue;
      var base = 'font-label-mono text-body-sm font-bold flex items-center gap-1.5 ';
      if (gerando) {
        rotulo.textContent = 'Status atual';
        valor.className = base + 'text-status-verified';
        valor.innerHTML = '<span class="w-2 h-2 rounded-full bg-status-verified animate-ping"></span>Gerando e Faturando';
      } else if (tipo === 'ok') {
        rotulo.textContent = 'Fase do Ativo';
        valor.className = base + 'text-status-verified';
        valor.textContent = '100% Concluído';
      } else if (tipo === 'iniciado') {
        rotulo.textContent = 'Fase do Ativo';
        valor.className = base + 'text-' + COR[i];
        valor.textContent = s.pct ? 'Iniciado · ' + s.pct + '%' : 'Em andamento';
      } else if (tipo === 'previsto') {
        rotulo.textContent = 'Previsão';
        valor.className = base + 'text-ink-muted';
        valor.textContent = s.dias ? 'Início em ' + s.dias + ' dias' : 'Aguardando';
      } else {
        rotulo.textContent = 'Fase do Ativo';
        valor.className = base + 'text-ink-muted';
        valor.textContent = '—';
      }
    }
  })();

  /* ================================ DOCUMENTAÇÃO DOS BLOCOS DA MANDALA ==== */
  /* Os cinco blocos ao lado da mandala têm sempre o botão de documentação.
     Com link (configurado no visualizador) ele abre o documento; sem link ele
     aparece desativado como "Documentação em breve" — o bloco não some nem
     finge ter um documento. Só https: o slug não pode virar porta de
     javascript: ou de outro esquema. Link sem esquema ganha https://. */
  (function documentacaoMandala() {
    var docs = c.data.docs || {};
    var CHAVES = ['prospeccao', 'construcao', 'juridico', 'manutencao', 'contratos'];
    var COR = ['tertiary', 'primary-container', 'secondary', 'status-verified', 'navy-accent'];
    var logo = document.querySelector('img[src="logo-b2w-invest.png"]');
    var secao = logo && logo.closest('section');
    if (!secao) return;

    function linkValido(v) {
      var url = String(v || '').trim();
      if (/^(www\.)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(url)) url = 'https://' + url;
      return /^https:\/\/[^\s"'<>]+$/i.test(url) ? url : null;
    }

    var titulos = secao.querySelectorAll('h4');
    for (var i = 0; i < titulos.length && i < CHAVES.length; i++) {
      var coluna = titulos[i].closest('.flex-col');
      if (!coluna || coluna.querySelector('[data-doc]')) continue;
      var url = linkValido(docs[CHAVES[i]]);
      var el = document.createElement(url ? 'a' : 'span');
      el.setAttribute('data-doc', CHAVES[i]);
      var base = 'mt-2 self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-md border ' +
        'font-label-mono text-[11px] font-bold transition-colors ';
      if (url) {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener';
        el.className = base + 'border-' + COR[i] + '/40 text-' + COR[i] + ' hover:bg-' + COR[i] + '/10';
        el.innerHTML = '<span class="material-symbols-outlined text-[14px]">description</span>Visualizar documentação';
      } else {
        el.className = base + 'border-border-subtle/60 text-ink-muted opacity-70 cursor-not-allowed';
        el.setAttribute('aria-disabled', 'true');
        el.title = 'Documento ainda não disponível';
        el.innerHTML = '<span class="material-symbols-outlined text-[14px]">schedule</span>Documentação em breve';
      }
      coluna.appendChild(el);
    }
  })();

  /* nomes do caso fictício, imagens mortas e a barra das três páginas —
     os três estão no motor, iguais para as três páginas. */
  B2W.trocarNomes(c);
  B2W.esconderImagensQuebradas();
  B2W.navegar(c, 'usina');
})();
