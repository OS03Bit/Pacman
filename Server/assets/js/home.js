// Assuming you have an HTML input element with id="inputField"
let inputField = document.getElementById('inputField');

function handleKeyPress(event) {
    // console.log(inputvalue);
    // Check if the key pressed is Enter (key code 13)
    if (event.keyCode === 13) {
        // Assuming you have an HTML input element with id="inputField"
        // Make a GET request using fetch
        let inputvalue = document.getElementById('inputField').value;
        
        // window.location.href = `http://localhost:8000/domainlist/${inputvalue}`;
        window.location.href = `http://3.111.34.186/domainlist/${inputvalue}`;
        //     fetch(`http://localhost:8000/domainlist/${inputvalue}`) // Replace 'https://example.com/data' with your API endpoint
        //       .then(response => {
        //         // Check if the response is successful
        //         if (!response.ok) {
        //           throw new Error('Network response was not ok');
        //         }

        //       })
        //       .catch(error => {
        //         // Handle any errors that occurred during the fetch
        //         console.error('There was a problem with the fetch operation:', error);
        //       });
    }
}

// Attach event listener for keypress event
inputField.addEventListener('keypress', handleKeyPress);
