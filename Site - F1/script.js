document.getElementById('exameForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    // Captura os dados do formulário
    const formData = new FormData(event.target);
    const resultado = {};

    // Itera sobre os campos preenchidos
    formData.forEach((value, key) => {
        if (value.trim() !== "") { // Ignora campos vazios
            resultado[key] = value;
        }
    });

    // Formatação do resultado
    let resultadoFormatado = "";

    // PARTE 01: IDENTIFICAÇÃO
    if (resultado["PCT"] || resultado["Data do Exame"]) {
        resultadoFormatado += `PCT: ${resultado["PCT"] || ""}\n`;
        resultadoFormatado += `> LAB ${resultado["Data do Exame"] || ""}: `;
    }

    // PARTE 02: HEMOGRAMA
    const camposHemograma = [
        "Hb", "Ht", "VCM", "HCM", "CHCM", "RDW", "LEUCO TOTAL", "PROMIELO", "MIELO", "METAMIELO", "BAST", "SEGM", "EOSI", "BASO", "LINFO", "LINFO ATPC", "MONO", "BLASTO", "PLASMO"
    ];
    const hemogramaFormatado = camposHemograma
        .map((campo) => (resultado[campo] ? `${campo} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");

    // Adiciona "PLAQ" apenas se houver valor
    if (resultado["PLAQ"]) {
        if (hemogramaFormatado) {
            resultadoFormatado += `${hemogramaFormatado} / PLAQ ${resultado["PLAQ"]} //\n`;
        } else {
            resultadoFormatado += `PLAQ ${resultado["PLAQ"]} //\n`;
        }
    } else if (hemogramaFormatado) {
        resultadoFormatado += `${hemogramaFormatado} //\n`;
    }

    // PARTE 03: OUTROS EXAMES
    const camposOutrosExames = [
        "TAP", "% TAP", "INR", "GLICOSE", "UR", "CR", "Na", "K", "Mg", "Ca", "P", "Cl", "TGO", "TGP", "BT", "BD", "BI", "PCR", "TTPA", "RATIO"
    ];
    const outrosExamesFormatado = camposOutrosExames
        .map((campo) => (resultado[campo] ? `${campo} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");

    if (outrosExamesFormatado) {
        resultadoFormatado += `${outrosExamesFormatado} //\n`;
    }

    // Adiciona "OUTROS" apenas se houver valor
    if (resultado["OUTROS"]) {
        resultadoFormatado += `OUTROS ${resultado["OUTROS"]}\n`;
    }

    // PARTE 04: GASOMETRIA ARTERIAL
    const camposGasometriaArterial = [
        "pH (Arterial)", "PCO3 (Arterial)", "PO2 (Arterial)", "HCO3 (Arterial)", "BE (Arterial)", "SatO2 (Arterial)", "Lac (Arterial)"
    ];
    const gasometriaArterialFormatado = camposGasometriaArterial
        .map((campo) => (resultado[campo] ? `${campo.replace(/ \(Arterial\)/g, "")} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");
    if (gasometriaArterialFormatado) {
        resultadoFormatado += `GASO ARTERIAL - ${gasometriaArterialFormatado} //\n`;
    }

    // PARTE 05: GASOMETRIA VENOSA
    const camposGasometriaVenosa = [
        "pH (Venosa)", "PCO3 (Venosa)", "PO2 (Venosa)", "HCO3 (Venosa)", "BE (Venosa)", "SatO2 (Venosa)", "Lac (Venosa)"
    ];
    const gasometriaVenosaFormatado = camposGasometriaVenosa
        .map((campo) => (resultado[campo] ? `${campo.replace(/ \(Venosa\)/g, "")} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");
    if (gasometriaVenosaFormatado) {
        resultadoFormatado += `GASO VENOSA - ${gasometriaVenosaFormatado} //\n`;
    }

    // PARTE 06: EAS
    const camposEAS = [
        "ASPECTO", "pH (EAS)", "PTN", "GLICO", "CETONAS", "BLRBN", "SANGUE", "NITRITO", "Á. ASCÓRBICO", "EST. LEUCO", "CEL. EPIT.", "LEUCO", "HEMAC", "CILINDROS", "FIL. MUCO"
    ];
    const easFormatado = camposEAS
        .map((campo) => (resultado[campo] ? `${campo} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");
    if (easFormatado) {
        resultadoFormatado += `EAS - ${easFormatado}\n`;
    }

    // Destacar a palavra "GLICOSE"
    resultadoFormatado = resultadoFormatado.replace(/GLICOSE/g, '<span class="destaque-glicose">GLICOSE</span>');

    // Exibe o resultado formatado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = resultadoFormatado;

    // Mostra o botão de copiar
    document.getElementById('copiarResultado').style.display = 'block';
});

// Função para copiar o resultado
document.getElementById('copiarResultado').addEventListener('click', function () {
    const resultadoTexto = document.getElementById('resultado').textContent; // Usa textContent para capturar o texto

    // Verifica se a API Clipboard está disponível
    if (navigator.clipboard) {
        navigator.clipboard.writeText(resultadoTexto)
            .then(() => {
                alert('Resultado copiado para a área de transferência!');
            })
            .catch(() => {
                alert('Erro ao copiar o resultado. Tente novamente.');
            });
    } else {
        // Fallback para navegadores que não suportam navigator.clipboard
        const textarea = document.createElement('textarea');
        textarea.value = resultadoTexto;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Resultado copiado para a área de transferência!');
        } catch (err) {
            alert('Erro ao copiar o resultado. Tente novamente.');
        }
        document.body.removeChild(textarea);
    }
});