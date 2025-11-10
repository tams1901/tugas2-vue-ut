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
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    },
    // Additional data for stok page
    filterUpbjj: '',
    filterKategori: '',
    showLowStock: false,
    sortBy: '',
    sortOrder: 'asc',
    editingIndex: -1,
    newItem: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    },
    errors: {}
  },
  computed: {
    filteredStok: function() {
      let filtered = this.stok.slice();

      if (this.filterUpbjj) {
        filtered = filtered.filter(item => item.upbjj === this.filterUpbjj);
      }

      if (this.filterKategori) {
        filtered = filtered.filter(item => item.kategori === this.filterKategori);
      }

      if (this.showLowStock) {
        filtered = filtered.filter(item => item.qty <= item.safety);
      }

      if (this.sortBy) {
        filtered.sort((a, b) => {
          let aVal = a[this.sortBy];
          let bVal = b[this.sortBy];
          if (this.sortBy === 'judul') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }
          if (this.sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      return filtered;
    },
    availableKategori: function() {
      if (!this.filterUpbjj) return this.kategoriList;
      return [...new Set(this.stok.filter(item => item.upbjj === this.filterUpbjj).map(item => item.kategori))];
    }
  },
  methods: {
    getStatus: function(item) {
      if (item.qty === 0) return 'Kosong';
      if (item.qty < item.safety) return 'Menipis';
      return 'Aman';
    },
    getStatusClass: function(item) {
      if (item.qty === 0) return 'status-kosong';
      if (item.qty < item.safety) return 'status-menipis';
      return 'status-aman';
    },
    editItem: function(index) {
      this.editingIndex = index;
      this.newItem = { ...this.stok[index] };
    },
    saveEdit: function() {
      if (this.validateForm()) {
        this.stok.splice(this.editingIndex, 1, { ...this.newItem });
        this.editingIndex = -1;
        this.resetNewItem();
      }
    },
    cancelEdit: function() {
      this.editingIndex = -1;
      this.resetNewItem();
    },
    addItem: function() {
      if (this.validateForm()) {
        this.stok.push({ ...this.newItem });
        this.resetNewItem();
      }
    },
    validateForm: function() {
      this.errors = {};
      if (!this.newItem.kode) this.errors.kode = 'Kode wajib diisi';
      if (!this.newItem.judul) this.errors.judul = 'Judul wajib diisi';
      if (!this.newItem.kategori) this.errors.kategori = 'Kategori wajib dipilih';
      if (!this.newItem.upbjj) this.errors.upbjj = 'UPBJJ wajib dipilih';
      if (!this.newItem.lokasiRak) this.errors.lokasiRak = 'Lokasi Rak wajib diisi';
      if (this.newItem.harga <= 0) this.errors.harga = 'Harga harus lebih dari 0';
      if (this.newItem.qty < 0) this.errors.qty = 'Qty tidak boleh negatif';
      if (this.newItem.safety < 0) this.errors.safety = 'Safety stock tidak boleh negatif';
      return Object.keys(this.errors).length === 0;
    },
    resetNewItem: function() {
      this.newItem = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      };
      this.errors = {};
    },
    resetFilters: function() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.showLowStock = false;
      this.sortBy = '';
      this.sortOrder = 'asc';
    },
    toggleSort: function(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    }
  },
  watch: {
    filterUpbjj: function() {
      this.filterKategori = '';
    },
    sortBy: function() {
      // Watcher for sort changes
    },
    showLowStock: function() {
      // Watcher for low stock filter
    }
  }
});
