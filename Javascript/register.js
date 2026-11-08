let register = document.querySelector("form");

register.addEventListener("submit", (event) => {
  event.preventDefault();
  let username = document.getElementById("username").value.trim();
  let email = document.querySelector("#email").value.trim();
  let password = document.querySelector("#password").value.trim();
  
  if (!username || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  let users_data = JSON.parse(localStorage.getItem("users")) || [];
  let existing_user = users_data.find((user) => user.username === username);
  let existing_email = users_data.find((user) => user.email === email);

  if (existing_user) {
    alert("Username already exists!");
    return;
  }

  if (existing_email) {
    alert("Email already exists!");
    return;
  }
  users_data.push({
    username: username,
    email: email,
    password: password,
  });
  
  localStorage.setItem("users", JSON.stringify(users_data));

  alert("Register successfully!");

  location.href = "./login.html";
});
