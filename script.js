function startTrial(){
const used = localStorage.getItem('flowbittools_trial');
const status = document.getElementById('trial-status');

if(used){
status.innerHTML = 'Perangkat/IP ini sudah menggunakan trial.';
status.style.color = '#ef4444';
}else{
localStorage.setItem('flowbittools_trial','used');
status.innerHTML = 'Trial berhasil diaktifkan.';
status.style.color = '#22c55e';

setTimeout(()=>{
window.location.href='trafik.html';
},1500);
}
}

function googleLogin(){
alert('Google Login Demo Berhasil');
window.location.href='dashboard.html';
}

function loginUser(){
window.location.href='dashboard.html';
}

function registerUser(){
alert('Pendaftaran berhasil');
window.location.href='dashboard.html';
}
