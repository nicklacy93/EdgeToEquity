console.log('Testing landing page...');

fetch('http://localhost:3000/landing')
.then(response => {
  console.log('Landing page status:', response.status);
  if (response.status === 200) {
    console.log(' Landing page loads successfully');
  } else {
    console.log(' Landing page failed:', response.status);
  }
})
.catch(error => console.log(' Landing page request failed:', error.message));
