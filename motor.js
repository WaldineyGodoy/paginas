/* =============================================================================
   motor.js — as contas da apresentação, num lugar só.

   As páginas (usina, eletroposto, híbrida) são desenho: elas leem daqui e
   escrevem na tela. Nenhuma delas recalcula nada. Três páginas com três cópias
   da mesma fórmula divergem no primeiro ajuste — já aconteceu neste projeto.

   Uso:
     const c = B2W.ler();            // null se o link não trouxer caso
     c.usina.anual, c.cascata.liquida, c.viab.tir, c.ep.mensal.resultado ...

   O slug é a query da URL: JSON -> UTF-8 escapado -> btoa -> base64url. Mesmo
   encode do generateSlug() no CRM.
   ========================================================================== */
(function (glob) {
  'use strict';

  /* ---------- formatadores ------------------------------------------------
     Dado ausente vira travessão, nunca zero: zero afirmaria uma medição que
     não existe.                                                            */
  var nf   = new Intl.NumberFormat('pt-BR');
  var nf1  = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  var brl  = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var brl4 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL',
                                              minimumFractionDigits: 4, maximumFractionDigits: 4 });

  // valorInvestido chega do CRM já formatado ("R$ 300.000,00"). Ponto só é
  // separador de milhar quando há vírgula decimal junto: "1.032" é um número.
  function toNum(v) {
    if (v === null || v === undefined || v === '') return NaN;
    if (typeof v === 'number') return v;
    var c = String(v).replace(/[^\d,.-]/g, '');
    if (c.indexOf(',') >= 0) c = c.replace(/\./g, '').replace(',', '.');
    return (c === '' || c === '-') ? NaN : Number(c);
  }
  function has(v) { return !isNaN(toNum(v)); }
  function num(v) { return has(v) ? toNum(v) : null; }

  function pctMes(v) { return nf.format(Math.round(v * 100) / 100) + '%'; }
  function pct1(v)   { return nf1.format(v) + '%'; }
  function anosTxt(v, horizonte) {
    if (v === null || v === undefined) return 'não atingido em ' + horizonte + ' anos';
    var a = Math.floor(v), m = Math.round((v - a) * 12);
    return a + 'a' + (m ? ' ' + m + 'm' : '');
  }
  function anosLongo(v, horizonte) {
    if (v === null || v === undefined) return 'não atingido em ' + horizonte + ' anos';
    var a = Math.floor(v), m = Math.round((v - a) * 12);
    return a + (a === 1 ? ' ano' : ' anos') + (m ? ' e ' + m + (m === 1 ? ' mês' : ' meses') : '');
  }
  // Grau decimal para o formato que se lê num mapa.
  function grauDMS(v, pos, neg) {
    var abs = Math.abs(v), g = Math.floor(abs);
    var mFloat = (abs - g) * 60, m = Math.floor(mFloat);
    var s = ((mFloat - m) * 60).toFixed(1);
    return g + '°' + String(m).padStart(2, '0') + "'" + s + '"' + (v >= 0 ? pos : neg);
  }

  /* ---------- decodifica o slug ------------------------------------------ */
  function decodeSlug(raw) {
    if (!raw) return null;
    try {
      var b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var bin = atob(b64);
      var json = decodeURIComponent(
        Array.prototype.map.call(bin, function (c) {
          return '%' + c.charCodeAt(0).toString(16).padStart(2, '0');
        }).join('')
      );
      var o = JSON.parse(json);
      return (o && typeof o === 'object' && o.name !== undefined) ? o : null;
    } catch (e) { return null; }
  }

  function encodeSlug(obj) {
    var json = JSON.stringify(obj);
    var b64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, function (m, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /* ---------- constantes do modelo ---------------------------------------- */
  var INFLACAO  = 0.089;   // 8,9% ao ano
  var FIOB_REAL = 0.15;    // reajuste real adicional do Fio B
  var FIOB_ATE  = 2028;    // último ano com reajuste real
  var ANO_BASE  = 2026, ANO_FIM = 2035;
  var DISPONIBILIDADE_KWH = 100;   // piso do Grupo B, trifásico

  /* ========================================================================
     Monta tudo a partir do objeto do caso.
     ===================================================================== */
  function montar(data) {
    var c = { data: data };

    /* -------- identidade -------- */
    var MODOS = ['usina', 'eletroposto', 'hibrida'];
    c.modo = MODOS.indexOf(data.modo) >= 0 ? data.modo : 'usina';
    c.ehUsina = c.modo === 'usina';
    c.ehEp    = c.modo === 'eletroposto';
    c.ehHib   = c.modo === 'hibrida';
    c.mostraUsina = c.ehUsina || c.ehHib;
    c.mostraEp    = c.ehEp    || c.ehHib;

    c.nome  = data.name || 'Usina';
    c.local = [data.cidade, data.uf].filter(Boolean).join('/');
    c.cep   = data.cep || '';
    c.concessionaria = data.concessionaria || '';
    c.enquadramento  = data.tipoUsina || '';
    c.modalidade     = data.modalidade || '';
    c.ehGD1 = c.enquadramento === 'GD1';
    c.ehCompartilhada = /compartilhada/i.test(c.modalidade);

    c.lat = num(data.lat);
    c.lng = num(data.lng);
    c.aero = (data.aero && num(data.aero.lat) !== null && num(data.aero.lng) !== null)
      ? data.aero : null;

    /* -------- arranjo -------- */
    var u = c.usina = {};
    u.kwp        = num(data.potencia);
    u.modulos    = num(data.modulos);
    u.wModulo    = num(data.potModulos);
    u.wInversor  = num(data.potInversor);
    u.qtdInv     = num(data.qtdInversores);
    u.kwCA       = (u.wInversor !== null && u.qtdInv !== null) ? u.wInversor * u.qtdInv / 1000 : null;
    u.moduloModelo   = data.moduloModelo || null;
    u.moduloTec      = data.moduloTec || null;
    u.inversorModelo = data.inversorModelo || data.fabInversor || null;
    u.ganhoBifacial  = num(data.ganhoBifacial);
    u.fdiNominal     = num(data.fdiNominal);
    u.fdiEfetivo     = num(data.fdiEfetivo);
    u.clipagem       = num(data.clipagem);
    u.albedo         = num(data.albedo);
    u.investido      = num(data.valorInvestido);
    u.porKwp = (u.investido !== null && u.kwp) ? u.investido / u.kwp : null;

    /* -------- geração mês a mês -------- */
    u.meses = data.geracao12 || [];
    u.serieGer = u.meses.map(function (m) { return num(m.v); });
    u.rotulos  = u.meses.map(function (m) { return m.m; });
    u.anual = u.serieGer.reduce(function (a, v) { return a + (v || 0); }, 0);
    // Média dos meses COM dado, não dos doze: mês sem leitura não vale zero.
    function mediaDe(a) {
      var f = a.filter(function (v) { return v !== null; });
      return f.length ? f.reduce(function (x, y) { return x + y; }, 0) / f.length : null;
    }
    u.medGer = mediaDe(u.serieGer);
    u.porKwpAno = (u.anual && u.kwp) ? u.anual / u.kwp : null;

    /* -------- cascata tarifária --------
       tarifa − desconto − Fio B (− tributos) − gestão = líquida.
       GD1 não paga Fio B: sai da conta, não vira zero por acaso.
       Base tributável exclui o Fio B, que já vem com impostos na conta. */
    var t = c.cascata = {};
    t.tarifa = num(data.tarifaCons);
    t.descP  = num(data.descCliente);
    t.fioB   = num(data.fioB);
    t.gestP  = num(data.gestao);
    t.icmsP  = num(data.icms);
    t.pisP   = num(data.pis);
    t.cofP   = num(data.cofins);

    t.descR = (t.tarifa !== null && t.descP !== null) ? t.tarifa * (t.descP / 100) : null;
    t.fioBefetivo = c.ehGD1 ? 0 : t.fioB;

    t.temAliquotas = t.icmsP !== null && t.pisP !== null && t.cofP !== null;
    var baseTrib = (t.tarifa !== null && t.fioB !== null) ? t.tarifa - t.fioB : null;
    t.icms = null; t.pisCofins = null; t.tributos = null;
    if (c.ehCompartilhada && t.temAliquotas && baseTrib !== null) {
      t.icms = baseTrib * (t.icmsP / 100);
      t.pisCofins = (baseTrib - t.icms) * ((t.pisP + t.cofP) / 100);
      t.tributos = t.icms + t.pisCofins;
    }
    // Compartilhada sem alíquotas cadastradas não vira zero: zero apresentaria
    // uma tarifa muito maior que a real como se fosse fato.
    t.tributosPendentes = c.ehCompartilhada && !t.temAliquotas;
    var tribNaConta = c.ehCompartilhada ? t.tributos : 0;

    t.base = (t.tarifa !== null && t.descR !== null && t.fioBefetivo !== null && tribNaConta !== null)
      ? t.tarifa - t.descR - t.fioBefetivo - tribNaConta : null;
    t.gestR = (t.base !== null && t.gestP !== null) ? t.base * (t.gestP / 100) : null;
    t.liquida = (t.base !== null && t.gestR !== null) ? t.base - t.gestR
      : (c.ehCompartilhada ? null : num(data.tarifaLiq));
    t.aproveitamento = (t.liquida !== null && t.tarifa) ? t.liquida / t.tarifa * 100 : null;

    /* -------- receita e rentabilidade mês a mês -------- */
    u.serieRec = u.serieGer.map(function (v) {
      return (v !== null && t.liquida !== null) ? v * t.liquida : null;
    });
    u.serieRen = u.serieRec.map(function (r) {
      return (r !== null && u.investido) ? (r / u.investido) * 100 : null;
    });
    u.medRec = mediaDe(u.serieRec);
    u.medRen = mediaDe(u.serieRen);
    u.receitaAno = u.medRec !== null ? u.medRec * 12 : null;

    /* -------- custos mensais -------- */
    var serv = (data.servicos && typeof data.servicos === 'object') ? data.servicos : {};
    c.servicos = Object.keys(serv).filter(function (k) { return Number(serv[k]) > 0; })
      .map(function (k) { return { nome: k, valor: Number(serv[k]) }; });
    var dg = data.demandaGeracao;
    c.demandaGeracao = (dg && Number(dg.mensal) > 0)
      ? { tarifa: Number(dg.tarifa), limite: Number(dg.limite),
          kwCA: Number(dg.kwCA), mensal: Number(dg.mensal) } : null;
    c.custoMensal = c.servicos.reduce(function (a, s) { return a + s.valor; }, 0)
      + (c.demandaGeracao ? c.demandaGeracao.mensal : 0);
    c.sobraMensal = (u.medRec !== null) ? u.medRec - c.custoMensal : null;

    /* -------- projeção tarifária 2026–2035 --------
       A tarifa cheia cresce pela inflação; o Fio B cresce pela inflação MAIS
       um reajuste real, até o ano em que o subsídio termina de ser retirado. */
    c.proj = null;
    if (t.tarifa !== null && t.descP !== null && t.fioB !== null && t.gestP !== null) {
      var linhas = [];
      for (var ano = ANO_BASE; ano <= ANO_FIM; ano++) {
        var n = ano - ANO_BASE;
        var infl = Math.pow(1 + INFLACAO, n);
        var tarifaAno = t.tarifa * infl;
        var anosReais = Math.max(0, Math.min(ano, FIOB_ATE) - ANO_BASE);
        var fiobCheio = t.fioB * infl * Math.pow(1 + FIOB_REAL, anosReais);
        var fiobAno = c.ehGD1 ? 0 : fiobCheio;
        var descAno = tarifaAno * (t.descP / 100);
        var icmsAno = 0, pisCofAno = 0;
        if (c.ehCompartilhada && t.temAliquotas) {
          var baseT = tarifaAno - fiobCheio;
          icmsAno = baseT * (t.icmsP / 100);
          pisCofAno = (baseT - icmsAno) * ((t.pisP + t.cofP) / 100);
        }
        var tribAno = icmsAno + pisCofAno;
        var baseGestAno = tarifaAno - descAno - fiobAno - tribAno;
        var gestAno = baseGestAno * (t.gestP / 100);
        linhas.push({
          ano: ano, tarifa: tarifaAno, desconto: descAno, fiob: fiobAno,
          impostos: tribAno, gestao: gestAno,
          liquida: baseGestAno - gestAno,
          pagoAssinante: tarifaAno - descAno
        });
      }
      c.proj = linhas;
    }
    c.horizonte = c.proj ? c.proj.length : 10;
    c.inflacao = INFLACAO;

    /* -------- viabilidade da usina --------
       Investimento em t=0; a receita de cada ano é a geração anual vezes a
       tarifa líquida daquele ano, menos os custos, que sobem pela inflação.
       O modelo não degrada os módulos e para no décimo ano: a primeira
       simplificação puxa para cima, a segunda para baixo. */
    function indicadores(fluxos, capex) {
      var vpl = function (taxa) {
        return fluxos.reduce(function (a, f, i) { return a + f / Math.pow(1 + taxa, i); }, 0);
      };
      // Bisseção em vez de Newton: mais lenta e não diverge quando o fluxo é magro.
      var lo = -0.99, hi = 10;
      if (vpl(lo) * vpl(hi) < 0) {
        for (var i = 0; i < 200; i++) { var m = (lo + hi) / 2; if (vpl(m) > 0) lo = m; else hi = m; }
      } else { lo = hi = NaN; }
      var entradas = fluxos.slice(1).reduce(function (a, b) { return a + b; }, 0);
      var acc = -capex, pay = null, ant = -capex, serie = [];
      fluxos.slice(1).forEach(function (f, i) {
        acc += f;
        if (pay === null && acc >= 0) pay = i + (ant < 0 ? (-ant) / (acc - ant) : 0);
        ant = acc; serie.push(acc);
      });
      // Payback descontado: o mesmo, com o dinheiro trazido a valor de hoje.
      var accD = -capex, payD = null, antD = -capex, serieD = [];
      fluxos.slice(1).forEach(function (f, i) {
        accD += f / Math.pow(1 + INFLACAO, i + 1);
        if (payD === null && accD >= 0) payD = i + (antD < 0 ? (-antD) / (accD - antD) : 0);
        antD = accD; serieD.push(accD);
      });
      return {
        roi: capex > 0 ? (entradas - capex) / capex : null,
        tir: (lo + hi) / 2, vpl: vpl(INFLACAO),
        payback: pay, paybackDesc: payD,
        acumulado: serie, acumuladoDesc: serieD,
        total: entradas, capex: capex
      };
    }
    c.indicadores = indicadores;

    c.viab = null;
    if (c.proj && u.investido && u.anual) {
      var fluxos = [-u.investido], detalhe = [];
      c.proj.forEach(function (p, k) {
        var receita = u.anual * p.liquida;
        var custo = c.custoMensal * 12 * Math.pow(1 + INFLACAO, k);
        fluxos.push(receita - custo);
        detalhe.push({ ano: p.ano, receita: receita, custo: custo, liquido: receita - custo });
      });
      c.viab = indicadores(fluxos, u.investido);
      c.viab.detalhe = detalhe;
      c.viab.fluxos = fluxos;
    }

    /* ========== eletroposto ==========
       A usina só compensa o que gera. Consumo acima disso é comprado da
       concessionária em TARIFA CHEIA — é o que faz o segundo carregador
       render menos que o primeiro. */
    c.ep = null;
    var ep = (data.eletroposto && typeof data.eletroposto === 'object') ? data.eletroposto : null;
    if (ep) {
      var e = c.ep = { bruto: ep };
      var epn = function (k) { var v = Number(ep[k]); return isFinite(v) ? v : 0; };
      e.n = epn;
      e.modelo    = ep.modelo || null;
      e.kw        = epn('kw');
      e.kwEfetivo = epn('kwEfetivo') || epn('kw');
      e.limite    = epn('limite');
      e.pistolas  = epn('pistolas');
      e.carregadores = epn('carregadores');
      e.cargaInstalada = epn('cargaInstalada');
      e.eta       = epn('eta');
      e.conexao   = ep.conexao || null;
      e.grupo     = ep.grupo || 'B';
      e.vinculado = ep.vinculado !== false;
      e.sessoes   = epn('sessoes');
      e.socIni    = epn('socIni');
      e.socFim    = epn('socFim');
      e.bateria   = epn('bateria');
      e.eSessao   = epn('eSessao');
      e.diasMes   = epn('diasMes') || 30;
      e.tCarga    = epn('tCarga');
      e.tOcupacao = epn('tOcupacao');
      e.horasOcupada = epn('horasOcupada');
      e.vendidos  = epn('vendidos');
      e.comprados = epn('comprados');
      e.preco     = epn('preco');
      e.plataforma = epn('plataforma');
      e.pagamento = epn('pagamento');
      /* Portagem: participação do dono da vaga sobre a receita das recargas.
         Links antigos trazem `portagem` em R$/mês — continuam valendo assim,
         senão um link já enviado passaria a cobrar 3% onde cobrava R$ 3. */
      e.portagemPct = epn('portagemPct');
      e.portagem  = epn('portagem');
      e.demanda   = epn('demanda');
      e.tarifaDem = epn('tarifaDem');
      e.opex      = epn('opex');
      e.capex     = epn('capex');
      e.precoCheio = epn('precoCheio') || t.tarifa || 0;
      e.precoAssinante = epn('precoAssinante');
      e.precoCusto = epn('precoCusto');
      e.geracaoMes = (ep.geracaoMes === null || ep.geracaoMes === undefined)
        ? null : Number(ep.geracaoMes);

      e.mensalA = function (precoEnergia) {
        var receita = e.vendidos * e.preco;
        var consumo = e.comprados;
        var cobertos = e.geracaoMes === null ? consumo : Math.min(consumo, e.geracaoMes);
        var excedente = Math.max(0, consumo - cobertos);
        var energia = cobertos * precoEnergia + excedente * e.precoCheio;
        var taxas = receita * ((e.plataforma + e.pagamento + e.portagemPct) / 100);
        var demanda = e.grupo === 'A' ? e.demanda * e.tarifaDem : 0;
        // Grupo B não paga demanda, mas tem piso: o custo de disponibilidade.
        var disponib = e.grupo === 'B' ? DISPONIBILIDADE_KWH * e.precoCheio : 0;
        var fixos = demanda + disponib + e.opex + e.portagem;
        var portagemR = receita * (e.portagemPct / 100);
        return {
          receita: receita, energia: energia, taxas: taxas, demanda: demanda,
          disponib: disponib, fixos: fixos, cobertos: cobertos, excedente: excedente,
          consumo: consumo, precoEnergia: precoEnergia, portagem: portagemR,
          resultado: receita - energia - taxas - fixos
        };
      };
      e.mensalAssinante = e.mensalA(e.precoAssinante);
      e.mensalCusto     = e.mensalA(e.precoCusto);
      e.receitaAno      = e.vendidos * e.preco * 12;
      e.margemKwh       = e.preco - (e.eta ? e.precoAssinante / e.eta : 0);
      e.ocupacaoPct     = e.horasOcupada ? Math.min(100, e.horasOcupada / 24 * 100) : 0;

      /* Fluxo de 10 anos com a tarifa de cada ano: a energia comprada
         acompanha a projeção, a receita da recarga sobe pela inflação. */
      function fluxoEp(precoPorAno, capex) {
        if (!c.proj) return null;
        var fl = [-capex];
        var consumoAno = e.comprados * 12;
        var geracaoAno = e.geracaoMes === null ? null : e.geracaoMes * 12;
        var cobertosAno = geracaoAno === null ? consumoAno : Math.min(consumoAno, geracaoAno);
        var excedenteAno = Math.max(0, consumoAno - cobertosAno);
        c.proj.forEach(function (p, k) {
          var infl = Math.pow(1 + INFLACAO, k);
          var receita = e.vendidos * 12 * e.preco * infl;
          var energia = cobertosAno * precoPorAno(p) + excedenteAno * p.tarifa;
          var taxas = receita * ((e.plataforma + e.pagamento + e.portagemPct) / 100);
          var demanda = e.grupo === 'A' ? e.demanda * e.tarifaDem * 12 * infl : 0;
          var disponib = e.grupo === 'B' ? DISPONIBILIDADE_KWH * 12 * p.tarifa : 0;
          var fixos = demanda + disponib + (e.opex + e.portagem) * 12 * infl;
          fl.push(receita - energia - taxas - fixos);
        });
        return fl;
      }
      e.fluxoEp = fluxoEp;

      // Como assinante: paga a tarifa cheia daquele ano menos o desconto.
      var precoAssinanteAno = function (p) { return p.pagoAssinante; };
      // A preço de custo: Fio B mais a gestão daquele ano.
      var precoCustoAno = function (p) { return p.fiob + p.gestao; };

      e.viabIsolado = null;
      if (c.proj && e.capex > 0) {
        e.viabIsolado = indicadores(fluxoEp(precoAssinanteAno, e.capex), e.capex);
      }

      /* Unificada: o que a usina gera além do consumo do eletroposto segue
         sendo vendido a assinantes, pela líquida daquele ano. */
      e.viabUnificada = null;
      if (c.proj && u.investido && e.capex > 0) {
        var capexUni = u.investido + e.capex;
        var consumoAnualEp = e.mensalCusto.cobertos * 12;
        var sobra = Math.max(0, u.anual - consumoAnualEp);
        var base = fluxoEp(precoCustoAno, capexUni);
        var fUni = base.map(function (v, i) {
          if (i === 0) return v;
          var p = c.proj[i - 1];
          var infl = Math.pow(1 + INFLACAO, i - 1);
          return v + sobra * p.liquida - c.custoMensal * 12 * infl;
        });
        e.viabUnificada = indicadores(fUni, capexUni);
        e.capexUnificado = capexUni;
        e.consumoAnual = consumoAnualEp;
        e.sobraParaAssinantes = sobra;
        e.resultadoUnificadoMes = e.mensalCusto.resultado
          + (sobra * (c.proj[0] ? c.proj[0].liquida : 0) - c.custoMensal * 12) / 12;
      }
    }

    return c;
  }

  /* ---------- ponto de entrada -------------------------------------------
     O slug é a query inteira, mas qualquer parâmetro anexado depois — um utm,
     um cache-buster — quebrava a decodificação. Fica com o trecho antes do
     primeiro &.                                                            */
  function ler() {
    var raw = glob.location.search.replace(/^\?/, '').split('&')[0];
    var data = decodeSlug(raw);
    return data ? montar(data) : null;
  }

  function linkDoModo(data, modo, arquivo) {
    var copia = Object.assign({}, data, { modo: modo });
    return arquivo + '?' + encodeSlug(copia);
  }


  /* ---------- utilidades das páginas -------------------------------------
     Ficam aqui porque as três precisam delas iguais. Copiadas em cada página,
     divergiriam no primeiro ajuste. */

  /* WhatsApp do vendedor quando o caso nao informa outro. Todo botao de
     conversao (Falar com Especialista, Participar, Garantir, Alocar) cai nele. */
  var WHATSAPP_PADRAO = '5584996134234';

  function linkWhatsApp(c) {
    var tel = String((c.data && c.data.contato) || WHATSAPP_PADRAO).trim();
    if (/^https?:/i.test(tel)) return tel;
    var texto = 'Olá! Vi a página ' + (c.nome ? 'da ' + c.nome + ' ' : '') +
      'e quero saber mais sobre o investimento.';
    return 'https://wa.me/' + tel.replace(/\D/g, '') + '?text=' + encodeURIComponent(texto);
  }

  /* Etapa da usina, escolhida no visualizador. Decide o que a pagina afirma:
     a linha do tempo, o selo do topo e o status sobre a foto. */
  var ESTAGIOS = {
    homologacao: { i: 0, cabecalho: 'Em homologação', selo: 'Em homologação', hud: 'EM HOMOLOGAÇÃO',
                   icone: 'fact_check', cor: 'tertiary', frase: 'em homologação' },
    construcao:  { i: 1, cabecalho: 'Em construção', selo: 'Em construção', hud: 'EM CONSTRUÇÃO',
                   icone: 'construction', cor: 'secondary', frase: 'em construção' },
    conexao:     { i: 2, cabecalho: 'Em conexão', selo: 'Em conexão', hud: 'EM CONEXÃO E COMISSIONAMENTO',
                   icone: 'electrical_services', cor: 'primary-container', frase: 'em conexão e comissionamento' },
    geracao:     { i: 3, cabecalho: 'Online / Conectada', selo: 'Operação Ativa', hud: 'CONECTADA E GERANDO',
                   icone: 'bolt', cor: 'status-verified', frase: 'gerando energia limpa' }
  };
  /* Situação de cada uma das quatro etapas, escolhida no visualizador:
       ok          concluída
       i30 i50 i70 iniciada, com o percentual executado
       p30 ... p120 provisionada: começa em N dias
     A etapa "atual" é a primeira que ainda não está concluída; com as quatro
     concluídas, a usina está gerando. */
  var ORDEM_ETAPAS = ['homologacao', 'construcao', 'conexao', 'geracao'];
  var NOME_ETAPA = ['Homologação', 'Construção', 'Conexão', 'Geração'];

  function lerSituacao(v) {
    var m = /^(?:(ok)|i(\d{1,3})|p(\d{1,3}))$/.exec(String(v || ''));
    if (!m) return null;
    if (m[1]) return { tipo: 'ok' };
    if (m[2]) return { tipo: 'iniciado', pct: Number(m[2]) };
    return { tipo: 'previsto', dias: Number(m[3]) };
  }

  function etapasDe(c) {
    var d = (c && c.data) || {};
    if (d.etapas) {
      var lista = ORDEM_ETAPAS.map(function (k) { return lerSituacao(d.etapas[k]); });
      return lista.every(Boolean) ? lista : null;
    }
    // Links gerados antes da situação por etapa trazem só `estagio`.
    var antigo = ESTAGIOS[d.estagio];
    if (!antigo) return null;
    return ORDEM_ETAPAS.map(function (k, i) {
      if (i < antigo.i || (antigo.i === 3 && i === 3)) return { tipo: 'ok' };
      if (i === antigo.i) return { tipo: 'iniciado', pct: null };
      return { tipo: 'previsto', dias: null };
    });
  }

  function estagioDe(c) {
    var etapas = etapasDe(c);
    if (!etapas) return null;
    var atual = 0;
    while (atual < 3 && etapas[atual].tipo === 'ok') atual++;
    var base = ESTAGIOS[ORDEM_ETAPAS[atual]], s = etapas[atual], r = {};
    for (var k in base) r[k] = base[k];
    r.situacao = s;
    if (s.tipo === 'iniciado' && s.pct) r.hud = base.hud + ' · ' + s.pct + '%';
    if (s.tipo === 'previsto') {
      var nome = NOME_ETAPA[atual], quando = s.dias ? ' em ' + s.dias + ' dias' : '';
      r.selo = r.cabecalho = nome + ' prevista' + quando;
      r.hud = (nome + ' prevista' + quando).toUpperCase();
      r.frase = 'aguardando o início da ' + nome.toLowerCase() + quando;
    }
    return r;
  }

  /* Links entre as tres paginas. Dois layouts convivem durante a migracao:
       - b2winvest.com.br/paginas/<branch>/ : uma pagina por branch, cada uma
         e' o index.html da propria pasta (usinasroi, eletropostoroi, hibridoroi);
       - b2wenergia.com.br/edu/usina/ e o TempRepo local: as tres na mesma pasta.
     O caminho em que a pagina esta rodando decide qual vale. */
  var PASTA_ROI = /\/(usinasroi|eletropostoroi|hibridoroi)\/?/;
  var DESTINOS = PASTA_ROI.test(location.pathname)
    ? { 'usina-fotovoltaica': ['../usinasroi/', 'usina'],
        'eletroposto':        ['../eletropostoroi/', 'eletroposto'],
        'operacao-hibrida':   ['../hibridoroi/', 'hibrida'] }
    : { 'usina-fotovoltaica': ['./', 'usina'],
        'eletroposto':        ['eletroposto.html', 'eletroposto'],
        'operacao-hibrida':   ['hibrida.html', 'hibrida'] };

  /* O Stitch exportou os três arquivos com "Usina Fotovoltaica" marcada como
     página atual. Cada página marca a sua, e todos os links levam o caso. */
  function navegar(c, modoAtual) {
    var nav = document.querySelector('nav[data-active-classes]');
    var ativas = nav ? nav.getAttribute('data-active-classes').split(/\s+/) : [];
    var inativas = ['text-on-surface-variant', 'font-body-sm', 'text-body-sm'];
    var links = document.querySelectorAll('a[data-path]');

    for (var i = 0; i < links.length; i++) {
      var a = links[i], pth = a.getAttribute('data-path');
      var d = DESTINOS[pth];
      if (d) {
        a.href = linkDoModo(c.data, d[1], d[0]);
        var ehAtual = d[1] === modoAtual;
        // Só mexe nos links que estão dentro da barra: os do rodapé não têm
        // estado de "página atual".
        if (nav && nav.contains(a)) {
          ativas.forEach(function (cl) { a.classList.toggle(cl, ehAtual); });
          inativas.forEach(function (cl) { a.classList.toggle(cl, !ehAtual); });
          if (ehAtual) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        }
      } else if (pth === 'falar-com-especialista') {
        a.href = linkWhatsApp(c);
        a.target = '_blank';
        a.rel = 'noopener';
      }
    }

    // Os CTAs do eletroposto sao <button>, nao <a>: abrem o mesmo WhatsApp.
    var botoes = document.querySelectorAll('[data-path="falar-com-especialista"]:not(a)');
    for (var b = 0; b < botoes.length; b++) {
      botoes[b].addEventListener('click', function () {
        window.open(linkWhatsApp(c), '_blank', 'noopener');
      });
    }

    // Selo do cabecalho ("Online / Conectada") segue a etapa da usina.
    var est = estagioDe(c);
    var chips = document.querySelectorAll('[data-f="statusHeader"]');
    for (var k = 0; k < chips.length; k++) {
      var chip = chips[k].closest('.rounded-full') || chips[k];
      if (!est) { chip.style.display = 'none'; continue; }
      chips[k].textContent = est.cabecalho;
    }
  }

  /* A prosa do mockup cita a usina e a cidade do caso fictício. Substituir só
     em nós de texto: mexer no HTML cru quebraria atributos e classes. */
  function trocarNomes(c) {
    var trocas = [];
    /* O caso fictício do Stitch aparece com quatro grafias: "Usina Solar Santa
       Maria I", "Santa Maria I", "Santa Maria Hub" e "Santa Maria" sozinho. A
       ordem importa — do mais longo para o mais curto. */
    if (c.nome) {
      trocas.push([/Usina Solar Santa Maria I/g, c.nome],
                  [/Santa Maria I/g, c.nome],
                  [/Santa Maria Hub/g, c.nome],
                  [/Santa Maria/g, c.nome]);
    }
    if (c.local) trocas.push([/Mossoró\s*\/\s*RN/g, c.local]);
    if (c.data && c.data.cidade) trocas.push([/Mossoró/g, c.data.cidade]);
    if (c.concessionaria) trocas.push([/Neoenergia Cosern/g, c.concessionaria]);
    /* A prosa do mockup também repete as grandezas do caso fictício. Estas
       trocas rodam DEPOIS do preenchimento dos campos, então só encontram o
       que ficou solto no texto corrido. */
    if (c.usina.kwp) trocas.push([/112,5 kWp/g, nf1.format(c.usina.kwp) + ' kWp']);
    if (c.usina.kwCA) trocas.push([/75 kW CA/g, nf1.format(c.usina.kwCA) + ' kW CA']);
    if (c.usina.modulos) trocas.push([/160 [Mm]ódulos/g, nf.format(c.usina.modulos) + ' módulos']);
    // Prosa da página híbrida: o consumo mensal do eletroposto e a potência dele.
    if (c.ep) {
      if (c.ep.comprados) {
        trocas.push([/14\.880 kWh\/mês/g, nf.format(Math.round(c.ep.comprados)) + ' kWh/mês'],
                    [/14\.880/g, nf.format(Math.round(c.ep.comprados))]);
      }
      if (c.ep.kwEfetivo) trocas.push([/DC 80\s?kW/g, 'DC ' + nf.format(c.ep.kwEfetivo) + ' kW']);
    }
    if (!trocas.length) return;

    var it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var no;
    while ((no = it.nextNode())) {
      var t = no.nodeValue;
      if (!t || t.length < 4) continue;
      /* Campo preenchido com dado do caso ja' e' o valor real. Trocar de novo
         duplicava: nome "Usina Santa Maria" contém "Santa Maria" e o hero saía
         "Usina Usina Santa Maria"; a cidade Santa Maria virava o nome da usina. */
      if (no.parentElement && no.parentElement.closest('[data-f]')) continue;
      var novo = t;
      for (var i = 0; i < trocas.length; i++) novo = novo.replace(trocas[i][0], trocas[i][1]);
      if (novo !== t) no.nodeValue = novo;
    }
  }

  /* Imagens do mockup vivem num CDN do Google que expira. Quebrada, a tag vira
     o texto do alt no meio do layout. */
  function esconderImagensQuebradas() {
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      (function (im) {
        if (im.complete && im.naturalWidth === 0) im.style.display = 'none';
        im.addEventListener('error', function () { im.style.display = 'none'; });
      })(imgs[i]);
    }
  }

  glob.B2W = {
    ler: ler, montar: montar, decodeSlug: decodeSlug, encodeSlug: encodeSlug,
    linkDoModo: linkDoModo, navegar: navegar, trocarNomes: trocarNomes,
    linkWhatsApp: linkWhatsApp, estagioDe: estagioDe, etapasDe: etapasDe,
    esconderImagensQuebradas: esconderImagensQuebradas,
    fmt: {
      nf: nf, nf1: nf1, brl: brl, brl4: brl4,
      num: num, has: has, toNum: toNum,
      pctMes: pctMes, pct1: pct1, anos: anosTxt, anosLongo: anosLongo, grauDMS: grauDMS,
      // Valor ausente vira travessão em toda a página, sem exceção.
      ou: function (v, f) { return (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) ? '—' : f(v); }
    },
    const: { INFLACAO: INFLACAO, ANO_BASE: ANO_BASE, ANO_FIM: ANO_FIM,
             DISPONIBILIDADE_KWH: DISPONIBILIDADE_KWH }
  };
})(window);
