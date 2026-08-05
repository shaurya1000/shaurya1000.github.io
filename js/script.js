(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Logo chips (language/tool/OS icons, with graceful text fallback if an icon fails to load)
  var DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
  var SI = 'https://cdn.simpleicons.org/';
  var langs = [
    { name:'Python', icon: DEV + 'python/python-original.svg' },
    { name:'Java', icon: DEV + 'java/java-original.svg' },
    { name:'JavaScript', icon: DEV + 'javascript/javascript-original.svg' },
    { name:'C++', icon: DEV + 'cplusplus/cplusplus-original.svg' },
    { name:'C', icon: DEV + 'c/c-original.svg' },
    { name:'HTML', icon: DEV + 'html5/html5-original.svg' },
    { name:'CSS', icon: DEV + 'css3/css3-original.svg' }
  ];
  var tools = [
    { name:'Git', icon: DEV + 'git/git-original.svg' },
    { name:'MySQL', icon: DEV + 'mysql/mysql-original.svg' },
    { name:'PHP', icon: DEV + 'php/php-original.svg' },
    { name:'React', icon: DEV + 'react/react-original.svg' },
    { name:'Processing', icon: SI + 'processingfoundation' },
    { name:'Vite', icon: DEV + 'vitejs/vitejs-original.svg' },
    { name:'Firebase', icon: DEV + 'firebase/firebase-plain.svg' }
  ];
  var oses = [
    { name:'Kali Linux', icon: SI + 'kalilinux' },
    { name:'Ubuntu Server', icon: DEV + 'ubuntu/ubuntu-plain.svg' },
    { name:'Windows Server', icon: DEV + 'windows8/windows8-original.svg' }
  ];

  function renderLogoChips(containerId, items){
    var container = document.getElementById(containerId);
    if (!container) return;
    items.forEach(function(item){
      var chip = document.createElement('span');
      chip.className = 'chip logo-chip';
      var iconWrap = document.createElement('span');
      iconWrap.className = 'chip-icon';
      var img = document.createElement('img');
      img.src = item.icon;
      img.alt = '';
      img.loading = 'lazy';
      var fallback = document.createElement('span');
      fallback.className = 'fallback';
      fallback.textContent = item.name.charAt(0);
      img.onerror = function(){
        img.style.display = 'none';
        fallback.style.display = 'flex';
      };
      iconWrap.appendChild(img);
      iconWrap.appendChild(fallback);
      var label = document.createElement('span');
      label.textContent = item.name;
      chip.appendChild(iconWrap);
      chip.appendChild(label);
      container.appendChild(chip);
    });
  }
  renderLogoChips('langChips', langs);
  renderLogoChips('toolChips', tools);
  renderLogoChips('osChips', oses);

  // Mobile nav
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', function(e){
    if (e.target.tagName === 'A') navLinks.classList.remove('open');
  });

  // Scroll-spy
  var links = Array.prototype.slice.call(navLinks.querySelectorAll('a'));
  var sections = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  function onScroll(){
    var pos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function(s){ if (s && s.offsetTop <= pos) current = s; });
    links.forEach(function(a){
      a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Scroll progress bar
  var progressBar = document.getElementById('scrollProgress');
  function updateProgress(){
    if (!progressBar) return;
    var docEl = document.documentElement;
    var scrollTop = window.scrollY || docEl.scrollTop;
    var height = docEl.scrollHeight - docEl.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  // Reveal on scroll
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  // Rotating "Hello" greeting, cycling every 6 seconds
  var greetings = [
    'Hello', 'Hola', 'Bonjour', 'Ciao', 'Hallo', 'Olá', 'こんにちは', '你好', '안녕하세요',
    'नमस्ते', 'Merhaba', 'Привет', 'مرحبا', 'Shalom', 'Sawubona', 'Halo', 'Xin chào',
    'Sawasdee', 'Kumusta', 'Selam', 'Jambo', 'Dobrý den', 'Cześć', 'Salut', 'Hej',
    'Hei', 'Tere', 'Sveiki', 'Ahoj', 'Zdravo', 'Habari', 'Yassou', 'Namaskaram',
    'Vanakkam', 'Kem cho', 'Aloha', 'Talofa', 'Bula', 'Konnichiwa', 'Anyoung',
    'Szia', 'Salve', 'Grüezi', 'Goddag', 'Sannu', 'Mingalaba', 'Wa alaikum'
  ];
  var helloEl = document.getElementById('helloText');
  if (helloEl) {
    var gi = 0;
    setInterval(function(){
      gi = (gi + 1) % greetings.length;
      if (reduceMotion) {
        helloEl.textContent = greetings[gi];
      } else {
        helloEl.classList.add('swap-out');
        setTimeout(function(){
          helloEl.textContent = greetings[gi];
          helloEl.classList.remove('swap-out');
        }, 350);
      }
    }, 6000);
  }

  // Rotating role text (Software Developer / IT Professional / CIS Graduate), cycling every 6 seconds
  var roles = ['Software Developer', 'IT Professional', 'CIS Graduate'];
  var roleEl = document.getElementById('roleSwitch');
  if (roleEl) {
    var ri = 0;
    setInterval(function(){
      ri = (ri + 1) % roles.length;
      if (reduceMotion) {
        roleEl.textContent = roles[ri];
      } else {
        roleEl.classList.add('fade');
        setTimeout(function(){
          roleEl.textContent = roles[ri];
          roleEl.classList.remove('fade');
        }, 450);
      }
    }, 6000);
  }
})();
