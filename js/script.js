document.addEventListener("DOMContentLoaded", function() {
    let user = localStorage.getItem("user"); // Check if user is logged in

    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = "login.html";
    }
});

// Predict Disease Function
document.getElementById("predictBtn").addEventListener("click", function() {
    let symptoms = document.getElementById("symptomsInput").value.trim();

    if (!symptoms) {
        alert("Please enter symptoms!");
        return;
    }

    // Prepare the data to send to Flask (Render backend)
    const requestData = { symptoms: symptoms };

    // Send POST request to Render API
    fetch('https://healthcareai-website-6.onrender.com/predict', {  // ✅ Updated to Render's URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)  // Convert data to JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);  // Log response for debugging
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
        console.error("Fetch Error:", error);  // Log fetch errors
        document.getElementById("result").innerText = "Error in prediction. Please try again later.";
    });
});
