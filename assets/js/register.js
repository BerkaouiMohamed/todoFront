window.onload = function () {
  main();
};

function main() {
  const $form = document.getElementsByTagName("form")[0];
  $form.addEventListener("submit", handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();
  const $name = e.target.name.value;
  const $email = e.target.email.value;
  const $password = e.target.password.value;

  axios
    .post("http://127.0.0.1:5000/api/auth/register", {
      name: $name,
      email: $email,
      password: $password,
    })
    .then((res) => {
        if (res.data.status === "success") {
            alert("Registration successful!");
            window.location.href = "/login.html";
        } else {alert("Registration failed")}
    });
}
