document.addEventListener("DOMContentLoaded", function() {
    let terminalOutput = document.querySelector(".terminal-output");
    let terminalInput = document.getElementById("terminal-input");
  
    let commands = {
      "sobre": "Divulgador Científico e Fundador do Universo Racionalista, empresa que tem como foco a divulgação científica, filosófica e tecnológica. Presidente do Instituto Ética, Racionalidade e Futuro da Humanidade. Colaborador da revista Pensar, que é uma publicação da organização internacional Center for Inquiry. Colaborador da Revista Questão de Ciência, mantida pelo Instituto Questão de Ciência.",
      "formacao": "Graduado em Tecnologia em Redes de Computadores pela Universidade de Franca\nPós-graduado em Full Stack Java Developer pela Faculdade VINCIT\nPós-graduado em Ethical Hacking e Cybersecurity pela Faculdade VINCIT\nPós-graduado em Cybersecurity pela Universidade Cruzeiro do Sul\nPós-graduado em Perícia Forense Computacional pela Universidade Cruzeiro do Sul",
      "experiencia": "Universo Racionalista (2012-Atual):\n\n- Analista de Segurança da Informação: Pela abrangência do projeto, desempenho funções como Desenvolvedor Web e Analista de Segurança da Informação, o que inclui análise de riscos, aplicação de patches de segurança, detecção de ameaças, implementação de políticas de segurança da informação e testes de invasão.\n\n- Divulgador Científico e Fundador: Escrevo ensaios críticos sobre ciência e pseudociência, faço a tradução de notícias científicas e tecnológicas e realizo palestras sobre ciência, filosofia e tecnologia.\n\nGuardsi Cybersecurity (2022-2023):\n\n- Penetration Tester: Prestava serviços de Consultoria em Segurança da Informação e Testes de Invasão em servidores em nuvem, redes de computadores, aplicativos móveis e sites.\n\nSolyd Offensive Security (2022-2023):\n\n- Instrutor-Assistente: Auxiliava na equipe dos cursos \"Introdução ao Hacking e Pentest\", \"Pentest do Zero ao Profissional\", \"Python Básico\" e \"Python Profissional na Prática\". No curso \"Pentest do Zero ao Profissional\", gravei a solução do Capture the Flag (CTF) da Solyd Offensive Security.",
      "certificacoes": "Certificações incluem:\n• Computer Forensics Foundation\n• Computer Forensics Specialization Certificate\n• Cybersecurity Attack and Defense Fundamentals Specialization Certificate\n• Cybersecurity Awareness\n• Cybersecurity Foundation Professional Certificate\n• DevOps Essentials Professional Certificate\n• Ethical Hacker Associate\n• Ethical Hacking Essentials\n• Fortinet Certified Fundamentals Cybersecurity\n• Fundamentals of Computer Network Security Specialization Certificate\n• Fundamentos na Lei Geral de Proteção de Dados\n• Google Cybersecurity Professional Certificate\n• Google IT Support Professional Certificate\n• IBM Cybersecurity Analyst Professional Certificate\n• Information Security Foundation Based on ISO/IEC 27002\n• Information Security Analyst\n• Information Security Policy Foundation\n• Information Security Specialist\n• ISO/IEC 27001 Information Security Associate\n• IT Fundamentals for Cybersecurity Specialization Certificate\n• NSE 1 Network Security Associate\n• NSE 2 Network Security Associate\n• NSE 3 Network Security Associate\n• OWASP Top 10 Specialization Certificate\n• Security Analyst Fundamentals Specialization Certificate\n• Security Engineering\n• Solyd Certified Pentester\n• Vulnerability Management Foundation",
      "cartas": "Carta de reconhecimento pela National Aeronautics and Space Administration (NASA) por ter descoberto e reportado vulnerabilidades em seu sistema.",
      "contato": "E-mail: douglas.rao@protonmail.ch ou douglas@universoracionalista.org",
      "clear": function() {
        terminalOutput.innerHTML = "";
      },
      "help": "Comandos disponíveis:\n- sobre: resumo sobre o sujeito\n- formacao: formação acadêmica\n- experiencia: experiências em empregos e trabalhos voluntários\n- certificacoes: certificações mais importantes\n- cartas: cartas de reconhecimento e prêmios conquistados\n- contato: opções de contato\n- clear: limpar tela"
    };
  
    terminalInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        processCommand();
      }
    });
  
    function processCommand() {
      let input = terminalInput.value.trim().toLowerCase();
      let command = commands[input] || "Comando não reconhecido. Digite 'help' para ver os comandos disponíveis.";
      terminalOutput.innerHTML += `\n$ ${input}\n`;
      if (typeof command === "function") {
        command();
      } else {
        terminalOutput.innerHTML += command + "\n";
      }
      terminalInput.value = ""; // Clear the input after processing
      terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto-scroll to the latest output
    }
  });
  