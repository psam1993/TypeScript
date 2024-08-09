"use strict";
class EstacionamentoFront {
    constructor($, estacionamento = new Estacionamento()) {
        this.$ = $;
        this.estacionamento = estacionamento;
    }
    adicionar(carro, salvar = false) {
        this.estacionamento.adicionar(carro);
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${carro.nome}</td>
                  <td>${carro.placa}</td>
                  <td data-time="${carro.entrada}">
                      ${carro.entrada.toLocaleString("pt-BR", {
            hour: "numeric",
            minute: "numeric",
        })}
                  </td>
                  <td>
                      <button class="delete">Encerrar</button>
                  </td>
              `;
        if (salvar) {
            this.estacionamento.salvar();
        }
        this.$("#patio").appendChild(row);
    }
    encerrar(cells) {
        if (cells[2] instanceof HTMLElement) {
            const veiculo = {
                nome: cells[0].textContent || "",
                placa: cells[1].textContent || "",
                tempo: new Date().valueOf() -
                    new Date(cells[2].dataset.time).valueOf(),
            };
            this.estacionamento.encerrar(veiculo);
        }
    }
    render() {
        this.$("#patio").innerHTML = "";
        this.estacionamento.patio.forEach((c) => this.adicionar(c));
    }
}
class Estacionamento {
    constructor() {
        this.patio = localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }
    adicionar(carro) {
        this.patio.push(carro);
    }
    encerrar(info) {
        const tempo = this.calcTempo(info.tempo);
        const msg = `O veículo ${info.nome} de placa ${info.placa} permaneceu ${tempo} estacionado.
        \n\n Deseja encerrar? `;
        if (!confirm(msg))
            return;
        this.patio = this.patio.filter((carro) => carro.placa !== info.placa);
        this.salvar();
    }
    calcTempo(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    salvar() {
        console.log("Salvando...");
        localStorage.patio = JSON.stringify(this.patio);
    }
}
(function () {
    const $ = (q) => {
        const elem = document.querySelector(q);
        if (!elem)
            throw new Error("Ocorreu um erro ao buscar o elemento.");
        return elem;
    };
    const estacionamento = new EstacionamentoFront($);
    estacionamento.render();
    $("#cadastrar").addEventListener("click", () => {
        const nome = $("#nome").value;
        const placa = $("#placa").value;
        if (!nome || !placa) {
            alert("Atenção campos são obrigatórios.");
            return;
        }
        const carro = { nome, placa, entrada: new Date() };
        estacionamento.adicionar(carro, true);
        $("#nome").value = "";
        $("#placa").value = "";
    });
    $("#patio").addEventListener("click", ({ target }) => {
        if (target.className === "delete") {
            estacionamento.encerrar(target.parentElement.parentElement.cells);
            estacionamento.render();
        }
    });
})();

document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll(".card-link");
    const sections = document.querySelectorAll(".container");

    // Função para mostrar a seção correta
    function showSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove("hidden");
            } else {
                section.classList.add("hidden");
            }
        });
    }

    // Inicialmente, exibir apenas o primeiro card
    // showSection("cadastro-form");

    // Adicionar event listeners aos links dos cards
    cards.forEach(card => {
        card.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = card.getAttribute("data-target");
            showSection(targetId);
        });
    });
});