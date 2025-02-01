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

        // Formata a data no formato DIA/MÊS/ANO
        const dataExame = resultado["Data do Exame"];
        if (dataExame) {
            const [ano, mes, dia] = dataExame.split('-'); // Divide a data no formato ISO (YYYY-MM-DD)
            resultadoFormatado += `> LAB ${dia}/${mes}/${ano}: `;
        } else {
            resultadoFormatado += `> LAB : `;
        }
    }

    // PARTE 02: HEMOGRAMA
    const camposHemograma = [
        "Hb", "Ht", "VCM", "HCM", "CHCM", "RDW", "LEUCO TOTAL"
    ];
    const hemogramaFormatado = camposHemograma
        .map((campo) => (resultado[campo] ? `${campo} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");

    // Campos que devem estar entre parênteses
    const camposEntreParenteses = [
        "PROMIELO", "MIELO", "METAMIELO", "BAST", "SEGM", "EOSI", "BASO", "LINFO", "LINFO ATPC", "MONO", "BLASTO", "PLASMO"
    ];
    const camposParentesesFormatado = camposEntreParenteses
        .map((campo) => (resultado[campo] ? `${campo} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");

    // Adiciona os campos entre parênteses, se houver
    if (camposParentesesFormatado) {
        if (hemogramaFormatado) {
            resultadoFormatado += `${hemogramaFormatado} (${camposParentesesFormatado})`;
        } else {
            resultadoFormatado += `(${camposParentesesFormatado})`;
        }
    } else if (hemogramaFormatado) {
        resultadoFormatado += `${hemogramaFormatado}`;
    }

    // Adiciona "PLAQ" apenas se houver valor
    if (resultado["PLAQ"]) {
        resultadoFormatado += ` / PLAQ ${resultado["PLAQ"]}`;
    }

    // Fecha a linha do hemograma
    if (hemogramaFormatado || camposParentesesFormatado || resultado["PLAQ"]) {
        resultadoFormatado += " //\n";
    }

    // PARTE 03: OUTROS EXAMES
    const camposOutrosExames = [
        "TAP", "INR", "GLICOSE", "UR", "CR", "Na", "K", "Mg", "Ca", "P", "Cl", "TGO", "TGP", "BT", "BD", "BI", "PCR", "TTPA", "RATIO"
    ];
    let outrosExamesFormatado = "";

    // Formatação especial para TAP e % TAP
    if (resultado["TAP"] && resultado["% TAP"]) {
        outrosExamesFormatado += `TAP ${resultado["TAP"]} - ${resultado["% TAP"]}%`;
    } else if (resultado["TAP"]) {
        outrosExamesFormatado += `TAP ${resultado["TAP"]}`;
    } else if (resultado["% TAP"]) {
        outrosExamesFormatado += `${resultado["% TAP"]}%`;
    }

    // Adiciona INR após TAP e % TAP
    if (resultado["INR"]) {
        if (outrosExamesFormatado) {
            outrosExamesFormatado += ` - INR ${resultado["INR"]} //`;
        } else {
            outrosExamesFormatado += `INR ${resultado["INR"]} //`;
        }
    }

    // Adiciona GLICOSE com "//"
    if (resultado["GLICOSE"]) {
        outrosExamesFormatado += ` GLICOSE ${resultado["GLICOSE"]} //`;
    }

    // Adiciona UR e CR com "/"
    if (resultado["UR"] || resultado["CR"]) {
        const urCrFormatado = [
            resultado["UR"] ? `UR ${resultado["UR"]}` : null,
            resultado["CR"] ? `CR ${resultado["CR"]}` : null
        ]
            .filter((item) => item !== null)
            .join(" / ");
        outrosExamesFormatado += ` ${urCrFormatado} //`;
    }

    // Adiciona Na, K, Mg, Ca, P, Cl com "/"
    const eletrolitosFormatado = [
        resultado["Na"] ? `Na ${resultado["Na"]}` : null,
        resultado["K"] ? `K ${resultado["K"]}` : null,
        resultado["Mg"] ? `Mg ${resultado["Mg"]}` : null,
        resultado["Ca"] ? `Ca ${resultado["Ca"]}` : null,
        resultado["P"] ? `P ${resultado["P"]}` : null,
        resultado["Cl"] ? `Cl ${resultado["Cl"]}` : null
    ]
        .filter((item) => item !== null)
        .join(" / ");
    if (eletrolitosFormatado) {
        outrosExamesFormatado += ` ${eletrolitosFormatado} //`;
    }

    // Adiciona TGO e TGP com "//"
    if (resultado["TGO"] || resultado["TGP"]) {
        const tgoTgpFormatado = [
            resultado["TGO"] ? `TGO ${resultado["TGO"]}` : null,
            resultado["TGP"] ? `TGP ${resultado["TGP"]}` : null
        ]
            .filter((item) => item !== null)
            .join(" / ");
        outrosExamesFormatado += ` ${tgoTgpFormatado} //`;
    }

    // Adiciona BT, BD, BI com "-"
    if (resultado["BT"] || resultado["BD"] || resultado["BI"]) {
        const btBdBiFormatado = [
            resultado["BT"] ? `BT ${resultado["BT"]}` : null,
            resultado["BD"] ? `BD ${resultado["BD"]}` : null,
            resultado["BI"] ? `BI ${resultado["BI"]}` : null
        ]
            .filter((item) => item !== null)
            .join(" - ");
        outrosExamesFormatado += ` ${btBdBiFormatado} //`;
    }

    // Adiciona PCR com "//"
    if (resultado["PCR"]) {
        outrosExamesFormatado += ` PCR ${resultado["PCR"]} //`;
    }

    // Adiciona TTPA e RATIO com "-"
    if (resultado["TTPA"] || resultado["RATIO"]) {
        const ttpaRatioFormatado = [
            resultado["TTPA"] ? `TTPA ${resultado["TTPA"]}` : null,
            resultado["RATIO"] ? `RATIO ${resultado["RATIO"]}` : null
        ]
            .filter((item) => item !== null)
            .join(" - ");
        outrosExamesFormatado += ` ${ttpaRatioFormatado}`;
    }

    if (outrosExamesFormatado) {
        resultadoFormatado += `${outrosExamesFormatado}\n`;
    }

    // Adiciona "OUTROS" apenas se houver valor
    if (resultado["OUTROS"]) {
        resultadoFormatado += `OUTROS ${resultado["OUTROS"]}\n`;
    }

    // PARTE 04: GASOMETRIA ARTERIAL
    const camposGasometriaArterial = [
        "pH (Arterial)", "PCO2 (Arterial)", "PO2 (Arterial)", "HCO3 (Arterial)", "BE (Arterial)", "SatO2 (Arterial)", "Lac (Arterial)"
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
        "pH (Venosa)", "PCO2 (Venosa)", "PO2 (Venosa)", "HCO3 (Venosa)", "BE (Venosa)", "SatO2 (Venosa)", "Lac (Venosa)"
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
