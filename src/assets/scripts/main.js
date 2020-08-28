(function () {

  // Set up the interface for the dashboard view.
  function showDashboard() {
    document.querySelector('.main-nav__item--signup').classList.add('hide');
    document.querySelector('.main-nav__item--logout').classList.remove('hide');
    document.querySelector('.logged-in-content').classList.remove('hide');
    document.querySelector('.main-content').classList.add('main-content--dashboard');
    inviteNewUser();
    logout();
  }

  // Fetch the users.
  function getUsers() {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://castcrew.herokuapp.com/people'; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://castcrew.herokuapp.com/people
      .then((response) => response.text())
      .then((contents) => showUsers(contents))
      .catch(() =>
        console.log('Can’t access ' + url + ' response. Blocked by browser?')
      );
  }

  // Render all users.
  function showUsers(obj) {
    const markup = document.getElementById('dashboard-users');
    markup.querySelector('.dashboard__users-loading').classList.add('hide');
    if (!markup) return;

    const jsonObj = JSON.parse(obj);
    const collection = jsonObj.collection;
    for (let prop in collection) {
      markup.innerHTML += `
        <div class="user">
          <a class="user__link" href="/user/${collection[prop].id}">
          <div class="user__media">
            <picture class="user__pict">
              <img class="user__img" src="${collection[prop].avatar}" alt=""/>
            </picture>
            <div class="user__media-copy">
              <h2 class="user__name">${collection[prop].name}</h2>
              <p class="user__info">${collection[prop].position} • ${collection[prop].job_title}</p>
            </div>
            <svg class="user__media-icon icon icon--chevron"><use xlink:href="#icon-chevron"></use></svg>
          </div>
          <ul class="user__expenses">
            <li class="user__expenses-item"><svg class="icon icon--expense"><use xlink:href="#icon-clock"></use></svg> Pending: $${collection[prop].payments.pending}</li>
            <li class="user__expenses-item"><svg class="icon icon--expense"><use xlink:href="#icon-clipboard"></use></svg> Approved: $${collection[prop].payments.approved}</li>
            <li class="user__expenses-item"><svg class="icon icon--expense"><use xlink:href="#icon-expense"></use></svg> Paid: $${collection[prop].payments.paid}</li>
          </ul>
          <ul class="user__status">
            <li class="user__status-item ${collection[prop].account_created}">Account created</li>
            <li class="user__status-item ${collection[prop].onboarded}">Onboarded</li>
          </ul>
          </a>
        </div>
      `;
    }
  }

  function inviteNewUser() {
    const inviteBtns = document.querySelectorAll('.button--copy');
    const inviteLink = document.querySelector('.invite__link-href').href;
    inviteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        alert(`Copied: ${inviteLink}`);
        navigator.clipboard.writeText(inviteLink);
      });
    });
  }

  function login() {
    const loginComponent = document.querySelector('.login');
    const passwordWrap = loginComponent.querySelector('.login__textfield--password');
    const loginSubmit = loginComponent.querySelector('.login__submit');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    email.focus();

    // Validate email
    email.addEventListener('keyup', () => {
      if (/(.+)@(.+){2,}\.(.+){2,}/.test(email.value)) {
        email.classList.add('textfield--active');
        passwordWrap.classList.remove('hide');
      } else {
        email.classList.remove('textfield--active');
        passwordWrap.classList.add('hide');
      }
    });

    // Validate password length
    password.addEventListener('keyup', () => {
      if (password.value.length > 3) {
        password.classList.add('textfield--active');
        loginSubmit.classList.add('button--active');
      } else {
        password.classList.remove('textfield--active');
        loginSubmit.classList.remove('button--active');
      }
    });

    loginSubmit.addEventListener('click', (e) => {
      e.preventDefault();

      if (loginSubmit.classList.contains('button--active')) {
        loginComponent.classList.add('hide');
        getUsers();
        showDashboard();
      }
    });
  }

  function logout() {
    const loginComponent = document.querySelector('.login');
    const passwordWrap = loginComponent.querySelector('.login__textfield--password');
    const loginSubmit = loginComponent.querySelector('.login__submit');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const logoutBtn = document.querySelector('[data-logout]');

    logoutBtn.addEventListener('click', () => {
      document.querySelector('.login').classList.remove('hide');
      document.querySelector('.main-nav__item--signup').classList.remove('hide');
      document.querySelector('.main-nav__item--logout').classList.add('hide');
      document.querySelector('.logged-in-content').classList.add('hide');
      document.querySelector('.main-content').classList.remove('main-content--dashboard');
      passwordWrap.classList.add('hide');
      email.value = '';
      password.value = '';
      loginSubmit.classList.remove('button--active');
      email.classList.remove('textfield--active');
      password.classList.remove('textfield--active');
      email.focus();
    });
  }

  function mobileNav() {
    const menuBtn = document.querySelector('.main-nav__menu');
    const bodyElm = document.body;
    menuBtn.addEventListener('click', () => {
      if (bodyElm.classList.contains('menu-open')) {
        bodyElm.classList.remove('menu-open');
      } else {
        bodyElm.classList.add('menu-open');
      }
    });
  }

  function init() {
    login();
    mobileNav();
  }

  init();
})();
