console.log("personel.js loaded");

// GLOBAL STATE
let IPSI_LOCKED = false;
let IPSI_DATA_LOCKED = [];

let PG_LOCKED = false;
let PG_DATA_LOCKED = [];

const UNSUR_INTI = ["Pimpinan", "Kesekretariatan", "Bendahara"];

// END GLOBAL STATE 

function renderPersonel() {
  return `
    <div class="page-header">
      <h2>Personel IPSI</h2>
		<div class="header-action">
		   <button class="btn btn-add btn-sm" onclick="showFormPersonel()">
			  <i class="fa-solid fa-plus"></i> Tambah
			</button>		
			<button class="btn btn-primary btn-sm" onclick="savePersonel()">
			  <i class="fa-solid fa-floppy-disk"></i> Simpan
			</button>
			<button class="btn btn-secondary btn-sm" onclick="resetPersonel()">
			  <i class="fa-solid fa-rotate-left"></i> Reset
			</button>
		</div>	
    </div>

    <!-- ================= DATA PRIBADI ================= -->
    <div class="card" id="formPersonel">
      <h3>Data Pribadi</h3>

      <div class="form-grid">
        <div>
          <label>Nama Lengkap</label>
          <input id="p_nama" type="text">
        </div>

        <div>
          <label>NIK</label>
          <input id="p_nik" type="text">
        </div>

        <div>
          <label>Jenis Kelamin</label>
          <select id="p_gender">
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div>
          <label>Tanggal Lahir</label>
          <input id="p_tgl_lahir" type="date">
        </div>

        <div>
          <label>No HP</label>
          <input id="p_hp" type="text">
        </div>

        <div>
          <label>Email</label>
          <input id="p_email" type="email">
        </div>
      </div>
    </div>

    <!-- ================= JABATAN IPSI ================= -->
	<div class="card">

	  <div class="card-header-flex">
		<h3>Jabatan IPSI</h3>	
	  </div>
	<div id="ipsi_container">
	  <table class="table">
		<thead>
		  <tr>
			<th>Organisasi</th>
			<th>Kategori</th>
			<th>Jabatan</th>
			<th></th>
		  </tr>
		</thead>
		<tbody id="ipsi_table"></tbody>
	  </table>
	  </div>
		<button class="btn btn-add btn-sm" onclick="addIPSIRow()">
		  <i class="fa-solid fa-plus"></i> Tambah
		</button>
		<button class="btn btn-primary btn-sm" onclick="saveIPSISection()">
		  <i class="fa-solid fa-lock"></i> Simpan
		</button>	
	</div>

    <!-- ================= JABATAN PERGURUAN ================= -->
	<div class="card">

	  <!-- HEADER -->
	  <div class="card-header-flex">
		<h3>Jabatan Perguruan</h3>	
	  </div>

	  <!-- CONTENT -->
	  <table class="table">
		<thead>
		  <tr>
			<th>Perguruan</th>
			<th>Jabatan</th>
			<th></th>
		  </tr>
		</thead>
		<tbody id="perguruan_table"></tbody>
	  </table>
		<button class="btn btn-add btn-sm" onclick="addPerguruanRow()">
			<i class="fa-solid fa-plus"></i> Tambah
		</button>
		<button class="btn btn-primary btn-sm" onclick="savePerguruanSection()">
		  <i class="fa-solid fa-lock"></i> Simpan
		</button>
	</div>



    <!-- ================= TABLE ================= -->
    <div class="card">
      <h3>Data Personel</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>IPSI</th>
            <th>Perguruan</th>
          </tr>
        </thead>
        <tbody id="personel_table"></tbody>
      </table>
    </div>
  `;
}

function initPersonel() {
  loadOrganisasiIPSI();
  initJabatan();
  renderPersonelTable();
//  addIPSIRow();
  
  const orgSelect = document.getElementById("p_org_ipsi");

  if (orgSelect) {
    orgSelect.addEventListener("change", function () {

      console.log("CHANGE:", this.value);

      const rows = document.querySelectorAll(".pg_nama");

      rows.forEach(select => {
        loadPerguruanDropdown(this.value, select);
      });

    });
  }  
}

