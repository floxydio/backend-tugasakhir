class TeacherEntity {
  constructor(nama, mengajar, status_guru, rating) {
    this.nama = nama;
    this.mengajar = mengajar;
    this.status_guru = status_guru;
    this.rating = rating;
  }
}
module.exports = {
  TeacherEntity,
};
