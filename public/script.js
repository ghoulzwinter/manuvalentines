document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('container');

  const wrapper = document.querySelector('.wrapper');
  const openBtn = document.getElementById('openBtn');
  const closeBtn = document.getElementById('closeBtn');
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');

  const rotator = document.querySelector('.header-rotator');
  const gifSources = ['./8edddcf4670d6dbeaf28ee97831825ad.gif', './dudu-bubu.gif', './MwwEcx7yJSCt.gif'];
  if (rotator) {
    gifSources.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'header-gif';
      if (src.includes('8edddcf4670d6dbeaf28ee97831825ad.gif')) img.dataset.duration = '3000';
      else img.dataset.duration = '10000';
      if (i === 0) img.classList.add('active');
      rotator.appendChild(img);
    });
    let gifIndex = 0;
    let rotatorTimer = null;
    function scheduleNext() {
      const imgs = rotator.querySelectorAll('img');
      if (!imgs.length) return;
      const current = imgs[gifIndex];
      const duration = parseInt(current.dataset.duration, 10) || 10000;
      rotatorTimer = setTimeout(() => {
        current.classList.remove('active');
        gifIndex = (gifIndex + 1) % imgs.length;
        imgs[gifIndex].classList.add('active');
        scheduleNext();
      }, duration);
    }
    scheduleNext();
  }

  if (!wrapper || !openBtn || !closeBtn || !noBtn || !yesBtn) return;

  openBtn.addEventListener('click', () => {
    wrapper.classList.add('open');
    openBtn.style.display = 'none';
    closeBtn.style.display = 'inline-block';
  });

  closeBtn.addEventListener('click', () => {
    wrapper.classList.remove('open');
    closeBtn.style.display = 'none';
    openBtn.style.display = 'inline-block';
  });

  let avoidSinceLastChallenge = 0;
  const CHALLENGE_THRESHOLD = 8;
  let challengeActive = false;
  let originalParent = null;
  let originalNextSibling = null;

  function teleportNoButton() {
    if (challengeActive) return;

    avoidSinceLastChallenge += 1;
    if (avoidSinceLastChallenge >= CHALLENGE_THRESHOLD) {
      showDogChallenge();
      return;
    }

    const padding = 12;
    if (noBtn.parentElement !== document.body) {
      originalParent = noBtn.parentElement;
      originalNextSibling = noBtn.nextElementSibling;
      document.body.appendChild(noBtn);
    }

    const rect = noBtn.getBoundingClientRect();
    const btnW = rect.width || 80;
    const btnH = rect.height || 36;
    const minLeft = padding;
    const maxLeft = Math.max(document.documentElement.clientWidth - btnW - padding, minLeft);
    const minTop = padding;
    const maxTop = Math.max(document.documentElement.clientHeight - btnH - padding, minTop);

    const left = Math.floor(minLeft + Math.random() * (maxLeft - minLeft + 1));
    const top = Math.floor(minTop + Math.random() * (maxTop - minTop + 1));

    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.min(Math.max(left, minLeft), maxLeft) + 'px';
    noBtn.style.top = Math.min(Math.max(top, minTop), maxTop) + 'px';
    noBtn.style.zIndex = '999';
  }

  noBtn.addEventListener('mouseover', () => {
    teleportNoButton();
  });

  noBtn.addEventListener('click', (e) => {
    if (challengeActive) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    teleportNoButton();
  });

  function showDogChallenge() {
    challengeActive = true;

    const overlay = document.createElement('div');
    overlay.className = 'dog-challenge-overlay';

    const box = document.createElement('div');
    box.className = 'dog-challenge-box';
    overlay.appendChild(box);

    const title = document.createElement('h2');
    title.textContent = 'Count the dogs';
    box.appendChild(title);

    const info = document.createElement('p');
    info.textContent = '';
    box.appendChild(info);

    const dogContainer = document.createElement('div');
    dogContainer.className = 'dog-grid';
    box.appendChild(dogContainer);

    const form = document.createElement('form');
    form.className = 'dog-form';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.required = true;
    input.className = 'dog-input';
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Submit';
    form.appendChild(input);
    form.appendChild(submit);
    box.appendChild(form);

    const feedback = document.createElement('div');
    feedback.className = 'dog-feedback';
    box.appendChild(feedback);

    document.body.appendChild(overlay);

    function generateChallenge() {
      const count = Math.floor(Math.random() * 9) + 7; // 7..15
      dogContainer.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.className = 'dog-emoji';
        s.textContent = '🐶';
        dogContainer.appendChild(s);
      }
      return count;
    }

    let currentCount = generateChallenge();

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const val = parseInt(input.value, 10);
      if (Number.isNaN(val)) return;
      if (val === currentCount) {
        overlay.remove();
        challengeActive = false;
        avoidSinceLastChallenge = 0;
        if (originalParent) {
          if (originalNextSibling) originalParent.insertBefore(noBtn, originalNextSibling);
          else originalParent.appendChild(noBtn);
          originalParent = null;
          originalNextSibling = null;
        } else {
          const buttonsContainer = document.querySelector('.envelope-area .buttons') || document.querySelector('.buttons');
          if (buttonsContainer) buttonsContainer.appendChild(noBtn);
        }
        noBtn.style.position = '';
        noBtn.style.left = '';
        noBtn.style.top = '';
        noBtn.style.zIndex = '';
        noBtn.style.display = '';
        noBtn.disabled = false;
      } else {
        feedback.textContent = 'WRONG';
        input.value = '';
        currentCount = generateChallenge();
      }
      input.focus();
    });
  }

  yesBtn.addEventListener('click', () => {
    const envelopeArea = document.querySelector('.envelope-area');
    if (envelopeArea) envelopeArea.remove();

    const close = document.getElementById('closeBtn');
    if (close) close.remove();

    const reveal = document.createElement('div');
    reveal.className = 'reveal';

    const topStack = document.createElement('div');
    topStack.className = 'reveal__top-images';
    const topSources = ['new1.jpg', 'new2.jpg', 'new3.jpg'];
    topSources.forEach(src => {
      const i = document.createElement('img');
      i.src = src;
      i.alt = '';
      topStack.appendChild(i);
    });
    reveal.appendChild(topStack);

    const msg = document.createElement('h1');
    msg.className = 'reveal__message';
    msg.textContent = '❤ I love you ❤';
    reveal.appendChild(msg);

    const imgs = document.createElement('div');
    imgs.className = 'reveal__images';
    const sources = ['image.png', 'image0.jpg', 'image2.jpg'];
    sources.forEach(src => {
      const i = document.createElement('img');
      i.src = src;
      i.alt = '';
      imgs.appendChild(i);
    });
    reveal.appendChild(imgs);

    const stage = document.querySelector('.stage') || document.body;
    stage.appendChild(reveal);
  });
});