function loadOrganisasiIPSI() {
  const select = document.getElementById("p_org_ipsi");
  if (!select) return;

  const data = JSON.parse(localStorage.getItem("orgData")) || [];

  select.innerHTML = '<option value="">Pilih Organisasi</option>';

  data.forEach(o => {
    // hanya IPSI (PB, Pengprov, Pengda)
    if (["PB", "Pengprov", "Pengda"].includes(o.level)) {
      select.innerHTML += `<option value="${o.nama}">${o.nama}</option>`;
    }
  });
}

function addPerguruanRow() {

  const orgValue = getActiveIPSIOrganisasi();

  if (!orgValue) {
    alert("Pilih Jabatan IPSI terlebih dahulu");
    return;
  }

  const tbody = document.getElementById("perguruan_table");

  const row = document.createElement("tr");
  row.className = "pg-row";

  // 🔥 simpan snapshot organisasi di row
  row.dataset.org = orgValue;

  row.innerHTML = `
    <td>
      <select class="pg_nama"></select>
    </td>
    <td>
      <input class="pg_jabatan" type="text" placeholder="Jabatan">
    </td>
    <td>
      <button class="btn btn-secondary btn-sm" onclick="this.closest('tr').remove()">
        Hapus
      </button>
    </td>
  `;

  tbody.appendChild(row);

  const select = row.querySelector(".pg_nama");

  // 🔥 load berdasarkan org masing-masing
  loadPerguruanDropdown(orgValue, select);
}


function loadOrganisasiDropdown() {
  const select = document.getElementById("p_organisasi");
  if (!select) return;

  select.innerHTML = '<option value="">Pilih Organisasi</option>';

  const data = JSON.parse(localStorage.getItem("orgData")) || [];

  data.forEach(o => {
    select.innerHTML += `<option value="${o.nama}">${o.nama}</option>`;
  });
}


function savePersonel() {

  const nama = document.getElementById("p_nama").value.trim();
  if (!nama) return alert("Nama wajib diisi");

  // 🔥 VALIDASI IPSI
  const ipsiData = validateIPSIRows();
  if (!ipsiData) return;

  // ===== PERGURUAN =====
const rows = document.querySelectorAll("#perguruan_table tr");

let perguruan = [];

rows.forEach(r => {
  const nama = r.querySelector(".pg_nama").value;
  const jabatan = r.querySelector(".pg_jabatan").value;
  const org = r.dataset.org;

  if (nama && jabatan) {
    perguruan.push({ nama, jabatan, organisasi: org });
  }
});

  let data = JSON.parse(localStorage.getItem("personelData")) || [];

  data.push({
    id: Date.now(),
    nama,
    ipsi: ipsiData,
    perguruan
  });

  localStorage.setItem("personelData", JSON.stringify(data));

  renderPersonelTable();
  resetPersonel();
  hideIPSITable();
  hidePerguruanTable();
}


function renderPersonelTable() {
  const tbody = document.getElementById("personel_table");
  if (!tbody) return;

  const data = JSON.parse(localStorage.getItem("personelData")) || [];

  tbody.innerHTML = "";

  data.forEach(p => {

    // ===== IPSI =====
    const ipsiHtml = (p.ipsi || []).map(x => `
      <div class="tag ipsi">
        <b>${x.jabatan}</b><br>
        <small>${x.organisasi} • ${x.kategori}</small>
      </div>
    `).join("");

    // ===== PERGURUAN =====
    const pgHtml = (p.perguruan || []).map(x => `
      <div class="tag pg">
        <b>${x.jabatan}</b><br>
        <small>${x.nama}</small>
      </div>
    `).join("");

    tbody.innerHTML += `
      <tr>
        <td>
          <div class="person-name">${p.nama}</div>
        </td>

        <td>${ipsiHtml || '-'}</td>

        <td>${pgHtml || '-'}</td>
      </tr>
    `;
  });
}

function resetPersonel() {

  document.getElementById("formPersonel")
    .querySelectorAll("input, select")
    .forEach(el => el.value = "");

  document.getElementById("ipsi_table").innerHTML = "";
  document.getElementById("perguruan_table").innerHTML = "";

 // 🔹 HIDE IPSI
  const ipsiContainer = document.getElementById("ipsi_container");
  if (ipsiContainer) ipsiContainer.style.display = "none";

  // 🔹 HIDE PERGURUAN (kalau ada container)
  const pgContainer = document.getElementById("perguruan_container");
  if (pgContainer) pgContainer.style.display = "none";


  IPSI_LOCKED = false;
  IPSI_DATA_LOCKED = [];

  PG_LOCKED = false;
  PG_DATA_LOCKED = [];

  //addIPSIRow();
  
  
}

