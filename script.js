const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');
const resetPasswordForm = document.getElementById('resetPassword');
const recoverPasswordLink = document.getElementById('recoverPasswordLink');
const backToSignInButton = document.getElementById('backToSignIn');

signUpButton.addEventListener('click', function(){
  signInForm.style.display = "none";
  signUpForm.style.display = "block";
  resetPasswordForm.style.display = "none";
});

signInButton.addEventListener('click', function(){
  signInForm.style.display = "block";
  signUpForm.style.display = "none";
  resetPasswordForm.style.display = "none";
});

recoverPasswordLink.addEventListener('click', function(e){
  e.preventDefault(); // Prevent default anchor behavior
  signInForm.style.display = "none";
  signUpForm.style.display = "none";
  resetPasswordForm.style.display = "block";
});

backToSignInButton.addEventListener('click', function(){
  resetPasswordForm.style.display = "none";
  signInForm.style.display = "block";
});
