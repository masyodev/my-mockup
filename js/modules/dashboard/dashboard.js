let organisasiData = JSON.parse(localStorage.getItem("orgData")) || [];

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    loadPage("Dashboard");
    loadActiveMenu();
});

// ===== MASTER DATA =====
const provinsiList = [
    "Jawa Barat",
    "DKI Jakarta",
    "Jawa Tengah",
    "Jawa Timur"
];

const orgList = [{
        id: 1,
        nama: "PB IPSI",
        level: "PB"
    },
    {
        id: 2,
        nama: "IPSI DKI Jakarta",
        level: "Pengprov"
    },

    {
        id: 3,
        nama: "IPSI Jawa Barat",
        level: "Pengprov"
    },
    {
        id: 4,
        nama: "IPSI Jawa Timur",
        level: "Pengprov"
    },
    {
        id: 5,
        nama: "IPSI Jawa Tengah",
        level: "Pengprov"
    }
];

let isSaving = false;

// ================= MENU =================
function initMenu() {

    // parent toggle
    document.querySelectorAll(".menu-title").forEach(title => {
        title.addEventListener("click", () => {
            const submenu = title.nextElementSibling;
            submenu.style.display =
                submenu.style.display === "block" ? "none" : "block";
        });
    });

    // item click
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", () => {

            // reset active
            document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
            document.querySelectorAll(".menu-parent").forEach(p => p.classList.remove("active"));

            item.classList.add("active");

            const parent = item.closest(".menu-parent");
            if (parent) {
                parent.classList.add("active");
                parent.querySelector(".submenu").style.display = "block";
            }

            const page = item.innerText.trim();
            localStorage.setItem("activeMenu", page);

            loadPage(page);
        });
    });
}

// ================= ROUTER =================
function loadPage(page) {
    const content = document.getElementById("contentArea");
    const title = document.getElementById("pageTitle");

    title.innerText = page;

    switch (page) {

        case "Dashboard":
            content.innerHTML = renderDashboard();
			setTimeout(() => {
				initCharts();
			}, 0);	
			
            break;

        case "Struktur Organisasi":
            content.innerHTML = renderOrganisasi();

            setTimeout(() => {
                loadProvinsi();
                initLevelChange();
                initWilayahChange();
                renderTable(); // ⬅️ WAJIB
            }, 0);

            break;

		case "Personel IPSI":
			content.innerHTML = renderPersonel();

			setTimeout(() => {
				initPersonel();
			}, 0);
			break;

        case "Perguruan":
            content.innerHTML = `<div class="card"><h3>Data Perguruan</h3></div>`;
            break;

        case "Warga":
            content.innerHTML = `<div class="card"><h3>Data Warga</h3></div>`;
            break;

        case "Laporan":
            content.innerHTML = `<div class="card"><h3>Laporan</h3></div>`;
            break;

        default:
            content.innerHTML = `<div class="card"><h3>${page}</h3></div>`;
    }
}

// ================= DASHBOARD =================
function renderDashboard() {
    return `
<div class="container">	
    <div class="welcome-banner">
      <h2>Selamat Datang, Admin!</h2>
      <p>Ringkasan data IPSI.</p>
    </div>

<div class="stats-row">

    <!-- 1 -->
    <div class="stat-card">
        <div class="stat-top">
            <div class="stat-icon blue">
                <i class="fa-solid fa-building"></i>
            </div>
            <div class="stat-text">
                <h4>Total Perguruan</h4>
                <h2>120</h2>
            </div>
        </div>
        <div class="divider"></div>
        <div class="stat-footer">
            <span>Aktif</span>
            <span>105</span>
        </div>
    </div>

    <!-- 2 -->
    <div class="stat-card">
        <div class="stat-top">
            <div class="stat-icon green">
                <i class="fa-solid fa-users"></i>
            </div>
            <div class="stat-text">
                <h4>Total Warga</h4>
                <h2>12.540</h2>
            </div>
        </div>
        <div class="divider"></div>
        <div class="stat-footer">
            <span>Aktif</span>
            <span>11.893</span>
        </div>
    </div>

    <!-- 3 -->
    <div class="stat-card">
        <div class="stat-top">
            <div class="stat-icon purple">
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="stat-text">
                <h4>Pengurus</h4>
                <h2>320</h2>
            </div>
        </div>
        <div class="divider"></div>
        <div class="stat-footer">
            <span>Aktif</span>
            <span>298</span>
        </div>
    </div>

    <!-- 4 -->
    <div class="stat-card">
        <div class="stat-top">
            <div class="stat-icon orange">
                <i class="fa-solid fa-scale-balanced"></i>
            </div>
            <div class="stat-text">
                <h4>Wasit/Juri</h4>
                <h2>180</h2>
            </div>
        </div>
        <div class="divider"></div>
        <div class="stat-footer">
            <span>Aktif</span>
            <span>165</span>
        </div>
    </div>

    <!-- 5 -->
    <div class="stat-card">
        <div class="stat-top">
            <div class="stat-icon red">
                <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div class="stat-text">
                <h4>Pelatih</h4>
                <h2>210</h2>
            </div>
        </div>
        <div class="divider"></div>
        <div class="stat-footer">
            <span>Aktif</span>
            <span>190</span>
        </div>
    </div>

</div>
</div>
	
    <!--CHART -->
	<div class="chart-row">
    <div class="card">
	<div class="chart-header">
		<h3>Statistik Warga</h3>

		<div class="chart-filter">
			<select id="filterBulan">
				<option value="all">Semua Bulan</option>
				<option value="1">Jan</option>
				<option value="2">Feb</option>
				<option value="3">Mar</option>
				<option value="4">Apr</option>
				<option value="5">Mei</option>
				<option value="6">Jun</option>
			</select>

			<select id="filterTahun">
				<option value="2025">2025</option>
				<option value="2024">2024</option>
			</select>
		</div>
	</div>



      <canvas id="chartLine"></canvas>
    </div>

    <div class="card">
      <h3>Sebaran Perguruan per Provinsi</h3>
		<div class="donut-container">
			<div class="donut-chart">
				<canvas id="chartDonut"></canvas>
			</div>
			<div class="donut-legend" id="donutLegend"></div>
		</div
    </div>
  </div>
  `;
}




