window.onload = function () {
    main();
  };
  
  function main() {
    const $form = document.getElementsByTagName("form")[0];
    $form.addEventListener("submit", handleSubmit);
  }
  
  function handleSubmit(e) {
    e.preventDefault();

    const $email = e.target.email.value;
    const $password = e.target.password.value;
  
    axios
      .post("http://127.0.0.1:5000/api/auth/login", {

        email: $email,
        password: $password,
      })
      .then((res) => {
   
          if (res.data.status === "success") {
              alert("loged in successfully");
              localStorage.setItem("token", res.data.data);
              if (res.data.role){
                localStorage.setItem('a',"1")
              }
              window.location.href = "/index.html";
          } else {alert(" failed")}
      });
  }
  