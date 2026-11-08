let login = document.querySelector("form");

login.addEventListener("submit", (event) => {
  event.preventDefault();
  let username = document.getElementById("username").value.trim();
  let password = document.querySelector("#password").value.trim();

  if (!username || !password) {
    alert("Please fill in all fields!");
    return;
  }

  let users_data = JSON.parse(localStorage.getItem("users")) || [];
  let current_user = users_data.find(
    (user) => user.username === username && user.password === password,
  );

  if (current_user) {
    localStorage.setItem(
      "current_user",
      JSON.stringify({
        username: current_user.username,
        email: current_user.email,
      }),
    );

    alert("Login successfully!");
    location.href = "./index.html";
  } else {
    alert("Invalid username or password!");
  }
});
