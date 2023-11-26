export interface SoalGet {
    id: number;
    nama_ujian: string;
    tanggal: Date;
    mata_pelajaran: number;
    durasi: number;
    jam_mulai: string;
    keterangan: string;
    status_ujian: number;
    total_soal: number;
    kelas_id: number;
    createdAt: Date;
}

export interface PilihanGanda {
    id_soal: string
    soal: string
    pilihan: string[][]
    jawaban: string
}

export interface Essay {
    id_soal: string
    soal: string
    jawaban: string
}

export interface DataSoal {
    pilihan_ganda: PilihanGanda[]
    essay: Essay[]
}