const IS_BROWSER = typeof window !== 'undefined';

class BackButton {
  constructor(options) {
    if (!IS_BROWSER) {
      return;
    }
    const defaultOptions = {
      time: '0.3s',
      textColor: 'white',
      fillColor: 'white',
      buttonColorPrimary: '#000', // bg color
      buttonColorLight: '#fff', //not used, but could be used if darkMode is added
      label: '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8 .4 34.3z"/></svg>',
      autoMatchOsTheme: true, //not used, but could be used if darkMode is added
      position: 'top-left', // top-right | top-left | bottom-left | bottom-right
      animation: null, // fadeIn | scaleUp | slideBottom | slideTop | slideleft | slideRight
      display: 'onLoad', // onLoad | onScrollDown | onScrollUp
      hideMode: 'none', // not used for now
      scrollHeight: 300, //in px, not used now
      radius: '5px', // Any css unit, 50% gives a rounded btn if same height/width
      width: '3em',
      padding: '1em',
      delay: '0', // defines how much time to wait until the element shows up
      backBehavior: 'javascript', // for now, javascript only
      containerSelector: '.backBtn', // if not null, button is injected into a container, it uses any html selectors '.class' '#id' 
      containerOrder: 'last', // 'inline-first', 'inline-last' | If container selector activated, it places the button before or after other elements
      textAlign: 'center', // center | start | end 
      shadow: false,// If true applies soft shadow
      replaceElement:  null // if a selector is placed here, this element would be replaced with the back button
    };

    options = Object.assign({}, defaultOptions, options);
    let positionValues = {right: 'unset', left: 'unset', bottom: 'unset', top: 'unset'}

   
      switch (options.position) {
        case 'bottom-right':
          positionValues.right = '32px';
          positionValues.bottom =  '32px';
          break;
        case 'bottom-left':
          positionValues.left = '32px';
          positionValues.bottom =  '32px';
          break;
        case 'top-right':
          positionValues.top = '32px';
          positionValues.right =  '32px';
          break; 
        case 'top-left':
          positionValues.top = '32px';
          positionValues.left =  '32px';
          break; 
        default:
          positionValues.right = '32px';
          positionValues.bottom =  '32px';
      }

    const css = `
      
      /* BTN CLASSES */
      .backButton-toggle {
        background: ${options.buttonColorPrimary};
        width: ${options.width};
        aspect-ratio: 1;
        padding: ${options.padding};
        position: ${options.containerSelector == null ? 'fixed' : 'inline-block' };
        border-radius: ${options.radius};
        border:none;
        right: ${positionValues.right};
        bottom: ${positionValues.bottom};
        left: ${positionValues.left};
        top: ${positionValues.top};
        cursor: pointer;
        transition: all 0.5s ease;
        display: none;
        justify-content: ${options.textAlign};
        align-items: center;
        z-index: 999999;
        color: ${options.textColor};
        fill: ${options.fillColor};
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
        display: inline-flex
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

    // with 'this' refers to the fn addStyle below (1)
    this.addStyle(css);

    this.button = button;
    this.display = options.display;
    this.hideMode = options.hideMode;
    this.time = options.time;
    this.scrollHeight = options.scrollHeight;
    this.delay = options.delay;
    this.backBehavior = options.backBehavior;
    this.containerSelector = options.containerSelector;
    this.containerOrder = options.containerOrder;
    this.replaceElement = options.replaceElement;
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
    if (!IS_BROWSER || window.history.length <= 1 || window.location.pathname == '/') {
          return;
    }
    let backBehavior = this.backBehavior;
    const containerSelector = this.containerSelector;
    const containerOrder = this.containerOrder;
    const button = this.button;
    const display = this.display;
    const replaceElement = this.replaceElement  
    if(replaceElement) {
      let element = document.querySelector(replaceElement)
      element.replaceWith(button);

    } 
    else {
      if(containerSelector  == null ) {
        document.body.insertBefore(button, document.body.firstChild);
      } else {
        let container = document.querySelector(containerSelector);
        switch (containerOrder) {
          case 'first':
            container.insertBefore(button, container.firstChild);
            break;
            case 'last':
              container.appendChild(button);
            break;
          default:
            container.appendChild(button)
        } 
      }
    }
    const delay = this.delay
    const  displayMode = () => {
      let lastScrollTop = 0;
      switch (display) {
        case 'onLoad':
            this.button.classList.add('backButton-toggle--visible');          
          break;
        case 'onScrollDown':
          
        window.addEventListener('scroll', function() {
          let scrollTop = window.scrollY || document.documentElement.scrollTop;
  
          if (scrollTop < lastScrollTop) {
            // Scrolling down, hide the element
            button.style.display = 'none';
          } else {
            // Scrolling up, show the element
            button.style.display = 'inline-flex';
          }
  
          lastScrollTop = scrollTop;
        });
          break;
        case 'onScrollUp':
          
          window.addEventListener('scroll', function() {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
    
            if (scrollTop > lastScrollTop) {
              // Scrolling down, hide the element
              button.style.display = 'none';
            } else {
              // Scrolling up, show the element
              button.style.display = 'inline-flex';
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
      if(backBehavior === 'javascript' && window.history.length > 1) {
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
    window.BackButton = BackButton;
  })(window);
}
/* eslint-enable */
