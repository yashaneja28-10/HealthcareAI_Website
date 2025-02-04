document.getElementById("predictBtn").addEventListener("click", function() {
    let symptoms = document.getElementById("symptomsInput").value.trim();

    if (!symptoms) {
        alert("Please enter symptoms!");
        return;
    }

    // Prepare the data to send to Flask
    const requestData = { symptoms: symptoms };

    // Send POST request to Flask API
    fetch('http://localhost:5000/predict', {  // Ensure it's POST, not GET
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)  // Convert data to JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response Data: ", data);  // Log response for debugging
        if (data.error) {
            document.getElementById("result").innerText = "Error: " + data.error;
        } else {
            document.getElementById("result").innerHTML = `
                <p>Symptoms Identified: ${data.extracted_symptoms.join(', ')}</p>
                <p>Predicted Disease: ${data.predicted_disease}</p>
            `;
        }
    })
    .catch(error => {
        console.error("Error in prediction:", error);  
        document.getElementById("result").innerText = "Error in prediction. Please try again later.";
    });
});
