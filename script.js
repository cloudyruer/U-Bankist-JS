'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

//190
const tabs = document.querySelectorAll('.operations__tab');

const tabsContainer = document.querySelector('.operations__tab-container');

const tabsContent = document.querySelectorAll('.operations__content');
//192
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///Page navigation
//189. Event Delegation: Implementing Page Navigation

// Button scrolling -->  詳細--185. (這邊只留執行碼)
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  //加移動效果的矛點(新版) work in modern broswer
  section1.scrollIntoView({ behavior: 'smooth' });
});
//////////////////////////////////////////////////
////////Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     console.log(this);
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//1. Add event listner to common parent element
//2. determine what element orignated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('1:', this);
  // console.log('2:', e.target);
  // console.log('3:', e.currentTarget);
  // console.log(this === e.currentTarget);
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
///////////////191. Building a Tabbed Component
///////////////////////////////
//Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return; //避免你點到比爸爸大的tabsContainer
  console.log(clicked);

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////
//192. Passing Arguments to EventHandlers
/////////////////////////
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing "kinda argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////
//193. Implementing a Sticky Navigation: The Scroll Event
///////////////////////////
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   //console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });
///////////////////////////////////////
//194. A Better Way: The Intersection Observer API
///////////////////////////////////
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(section1);

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries; // 也可以寫entries[0]--> 記得entries是 options中的threshold(門檻)變成的array 但這次只有一個 所以直接取
  //console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////
//195. Revealing Elements on Scroll
////////////////////////////////
const allSectoins = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSectoins.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
//196. Lazy Loading Images
///////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;
  //Replace scr with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));
//////////////////////////////////
//197. Building a Slider Component: Part 1
///////////////////////
//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');

  const btnRight = document.querySelector('.slider__btn--right');

  const dotContaniner = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.3) translateX(-900px)';
  // slider.style.overflow = 'visible';

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContaniner.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    //Curslide =1: -100%, 0%, 100%, 200%
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    //大家乖乖排好
    goToSlide(0);
    // 0%, 100%, 200%, 300%
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  ////////////////////////
  ///198. Building a Slider Component: Part 2
  ////
  document.addEventListener('keydown', function (e) {
    //console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); //short circuiting
  });

  dotContaniner.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

/////////////////////////////////////////////////
//183. Selecting, Creating, and Deleting Elements;
//////////////////////////////////////////////////
/*
//Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
//NodeList 創好的時候  後續刪不會更新
const allSectoins = document.querySelectorAll('.section');
console.log(allSectoins);

document.getElementById('sectoin--1');
//HTMLCollection 實時更新(LIVE)
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

document.getElementsByClassName('btn');

// creating and inserting elements
// .insertAdjacentHTML
const message = document.createElement('div'); //just dom object but not yet inside DOM !!! so, cannot find on webpage
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookied for improved functionality and analytics. ';

//innerHTML 直接改寫
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// in live Dom , so could only have one
header.prepend(message); //first child as the element
//header.append(message); // last child as the element

//如果要同時 要先複製clone
//header.append(message.cloneNode(true));

//header.before(message);
//header.after(message);

//Delete.elemets
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    //message.remove();
    message.parentElement.removeChild(message);
  });


*/
/////////////////////////////////////
//184. Styles, Attributes and Classes
//////////////////////////////////////

/*
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//只能找到自己手動設定的 inner style
console.log(message.style.height);
console.log(message.style.backgroundColor);
//除非以下: 就算CSS沒有定義也讀得到 電腦於瀏覽器顯示的數值
console.log(getComputedStyle(message).height);

//因為原本的是字串 所以要先轉成數字
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//custom properties
document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes -- e.g. src div span
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);

console.log(logo.className);

//讀得到所以也可以改
logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer); // undefined  因為不是standard property 是後來才加的 非預設 (只能讀到預設有的)

//除非以下:
console.log(logo.getAttribute('desinger'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src); //絕對位置
console.log(logo.getAttribute('src')); //相對位置 (常用)

const link = document.querySelector('.nav__link--btn');
console.log(link.href); //絕對 http://127.0.0.1:5500/#
console.log(link.getAttribute('href')); //相對 #

//Data attributes data-???-???
// data-version-number="3.0" --> html
console.log(logo.dataset.versionNumber);

//Classes

logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); //--> T or F *not includes

//Don't use -cuz re-write all the existing classes and could only put one class
logo.className = 'jonas';
*/

////////////////////////////////////////////////////
//185. Implementing Smooth Scrolling
////////////////////////////////////////////////////
/*
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  //該物件於客戶視窗中 距離viewport的距離
  console.log(e.target.getBoundingClientRect());
  //滑鼠滑多少 ↓
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  //客戶端的視窗開多大↓
  console.log(
    'height/width viewport(瀏覽器視窗)',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //以下都是絕對位置
  // 無特效矛點
  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //加移動效果的矛點(舊版)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //加移動效果的矛點(新版) work in modern broswer
  section1.scrollIntoView({ behavior: 'smooth' });
});
*/
///////////////////////////////////////////////////
/////186. Types of Events and Event Handlers
///////////////////////////////////////////////////
/*
//mouseenter ---> like CSS hover

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventLister: Great! You are reading the heading =)');
};

//addEventlister (可以一次注意多個動作)???
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading =)');
// };
*/

//188. Event Propagation in Practice
//188 要動到html 很麻煩  直接回去看課比較快
// rgb(255,255,255)
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}),rgb(${randomInt(0, 255)}),rgb(${randomInt(
    0,
    255
  )})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('LINK');
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   console.log('LINK');
// });
*/
//
///////////////////////////////////
//190. DOM Traversing
/////////////////////////////////
/*
const h1 = document.querySelector('h1');

// Going downwards: child

//the child element of ONLY "h1" would show others'
console.log(h1.querySelectorAll('.highlight'));

//To find the child
console.log(h1.childNodes); //nodelist ->anything even comment, evety thing exist but usually we do need that

console.log(h1.children); //html collection 實時更新(LIVE)

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// USE MOST ->receive a query string as an input
//the closest parent element that has this class (.header)
h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings

//only the previous and the next one
console.log(h1.previousElementSibling); //null 因為是第一個
console.log(h1.nextElementSibling);

console.log(h1.previousSibling); //nodelist->記得nodelist就是大雜燴 基本上平常不會用
console.log(h1.nextSibling); //nodelist

// 先往上到parent 再往下看全部children--> 全部siblings(但包含自己)

console.log(h1.parentElement.children);
//html collection is not array but iterable
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.color = 'purple';
});
*/

//////////////////
//199. Lifecycle DOM Events
////////////////////

//just html and js to be loaded
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// // all the external loaded then fired
// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

//200. Efficient Script Loading: defer and async
