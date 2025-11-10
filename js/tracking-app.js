var app = new Vue({
  el: '#app',
  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
    ],
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      }
    ],
    // Simulasi status DO (opsional fitur Tracking DO)
    tracking: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        expanded: false,
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    },
    // Additional data for tracking page
    selectedPaket: '',
    searchTerm: '',
    sortKey: '',
    sortOrder: 'asc',
    newDO: {
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: '',
      tanggalKirim: '',
      total: 0
    },
    errors: {},
    currentYear: new Date().getFullYear(),
    sequenceNumber: 1
  },
  computed: {
    paketDetail: function() {
      return this.paket.find(p => p.kode === this.selectedPaket);
    },
    trackingList: function() {
      return Object.keys(this.tracking).map(key => ({
        noDO: key,
        expanded: this.tracking[key].expanded || false,
        ...this.tracking[key]
      }));
    },
    filteredTrackingList: function() {
      let list = this.trackingList;
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.trim();
        list = list.filter(item =>
          item.noDO.includes(term) || item.nim.includes(term) || item.nama.toLowerCase().includes(term.toLowerCase())
        );
      }
      if (this.sortKey) {
        list = list.sort((a, b) => {
          let aVal = a[this.sortKey];
          let bVal = b[this.sortKey];
          if (this.sortKey === 'tanggalKirim') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          }
          if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return list;
    },
    nextDONumber: function() {
      const existingNumbers = Object.keys(this.tracking).map(key => parseInt(key.split('-')[1]));
      const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
      return `DO${this.currentYear}-${String(maxNumber + 1).padStart(3, '0')}`;
    }
  },
  methods: {
    addDO: function() {
      if (this.validateDOForm()) {
        const paket = this.paket.find(p => p.kode === this.newDO.paket);
        this.newDO.total = paket.harga;
        this.newDO.tanggalKirim = this.newDO.tanggalKirim || new Date().toISOString().split('T')[0];
        this.$set(this.tracking, this.nextDONumber, {
          ...this.newDO,
          status: "Dalam Proses",
          perjalanan: []
        });
        this.resetNewDO();
      }
    },
    validateDOForm: function() {
      this.errors = {};
      if (!this.newDO.nim) this.errors.nim = 'NIM wajib diisi';
      if (!this.newDO.nama) this.errors.nama = 'Nama wajib diisi';
      if (!this.newDO.ekspedisi) this.errors.ekspedisi = 'Ekspedisi wajib dipilih';
      if (!this.newDO.paket) this.errors.paket = 'Paket wajib dipilih';
      return Object.keys(this.errors).length === 0;
    },
    resetNewDO: function() {
      this.newDO = {
        nim: '',
        nama: '',
        ekspedisi: '',
        paket: '',
        tanggalKirim: '',
        total: 0
      };
      this.errors = {};
      this.selectedPaket = '';
    },
    getPaketInfo: function(kode) {
      const paket = this.paket.find(p => p.kode === kode);
      return paket ? `${paket.kode} - ${paket.nama}` : '';
    },
    getPaketIsi: function(kode) {
      const paket = this.paket.find(p => p.kode === kode);
      if (!paket) return [];
      return paket.isi.map(kodeItem => {
        const item = this.stok.find(s => s.kode === kodeItem);
        return item ? `${item.kode} - ${item.judul}` : kodeItem;
      });
    },
    sortBy: function(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    toggleExpand: function(noDO) {
      this.$set(this.tracking[noDO], 'expanded', !this.tracking[noDO].expanded);
    },
    editDO: function(noDO) {
      // Placeholder for edit functionality
      alert(`Edit DO ${noDO} - Functionality to be implemented`);
    },
    deleteDO: function(noDO) {
      if (confirm(`Apakah Anda yakin ingin menghapus DO ${noDO}?`)) {
        this.$delete(this.tracking, noDO);
      }
    }
  },
  watch: {
    'newDO.paket': function(newVal) {
      if (newVal) {
        const paket = this.paket.find(p => p.kode === newVal);
        this.newDO.total = paket ? paket.harga : 0;
      } else {
        this.newDO.total = 0;
      }
    },
    selectedPaket: function() {
      // Watcher for selected paket in form
    }
  }
});
