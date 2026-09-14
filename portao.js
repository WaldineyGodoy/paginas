/* =============================================================================
   portao.js — portão de captura de lead das três páginas (usina, eletroposto
   e híbrida).

   Carregado no <head>, antes do corpo aparecer: sem token válido, a página
   nasce escondida e só o portão fica visível. O token é o mesmo nas três
   páginas (mesma origem, mesma chave), então quem entrou numa entra nas outras.

   O objetivo é CAPTURAR O LEAD, não esconder números: o caso viaja dentro do
   próprio link e um atob() no console revela tudo. Quem valida de verdade é a
   Edge Function `usina-acesso`, no momento de emitir o token; aqui a checagem
   é só de validade.
   ========================================================================== */
(function () {
  'use strict';

  var API = 'https://abbysvxnnhwvvzhftoms.supabase.co/functions/v1/usina-acesso';
  var ANON = 'sb_publishable_HOPodX4h1n_dENhaszQIuw_6-bTmtVN';
  var CHAVE = 'b2w_usina_token';
  var raiz = document.documentElement;

  function tokenValido() {
    try {
      var t = localStorage.getItem(CHAVE);
      if (!t || t.indexOf('.') < 0) return false;
      var p = JSON.parse(atob(t.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof p.exp === 'number' && p.exp > Date.now();
    } catch (e) { return false; }
  }

  /* Atalho do visualizador: `#pular` abre sem portão, mas SÓ fora do ar
     (file:// ou localhost). Em produção o hash não faz nada — senão qualquer
     um burlaria a captura acrescentando #pular na URL. */
  var local = location.protocol === 'file:' ||
    ['localhost', '127.0.0.1', '[::1]'].indexOf(location.hostname) >= 0;
  if ((local && location.hash === '#pular') || tokenValido()) return;

  raiz.classList.add('portao-fechado');

  var estilo = document.createElement('style');
  estilo.textContent = [
    'html.portao-fechado body > :not(#portao){display:none !important}',
    'html.portao-fechado body{overflow:hidden}',
    '#portao{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;overflow:auto;',
    '  background:radial-gradient(circle at 25% 15%,rgba(242,107,0,.16),transparent 55%),#0B0F1E;',
    '  font-family:Inter,system-ui,sans-serif;color:#B8BCCE}',
    '#portao .pt-card{width:100%;max-width:420px;box-sizing:border-box;background:#141A33;',
    '  border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.45)}',
    '#portao .pt-marca{display:flex;align-items:center;gap:10px;font-family:Manrope,Inter,sans-serif;',
    '  font-weight:800;font-size:18px;color:#F8F9FB}',
    '#portao .pt-marca img{width:34px;height:34px;object-fit:contain}',
    '#portao .pt-marca b{color:#F26B00;font-weight:800}',
    '#portao h2{font-family:Manrope,Inter,sans-serif;color:#F8F9FB;font-size:22px;line-height:1.25;margin:20px 0 6px}',
    '#portao .pt-sub{font-size:14px;line-height:1.5;margin:0 0 20px}',
    '#portao form[hidden]{display:none}',
    '#portao .pt-campo{margin-bottom:14px}',
    '#portao label{display:block;font-size:12px;font-weight:500;color:#B8BCCE;margin:0 0 6px}',
    '#portao input{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:10px;background:#0B0F1E;',
    '  border:1px solid rgba(255,255,255,.14);color:#F8F9FB;font-size:15px;outline:none}',
    '#portao input:focus{border-color:#F26B00}',
    '#portao .pt-btn{width:100%;padding:13px;border:0;border-radius:10px;background:#F26B00;color:#fff;',
    '  font-weight:700;font-size:15px;cursor:pointer;margin-top:4px}',
    '#portao .pt-btn:disabled{opacity:.6;cursor:wait}',
    '#portao .pt-link{display:block;width:100%;background:none;border:0;color:#6FE9F0;font-size:13px;',
    '  margin-top:12px;cursor:pointer}',
    '#portao .pt-msg{min-height:20px;font-size:13px;line-height:1.45;margin-top:12px}',
    '#portao .pt-msg.erro{color:#FF8A8A}',
    '#portao .pt-msg.ok{color:#5EE0A0}',
    '#portao .pt-legal{font-size:11px;line-height:1.5;color:#7D8299;margin:14px 0 0}'
  ].join('\n');
  document.head.appendChild(estilo);

  function montar() {
    /* O ligador troca o corpo por "Link inválido" quando o slug não serve.
       Não há o que capturar nesse caso: abre e deixa a mensagem aparecer. */
    if (!document.querySelector('[data-f]')) { raiz.classList.remove('portao-fechado'); return; }

    var caminho = location.pathname;
    var doQue = /eletroposto/.test(caminho) ? 'deste eletroposto'
      : /hibrid/.test(caminho) ? 'desta operação híbrida' : 'desta usina';

    var el = document.createElement('div');
    el.id = 'portao';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'ptTitulo');
    el.innerHTML =
      '<div class="pt-card">' +
      '  <div class="pt-marca"><img src="logo-b2w-invest.png" alt=""><span>B2W <b>Invest</b></span></div>' +
      '  <h2 id="ptTitulo">Veja os números ' + doQue + '</h2>' +
      '  <p class="pt-sub">Informe seus dados. Enviamos um código de acesso pelo WhatsApp.</p>' +
      '  <form id="ptCadastro" autocomplete="on">' +
      '    <div class="pt-campo"><label for="ptNome">Nome completo</label>' +
      '      <input id="ptNome" type="text" autocomplete="name" required></div>' +
      '    <div class="pt-campo"><label for="ptEmail">E-mail</label>' +
      '      <input id="ptEmail" type="email" autocomplete="email" required></div>' +
      '    <div class="pt-campo"><label for="ptTel">WhatsApp com DDD</label>' +
      '      <input id="ptTel" type="tel" inputmode="tel" autocomplete="tel" placeholder="84 90000-0000" required></div>' +
      '    <button class="pt-btn" type="submit" id="ptBtnCadastro">Receber código no WhatsApp</button>' +
      '    <button class="pt-link" type="button" id="ptJaTenho">Já acessei antes</button>' +
      '  </form>' +
      '  <form id="ptLogin" autocomplete="on" hidden>' +
      '    <div class="pt-campo"><label for="ptTelLogin">WhatsApp com DDD</label>' +
      '      <input id="ptTelLogin" type="tel" inputmode="tel" autocomplete="tel" placeholder="84 90000-0000" required></div>' +
      '    <button class="pt-btn" type="submit" id="ptBtnLogin">Receber código</button>' +
      '    <button class="pt-link" type="button" id="ptPrimeira">É minha primeira vez aqui</button>' +
      '  </form>' +
      '  <form id="ptCodigo" hidden>' +
      '    <div class="pt-campo"><label for="ptCod">Código de 6 dígitos</label>' +
      '      <input id="ptCod" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></div>' +
      '    <button class="pt-btn" type="submit" id="ptBtnCodigo">Entrar</button>' +
      '    <button class="pt-link" type="button" id="ptVoltar">Usar outro número</button>' +
      '  </form>' +
      '  <div class="pt-msg" id="ptMsg" role="status" aria-live="polite"></div>' +
      '  <p class="pt-legal">Ao continuar você concorda em receber contato da B2W Energia sobre este investimento.</p>' +
      '</div>';
    document.body.appendChild(el);

    function $(id) { return document.getElementById(id); }
    var fCad = $('ptCadastro'), fLog = $('ptLogin'), fCod = $('ptCodigo'), msg = $('ptMsg');
    var telefoneEmUso = '';

    function aviso(texto, tipo) {
      msg.textContent = texto || '';
      msg.className = 'pt-msg' + (texto ? ' ' + tipo : '');
    }
    function mostrar(form) {
      [fCad, fLog, fCod].forEach(function (f) { f.hidden = f !== form; });
      aviso('');
      var primeiro = form.querySelector('input');
      if (primeiro) primeiro.focus();
    }

    function chamar(corpo, botao, ocupado) {
      var rotulo = botao.textContent;
      botao.disabled = true; botao.textContent = ocupado;
      return fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: 'Bearer ' + ANON },
        body: JSON.stringify(corpo)
      })
        // fetch não lança em 4xx/5xx: o corpo é que diz o que houve.
        .then(function (r) { return r.json(); })
        .catch(function () { return { erro: 'Sem conexão. Tente de novo.' }; })
        .then(function (res) { botao.disabled = false; botao.textContent = rotulo; return res; });
    }

    function codigoEnviado(res) {
      mostrar(fCod);
      aviso('Código enviado no WhatsApp. Ele vale por ' + (res.expiraEm || 10) + ' minutos.', 'ok');
    }

    function abrir() {
      raiz.classList.remove('portao-fechado');
      el.remove();
      window.scrollTo(0, 0);
      // Gráficos que mediram a tela enquanto ela estava escondida se refazem.
      window.dispatchEvent(new Event('resize'));
    }

    fCad.addEventListener('submit', function (ev) {
      ev.preventDefault();
      telefoneEmUso = $('ptTel').value;
      chamar({ acao: 'cadastrar', nome: $('ptNome').value, email: $('ptEmail').value, telefone: telefoneEmUso },
        $('ptBtnCadastro'), 'Enviando...').then(function (res) {
        if (res.erro) return aviso(res.erro, 'erro');
        codigoEnviado(res);
      });
    });

    fLog.addEventListener('submit', function (ev) {
      ev.preventDefault();
      telefoneEmUso = $('ptTelLogin').value;
      chamar({ acao: 'entrar', telefone: telefoneEmUso }, $('ptBtnLogin'), 'Enviando...').then(function (res) {
        if (res.encontrado === false) {
          mostrar(fCad);
          $('ptTel').value = telefoneEmUso;
          return aviso('Não encontramos esse número. Complete o cadastro abaixo.', 'erro');
        }
        if (res.erro) return aviso(res.erro, 'erro');
        codigoEnviado(res);
      });
    });

    fCod.addEventListener('submit', function (ev) {
      ev.preventDefault();
      chamar({ acao: 'verificar', telefone: telefoneEmUso, codigo: $('ptCod').value },
        $('ptBtnCodigo'), 'Verificando...').then(function (res) {
        if (res.erro) return aviso(res.erro, 'erro');
        try { localStorage.setItem(CHAVE, res.token); } catch (e) { /* modo privado: entra só nesta visita */ }
        abrir();
      });
    });

    $('ptJaTenho').addEventListener('click', function () { mostrar(fLog); });
    $('ptPrimeira').addEventListener('click', function () { mostrar(fCad); });
    $('ptVoltar').addEventListener('click', function () { mostrar(fCad); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