function showFormPersonel() {
  const form = document.getElementById("formPersonel");
  if (!form) return;

  resetPersonel();

  form.scrollIntoView({
    behavior: "smooth"
  });
  hideIPSITable();
  hidePerguruanTable();
}

function refreshPerguruanDropdown() {

  if (IPSI_LOCKED) return; // 🔒 KUNCI TOTAL

  const ipsiRows = document.querySelectorAll(".i_org");

  let orgValue = "";

  ipsiRows.forEach(r => {
    if (r.value) orgValue = r.value;
  });

  const pgSelects = document.querySelectorAll(".pg_nama");

  pgSelects.forEach(select => {
    loadPerguruanDropdown(orgValue, select);
  });
}


function loadOrganisasiToSelect(selectEl) {
  const data = JSON.parse(localStorage.getItem("orgData")) || [];

  selectEl.innerHTML = '<option value="">Pilih Organisasi</option>';

  data.forEach(o => {
    if (["PB", "Pengprov", "Pengda"].includes(o.level)) {
      selectEl.innerHTML += `<option value="${o.nama}">${o.nama}</option>`;
    }
  });
}

//const UNSUR_INTI = ["Pimpinan", "Kesekretariatan", "Bendahara"];

function validateIPSIRows() {

  const rows = document.querySelectorAll("#ipsi_table tr");

  let data = [];

  for (let r of rows) {
    const organisasi = r.querySelector(".i_org").value;
    const kategori   = r.querySelector(".i_kategori").value;
    const jabatan    = r.querySelector(".i_jabatan").value.trim();

    if (!organisasi || !kategori || !jabatan) {
      alert("Lengkapi data Jabatan IPSI");
      return false;
    }

    // 🔥 RULE 1: 1 organisasi = 1 jabatan
    const sameOrg = data.some(x => x.organisasi === organisasi);
    if (sameOrg) {
      alert(`Organisasi ${organisasi} sudah punya jabatan`);
      return false;
    }

    // 🔥 RULE 2: unsur inti tidak boleh rangkap lintas organisasi
    if (UNSUR_INTI.includes(kategori)) {
      const alreadyInti = data.some(x =>
        UNSUR_INTI.includes(x.kategori)
      );
      if (alreadyInti) {
        alert("Unsur Pimpinan/Kesekretariatan/Bendahara tidak boleh rangkap");
        return false;
      }
    }

    data.push({ organisasi, kategori, jabatan });
  }

  return data; // kalau valid, return data
}

 function attachIPSIRowValidation(row) {

  const kategoriSelect = row.querySelector(".i_kategori");

  kategoriSelect.addEventListener("change", function () {

    const all = document.querySelectorAll(".i_kategori");

    // 🔥 HITUNG JUMLAH UNSUR INTI
    const intiList = Array.from(all).filter(s =>
      UNSUR_INTI.includes(s.value)
    );

    if (intiList.length > 1) {
      alert("Unsur inti (Pimpinan/Kesekretariatan/Bendahara) hanya boleh 1");

      this.value = ""; // reset
    }
  });
}

function attachOrganisasiValidation(row) {

  const orgSelect = row.querySelector(".i_org");

  orgSelect.addEventListener("change", function () {

    const value = this.value;
    if (!value) return;

    const all = document.querySelectorAll(".i_org");

    const count = Array.from(all).filter(s => s.value === value).length;

    if (count > 1) {
      alert("Organisasi tidak boleh dipilih lebih dari 1 kali");
      this.value = "";
    }
  });
}


function refreshPerguruanDropdown() {

  const ipsiRows = document.querySelectorAll(".i_org");

  // ambil organisasi yang aktif (yang terakhir diisi)
  let orgValue = "";

  ipsiRows.forEach(r => {
    if (r.value) orgValue = r.value;
  });

  console.log("REFRESH ORG:", orgValue);

  const pgSelects = document.querySelectorAll(".pg_nama");

  pgSelects.forEach(select => {
    loadPerguruanDropdown(orgValue, select);
  });
}

