console.log("perguruan.js loaded");

const perguruanData = [
  { nama: "Setia Hati", organisasi: "PB IPSI" },
  { nama: "PSHT", organisasi: "PB IPSI" },

  { nama: "PSHT", organisasi: "IPSI Jakarta Selatan" },
  { nama: "Perisai Diri", organisasi: "IPSI Jakarta Selatan" },
  { nama: "Tapak Suci", organisasi: "IPSI Jakarta Selatan" },
  { nama: "Merpati Putih", organisasi: "IPSI Jakarta Selatan" },

  { nama: "PSHT", organisasi: "IPSI Kota Semarang" },
  { nama: "Tapak Suci", organisasi: "IPSI Kota Semarang" },
  { nama: "Satria Muda Indonesia", organisasi: "IPSI Kota Semarang" },

  { nama: "Perisai Diri", organisasi: "IPSI Bandung" }
];

function loadPerguruanDropdown(orgValue, targetElement) {

  if (!targetElement) return;

  targetElement.innerHTML = '<option value="">Pilih Perguruan</option>';

  if (!orgValue) return;

  const filtered = perguruanData.filter(p =>
    p.organisasi.trim().toLowerCase() === orgValue.trim().toLowerCase()
  );

  console.log("ORG:", orgValue);
  console.log("FILTER:", filtered);

  filtered.forEach(p => {
    targetElement.innerHTML += `<option value="${p.nama}">${p.nama}</option>`;
  });
}