// ================= ACTIVE MENU =================
function loadActiveMenu() {
    const saved = localStorage.getItem("activeMenu");

    if (saved) {
        document.querySelectorAll(".menu-item").forEach(item => {
            if (item.innerText.trim() === saved) {
                item.classList.add("active");

                const parent = item.closest(".menu-parent");
                if (parent) {
                    parent.classList.add("active");
                    parent.querySelector(".submenu").style.display = "block";
                }
            }
        });
    }
}

// ================= USER MENU =================
function toggleUserMenu() {
    const menu = document.getElementById("userMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
window.logout = logout;

// ================= SIDEBAR =================
function toggleSidebar(force) {
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("overlay");

    if (window.innerWidth <= 768) {
        const isOpen = force !== undefined ? force : !sidebar.classList.contains("open");
        sidebar.classList.toggle("open", isOpen);
        overlay.classList.toggle("show", isOpen);
        return;
    }

    sidebar.classList.toggle("collapsed");
}



let lineChart;

const chartData = {
    2025: [9000, 9500, 10200, 10800, 11500, 12400],
    2024: [7000, 7800, 8500, 9000, 9500, 10000]
};

const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];

function initCharts() {

    // ================= LINE =================
    const canvas = document.getElementById("chartLine");

    if (canvas) {

        const ctx = canvas.getContext("2d");

        if (lineChart) {
            lineChart.destroy();
        }

        lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
                datasets: [{
                    label: "Warga",
					data: chartData["2025"], // default awal

                    borderColor: "#3b82f6",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,

                    backgroundColor: function(context) {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;

                        if (!chartArea) return null;

                        const gradient = ctx.createLinearGradient(
                            0,
                            chartArea.top,
                            0,
                            chartArea.bottom
                        );

                        gradient.addColorStop(0, "rgba(59,130,246,0.45)");
                        gradient.addColorStop(1, "rgba(59,130,246,0)");

                        return gradient;
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // ================= DONUT =================
    const ctx2 = document.getElementById("chartDonut");

    if (ctx2) {

        const labels = ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "DKI Jakarta", "Lainnya"];
        const data = [34, 26, 22, 14, 24];

        const colors = [
            "#3b82f6",
            "#22c55e",
            "#f59e0b",
            "#8b5cf6",
            "#14b8a6"
        ];

        new Chart(ctx2, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // LEGEND
        const legendContainer = document.getElementById("donutLegend");

        let total = data.reduce((a, b) => a + b, 0);

        legendContainer.innerHTML = "";

        data.forEach((val, i) => {
            const percent = Math.round((val / total) * 100);

            legendContainer.innerHTML += `
                <div class="legend-item">
                    <div class="legend-left">
                        <div class="legend-color" style="background:${colors[i]}"></div>
                        <span>${labels[i]}</span>
                    </div>
                    <div class="legend-value">
                        ${percent}% (${val})
                    </div>
                </div>
            `;
        });
    }
	
const filterBulan = document.getElementById("filterBulan");
const filterTahun = document.getElementById("filterTahun");

if (filterBulan && filterTahun) {
    filterBulan.addEventListener("change", updateLineChart);
    filterTahun.addEventListener("change", updateLineChart);
}
updateLineChart(); // sync awal dengan dropdown
}


function updateLineChart() {

    const bulan = document.getElementById("filterBulan").value;
    const tahun = document.getElementById("filterTahun").value;

    let data = chartData[tahun];

    // filter bulan
    if (bulan !== "all") {
        data = data.slice(0, bulan);
        lineChart.data.labels = labels.slice(0, bulan);
    } else {
        lineChart.data.labels = labels;
    }

    lineChart.data.datasets[0].data = data;
    lineChart.update();
}

