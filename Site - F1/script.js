 document.addEventListener('DOMContentLoaded', function () {
    // Credenciais válidas
    const validCredentials = {
        "ADMIN": "ADMIN",
        "VICHUGO": "VICHUGO",
        "JUAQUINO": "AMORZINHO",
        "Med1": "Med11",
        "Med2": "Med22",
        "Med3": "Med33",
        "TESTE": "TESTE",
        
    };

    // Função de login
    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // Captura os valores do formulário
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Verifica se as credenciais são válidas
        if (validCredentials[username] && validCredentials[username] === password) {
            // Esconde a tela de login e mostra o formulário de exames
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('form-screen').style.display = 'block';
        } else {
            // Exibe mensagem de erro
            document.getElementById('login-error').style.display = 'block';
        }
    });
});

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
          "TAP", "INR", "GLICEMIA", "UR", "CR", "Na", "K", "Mg", "Ca", "P", "Cl", "TGO", "TGP", "BT", "BD", "BI", "PCR", "TTPA", "RATIO"
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

      // Adiciona GLICEMIA com "//"
      if (resultado["GLICEMIA"]) {
          outrosExamesFormatado += ` GLICEMIA ${resultado["GLICEMIA"]} //`;
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
          resultadoFormatado += `${resultado["OUTROS"]}\n`; // Apenas o conteúdo digitado
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
    "ASPECTO", "pH (EAS)", "PTN", "GLICO", "CETONAS", "BLRBN", "SANGUE", "NITRITO", "Á. ASCÓRBICO", "EST. LEUCO", "CEL. EPIT.", "LEUCO", "HEMAC", "CILINDROS", "FIL. MUCO",
    ];
    const easFormatado = camposEAS
        .map((campo) => (resultado[campo] ? `${campo} ${resultado[campo]}` : null))
        .filter((item) => item !== null)
        .join(" / ");

    if (easFormatado) {
    resultadoFormatado += `EAS - ${easFormatado}`;

    // Adiciona "easOUTROS" se houver valor, na mesma linha, após / e entre << >>
    if (resultado["easOUTROS"]) {
        resultadoFormatado += ` / << ${resultado["easOUTROS"]} >>`;
    }
    resultadoFormatado += `\n`; // Adiciona a nova linha depois de adicionar o "easOUTROS"

      }

      // Destacar a palavra "GLICEMIA"
        resultadoFormatado = resultadoFormatado.replace(/GLICEMIA/g, '<span class="destaque-GLICEMIA">GLICEMIA</span>');

      // Exibe o resultado formatado
      const resultadoDiv = document.getElementById('resultado');
      resultadoDiv.innerHTML = resultadoFormatado;

      // Mostra os botões "Copiar Resultados" e "Limpar Dados"
      document.getElementById('copiarResultado').style.display = 'block';
      document.getElementById('limparDados').style.display = 'block';

      // Rola a página até a área de resultados
      document.querySelector('.resultado-container').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('copiarResultado').addEventListener('click', function () {
      const resultadoTexto = document.getElementById('resultado').innerText;

      // Verifica se a API Clipboard está disponível (para navegadores modernos)
      if (navigator.clipboard) {
          navigator.clipboard.writeText(resultadoTexto)
              .then(() => {
                  alert('Resultado copiado para a área de transferência!');
              })
              .catch((err) => {
                  console.error('Erro ao copiar!', err);
                  fallbackCopyTextToClipboard(resultadoTexto);
              });
      } else {
          // Se a API Clipboard não estiver disponível, utilizamos a alternativa
          fallbackCopyTextToClipboard(resultadoTexto);
      }
  });

  // Função de fallback usando textarea
  function fallbackCopyTextToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');  // Torna o textarea somente leitura
      textarea.style.position = 'absolute';   // Coloca o textarea fora da tela
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();  // Seleciona o texto

      try {
          const successful = document.execCommand('copy'); // Tenta copiar
          if (successful) {
              alert('Resultado copiado para a área de transferência!');
          } else {
              alert('Erro ao copiar o resultado. Tente novamente.');
          }
      } catch (err) {
          console.error('Erro ao usar execCommand', err);
          alert('Erro ao copiar o resultado. Tente novamente.');
      }
      document.body.removeChild(textarea);  // Remove o textarea da página
  }


  // Função para limpar os dados do formulário
  document.getElementById('limparDados').addEventListener('click', function () {
      // Limpa todos os campos do formulário
      document.getElementById('exameForm').reset();

      // Limpa a área de resultados
      document.getElementById('resultado').innerHTML = '';

      // Oculta os botões "Copiar Resultados" e "Limpar Dados"
      document.getElementById('copiarResultado').style.display = 'none';
      document.getElementById('limparDados').style.display = 'none';

      // Rola a página para o início do formulário
     window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
  });
  document.addEventListener('DOMContentLoaded', function () {
          
    
    // Função de scroll para o resultado
      document.getElementById('scrollToResultado').addEventListener('click', function() {
          // Rola suavemente até o elemento com o id 'resultado'
         document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
      });
  });


// Adiciona um ouvinte de evento ao botão "Sair"
document.getElementById('logout-button').addEventListener('click', function() {
    // Esconde a tela do formulário
    document.getElementById('form-screen').style.display = 'none';
    // Mostra a tela de login
    document.getElementById('login-screen').style.display = 'block';
});
