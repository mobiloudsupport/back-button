const IS_BROWSER = typeof window !== 'undefined';

class Darkmode {
  constructor(options) {
    if (!IS_BROWSER) {
      return;
    }
    /*
      delay: maybe animation

    */ 
    const defaultOptions = {
      time: '0.3s',
      textColor: 'white',
      buttonColorPrimary: '#047857', // bg color
      buttonColorLight: '#fff', //not used, but could be used if darkMode is added
      label: '←',
      autoMatchOsTheme: true, //not used, but could be used if darkMode is added
      position: 'bottom-left', // top-right | top-left | bottom-left | bottom-right
      animation: 'fadeIn', // fadeIn | scaleUp | slideBottom | slideTop | slideleft | slideRight
      display: 'onLoad', // onLoad | onScrollDown | onScrollUp
      hideMode: 'none', // not used for now
      scrollHeight: 300, //in px, not used now
      radius: '50%', // Any css unit, 50% gives a rounded btn if same height/width
      width: 'auto',
      delay: '1000', // defines how much time to wait until the element shows up
      backBehavior: 'javascript', // for now, javascript only
      containerClass: null, // if not null, button is injected into a container, it uses any html selectors '.class' '#id' 
      textAlign: 'center', // center | start | end 
      shadow: false
    };

    options = Object.assign({}, defaultOptions, options);

    const position = () => {
      let values = {right: 'unset', left: 'unset', bottom: 'unset', top: 'unset'}
      switch (options.position) {
        case 'bottom-right':
          values.right = '32px';
          values.bottom =  '32px';
          break;
        case 'bottom-left':
          values.left = '32px';
          values.bottom =  '32px';
          break;
        case 'top-right':
          values.top = '32px';
          values.right =  '32px';
          break; 
        case 'top-left':
          values.top = '32px';
          values.left =  '32px';
          break; 
        default:
          values.right = '32px';
          values.bottom =  '32px';
      }
      return values
    }
    const css = `
      
      /* BTN CLASSES */
      .backButton-toggle {
        background: ${options.buttonColorPrimary};
        width: ${options.width};
        height: 3rem;
        padding: 1em;
        position: ${options.containerClass == null ? 'fixed' : 'block' };
        border-radius: ${options.radius};
        border:none;
        right: ${position().right};
        bottom: ${position().bottom};
        left: ${position().left};
        top: ${position().top};
        cursor: pointer;
        transition: all 0.5s ease;
        display: none;
        justify-content: ${options.textAlign};
        align-items: center;
        z-index: 999999;
        color: ${options.textColor};
        animation: ${options.animation + ' ' + '0.5s both'};
        box-shadow: ${options.shadow ? '0px 3px 15px rgba(0,0,0,0.2);' : 'none'}
        
      }

      .backButton-toggle--white {
        background: ${options.buttonColorLight};
      }

      .backButton-toggle--inactive {
        display: none;
      }

      .backButton-toggle--visible {
        display: flex
      }

    @keyframes fadeIn {
      0% {
          opacity: 0;
      }
      100% {
          opacity: 1;
       }
  }

  @keyframes scaleUp {
    0% {
      transform: scale(0.5);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes slideBottom {
    0% {
      transform: translateY(1000px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes slideTop {
    0% {
      transform: translateY(-1000px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes slideLeft {
    0% {
      transform: translateX(-1000px);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes slideRight {
    0% {
      transform: translateX(1000px);
    }
    100% {
      transform: translateX(0);
    }
  }
      /* CHECK MEDIA CLASSES */
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        .darkmode-toggle {display: none !important}
      }

      @supports (-ms-ime-align:auto), (-ms-accelerator:true) {
        .darkmode-toggle {display: none !important}
      }
    `;
    
    // keep btn
    const button = document.createElement('button');
    button.innerHTML = options.label; //adds txt

    // check if we would store history here
    //const darkmodeActivated = window.localStorage.getItem('history') === '0';
      if(options.containerClass  == null ) {
        document.body.insertBefore(button, document.body.firstChild);
      } else {
        let container = document.querySelector(options.containerClass);
        container.appendChild(button)
      }

    // with 'this' refers to the fn addStyle below (1)
    this.addStyle(css);

    this.button = button;
    this.display = options.display;
    this.hideMode = options.hideMode;
    this.time = options.time;
    this.scrollHeight = options.scrollHeight;
    this.delay = options.delay;
    this.backBehavior = options.backBehavior;
  }
 // (1) inserts css in page
  addStyle(css) {
    const linkElement = document.createElement('link');

    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(css));
    document.head.appendChild(linkElement);
  }


  init() {
    if (!IS_BROWSER) {
          return;
    }
    const scrollHeight = this.scrollHeight   ;
    let backBehavior = this.backBehavior;
    // keep, 'this' refers to the bubbotn in the constructor
    const button = this.button;
    let scrollTop = 0;
    // const hideMode = this.hideMode;
    const display = this.display
    
    const delay = this.delay
    const  displayMode = () => {
      let lastScrollTop = 0;
      switch (display) {
        case 'onLoad':
            this.button.classList.add('backButton-toggle--visible');          
          break;
        case 'scrollDown':
          
        window.addEventListener('scroll', function() {
          let scrollTop = window.scrollY || document.documentElement.scrollTop;
  
          if (scrollTop < lastScrollTop) {
            // Scrolling down, hide the element
            button.style.display = 'none';
          } else {
            // Scrolling up, show the element
            button.style.display = 'flex';
          }
  
          lastScrollTop = scrollTop;
        });
          break;
        case 'scrollUp':
          
          window.addEventListener('scroll', function() {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
    
            if (scrollTop > lastScrollTop) {
              // Scrolling down, hide the element
              button.style.display = 'none';
            } else {
              // Scrolling up, show the element
              button.style.display = 'flex';
            }
    
            lastScrollTop = scrollTop;
          });
          break; 
        default:
          this.button.classList.add('backButton-toggle--visible')
          break;
      }
     
    }
    // Triggers displayMode after X MilliSeconds
    setTimeout(() => {
      displayMode()
    }, delay)

    button.classList.add('backButton-toggle');
    button.setAttribute('aria-label', 'Go back');

    button.addEventListener('click', () => {

      // HERE GOES THE BACK FUNCTIONS
      if(backBehavior === 'javascript') {
        history.back();
        console.log(history.length)
      }
    });

    //window.localStorage.setItem('history', history.lenght);
  }

  // PROGRAMATIC GO BACK
  trigger() {
    if (!IS_BROWSER) {
      return;
    }
    const button = this.button;
    history.back();
    //window.localStorage.setItem('darkmode', history.length);
  }
  
}

/* eslint-disable */
if (IS_BROWSER) {
  (function (window) {
    window.Darkmode = Darkmode;
  })(window);
}
/* eslint-enable */
