
  const pdfData = [
    { file: "informe1.pdf", label: "Informe Enero", seccion: "seccion1" },
    { file: "/pdf/Certificado_Tecnico_Nivel_Superior.pdf", label: "Documento", seccion: "seccion2" },
    { file: "/pdf/Certificado_Tecnico_Nivel_Medio.pdf", label: "Documento", seccion: "seccion3" },
    { file: "/pdf/certificado_inacap.pdf", label: "Documento", seccion: "seccion4" },
    { file: "/pdf/dev.f.pdf", label: "Documento", seccion: "seccion5"},
    { file: "/pdf/diploma_js.pdf", label: "Documento", seccion: "seccion6"},
    { file: "/pdf/diploma_pb.pdf", label: "Documento", seccion: "seccion7"},
    { file: "/pdf/diploma_bd.pdf", label: "Documento", seccion: "seccion8"},
    { file: "/pdf/diploma_crdw.pdf", label: "Documento", seccion: "seccion9"},
    { file: "/pdf/diploma_itlc.pdf", label: "Documento", seccion: "seccion10"},
    { file: "/pdf/diploma_p.pdf", label: "Documento", seccion: "seccion11"},
    { file: "/pdf/diploma_c.pdf", label: "Documento", seccion: "seccion12"},
    { file: "/pdf/diploma_e.pdf", label: "Documento", seccion: "seccion13"},
    { file: "/pdf/diploma_epa.pdf", label: "Documento", seccion: "seccion14"},
    
  ];

  const password = "1234";

  pdfData.forEach((doc, index) => {
    const viewModalId = `modalVerPDF${index}`;
    const downloadModalId = `modalDescargarPDF${index}`;
    const inputId = `passwordInput${index}`;
    const btnId = `downloadBtn${index}`;
    const errorId = `errorMsg${index}`;
    const timerId = `timerMsg${index}`;
    const seccion = document.getElementById(doc.seccion);

    if (!seccion) {
      return;
    }

    const html = `
      <button class="btn btn-outline-primary me-2 mt-3" data-bs-toggle="modal" data-bs-target="#${viewModalId}">
        Ver ${doc.label}
      </button>
      <button class="btn btn-success mt-3" data-bs-toggle="modal" data-bs-target="#${downloadModalId}">
        Descargar ${doc.label}
      </button>

      <div class="modal fade" id="${viewModalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${doc.label}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div id="${timerId}" class="alert alert-warning text-center mb-3" style="display:none;"></div>
              <iframe src="${doc.file}#toolbar=0" width="100%" height="600px" style="border:none;" oncontextmenu="return false;" id="iframe${index}"></iframe>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="${downloadModalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Descargar ${doc.label}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <label>Contraseña:</label>
              <input type="password" class="form-control mb-2" id="${inputId}" placeholder="Ingresa la contraseña">
              <button id="${btnId}" class="btn btn-primary" style="display:none;">Descargar PDF</button>
              <div id="${errorId}" class="text-danger mt-2" style="display:none;">Contraseña incorrecta.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    seccion.insertAdjacentHTML("beforeend", html);
  });

  // Timer logic for 20 seconds view
  // Store timers to clear if needed
  const viewTimers = {};

  document.addEventListener("shown.bs.modal", function (e) {
    // Only act for view modals
    const modal = e.target;
    if (!modal.id.startsWith("modalVerPDF")) return;
    const index = parseInt(modal.id.replace("modalVerPDF", ""), 10);
    const timerMsg = document.getElementById(`timerMsg${index}`);
    const iframe = document.getElementById(`iframe${index}`);
    if (!timerMsg || !iframe) return;

    let secondsLeft = 10;
    timerMsg.style.display = "block";
    timerMsg.textContent = `Tiempo restante para ver: ${secondsLeft} segundos`;

    // Enable iframe if previously disabled
    iframe.style.pointerEvents = "auto";
    iframe.style.opacity = "1";

    // Clear any previous timer
    if (viewTimers[index]) {
      clearInterval(viewTimers[index]);
    }

    viewTimers[index] = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        timerMsg.textContent = `Tiempo restante para ver: ${secondsLeft} segundos`;
      } else {
        timerMsg.textContent = "El tiempo para ver el documento ha finalizado.";
        // Disable iframe interaction
        iframe.style.pointerEvents = "none";
        iframe.style.opacity = "0.5";
        clearInterval(viewTimers[index]);
      }
    }, 1000);
  });

  document.addEventListener("hidden.bs.modal", function (e) {
    // Only act for view modals
    const modal = e.target;
    if (!modal.id.startsWith("modalVerPDF")) return;
    const index = parseInt(modal.id.replace("modalVerPDF", ""), 10);
    const timerMsg = document.getElementById(`timerMsg${index}`);
    const iframe = document.getElementById(`iframe${index}`);
    if (viewTimers[index]) {
      clearInterval(viewTimers[index]);
      delete viewTimers[index];
    }
    if (timerMsg) {
      timerMsg.style.display = "none";
      timerMsg.textContent = "";
    }
    if (iframe) {
      iframe.style.pointerEvents = "auto";
      iframe.style.opacity = "1";
    }
  });

  document.addEventListener("input", function (e) {
    const match = e.target.id.match(/^passwordInput(\d+)$/);
    if (match) {
      const index = parseInt(match[1], 10);
      const input = document.getElementById(`passwordInput${index}`);
      const btn = document.getElementById(`downloadBtn${index}`);
      const error = document.getElementById(`errorMsg${index}`);

      if (!input || !btn || !error) return;

      if (input.value === password) {
        btn.style.display = "inline-block";
        error.style.display = "none";
      } else {
        btn.style.display = "none";
        error.style.display = input.value ? "block" : "none";
      }
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id && e.target.id.startsWith("downloadBtn")) {
      const index = parseInt(e.target.id.replace("downloadBtn", ""), 10);
      if (isNaN(index) || !pdfData[index]) return;
      const pdf = pdfData[index].file;
      const link = document.createElement("a");
      link.href = pdf;
      link.download = pdf.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName === "IFRAME") {
      e.preventDefault();
    }
  });
