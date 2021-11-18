

let loginForm = document.querySelector('.login-container');

document.querySelector('#login-btn').onclick = () =>{
  loginForm.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () =>{
  loginForm.classList.remove('active');
}
let sidebar=document.querySelector('.sidebar')

document.querySelector('#btn').onclick=()=>{
  sidebar.classList.toggle('active');

}
document.querySelector('.nav').onclick = () =>{
  sidebar.classList.remove('active');
}
document.querySelector('.home').onclick = () =>{
  sidebar.classList.remove('active');
}