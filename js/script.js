function validateLogin(event) {
  // Prevent the default form submission behavior
  if (event) event.preventDefault();

  // Get the input values
  const username = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  // Check credentials
  if (username === "admin" && password === "admin") {
    const message = document.getElementById("message");
    message.style.color = "green";
    message.textContent = "Login successful!";

    // Start countdown after showing success message
    let countdown = 3; // Starting countdown value
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        message.textContent = `Loading... ${countdown}`;
        countdown--;
      } else {
        clearInterval(countdownInterval); // Stop the countdown
        window.location.href = "welcome.html"; // Redirect to welcome.html
      }
    }, 1000); // Update every second

    return false; // Prevent the form from submitting
  } else {
    // Display error message
    const message = document.getElementById("message");
    message.style.color = "red";
    message.textContent = "Incorrect username or password!";
    return false; // Prevent form submission
  }
}
function showTab(tabId, event) {
  // Hide all tenant sections
  const sections = document.querySelectorAll('.tenant-details');
  sections.forEach(section => section.classList.remove('active'));

  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Show the selected tenant section
  document.getElementById(tabId).classList.add('active');

  // Highlight the active tab
  event.currentTarget.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  // Function to display the current time
  const updateTime = () => {
    const now = new Date();
    const options = { weekday: 'short', hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'short', day: 'numeric' };
    const currentTime = now.toLocaleDateString("en-US", options);
    document.querySelectorAll(".tenant-info p:last-child").forEach(p => {
      p.textContent = currentTime; // Update all time elements
    });
  };

  // Update the time immediately and every second
  updateTime();
  setInterval(updateTime, 1000);

  // Function to populate the month dropdown for 3 months before and after
  const populateMonths = () => {
    const monthSelectors = document.querySelectorAll("[id^='month-']");
    monthSelectors.forEach(select => {
      select.innerHTML = ""; // Clear previous options
      const now = new Date();
      for (let i = -3; i <= 3; i++) {
        const newDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const monthName = newDate.toLocaleString("en-US", { month: "long", year: "numeric" });
        const option = document.createElement("option");
        option.value = `${newDate.getMonth() + 1}-${newDate.getFullYear()}`;
        option.textContent = monthName;
        select.appendChild(option);
      }
    });
  };
  populateMonths();

  // Calculate and display the room price
  const calculateRoomPrice = () => {
    document.querySelectorAll("[id^='current-price-']").forEach(input => {
      input.addEventListener("input", (event) => {
        const value = parseFloat(event.target.value) || 0;
        const roomDisplay = input.closest(".invoice-form").querySelector(".info-section .left-section p:nth-child(2)");
        roomDisplay.textContent = `Room: ${value.toFixed(2)}$`;
        calculateTotal(input.closest(".invoice-form"));
      });
    });
  };

  // Calculate and display the electric price
  const calculateElectricPrice = () => {
    document.querySelectorAll("[id^='electric-new-']").forEach(input => {
      input.addEventListener("input", (event) => {
        const form = input.closest(".invoice-form");
        const previousElectric = 2334; // Hardcoded value
        const newElectric = parseFloat(event.target.value) || 0;
        const electricPrice = 0.375 * (newElectric - previousElectric);
        const electricDisplay = form.querySelector(".info-section .left-section p:nth-child(3)");
        electricDisplay.textContent = `Electric: ${Math.max(electricPrice, 0).toFixed(2)}$`;
        calculateTotal(form);
      });
    });
  };

  // Calculate and display the water price
  const calculateWaterPrice = () => {
    document.querySelectorAll("#tenant-quantity").forEach(select => {
      select.addEventListener("change", (event) => {
        const form = select.closest(".invoice-form");
        const tenantQuantity = parseInt(event.target.value) || 0;
        const waterPrice = tenantQuantity * 1.5;
        const waterDisplay = form.querySelector(".info-section .left-section p:nth-child(5)");
        waterDisplay.textContent = `Water: ${waterPrice.toFixed(2)}$`;
        calculateTotal(form);
      });
    });
  };

  // Calculate the total
  const calculateTotal = (form) => {
    const roomPrice = parseFloat(form.querySelector(".info-section .left-section p:nth-child(2)").textContent.split(":")[1]) || 0;
    const electricPrice = parseFloat(form.querySelector(".info-section .left-section p:nth-child(3)").textContent.split(":")[1]) || 0;
    const internetFee = parseFloat(form.querySelector("#internet-fee-1").value) || 0;
    const waterPrice = parseFloat(form.querySelector(".info-section .left-section p:nth-child(5)").textContent.split(":")[1]) || 0;
    const total = roomPrice + electricPrice + internetFee + waterPrice;
    const totalDisplay = form.querySelector(".total-container p strong");
    totalDisplay.textContent = `Total: ${total.toFixed(2)}$`;
  };

  // Initialize calculations
  calculateRoomPrice();
  calculateElectricPrice();
  calculateWaterPrice();
});
