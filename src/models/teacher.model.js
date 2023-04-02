class TeacherEntity {
  constructor(nama, umur, mengajar, status_guru, rating) {
    this.nama = nama;
    this.umur = umur;
    this.mengajar = mengajar;
    this.status_guru = status_guru;
    this.rating = rating;
  }
}
module.exports = {
  TeacherEntity,
};
