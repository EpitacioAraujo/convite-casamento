import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar plugin do GSAP
gsap.registerPlugin(ScrollTrigger)

/* ==========================================
   1. MENU MOBILE (HAMBÚRGUER)
   ========================================== */
const navToggle = document.querySelector('.nav-toggle')
const navMenu = document.querySelector('.nav-menu')
const navLinks = document.querySelectorAll('.nav-link')
const header = document.querySelector('.header-nav')

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open')
    navMenu.classList.toggle('open')
  })

  // Fechar menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open')
      navMenu.classList.remove('open')
    })
  })
}

// Efeito de scroll no Header (mudar background)
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header?.classList.add('scrolled')
  } else {
    header?.classList.remove('scrolled')
  }
})

// Highlight do link ativo na navegação baseado na rolagem
window.addEventListener('scroll', () => {
  let scrollPosition = window.scrollY + 100

  document.querySelectorAll('section').forEach(section => {
    if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
      const id = section.getAttribute('id')
      navLinks.forEach(link => {
        link.classList.remove('active')
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active')
        }
      })
    }
  })
})


/* ==========================================
   2. CONTAGEM REGRESSIVA (COUNTDOWN)
   ========================================== */
// Data do casamento: 21 de Outubro de 2026 às 16:30
const weddingDate = new Date('Oct 21, 2026 16:30:00').getTime()

function updateCountdown() {
  const now = new Date().getTime()
  const distance = weddingDate - now

  // Se a data já passou
  if (distance < 0) {
    document.querySelector('.countdown-grid').innerHTML = `
      <div class="countdown-card" style="max-width: 100%; width: 100%;">
        <span class="countdown-num" style="font-size: 1.8rem; font-style: italic;">Chegou o Grande Dia!</span>
      </div>
    `
    return
  }

  // Cálculos de tempo
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  // Mostrar na tela com padding de zero à esquerda
  const daysEl = document.getElementById('days')
  const hoursEl = document.getElementById('hours')
  const minutesEl = document.getElementById('minutes')
  const secondsEl = document.getElementById('seconds')

  if (daysEl) daysEl.innerText = String(days).padStart(2, '0')
  if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0')
  if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0')
  if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0')
}

// Atualizar a cada 1 segundo
setInterval(updateCountdown, 1000)
updateCountdown()


/* ==========================================
   3. COPIAR CHAVE PIX
   ========================================== */
const copyPixBtn = document.getElementById('copy-pix-btn')
const pixKey = document.getElementById('pix-key')
const pixFeedback = document.getElementById('pix-feedback')

if (copyPixBtn && pixKey && pixFeedback) {
  copyPixBtn.addEventListener('click', () => {
    const keyText = pixKey.innerText.trim()
    navigator.clipboard.writeText(keyText).then(() => {
      // Feedback Visual
      pixFeedback.classList.remove('d-none')
      copyPixBtn.innerText = 'Copiado!'
      copyPixBtn.classList.remove('btn-outline')
      copyPixBtn.classList.add('btn-primary')

      setTimeout(() => {
        pixFeedback.classList.add('d-none')
        copyPixBtn.innerText = 'Copiar Chave'
        copyPixBtn.classList.remove('btn-primary')
        copyPixBtn.classList.add('btn-outline')
      }, 3000)
    }).catch(err => {
      console.error('Erro ao copiar chave Pix: ', err)
    })
  })
}


/* ==========================================
   4. FORMULÁRIO RSVP (com convite personalizado)
   ========================================== */
const rsvpForm   = document.getElementById('rsvp-form')
const rsvpSuccess = document.getElementById('rsvp-success')
const rsvpHeader  = document.getElementById('rsvp-header-text')
const membersContainer = document.getElementById('rsvp-members')

