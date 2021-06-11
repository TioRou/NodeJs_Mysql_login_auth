class User {
   constructor(nombre, email, password) {
      this.nombre = nombre;
      this.email = email;
      this.password = password;  
   }
}

module.exports = {
    User: User
}