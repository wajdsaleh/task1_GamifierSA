function anim1(path) {
    path.style.transitionDelay = `${Math.random() * 200}ms`;
    path.style.transformOrigin = `${Math.random() * 50 + 25}% 0%`;
    path.style.transform = `scale(0) rotate(${Math.random() * 100 - 50}deg)`;
    path.style.fill = 'rgb(189, 171, 210)';
    path.style.stroke = 'rgb(189, 171, 210)';
  }
  
  function reset1(path) {
    path.style.transitionDelay = 0;
    path.style.transformOrigin = `50%`;
    path.style.transform = `scale(1) rotate(0)`;
    path.style.fill = 'rgb(189, 171, 210)';
    path.style.stroke = 'rgb(189, 171, 210)';
  }

  const anims = [anim1],
        resets = [reset1],
        buttons = Array.from(document.querySelectorAll('.button')),
        refresh = document.querySelector('.refresh')
  buttons.forEach((button, i) => {
    const submit = button.querySelector('.submit');
    let paths = button.querySelectorAll('path')
    submit.addEventListener('click', () => {
      paths.forEach((path, j) => {
        anims[i](path, j);
      });
      submit.style.backgroundColor = 'transparent';
      submit.style.opacity = '0';

    })
  })



  


  
