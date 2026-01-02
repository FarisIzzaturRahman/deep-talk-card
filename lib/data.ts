export interface Category {
    id: string;
    label: string;
    description: string;
    color: string;
    gradient: string;
}

export interface Question {
    id: string;
    categoryId: string;
    text: string;
    depth: 1 | 2 | 3; // 1 = Light, 3 = Deep
    followUps?: string[]; // Contextual follow-up questions
}

export const CATEGORIES: Category[] = [
    {
        id: "ice-breaker",
        label: "Ice Breaker",
        description: "Pemanasan dulu gais, biar nggak kaku.",
        color: "bg-blue-500",
        gradient: "from-blue-400 to-blue-600"
    },
    {
        id: "deep-talk",
        label: "Deep Talk",
        description: "Ngobrolin perasaan, mimpi, dan realita hidup.",
        color: "bg-purple-500",
        gradient: "from-purple-400 to-purple-600"
    },
    {
        id: "reflection",
        label: "Refleksi Diri",
        description: "Flashback bentar, evaluasi diri sendiri.",
        color: "bg-emerald-500",
        gradient: "from-emerald-400 to-emerald-600"
    },
    {
        id: "nostalgia",
        label: "Nostalgia",
        description: "Masa kecil, jajan SD, dan momen alay dulu.",
        color: "bg-amber-500",
        gradient: "from-amber-400 to-amber-600"
    },
    {
        id: "fun",
        label: "Fun & Random",
        description: "Halu dikit nggak ngaruh, seru-seruan aja.",
        color: "bg-pink-500",
        gradient: "from-pink-400 to-pink-600"
    },
];

