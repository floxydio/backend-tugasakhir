class AbsenEntity {
  constructor(
    user_id,
    guru_id,
    pelajaran_id,
    kelas_id,
    keterangan,
    reason,
    createdAt
  ) {
    this.user_id = user_id;
    this.guru_id = guru_id;
    this.pelajaran_id = pelajaran_id;
    this.kelas_id = kelas_id;
    this.keterangan = keterangan;
    this.reason = reason;
    this.createdAt = createdAt;
  }
}

module.exports = { AbsenEntity };