function addIPSIRow() {

//  const nama = document.getElementById("p_nama").value.trim();
//  if (!nama) return alert("Lengkapi Data Pribadi");
  
  // 🔥 TAMPILKAN TABLE SAAT ADA ROW
  const container = document.getElementById("ipsi_container");
  if (container) container.style.display = "block";

  const tbody = document.getElementById("ipsi_table");
  const row = document.createElement("tr");
  row.className = "ipsi-row";

  row.innerHTML = `
    <td>
      <select class="i_org"></select>
    </td>
    <td>
      <select class="i_kategori">
        <option value="">Pilih</option>
        <option>Pimpinan</option>
        <option>Kesekretariatan</option>
        <option>Bendahara</option>
        <option>Bidang</option>
        <option>Teknis</option>
      </select>
    </td>
    <td>
      <input class="i_jabatan" type="text" placeholder="Jabatan">
    </td>
    <td>
      <button class="btn btn-secondary btn-sm" onclick="removeIPSIRow(this)">
        Hapus
      </button>
    </td>
  `;

  tbody.appendChild(row);

  const orgSelect = row.querySelector(".i_org");
  const kategoriSelect = row.querySelector(".i_kategori");

  loadOrganisasiToSelect(orgSelect);

  orgSelect.addEventListener("change", function () {

    if (IPSI_LOCKED) return; 

    console.log("ORG BERUBAH:", this.value);

    attachOrganisasiValidation(row);

    refreshPerguruanDropdown();
  });

  kategoriSelect.addEventListener("change", function () {

    const all = document.querySelectorAll(".i_kategori");

    const intiList = Array.from(all).filter(s =>
      UNSUR_INTI.includes(s.value)
    );

    if (intiList.length > 1) {
      alert("Unsur inti hanya boleh 1");
      this.value = "";
    }
  });

  attachIPSIRowValidation(row);

  if (!IPSI_LOCKED) {
    refreshPerguruanDropdown();
  }
} 


function saveIPSISection() {

  const data = validateIPSIRows(); // Anda sudah punya
  if (!data) return;

  IPSI_DATA_LOCKED = data;
  IPSI_LOCKED = true;

  // 🔒 lock UI IPSI
  document.querySelectorAll("#ipsi_table .i_org, #ipsi_table .i_kategori, #ipsi_table .i_jabatan")
    .forEach(el => el.disabled = true);

}

function getActiveIPSIOrganisasi() {
  if (!IPSI_LOCKED || IPSI_DATA_LOCKED.length === 0) return "";
  // kalau multi, tentukan rule: pakai terakhir / pertama
  return IPSI_DATA_LOCKED[IPSI_DATA_LOCKED.length - 1].organisasi;
}

function savePerguruanSection() {

  const rows = document.querySelectorAll("#perguruan_table tr");

  let data = [];

  rows.forEach(r => {
    const nama = r.querySelector(".pg_nama").value;
    const jabatan = r.querySelector(".pg_jabatan").value;

    if (!nama || !jabatan) {
      alert("Lengkapi data perguruan");
      return;
    }

    data.push({ nama, jabatan });
  });

  if (data.length === 0) {
    alert("Data perguruan kosong");
    return;
  }

  PG_DATA_LOCKED = data;
  PG_LOCKED = true;

  // 🔒 lock UI
  document.querySelectorAll(".pg_nama, .pg_jabatan")
    .forEach(el => el.disabled = true);

  //alert("Jabatan Perguruan sudah dikunci");
}

function removeIPSIRow(btn) {

  const row = btn.closest("tr");
  row.remove();

  const tbody = document.getElementById("ipsi_table");

  // 🔥 kalau kosong → hide lagi
  if (tbody.children.length === 0) {
    const container = document.getElementById("ipsi_container");
    if (container) container.style.display = "none";
  }
}

function hideIPSITable() {
  const tbody = document.getElementById("ipsi_table");
  if (tbody) tbody.innerHTML = ""; // 🔥 kosongkan row
}

function hidePerguruanTable() {
  const tbody = document.getElementById("perguruan_table");
  if (tbody) tbody.innerHTML = ""; // 🔥 sudah sama behaviournya
}