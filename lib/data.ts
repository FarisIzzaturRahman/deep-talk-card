export interface Category {
    id: string;
    label: string;
    description: string;
    color: string;
    gradient: string;
    surfaceBg: string;
    surfaceEdge: string;
    surfaceInk: string;
    badgeColor: string;
    isDarkSurface?: boolean;
}

export interface Question {
    id: string;
    categoryId: string;
    text: string;
    depth: 1 | 2 | 3; // 1 = Light, 3 = Deep
    type?: 'normal' | 'wildcard';
    intensity?: 1 | 2 | 3; // Wildcard intensity: 1 (safe), 3 (bold)
    followUps?: string[]; // Contextual follow-up questions
}

export const CATEGORIES: Category[] = [
    {
        id: "ice-breaker",
        label: "Ice Breaker",
        description: "Pemanasan dulu gais, biar nggak kaku.",
        color: "bg-[var(--cat-ice-badge)]",
        gradient: "bg-[var(--cat-ice-bg)]",
        surfaceBg: "var(--cat-ice-bg)",
        surfaceEdge: "var(--cat-ice-edge)",
        surfaceInk: "var(--cat-ice-ink)",
        badgeColor: "var(--cat-ice-badge)",
    },
    {
        id: "deep-talk",
        label: "Deep Talk",
        description: "Ngobrolin perasaan, mimpi, dan realita hidup.",
        color: "bg-[var(--cat-deep-bg)]",
        gradient: "bg-[var(--cat-deep-bg)]",
        surfaceBg: "var(--cat-deep-bg)",
        surfaceEdge: "var(--cat-deep-edge)",
        surfaceInk: "var(--cat-deep-ink)",
        badgeColor: "var(--cat-deep-badge)",
        isDarkSurface: true,
    },
    {
        id: "reflection",
        label: "Refleksi Diri",
        description: "Flashback bentar, evaluasi diri sendiri.",
        color: "bg-[var(--cat-reflect-badge)]",
        gradient: "bg-[var(--cat-reflect-bg)]",
        surfaceBg: "var(--cat-reflect-bg)",
        surfaceEdge: "var(--cat-reflect-edge)",
        surfaceInk: "var(--cat-reflect-ink)",
        badgeColor: "var(--cat-reflect-badge)",
    },
    {
        id: "nostalgia",
        label: "Nostalgia",
        description: "Masa kecil, jajan SD, dan momen alay dulu.",
        color: "bg-[var(--cat-nostalgia-badge)]",
        gradient: "bg-[var(--cat-nostalgia-bg)]",
        surfaceBg: "var(--cat-nostalgia-bg)",
        surfaceEdge: "var(--cat-nostalgia-edge)",
        surfaceInk: "var(--cat-nostalgia-ink)",
        badgeColor: "var(--cat-nostalgia-badge)",
    },
    {
        id: "fun",
        label: "Fun & Random",
        description: "Halu dikit nggak ngaruh, seru-seruan aja.",
        color: "bg-[var(--color-accent)]",
        gradient: "bg-[var(--cat-fun-bg)]",
        surfaceBg: "var(--cat-fun-bg)",
        surfaceEdge: "var(--cat-fun-edge)",
        surfaceInk: "var(--cat-fun-ink)",
        badgeColor: "var(--cat-fun-badge)",
    },
    {
        id: "asmara",
        label: "PDKT & Chemistry",
        description: "Kenalan lebih dekat, cari chemistry, dan ngobrol manis tanpa bikin risih.",
        color: "bg-[var(--cat-asmara-badge)]",
        gradient: "bg-[var(--cat-asmara-bg)]",
        surfaceBg: "var(--cat-asmara-bg)",
        surfaceEdge: "var(--cat-asmara-edge)",
        surfaceInk: "var(--cat-asmara-ink)",
        badgeColor: "var(--cat-asmara-badge)",
    },
];

export const CLOSING_MESSAGES = [
    "Terima kasih sudah berbagi cerita hari ini. Hal-hal kecil kayak gini yang bikin kita makin dekat.",
    "Obrolan hari ini seru banget. Kadang kita lupa betapa pentingnya sekadar duduk dan ngobrol.",
    "Semoga ada satu atau dua cerita dari hari ini yang bikin kamu senyum pas mau tidur nanti.",
    "Nggak ada jawaban benar atau salah, yang ada cuma cerita kita. Makasih udah jadi diri sendiri.",
    "Capek ya? Istirahat yang cukup. Besok kita mulai hari baru dengan semangat baru.",
    "Senang rasanya bisa mengenal sisi lain dari kalian semua. Sampai ketemu di obrolan berikutnya!",
    "Dunia di luar sana mungkin berisik, tapi semoga momen ini ngasih sedikit ketenangan.",
    "Teman ngobrol itu investasi terbaik. Jaga terus koneksi ini ya.",
    "Udah, jangan dipikirin lagi jawaban tadi. Yang penting kita udah ketawa bareng.",
    "Pulang dengan hati ringan ya. Kalian semua keren banget hari ini.",
    "Kadang yang kita butuhkan cuma telinga yang mendengar dan hati yang mengerti. Thanks for today.",
    "Jangan lupa minum air putih dan istirahat. Kesehatanmu lebih penting dari apapun.",
    "Setiap orang punya cerita. Makasih udah ngasih kepercayaan buat dengerin ceritamu.",
    "Kalau besok berat, inget aja kita pernah ketawa lepas gara-gara pertanyaan konyol tadi.",
    "Stay safe, stay sane, and stay kind. Sampai jumpa lagi!",
    "Terima kasih sudah meluangkan waktu. Nggak harus lama, yang penting rasanya nyata.",
    "Hari ini mungkin biasa saja, tapi obrolannya nggak. Semoga terasa sampai nanti.",
    "Ada hal-hal yang nggak perlu disimpulkan. Cukup dirasain sebentar, lalu disimpan.",
    "Semoga setelah ini, suasananya jadi sedikit lebih hangat dari sebelumnya.",
    "Nggak semua momen harus bermakna besar. Yang kecil-kecil juga layak dirayakan.",
    "Kalau ada yang kepikiran setelah ini, berarti obrolannya kena di hati.",
    "Terima kasih sudah hadir sepenuhnya, walau cuma sebentar.",
    "Kadang ngobrol ringan justru yang paling kita butuhkan hari ini.",
    "Semoga pulangnya nggak cuma bawa HP, tapi juga perasaan yang lebih ringan.",
    "Momen kayak gini jarang terasa penting sekarang, tapi sering diingat nanti.",
    "Nggak apa-apa kalau masih kepikiran satu dua jawaban. Itu bagian dari proses.",
    "Terima kasih sudah bikin sesi ini hidup dengan caramu sendiri.",
    "Kalau hari ini melelahkan, semoga obrolan tadi jadi jeda yang menyenangkan.",
    "Semoga setelah ini, kamu merasa sedikit lebih ditemani.",
    "Nggak perlu buru-buru. Semua hal baik memang datang pelan-pelan.",
    "Terima kasih sudah ikut meramaikan ruang kecil ini.",
    "Mungkin sederhana, tapi momen ini tetap berarti.",
    "Kalau ada yang bikin senyum kecil barusan, itu sudah cukup.",
    "Terima kasih sudah berbagi ruang, waktu, dan cerita.",
    "Sampai jumpa lagi, di obrolan yang nggak perlu dipaksakan.",
];
