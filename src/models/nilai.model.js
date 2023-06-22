 class NilaiEntity {
    constructor(uts,uas,kelas_id,user_id,semester,pelajaran_id) {
      this.uts = uts;
      this.uas = uas;
      this.kelas_id = kelas_id;
      this.user_id = user_id;
      this.semester = semester;
      this.pelajaran_id = pelajaran_id;
    }
   }

module.exports = {
   NilaiEntity,
}
