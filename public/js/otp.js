document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".otp-box");
  const otpValue = document.getElementById("otpValue");
  const form = document.getElementById("otpForm");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      // Allow only numbers
      input.value = input.value.replace(/[^0-9]/g, "");
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      collectOTP();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });

  function collectOTP() {
    otpValue.value = Array.from(inputs).map(i => i.value).join("");
  }

  form.addEventListener("submit", (e) => {
    collectOTP();
    if (otpValue.value.length !== 6) {
      e.preventDefault();
      alert("Please enter all 6 digits of the OTP");
    }
  });
});
