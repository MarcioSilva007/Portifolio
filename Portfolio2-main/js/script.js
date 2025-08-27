// JavaScript do portfolio - funcionalidades interativas
// Código organizado em funções para melhor manutenção

(function () {
  'use strict';

  // Inicia todas as funcionalidades quando a página carrega
  document.addEventListener('DOMContentLoaded', () => {
    // Página aparece suavemente
    document.body.classList.add('loaded');
    
    initNavToggle();      // Menu mobile
    initCopyButtons();    // Botões de copiar
    initContactForm();    // Formulário
    initAnimatedCounters(); // Contadores das estatísticas
    initScrollAnimations(); // Animações na rolagem
    initCollapsibleSections(); // Expandir/colapsar seções
    setYear();           // Ano atual no footer
  });

  // Menu hambúrguer para mobile
  function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    
    // Sai da função se não encontrar os elementos
    if (!toggle || !nav) return;

    // Abre/fecha o menu ao clicar
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      // Atualiza atributo para acessibilidade
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu quando clica em um link
    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.matches('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Funcionalidade dos botões "copiar" para email e WhatsApp
  function initCopyButtons() {
    const buttons = document.querySelectorAll('.link--copy');
    
    // Verificação de suporte e presença de elementos
    if (!buttons.length || !navigator.clipboard) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Obtenção do elemento a ser copiado através do atributo data-copy
        const selector = btn.getAttribute('data-copy');
        if (!selector) return;
        
        const el = document.querySelector(selector);
        if (!(el instanceof HTMLAnchorElement)) return;
        
        const text = el.textContent?.trim();
        if (!text) return;

        // Cópia para área de transferência com feedback visual
        navigator.clipboard.writeText(text).then(() => {
          flash(btn, 'Copiado!');
        }).catch(() => {
          flash(btn, 'Erro ao copiar');
        });
      });
    });
  }

  // Gerenciamento do formulário de contato com envio via WhatsApp
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!(form instanceof HTMLFormElement)) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevenção do envio padrão do formulário

      // Obtenção dos campos que precisam ser validados
      const nome = form.querySelector('#nome');
      const email = form.querySelector('#email');
      const assunto = form.querySelector('#assunto');
      const mensagem = form.querySelector('#mensagem');

      // Limpeza de erros anteriores e validação de todos os campos
      clearErrors(form);
      const isValid = validateRequired(nome) & validateEmail(email) & validateRequired(assunto) & validateRequired(mensagem);
      if (!isValid) return;

      // Formatação da mensagem para WhatsApp
      const whatsappMessage = formatWhatsAppMessage({
        nome: nome.value.trim(),
        email: email.value.trim(),
        assunto: assunto.value,
        mensagem: mensagem.value.trim()
      });

      // Envio via WhatsApp
      sendToWhatsApp(whatsappMessage);
    });
  }

  // Função para formatar a mensagem do WhatsApp
  function formatWhatsAppMessage(data) {
    const assuntoTexto = {
      'oportunidade': 'Oportunidade de trabalho',
      'projeto': 'Proposta de projeto',
      'consultoria': 'Consultoria',
      'networking': 'Networking',
      'outro': 'Outro'
    }[data.assunto] || data.assunto;

    return `🚀 *Nova mensagem do portfólio!*

👤 *Nome:* ${data.nome}
📧 *Email:* ${data.email}
📋 *Assunto:* ${assuntoTexto}

💬 *Mensagem:*
${data.mensagem}

---
_Enviado através do formulário de contato do portfólio_`;
  }

  // Função para enviar mensagem via WhatsApp
  function sendToWhatsApp(message) {
    const phoneNumber = '5511954381825'; // Número do WhatsApp (11) 95438-1825
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappURL, '_blank');
    
    // Feedback visual para o usuário
    const button = document.querySelector('#contactForm button[type="submit"]');
    if (button) {
      flash(button, '✓ Redirecionando...');
    }
  }

  // Funções auxiliares para validação do formulário
  function validateRequired(input) {
    if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement)) return false;
    const error = getErrorEl(input);
    const value = input.value.trim();
    if (!value) {
      error.textContent = 'Campo obrigatório';
      return false;
    }
    return true;
  }

  // Validação específica para email usando regex
  function validateEmail(input) {
    if (!(input instanceof HTMLInputElement)) return false;
    const error = getErrorEl(input);
    const value = input.value.trim();
    // Regex simples mas eficaz para validar formato de email
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!ok) {
      error.textContent = 'Email inválido';
      return false;
    }
    return true;
  }

  // Busca do elemento de erro associado a cada campo do formulário
  function getErrorEl(input) {
    const name = input.getAttribute('id');
    const el = document.querySelector(`.form__error[data-error-for="${name}"]`);
    return el || document.createElement('span'); // Fallback se não encontrar
  }

  // Limpeza de todas as mensagens de erro do formulário
  function clearErrors(scope) {
    scope.querySelectorAll('.form__error').forEach((el) => el.textContent = '');
  }

  // Feedback visual temporário para os botões (ex: "Copiado!")
  function flash(el, text) {
    const original = el.textContent;
    el.textContent = text;
    el.setAttribute('disabled', 'true');
    el.style.background = 'linear-gradient(135deg, #34a853 0%, #0f9d58 100%)';
    
    // Retorno ao texto original após 2s
    setTimeout(() => {
      el.textContent = original;
      el.removeAttribute('disabled');
      el.style.background = ''; // Remove o estilo inline
    }, 2000);
  }

  // Atualização automática do ano no footer
  function setYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  // Contadores animados para as estatísticas do portfólio
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('.animated-counter');
    if (!counters.length) return;

    // Configurações do observer - animação quando 70% do elemento está visível
    const observerOptions = {
      threshold: 0.7,
      rootMargin: '0px 0px -50px 0px'
    };

    // Observer que detecta quando os contadores entram na tela
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target') || '0');
          animateCounter(counter, target);
          observer.unobserve(counter); // Para de observar após animar
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  // Animação suave dos números usando requestAnimationFrame
  function animateCounter(element, target) {
    const duration = 2000; // 2 segundos para a animação completa
    const start = performance.now();
    const startValue = 0;

    function updateCounter(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing para deixar a animação mais natural
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
      
      element.textContent = current.toString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toString(); // Garante o valor final exato
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Sistema de animações que aparecem conforme a rolagem da página
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .skill-item, .timeline__item');
    if (!animatedElements.length) return;

    // Configurações para detectar quando elementos entram na tela
    const observerOptions = {
      threshold: 0.1, // Anima quando 10% do elemento está visível
      rootMargin: '0px 0px -50px 0px'
    };

    // Observer que gerencia as animações de entrada
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Elementos aparecem suavemente de baixo para cima
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target); // Para de observar após animar
        }
      });
    }, observerOptions);

    // Aplicação de estilos iniciais e registro de cada elemento para animação
    animatedElements.forEach((element, index) => {
      element.style.opacity = '0'; // Invisível inicialmente
      element.style.transform = 'translateY(20px)'; // Deslocado para baixo
      // Delay escalonado para criar efeito cascata
      element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(element);
    });
  }

  // Sistema de expandir/colapsar para seções como certificações
  function initCollapsibleSections() {
    const headers = document.querySelectorAll('.collapsible-header');
    
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const targetId = header.getAttribute('data-toggle');
        const targetElement = document.getElementById(targetId);
        const icon = header.querySelector('.expand-icon');
        
        if (!targetElement || !icon) return;
        
        // Toggle da classe collapsed
        const isCollapsed = targetElement.classList.contains('collapsed');
        
        if (isCollapsed) {
          // Expandir
          targetElement.classList.remove('collapsed');
          icon.classList.add('rotated');
          icon.textContent = '−';
          // Garantir que o conteúdo seja totalmente visível
          targetElement.style.maxHeight = 'none';
        } else {
          // Colapsar
          targetElement.classList.add('collapsed');
          icon.classList.remove('rotated');
          icon.textContent = '+';
        }
      });
    });
  }
})();
