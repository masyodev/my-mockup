const jabatanData = {
  "Pimpinan": {
    unit: [],
    jabatan: ["Ketua Umum", "Ketua Harian"]
  },
  "Kesekretariatan": {
    unit: [],
    jabatan: ["Sekretaris Jenderal", "Wakil Sekretaris"]
  },
  "Bendahara": {
    unit: [],
    jabatan: ["Bendahara Umum", "Wakil Bendahara"]
  },
  "Bidang": {
    unit: ["Bidang Organisasi", "Bidang Prestasi", "Bidang Wasit Juri"],
    jabatan: ["Ketua", "Anggota"]
  },
  "Teknis": {
    unit: [],
    jabatan: ["Pelatih", "Wasit–Juri"]
  },
  "Keanggotaan": {
    unit: [],
    jabatan: ["Anggota"]
  }
};

function initJabatan() {
  const kategori = document.getElementById("jabatan_kategori");
  const unit = document.getElementById("jabatan_unit");
  const jabatan = document.getElementById("jabatan_nama");

  if (!kategori) return;

  kategori.innerHTML = '<option value="">Pilih Kategori</option>';
  unit.innerHTML = '<option value="">Pilih Unit</option>';
  jabatan.innerHTML = '<option value="">Pilih Jabatan</option>';

  unit.disabled = true;

  Object.keys(jabatanData).forEach(k => {
    kategori.innerHTML += `<option value="${k}">${k}</option>`;
  });

  kategori.addEventListener("change", function () {
    const val = this.value;

    unit.innerHTML = '<option value="">Pilih Unit</option>';
    jabatan.innerHTML = '<option value="">Pilih Jabatan</option>';

    if (!val) return;

    const data = jabatanData[val];

    if (data.unit.length > 0) {
      unit.disabled = false;
      data.unit.forEach(u => {
        unit.innerHTML += `<option value="${u}">${u}</option>`;
      });
    } else {
      unit.disabled = true;
    }

    data.jabatan.forEach(j => {
      jabatan.innerHTML += `<option value="${j}">${j}</option>`;
    });
  });
}