if (window.__INVITE && rsvpForm && rsvpSuccess) {
  const invite = window.__INVITE

  // Já confirmou tudo
  if (invite.all_confirmed) {
    rsvpForm.classList.add('d-none')
    rsvpSuccess.classList.remove('d-none')
    const h3 = rsvpSuccess.querySelector('h3')
    if (h3) h3.textContent = `Presença confirmada, ${invite.family_name}!`
    const p = rsvpSuccess.querySelector('p')
    if (p) p.textContent = `${invite.confirmed_count} de ${invite.total_members} pessoa(s) confirmada(s). Aguardamos vocês!`
    gsap.fromTo(rsvpSuccess, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
  } else {
    // Header personalizado
    if (rsvpHeader) {
      rsvpHeader.textContent = `${invite.family_name}, confirme sua presença!`
    }

    // Esconde os campos genéricos (name, phone, guests) e mostra checkboxes
    const nameGroup = document.getElementById('rsvp-name-group')
    const phoneGroup = document.getElementById('rsvp-phone-group')
    const guestsGroup = document.getElementById('rsvp-guests-group')
    if (nameGroup) nameGroup.style.display = 'none'
    if (phoneGroup) phoneGroup.style.display = 'none'
    if (guestsGroup) guestsGroup.style.display = 'none'

    // Renderiza checkboxes dos membros
    if (membersContainer) {
      membersContainer.innerHTML = '<label>Quem irá comparecer?</label>' +
        invite.members.map((m, i) => `
          <label class="member-checkbox ${m.confirmed ? 'confirmed' : ''}">
            <input type="checkbox" name="members[]" value="${m.id}" ${m.confirmed ? 'checked disabled' : ''}>
            <span>${m.name}</span>
            ${m.confirmed ? '<em class="already-ok">já confirmado</em>' : ''}
          </label>
        `).join('')
      membersContainer.style.display = 'flex'
    }

    // Atualiza action do form com o código
    rsvpForm.action = `index.php?code=${invite.code}`

    // Se todos confirmados individualmente (não via POST ainda), esconde submit
    const allChecked = invite.members.every(m => m.confirmed)
    const submitBtn = rsvpForm.querySelector('button[type="submit"]')
    if (allChecked && submitBtn) {
      submitBtn.style.display = 'none'
    }
  }
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', () => {
    const btn = rsvpForm.querySelector('button[type="submit"]')
    if (btn) { btn.innerText = 'Enviando...'; btn.disabled = true }
  })
}

/* ==========================================
   4b. LISTA DE PRESENTES DINÂMICA
   ========================================== */
if (window.__GIFTS && window.__GIFTS.length > 0) {
  const giftsList = document.getElementById('gifts-dynamic-list')
  if (giftsList) {
    giftsList.innerHTML = window.__GIFTS.map(g => `
      <li class="gift-item ${g.chosen_by ? 'chosen' : ''}">
        <span class="gift-name">${g.name}</span>
        <span class="gift-value">R$ ${parseFloat(g.value).toFixed(2).replace('.', ',')}</span>
        ${g.link ? `<a href="${g.link}" target="_blank" class="gift-link">Ver presente</a>` : ''}
        ${g.chosen_by ? `<span class="gift-chosen-badge">🎁 Escolhido</span>` : ''}
      </li>
    `).join('')
  }
}


/* ==========================================
   5. ANIMAÇÕES GSAP (MOTION DESIGN)
   ========================================== */
// Efeito de entrada suave nos elementos da Hero
window.addEventListener('load', () => {
  const tl = gsap.timeline()
  
  // Parallax sutil no fundo da hero ao carregar
  gsap.to('.hero-bg', {
    transform: 'scale(1)',
    duration: 2.5,
    ease: 'power2.out'
  })

  tl.fromTo('.hero-subtitle', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  .fromTo('.hero-title', 
    { opacity: 0, y: 40 }, 
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    '-=0.7'
  )
  .fromTo('.hero-tagline', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    '-=0.8'
  )
  .fromTo('.hero-date-block', 
    { opacity: 0, scale: 0.9 }, 
    { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
    '-=0.6'
  )
  .fromTo('.btn-hero', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
    '-=0.5'
  )
  .fromTo('.scroll-indicator',
    { opacity: 0 },
    { opacity: 0.8, duration: 1 },
    '-=0.2'
  )
})

// Animação de cards e seções com ScrollTrigger (fade/slide up suave de alta classe)
gsap.utils.toArray('.reveal-up').forEach((elem) => {
  gsap.fromTo(elem, 
    { opacity: 0, y: 50 },
    {
      scrollTrigger: {
        trigger: elem,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }
  )
})

// Animação staggered da colagem polaroid (cada card sobe com delay)
gsap.utils.toArray('.reveal-collage').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 60, scale: 0.88 },
    {
      scrollTrigger: {
        trigger: '.collage-grid',
        start: 'top 82%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.75,
      delay: i * 0.12,
      ease: 'power3.out'
    }
  )
})

// Animação de fade-in de outras seções principais
const fadeSections = ['#countdown', '#detalhes .section-header', '#galeria .section-header', '#colagem .section-header', '#rsvp', '#presentes', '#info']
fadeSections.forEach((sel) => {
  const element = document.querySelector(sel)
  if (element) {
    gsap.fromTo(element,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }
    )
  }
})
