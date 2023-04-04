class UserEntity {
  constructor(nama, username, password, userAgent) {
    this.nama = nama;
    this.username = username;
    this.password = password;
    this.userAgent = userAgent;
  }
}
module.exports = {
  UserEntity,
};
