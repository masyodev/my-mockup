// ================= ORGANISASI =================
function renderOrganisasi() {
    return `
    <div class="page-header">
      <h2>Struktur Organisasi IPSI</h2>
	  <button class="btn btn-add" onclick="showForm()">
		  <i class="fa-solid fa-plus"></i>	  
		  Tambah
	  </button>
    </div>

    <div class="card" id="formOrganisasi">
      <h3>Form Organisasi</h3>

      <div class="form-grid">

        <div>
          <label>Nama Organisasi</label>
          <input id="org_nama" type="text">
        </div>

        <div>
          <label>Wilayah</label>
          <select id="org_wilayah"></select>
        </div>

        <div>
          <label>Level</label>
          <select id="org_level">
            <option value="">Pilih Level</option>
            <option value="PB">PB</option>
            <option value="Pengprov">Pengprov</option>
            <option value="Pengda">Pengda</option>
          </select>
        </div>

        <div>
          <label>Parent</label>
          <select id="org_parent"></select>
        </div>

		<div>
		  <label>Alamat Lengkap</label>
		  <textarea id="org_alamat" rows="2"></textarea>
		</div>
		
		
<div>
  <label>Kode Pos</label>
  <input id="org_kodepos" type="text" maxlength="5">
</div>
<div>
  <label>No Telepon</label>
  <input id="org_telp" type="text" placeholder="08xxxxxxxxxx">
</div>

<div>
  <label>Email</label>
  <input id="org_email" type="email">
</div>

<!-- PENANGGUNG JAWAB (sementara) -->
<div>
  <label>Nama Ketua</label>
  <input id="org_ketua" type="text">
</div>

<div>
  <label>No HP Ketua</label>
  <input id="org_hp_ketua" type="text">
</div>

<!-- STATUS -->
<div>
  <label>Status</label>
  <select id="org_status">
    <option value="Aktif">Aktif</option>
    <option value="Nonaktif">Nonaktif</option>
  </select>
</div>		
      </div>

      <div class="form-action">
        <button class="btn btn-primary" onclick="saveOrganisasi()">
			<i class="fa-solid fa-floppy-disk"></i>
			Simpan
		</button>
		<button class="btn btn-secondary" onclick="resetForm()">
		  <i class="fa-solid fa-rotate-left"></i>
		  Reset
		</button>
      </div>

    </div>

    <div class="card">
      <h3>Data Organisasi</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Level</th>
            <th>Wilayah</th>
            <th>Parent</th>
            <th>Status</th>
          </tr>
        </thead>
		<tbody id="org_table"></tbody>
      </table>
    </div>
  `;
}

// ================= LOAD DATA =================
function loadProvinsi() {
    const select = document.getElementById("org_wilayah");
    if (!select) return;

    select.innerHTML = '<option value="">Pilih Wilayah</option>';

    provinsiList.forEach(p => {
        select.innerHTML += `<option value="${p}">${p}</option>`;
    });
}


// ================= LEVEL LOGIC =================
function initLevelChange() {
    const level = document.getElementById("org_level");
    if (!level) return;

    level.addEventListener("change", () => {
        const val = level.value;
        const parent = document.getElementById("org_parent");

        parent.innerHTML = '<option value="">Pilih Parent</option>';

        if (val === "PB") {
            parent.innerHTML = '<option>-</option>';
            parent.disabled = true;
        }

        if (val === "Pengprov") {
            parent.disabled = false;
            parent.innerHTML += `<option>PB IPSI</option>`;
        }

        if (val === "Pengda") {
            parent.disabled = false;
            parent.innerHTML = '<option value="">Pilih Pengprov</option>';

            const list = orgList.filter(o => o.level === "Pengprov");

            list.forEach(o => {
                parent.innerHTML += `<option value="${o.nama}">${o.nama}</option>`;
            });
        }
    });
}

function initWilayahChange() {
    const wilayah = document.getElementById("org_wilayah");
    const parent = document.getElementById("org_parent");

    if (!wilayah) return;

    wilayah.addEventListener("change", () => {
        const level = document.getElementById("org_level").value;

        if (level === "Pengda") {
            parent.innerHTML = `<option>IPSI ${wilayah.value}</option>`;
        }
    });
}

function saveOrganisasi() {

    const error = validateOrganisasi();
    if (error) {
        alert(error);
        return;
    }

    const nama = document.getElementById("org_nama").value.trim();
    const level = document.getElementById("org_level").value;
    const wilayah = document.getElementById("org_wilayah").value;
    const parent = document.getElementById("org_parent").value;

    let dataList = JSON.parse(localStorage.getItem("orgData")) || [];

    const isExist = dataList.some(o =>
        o.nama === nama &&
        o.level === level &&
        o.wilayah === (wilayah || "-")
    );

    if (isExist) {
        alert("Data sudah ada!");
        return;
    }

    const data = {
        id: Date.now(),
        nama,
        level,
        wilayah: wilayah || "-",
        parent: parent || "-"
    };

    dataList.push(data);
    localStorage.setItem("orgData", JSON.stringify(dataList));

    renderTable();
    resetForm();
}

function renderTable() {
    const tbody = document.getElementById("org_table");
    if (!tbody) return;

    // 🔥 WAJIB CLEAR TOTAL
    tbody.innerHTML = "";

    // 🔥 ambil data fresh dari storage (hindari referensi lama)
    const dataList = JSON.parse(localStorage.getItem("orgData")) || [];

    dataList.forEach(o => {
        const row = `
      <tr>
        <td>${o.nama}</td>
        <td>${o.level}</td>
        <td>${o.wilayah}</td>
        <td>${o.parent}</td>
        <td><span class="badge green">Aktif</span></td>
      </tr>
    `;
        tbody.innerHTML += row;
    });
}


function resetForm() {
  const ids = [
    "org_nama","org_level","org_wilayah","org_parent",
    "org_alamat","org_kodepos","org_telp","org_email",
    "org_ketua","org_hp_ketua","org_status"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.tagName === "SELECT") {
      el.selectedIndex = 0;
    } else {
      el.value = "";
    }
  });

  // reset parent
  const parent = document.getElementById("org_parent");
  if (parent) {
    parent.innerHTML = '<option value="">Pilih Parent</option>';
    parent.disabled = false;
  }
}

function showForm() {
    const form = document.getElementById("formOrganisasi");

    if (!form) return;

    // reset form dulu
    resetForm();

    // scroll ke form
    form.scrollIntoView({
        behavior: "smooth"
    });
}

function validateOrganisasi() {
  const nama = document.getElementById("org_nama").value.trim();
  const level = document.getElementById("org_level").value;
  const wilayah = document.getElementById("org_wilayah").value;
  const email = document.getElementById("org_email").value;
  const telp = document.getElementById("org_telp").value;

  if (!nama) return "Nama organisasi wajib diisi";
  if (!level) return "Level wajib dipilih";

  // aturan IPSI
  if (level !== "PB" && !wilayah) {
    return "Wilayah wajib diisi untuk Pengprov/Pengda";
  }

  // email
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return "Format email tidak valid";
  }

  // no HP sederhana
  if (telp && !/^08[0-9]{8,12}$/.test(telp)) {
    return "Format no HP tidak valid";
  }

  return null;
}
