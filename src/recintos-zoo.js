//Importando classes;
class Bioma {
    constructor(nome) {
        this.nome = nome;
    }
}


class Recinto {
    constructor(numero, bioma, tamanho, animais = []) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanho = tamanho;
        this.animais = animais; // Array de objetos { especie: Especie, quantidade: numero }
    }
}

class Especie {
    constructor(nome, tamanho, biomas, carnivoro) {
        this.nome = nome;
        this.tamanho = tamanho;
        this.biomas = biomas; // Array de biomas permitidos
        this.carnivoro = carnivoro;
    }
}


class RecintosZoo {
    constructor() {
        // Definindo Biomas
        const biomas = {
            savana: new Bioma("savana"),
            floresta: new Bioma("floresta"),
            rio: new Bioma("rio"),
            savanaRio: new Bioma("savana e rio")
        }

        // Definindo Espécies
        const leao = new Especie("LEAO", 3, [biomas.savana], true);
        const leopardo = new Especie("LEOPARDO", 2, [biomas.savana], true);
        const crocodilo = new Especie("CROCODILO", 3, [biomas.rio], true);
        const macaco = new Especie("MACACO", 1, [biomas.savana, biomas.floresta], false);
        const gazela = new Especie("GAZELA", 2, [biomas.savana], false);
        const hipopotamo = new Especie("HIPOPOTAMO", 4, [biomas.savana, biomas.rio], false);

        // Definindo Recintos
        this.recintos = new Map([
            [1, new Recinto(1, biomas.savana, 10, [{ especie: macaco, quantidade: 3 }])],
            [2, new Recinto(2, biomas.floresta, 5)],
            [3, new Recinto(3, biomas.savanaRio, 7, [{ especie: gazela, quantidade: 1 }])],
            [4, new Recinto(4, biomas.rio, 8)],
            [5, new Recinto(5, biomas.savana, 9, [{ especie: leao, quantidade: 1 }])]
        ]);

        this.animaisPermitidos = {
            [leao.nome]: leao,
            [leopardo.nome]: leopardo,
            [crocodilo.nome]: crocodilo,
            [macaco.nome]: macaco,
            [gazela.nome]: gazela,
            [hipopotamo.nome]: hipopotamo
        };

        this.recintosPermitidos = {
            [leao.nome]: [5],
            [leopardo.nome]: [5],
            [crocodilo.nome]: [4],
            [macaco.nome]: [1, 2, 3],
            [gazela.nome]: [1, 3],
            [hipopotamo.nome]: [3, 4]
        };
    }

    verificaCarnivoro(animal, recinto) {
        const infoAnimal = this.animaisPermitidos[animal];
        if (infoAnimal.carnivoro) {
            return !recinto.animais.some(a => !this.animaisPermitidos[a.especie.nome].carnivoro);
        }
        return true;
    }

    verificaHipopotamo(animal, recinto) {
        if (animal === "HIPOPOTAMO" && recinto.animais.length > 0 && recinto.bioma.nome !== "savana e rio") {
            return false;
        }
        return true;
    }

    verificaMacaco(animal, quantidade, recinto) {
        if (animal === "MACACO" && quantidade < 2 && recinto.animais.length === 0) {
            return false;
        }
        return true;
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const infoAnimal = this.animaisPermitidos[animal];
        let recintosViaveis = [];

        for (const [numero, recinto] of this.recintos.entries()) {
            if (!this.recintosPermitidos[animal].includes(numero)) {
                continue;
            }

            const espacoOcupado = recinto.animais.reduce((total, a) => {
                return total + (this.animaisPermitidos[a.especie.nome].tamanho * a.quantidade);
            }, 0);

            let espacoLivre = recinto.tamanho - espacoOcupado;
            const espacoNecessario = infoAnimal.tamanho * quantidade;

            if (!this.verificaCarnivoro(animal, recinto) || !this.verificaHipopotamo(animal, recinto) || !this.verificaMacaco(animal, quantidade, recinto)) {
                continue;
            }

            if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie.nome !== animal)) {
                espacoLivre -= 1;
            }

            if (espacoLivre >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanho})`);
            }
        }

        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };
