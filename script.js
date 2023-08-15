'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const openModal = function (e) {
  e.preventDefault(); // This is done so that as soon as we click the open account button the page does not scroll up i.e. it's default behaviour
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); //to get the coordinates of section 1 as soon as the click event is performed.
  //console.log(s1coords);
  // console.log(
  //   'Current height and width of the viewport: ',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  console.log(window.scrollX, window.scrollY);
  //window.scrollTo(s1coords.left+window.scrollX,s1coords.top+window.scrollY);
  // window.scrollTo({
  //   left: s1coords.left+window.scrollX,
  //   top: s1coords.top+window.scrollY,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////////
//NAVIGATION
// document.querySelectorAll('.nav__link').forEach(function (element) { //selecting all the elements with nav__link class attached
//   element.addEventListener('click', function (e) {
//     e.preventDefault();//preventing the default behavior without which the page will just jump to given href section
//     const id = this.getAttribute('href');//getting the attribute from the current element
//     //console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});//smooth scrolling
//   });
// });
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); //to prevent the default jump
  //console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    //only if one of the navigation links is clicked, we will go forward i.e. we will ignore the clicks in other areas
    const id = e.target.getAttribute('href'); //getting the attribute href from e.target
    //console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //implememting smooth scroll to the selected section
  }
});
//Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  if (!clicked) return;
  //Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate the content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
const handlehover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(ele => {
      if (ele !== link) {
        ele.style.opacity = opacity;
      }
      if (ele === link && opacity === 0.5) ele.style.color = 'black';
      if (ele === link && opacity === 1.0) ele.style.color = '#444444';
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  handlehover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handlehover(e, 1);
});

// //Implementing sticky navigation
// //We have to this by adding to sticky class as soon as we reach a certain point
// const initialcoords=section1.getBoundingClientRect();
// //console.log(initialcoords.top);
// window.addEventListener('scroll',function()
// {
//   //console.log(window.scrollY);
//   if(this.window.scrollY>initialcoords.top)//as soon as we reach section 1 or higher, sticky class will be added to the navbar
//   {
//     //console.log('helllloooo');
//     nav.classList.add('sticky');
//   }
//   else nav.classList.remove('sticky');//remove the sticky class if we are back to the the area above the section 1
// })

//Sticky navigation : Intersection Observer API
const header=document.querySelector('.header');//selecting the header
const navHeight=nav.getBoundingClientRect();//getting the height of the navigation bar
//console.log(navHeight);
const stickynav=function(entries)
{
  const [entry]=entries;//this will give the fist element of the array entries to entry variable
  if(!entry.isIntersecting)//is intersecting means whether the header is intersecting with the current viewport
  nav.classList.add('sticky');
  else nav.classList.remove('sticky');//if header comes into the viewport, remove the sticky navbar
}
const headerObserver=new IntersectionObserver(stickynav,{//declaring the intersection observer api
  root:null,
  threshold:0,//threshold=0 means when the header is not in the viewport. This is because when the header is not in the viewport then only we want to add the sticky navbar
  rootMargin: `-${navHeight.height}px`//basically we are turning the sticky nav bar a bit before than section 1
})
headerObserver.observe(header);//calling the api to observe the header


//Revealing elements on scroll
const allSections=document.querySelectorAll('.section');//selcting all the sections
const revealSection=function(entries,observer)
{
  const [entry]=entries;
  //console.log(entry);
  if(entry.isIntersecting)//if section is intersecting the viewport
  {
    entry.target.classList.remove('section--hidden');//remove the hidden class from the specific section
    observer.unobserve(entry.target);//as the section is now visible remove the observer as it will be consuming resources
  }
};
const sectionObserver=new IntersectionObserver(revealSection,{
  root:null,
  threshold: 0.2,//section will only be visible when it is 20% on the viewport

});
allSections.forEach(function(section)
{
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
})


//Lazy loading Images
const imgTargets=document.querySelectorAll('img[data-src]');//selecting only the images which have the attribute: data-src
//console.log(imgTargets);
const revealing=function(entries,observer)
{
  const [entry]=entries;
  if(entry.isIntersecting)//if image is in the viewport
  {
    //console.log(entry);
    //console.log(entry.target.dataset.src);
    //console.log(entry.target.src);
    entry.target.src=`${entry.target.dataset.src}`;//replacing the low res image with high res image
    entry.target.addEventListener('load',function()
    {
      entry.target.classList.remove('lazy-img');//removing the blur class from the image
    })
    observer.unobserve(entry.target);//as the image is already loaded, remove the observer from it
  }
}
const imgObserver=new IntersectionObserver(revealing,{
  root: null,
  threshold: 0.5,//after the image is half in the viewport, load it properly
});
imgTargets.forEach(img=>imgObserver.observe(img));//for all the images, call the observer


//Implementing Slider Component
const slides=document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide=0;
const maxSlide=slides.length-1;
// const slider=document.querySelector('.slider');
// slider.style.transform='scale(0.4) translateX(-600px)';
// slider.style.overflow='visible';
//slides.forEach((s,i)=>(s.style.transform=`translateX(${100*i}%)`));

//next slide
const gotoSlide=function(curSlide)
{
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
}
gotoSlide(0);
const prevSlide=function()
{
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else curSlide--;
  gotoSlide(curSlide);
}
const nextSlide=function()
{
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else curSlide++;
  gotoSlide(curSlide);
}
btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);
document.addEventListener('keydown',function(e)
{
  //console.log(e);
  if(e.key==='ArrowLeft')prevSlide();
  if(e.key==='ArrowRight')nextSlide();
});
/*
console.log(document.documentElement);//selects the entire document
console.log(document.head);//selects the head of the HTML
document.querySelector('.class_name');//for selecting a class
document.querySelectorAll('.section');//for selecting multiple classes
document.getElementById('section--1');

const header = document.querySelector('.header');
const message = document.createElement('div');//created an element with name message
message.classList.add('cookie-message');//added a predefined class to message
message.innerHTML =
  'We use cookies for your betterment <button class="btn btn--close-cookie">Got it!</button>';//contents of the message

header.prepend(message);//the message contents will now be shown
document.querySelector('.btn--close-cookie').addEventListener('click',function()
{
  message.remove();//as soon as we click the button, message will be removed
});
//Styles
message.style.backgroundColor='#37383d';//changes the bgcolor of the cookie reminder.
message.style.width='120%';//increases the width of the cookie reminder.
message.style.height=Number.parseFloat(getComputedStyle(message).height)+30+'px';//with getcomputedstyle we get the height. But that height is in the form '40px' and we don't want the px with it so we use the parsefloat method to extract the number then we add 30 to it and then we append px to it that we previously removed when we used the parsefloat method.

//Attributes
const logo=document.querySelector('.nav__logo');//selecting the image that has the class nav__logo
console.log(logo.alt);//accessing the attribute alt of the image that we have selected
console.log(logo.src);//accessing the attribute src of the logo
console.log(logo.className);//className will give the name of the class which the image is part of.
//another way of accessing attributes
console.log(logo.getAttribute('alt'));//this method is more powerful than the previous one.
*/

/*
const h1=document.querySelector('h1');
const genalert = function (e) 
{
  alert('You have just hovered over an h1 element.');
  h1.removeEventListener('mouseenter', genalert);
}
h1.addEventListener('mouseenter',genalert);
// h1.onmouseenter=function(e)
// {
//   alert('This is the second alert using onmouseenter');
// }

const randomint = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const nvlink = document.querySelectorAll('.nav__link');
const randomcolor = () =>
  `rgb(${randomint(0, 255)},${randomint(0, 255)},${randomint(0, 255)})`;
/*
  nvlink.forEach(btn =>
  btn.addEventListener('click', function () {
    this.style.backgroundColor = randomcolor();
  })
);

//DOM Traversing
const h1=document.querySelector("h1");//selected h1


//Going downwards : Selecting child elements
console.log(h1.querySelectorAll('.highlight'));//this will select only those elements that have highlight class who are childs of h1. Other elements who are not child of h1 won't be selected. Also notice how we used querySelecter with h1 instead of document
console.log(h1.childNodes);//gives all the childnodes of the selected element
console.log(h1.children); //gives only the child nodes of the type element

h1.firstElementChild.style.color='white';//first element child
h1.lastElementChild.style.color='white';//last element child
console.log(h1.firstChild);//first normal child


//Going upwards : Parents
console.log(h1.parentNode);//gives all the parent nodes
console.log(h1.parentElement);//gives only the parent node element

h1.closest('.header').style.background='var(--gradient-secondary)';//closest chooses the closest parent element. closest() is like the exact opposite of querySelector(). closest() finds the parents of the given input string and querySelector() finds the childs no matter how deep down in DOM tree.


//Going sideways : siblings
console.log(h1.nextElementSibling);//gives the next direct element sibling
console.log(h1.previousElementSibling);//gives the previous direct element sibling

console.log(h1.previousSibling);//gives previous sibling of type node
console.log(h1.nextSibling);//gives next sibling of type node
*/