export const ALL_QUESTIONS: Question[] = [
    // ============================
    // ICE BREAKER (San-tai & Lokal)
    // ============================
    { id: "ib-1", categoryId: "ice-breaker", text: "Tim Bubur Ayam: Diaduk atau Nggak Diaduk?", depth: 1, followUps: ["Alasannya apa? Jangan bilang biar estetik doang.", "Pernah coba aliran sebaliknya nggak?"] },
    { id: "ib-2", categoryId: "ice-breaker", text: "Kalau lagi nunggu ojek online lama banget, biasanya ngapain?", depth: 1 },
    { id: "ib-3", categoryId: "ice-breaker", text: "Menu sarapan andalan yang nggak pernah salah menurutmu?", depth: 1 },
    { id: "ib-4", categoryId: "ice-breaker", text: "Apa 'guilty pleasure' jajanan minimarket kamu?", depth: 1 },
    { id: "ib-5", categoryId: "ice-breaker", text: "Sebutkan satu lagu dangdut atau koplo yang diam-diam kamu hafal liriknya!", depth: 1, followUps: ["Coba nyanyiin reff-nya dikit dong!"] },
    { id: "ib-6", categoryId: "ice-breaker", text: "Kalau ke kondangan, incaran utama kamu apa?", depth: 1, followUps: ["Sate ayam, zuppa soup, atau es krim?"] },
    { id: "ib-7", categoryId: "ice-breaker", text: "Lebih suka liburan ke gunung (dingin) atau pantai (panas)?", depth: 1 },
    { id: "ib-8", categoryId: "ice-breaker", text: "Siapa artis atau selebgram Indo yang menurutmu paling 'relate' sama hidupmu?", depth: 1 },
    { id: "ib-9", categoryId: "ice-breaker", text: "Platform medsos apa yang paling sering bikin kamu lupa waktu?", depth: 1 },
    { id: "ib-10", categoryId: "ice-breaker", text: "Kalau kamu jadi youtuber, konten apa yang bakal kamu buat?", depth: 1 },
    { id: "ib-11", categoryId: "ice-breaker", text: "Apa barang paling nggak penting yang pernah kamu beli online?", depth: 1 },
    { id: "ib-12", categoryId: "ice-breaker", text: "Pernah nggak salah kirim chat di grup keluarga? Ceritain!", depth: 1 },
    { id: "ib-13", categoryId: "ice-breaker", text: "Kalau punya uang kaget 100 juta hari ini dan harus habis, buat beli apa?", depth: 1 },
    { id: "ib-14", categoryId: "ice-breaker", text: "Lebih takut ketinggalan dompet atau ketinggalan HP?", depth: 1 },
    { id: "ib-15", categoryId: "ice-breaker", text: "Apa kebiasaan aneh kamu sebelum tidur?", depth: 1 },
    { id: "ib-16", categoryId: "ice-breaker", text: "Kalau bisa ganti nama panggilan, mau dipanggil apa?", depth: 1 },
    { id: "ib-17", categoryId: "ice-breaker", text: "Tim durian: Yay atau Nay?", depth: 1 },
    { id: "ib-18", categoryId: "ice-breaker", text: "Hal apa yang paling bikin males kalau lagi nongkrong bareng teman?", depth: 1 },
    { id: "ib-19", categoryId: "ice-breaker", text: "Mie instan kuah atau goreng? Pakai telor atau polos?", depth: 1 },
    { id: "ib-20", categoryId: "ice-breaker", text: "Pernah punya pengalaman horor receh nggak? (Bukan yang serem banget)", depth: 1 },
    { id: "ib-21", categoryId: "ice-breaker", text: "Apa aplikasi HP yang paling sering kamu buka tapi sebenernya nggak penting?", depth: 1 },
    { id: "ib-22", categoryId: "ice-breaker", text: "Sebutkan satu hal yang orang lain suka banget, tapi kamu nggak paham di mana enaknya.", depth: 1, followUps: ["Contoh: Seblak, BOBA, K-Pop?"] },
    { id: "ib-23", categoryId: "ice-breaker", text: "Kalau disuruh makan satu jenis lauk nasi padang selamanya, pilih apa?", depth: 1 },
    { id: "ib-24", categoryId: "ice-breaker", text: "Tipe orang kalau balas chat: gercep (fast response) atau nunggu mood?", depth: 1 },
    { id: "ib-25", categoryId: "ice-breaker", text: "Pernah nggak pura-pura sibuk main HP biar nggak diajak ngobrol orang?", depth: 1 },
    { id: "ib-26", categoryId: "ice-breaker", text: "Apa film Indonesia favoritmu sepanjang masa?", depth: 1 },
    { id: "ib-27", categoryId: "ice-breaker", text: "Kalau lagi macet parah di jalan, biasanya ngapain biar nggak stress?", depth: 1 },
    { id: "ib-28", categoryId: "ice-breaker", text: "Sebutkan satu skill remeh yang kamu banggakan.", depth: 1 },
    { id: "ib-29", categoryId: "ice-breaker", text: "Pilih mana: nggak bisa lihat story orang atau nggak bisa post story sendiri?", depth: 1 },
    { id: "ib-30", categoryId: "ice-breaker", text: "Apa nama grup WhatsApp paling aneh yang kamu punya?", depth: 1 },

    // ============================
    // DEEP TALK (Hati ke Hati)
    // ============================
    { id: "dt-1", categoryId: "deep-talk", text: "Apa ketakutan terbesar kamu soal masa depan?", depth: 3, followUps: ["Apakah ketakutan itu realistik?", "Gimana caramu berdamai sama hal itu?"] },
    { id: "dt-2", categoryId: "deep-talk", text: "Menurutmu, apa arti 'rumah' yang sebenarnya? Bukan sekadar bangunan.", depth: 3 },
    { id: "dt-3", categoryId: "deep-talk", text: "Apa pengorbanan terbesar orang tua yang baru kamu sadari setelah dewasa?", depth: 3 },
    { id: "dt-4", categoryId: "deep-talk", text: "Kalau bisa minta maaf ke satu orang di masa lalu, kamu mau bilang apa?", depth: 3 },
    { id: "dt-5", categoryId: "deep-talk", text: "Kapan terakhir kali kamu merasa benar-benar dicintai?", depth: 3 },

    { id: "dt-6", categoryId: "deep-talk", text: "Hal apa yang selama ini kamu tahan-tahan demi menjaga perasaan orang lain?", depth: 3 },
    { id: "dt-7", categoryId: "deep-talk", text: "Apa mimpi kamu yang terpaksa dikubur karena realita?", depth: 3, followUps: ["Masih ada kesempatan buat wujudin nggak?", "Atau udah ikhlas?"] },
    { id: "dt-8", categoryId: "deep-talk", text: "Kalau pasanganmu selingkuh, ada kesempatan kedua atau langsung selesai?", depth: 3 },
    { id: "dt-9", categoryId: "deep-talk", text: "Apa nasihat tentang cinta yang menurutmu paling bullshit?", depth: 2 },
    { id: "dt-10", categoryId: "deep-talk", text: "Sifat orang tua mana yang paling kamu takutin nurun ke kamu?", depth: 3 },

    { id: "dt-11", categoryId: "deep-talk", text: "Di usia sekarang, kamu ngerasa udah jadi versi dirimu yang kamu harapkan belum?", depth: 3 },
    { id: "dt-12", categoryId: "deep-talk", text: "Apa momen terberat dalam hidupmu yang bikin kamu jadi sekuat sekarang?", depth: 3 },
    { id: "dt-13", categoryId: "deep-talk", text: "Menurutmu, uang bisa beli kebahagiaan nggak? Jujur aja.", depth: 2 },
    { id: "dt-14", categoryId: "deep-talk", text: "Apa 'red flag' dalam hubungan yang dulu kamu toleransi tapi sekarang nggak bisa lagi?", depth: 2 },
    { id: "dt-15", categoryId: "deep-talk", text: "Apa pujian yang paling berkesan yang pernah kamu terima?", depth: 2 },

    { id: "dt-16", categoryId: "deep-talk", text: "Kalau sisa hidupmu tinggal 1 tahun, apa yang bakal kamu ubah dari rutinitasmu sekarang?", depth: 3 },
    { id: "dt-17", categoryId: "deep-talk", text: "Lebih mending dicintai tapi nggak punya uang, atau kaya raya tapi kesepian?", depth: 2 },
    { id: "dt-18", categoryId: "deep-talk", text: "Apa satu rahasia yang nggak pernah kamu ceritain ke orang tua?", depth: 3 },
    { id: "dt-19", categoryId: "deep-talk", text: "Kapan terakhir kali kamu nangis sendirian? Kenapa?", depth: 3 },
    { id: "dt-20", categoryId: "deep-talk", text: "Siapa orang yang udah nggak ada di hidupmu, tapi dampaknya masih kerasa sampai sekarang?", depth: 3 },

    { id: "dt-21", categoryId: "deep-talk", text: "Definisi 'cukup' buat kamu itu kayak gimana?", depth: 3 },
    { id: "dt-22", categoryId: "deep-talk", text: "Apa penyesalan terbesar kamu di usia 20-an (atau masa remaja)?", depth: 3 },
    { id: "dt-23", categoryId: "deep-talk", text: "Kalau bisa ngulang satu hari dalam hidupmu, hari yang mana?", depth: 2 },
    { id: "dt-24", categoryId: "deep-talk", text: "Hal apa yang bikin kamu gampang ilfeel sama orang lain?", depth: 2 },
    { id: "dt-25", categoryId: "deep-talk", text: "Apa lagu yang kalau kamu dengerin, rasanya sedih banget?", depth: 2 },

    { id: "dt-26", categoryId: "deep-talk", text: "Apa ekspektasi sosial yang paling membebani kamu saat ini?", depth: 2, followUps: ["Soal nikah? Karir? Gaji?"] },
    { id: "dt-27", categoryId: "deep-talk", text: "Gimana cara kamu mengekspresikan rasa sayang ke orang terdekat? (Love language)", depth: 2 },
    { id: "dt-28", categoryId: "deep-talk", text: "Pernah nggak ngerasa sendirian padahal lagi rame-rame?", depth: 3 },
    { id: "dt-29", categoryId: "deep-talk", text: "Apa janji ke diri sendiri yang sampai sekarang belum ditepati?", depth: 3 },
    { id: "dt-30", categoryId: "deep-talk", text: "Apa legacy (warisan) ingatan yang pengen kamu tinggalin buat orang-orang di sekitarmu?", depth: 3 },

    // ============================
    // REFLEKSI DIRI (Evaluasi & Growth)
    // ============================
    { id: "rf-1", categoryId: "reflection", text: "Apa satu kebiasaan buruk yang pengen banget kamu stop tahun ini?", depth: 2 },
    { id: "rf-2", categoryId: "reflection", text: "Kalau kamu ketemu versi dirimu yang umur 10 tahun, dia bakal bangga nggak sama kamu sekarang?", depth: 3 },
    { id: "rf-3", categoryId: "reflection", text: "Apa pencapaian kecil tahun ini yang belum sempet kamu rayain/hargai?", depth: 2 },
    { id: "rf-4", categoryId: "reflection", text: "Kapan terakhir kali kamu bilang 'makasih' ke diri sendiri?", depth: 2 },
    { id: "rf-5", categoryId: "reflection", text: "Apa bakat atau hobi yang dulu kamu suka tapi ditinggalin karena sibuk?", depth: 2 },

    { id: "rf-6", categoryId: "reflection", text: "Sifat apa dari dirimu yang sering bikin masalah sama orang lain?", depth: 3 },
    { id: "rf-7", categoryId: "reflection", text: "Apa hal yang paling bikin kamu insecure akhir-akhir ini?", depth: 3 },
    { id: "rf-8", categoryId: "reflection", text: "Menurutmu, kamu pendengar yang baik atau pembicara yang dominan?", depth: 2 },
    { id: "rf-9", categoryId: "reflection", text: "Apa pelajaran mahal yang kamu dapet dari 'kegagalan' terakhirmu?", depth: 2 },
    { id: "rf-10", categoryId: "reflection", text: "Kalau hidupmu adalah buku, judul bab saat ini apa?", depth: 2, followUps: ["Kenapa judulnya itu?"] },

    { id: "rf-11", categoryId: "reflection", text: "Siapa orang yang harusnya kamu hubungi tapi kamu tunda-tunda terus?", depth: 2 },
    { id: "rf-12", categoryId: "reflection", text: "Berapa jam sehari kamu dedikasikan buat scroll medsos? Worth it nggak?", depth: 2 },
    { id: "rf-13", categoryId: "reflection", text: "Apa definisi 'Bahagia' versi kamu sekarang vs 5 tahun lalu?", depth: 2 },
    { id: "rf-14", categoryId: "reflection", text: "Apakah lingkungan pertemananmu sekarang bikin kamu berkembang atau stagnan?", depth: 3 },
    { id: "rf-15", categoryId: "reflection", text: "Apa satu hal yang orang lain sering salah paham soal kamu?", depth: 2 },

    { id: "rf-16", categoryId: "reflection", text: "Apa batasan (boundary) yang perlu kamu tegesin ke orang lain?", depth: 2 },
    { id: "rf-17", categoryId: "reflection", text: "Kalau nggak ada masalah uang, kerjaan apa yang sebenernya pengen kamu lakuin?", depth: 2 },
    { id: "rf-18", categoryId: "reflection", text: "Apa momen di mana kamu merasa paling 'hidup'?", depth: 2 },
    { id: "rf-19", categoryId: "reflection", text: "Apa kritik pedas yang pernah kamu terima dan ternyata bener?", depth: 2 },
    { id: "rf-20", categoryId: "reflection", text: "Gimana caramu ngadepin stress? Sehat nggak caranya?", depth: 2 },

    { id: "rf-21", categoryId: "reflection", text: "Apa prioritas hidupmu yang sering kegeser sama hal-hal nggak penting?", depth: 2 },
    { id: "rf-22", categoryId: "reflection", text: "Kalau kamu bisa kasih satu skill baru ke dirimu secara instan, mau skill apa?", depth: 1 },
    { id: "rf-23", categoryId: "reflection", text: "Seberapa sering kamu ngebandingin diri sama orang lain di Instagram/TikTok?", depth: 2 },
    { id: "rf-24", categoryId: "reflection", text: "Apa satu hal yang kamu harap orang lain lebih apresiasi dari kamu?", depth: 2 },
    { id: "rf-25", categoryId: "reflection", text: "Apakah kamu tipe orang yang menyimpan dendam atau gampang melupakan?", depth: 2 },

    { id: "rf-26", categoryId: "reflection", text: "Apa keputusan tersulit yang pernah kamu ambil?", depth: 3 },
    { id: "rf-27", categoryId: "reflection", text: "Apa hal yang bikin kamu merasa berharga?", depth: 2 },
    { id: "rf-28", categoryId: "reflection", text: "Sudahkah kamu memaafkan dirimu atas kesalahan di masa lalu?", depth: 3 },
    { id: "rf-29", categoryId: "reflection", text: "Apa ketakutan irasional yang masih kamu percaya?", depth: 1 },
    { id: "rf-30", categoryId: "reflection", text: "Satu kata yang mendeskripsikan tahun ini buatmu?", depth: 1 },

    // ============================
    // NOSTALGIA (Masa Kecil & Sekolah)
    // ============================
    { id: "ns-1", categoryId: "nostalgia", text: "Jajanan SD apa yang paling legendaris menurutmu?", depth: 1, followUps: ["Telur gulung? Lidi-lidian? Es wawan?"] },
    { id: "ns-2", categoryId: "nostalgia", text: "Kartun minggu pagi apa yang dulu wajib banget ditonton?", depth: 1 },
    { id: "ns-3", categoryId: "nostalgia", text: "Apa momen paling memalukan waktu upacara bendera?", depth: 1 },
    { id: "ns-4", categoryId: "nostalgia", text: "Dulu cita-citamu pas TK/SD mau jadi apa? Kesampaian nggak?", depth: 1 },
    { id: "ns-5", categoryId: "nostalgia", text: "Permainan tradisional apa yang dulu sering kamu mainin bareng tetangga?", depth: 1, followUps: ["Benteng? Petak umpet? Gobak sodor?"] },

    { id: "ns-6", categoryId: "nostalgia", text: "Pernah punya 'cinta monyet' pas SD/SMP? Ceritain!", depth: 1 },
    { id: "ns-7", categoryId: "nostalgia", text: "Apa lagu alay yang dulu sering kamu dengerin di warnet?", depth: 1 },
    { id: "ns-8", categoryId: "nostalgia", text: "Kapan terakhir kali kamu dapet THR lebaran (sebagai penerima)?", depth: 1 },
    { id: "ns-9", categoryId: "nostalgia", text: "Hukuman guru paling aneh yang pernah kamu dapet apa?", depth: 1 },
    { id: "ns-10", categoryId: "nostalgia", text: "Benda apa yang dulu hits banget di sekolahmu (misal: binder, tamiya, kartu yu-gi-oh)?", depth: 1 },

    { id: "ns-11", categoryId: "nostalgia", text: "Momen MOS/Ospek apa yang paling nggak bisa dilupain?", depth: 1 },
    { id: "ns-12", categoryId: "nostalgia", text: "Siapa teman sebangku yang paling 'ajaib' kelakuannya?", depth: 1 },
    { id: "ns-13", categoryId: "nostalgia", text: "Kalau bisa balik ke masa SMA selama sehari, mau ngapain?", depth: 1 },
    { id: "ns-14", categoryId: "nostalgia", text: "Buku atau komik apa yang dulu sering kamu baca diem-diem?", depth: 1 },
    { id: "ns-15", categoryId: "nostalgia", text: "Apa kenangan lebaran/liburan keluarga yang paling anget di ingatan?", depth: 2 },

    { id: "ns-16", categoryId: "nostalgia", text: "Dulu takut banget sama apa? (Misal: ondel-ondel, badut, suara tokek)", depth: 1 },
    { id: "ns-17", categoryId: "nostalgia", text: "Pernah kabur dari rumah atau bolos sekolah nggak? Gimana ceritanya?", depth: 1 },
    { id: "ns-18", categoryId: "nostalgia", text: "Siapa guru 'killer' yang sekarang malah kamu kangenin/respekin?", depth: 1 },
    { id: "ns-19", categoryId: "nostalgia", text: "Acara TV malam apa yang dulu sering ditonton bareng keluarga?", depth: 1 },
    { id: "ns-20", categoryId: "nostalgia", text: "Barang jadul apa yang sekarang pengen kamu punya lagi?", depth: 1 },

    { id: "ns-21", categoryId: "nostalgia", text: "Nick name game online atau email alay pertamamu apa?", depth: 1 },
    { id: "ns-22", categoryId: "nostalgia", text: "Dulu tim Nokia, Blackberry, atau Sony Ericsson?", depth: 1 },
    { id: "ns-23", categoryId: "nostalgia", text: "Pernah kirim surat cinta (kertas) ke siapa?", depth: 1 },
    { id: "ns-24", categoryId: "nostalgia", text: "Apa mitos masa kecil yang dulu kamu percaya banget? (Misal: nelen biji jeruk tumbuh pohon)", depth: 1 },
    { id: "ns-25", categoryId: "nostalgia", text: "Tempat nongkrong legendaris pas jaman sekolah di mana?", depth: 1 },
    { id: "ns-26", categoryId: "nostalgia", text: "Apa gaya rambut atau fashion dulu yang sekarang bikin kamu cringe?", depth: 1 },
    { id: "ns-27", categoryId: "nostalgia", text: "Siapa pahlawan fiksi masa kecilmu?", depth: 1 },
    { id: "ns-28", categoryId: "nostalgia", text: "Apa iklan TV jadul yang jingle-nya masih nempel di kepala?", depth: 1 },
    { id: "ns-29", categoryId: "nostalgia", text: "Pernah ngerasain nungguin download lagu berjam-jam?", depth: 1 },
    { id: "ns-30", categoryId: "nostalgia", text: "Hal apa yang hilang dari masa lalu dan nggak ada di zaman sekarang?", depth: 2 },

    // ============================
    // FUN & RANDOM (Halu & Kocak)
    // ============================
    { id: "fn-1", categoryId: "fun", text: "Kalau hidupmu dijadikan sinetron azab, judulnya kira-kira apa?", depth: 1, followUps: ["Azab apa tuh? wkwk"] },
    { id: "fn-2", categoryId: "fun", text: "Kalau kamu jadi hantu Indonesia, mau jadi apa? (Pocong/Kunti/Tuyul, dll)", depth: 1, followUps: ["Kenapa pilih itu? Biar bisa loncat-loncat?"] },
    { id: "fn-3", categoryId: "fun", text: "Skenario kiamat zombie: Senjata apa yang pertama kali kamu cari di rumah?", depth: 1 },
    { id: "fn-4", categoryId: "fun", text: "Kalau binatang bisa ngomong, binatang apa yang paling nyebelin?", depth: 1 },
    { id: "fn-5", categoryId: "fun", text: "Teori konspirasi apa yang diem-diem kamu percaya? (Misal: alien, bumi datar, dll)", depth: 1 },

    { id: "fn-6", categoryId: "fun", text: "Kalau kamu punya uang unlimited tapi cuma boleh beli barang yang huruf depannya 'K', beli apa?", depth: 1 },
    { id: "fn-7", categoryId: "fun", text: "Hal paling absurd apa yang pernah kamu lakuin pas lagi sendirian di kamar?", depth: 1 },
    { id: "fn-8", categoryId: "fun", text: "Pilih: Nggak bisa makan nasi selamanya ATAU nggak bisa akses internet selamanya?", depth: 1 },
    { id: "fn-9", categoryId: "fun", text: "Kalau kamu bisa tukeran hidup sama satu orang selama 24 jam, mau jadi siapa?", depth: 1 },
    { id: "fn-10", categoryId: "fun", text: "Apa kebohongan paling konyol yang pernah kamu bilang ke teman biar nggak jadi ketemuan?", depth: 1 },

    { id: "fn-11", categoryId: "fun", text: "Kalau alien dateng ke bumi, makanan Indonesia apa yang mau kamu suguhin biar mereka nggak jadi nyerang?", depth: 1 },
    { id: "fn-12", categoryId: "fun", text: "Sebutkan satu kata bahasa Indonesia yang kedengeran aneh kalau diulang-ulang.", depth: 1 },
    { id: "fn-13", categoryId: "fun", text: "Kalau kamu masuk penjara, kira-kira kasusnya apa?", depth: 1 },
    { id: "fn-14", categoryId: "fun", text: "Apa superpower paling nggak berguna yang kamu pengen punya?", depth: 1, followUps: ["Bisa ngubah air jadi kuah bakso?"] },
    { id: "fn-15", categoryId: "fun", text: "Siapa selebritis yang menurutmu cocok jadi presiden kita selanjutnya?", depth: 1 },

    { id: "fn-16", categoryId: "fun", text: "Pilih: Selalu salah kostum di acara penting ATAU selalu salah nyebut nama orang pas salaman?", depth: 1 },
    { id: "fn-17", categoryId: "fun", text: "Kalau kamu buka warung makan, nama warungnya apa & menu andalannya apa?", depth: 1 },
    { id: "fn-18", categoryId: "fun", text: "Apa bau aneh yang sebenernya kamu suka? (Bensin? Hujan? Ketiak sendiri?)", depth: 1 },
    { id: "fn-19", categoryId: "fun", text: "Kalau disuruh bikin sekte baru, ajaran utamanya apa?", depth: 1 },
    { id: "fn-20", categoryId: "fun", text: "Momen 'salah server' paling canggung yang pernah kamu alami?", depth: 1 },

    { id: "fn-21", categoryId: "fun", text: "Kalau hidupmu ada backsound-nya, lagu apa yang lagi muter sekarang?", depth: 1 },
    { id: "fn-22", categoryId: "fun", text: "Pilih: Tahu masa depan ATAU bisa mengubah masa lalu?", depth: 1 },
    { id: "fn-23", categoryId: "fun", text: "Siapa tokoh kartun yang sifatnya paling mirip sama kamu?", depth: 1 },
    { id: "fn-24", categoryId: "fun", text: "Apa hal ilegal yang kalau jadi legal bakal sering kamu lakuin?", depth: 1 },
    { id: "fn-25", categoryId: "fun", text: "Kalau kamu jadi influencer, kontenmu tentang apa?", depth: 1 },
    { id: "fn-26", categoryId: "fun", text: "Sebutkan 3 benda yang bakal kamu bawa kalau terdampar di pulau kosong (nggak boleh HP).", depth: 1 },
    { id: "fn-27", categoryId: "fun", text: "Kalau bisa ngilang, tempat mana yang pertama kali kamu masukin?", depth: 1 },
    { id: "fn-28", categoryId: "fun", text: "Apa nama WI-FI terkocak yang pernah kamu lihat?", depth: 1 },
    { id: "fn-29", categoryId: "fun", text: "Kalau kamu harus nikah sama makanan, makanan apa yang kamu pilih?", depth: 1 },
    { id: "fn-30", categoryId: "fun", text: "Apa chat terakhir yang kamu copy-paste?", depth: 1 },
];
