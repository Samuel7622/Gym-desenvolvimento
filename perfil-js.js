// perfil-data.js
class PerfilData {
    constructor() {
        this.dadosPerfil = this.carregarDados();
    }

    carregarDados() {
        const dadosSalvos = localStorage.getItem('dadosPerfilAcademia');
        if (dadosSalvos) {
            return JSON.parse(dadosSalvos);
        } else {
            // Dados padrão
            return {
                gymName: "Usuário do GymP2",
                description: "Nenhuma descrição adicionada ainda.",
                profilePhoto: "https://via.placeholder.com/150/00ff88/000000?text=GYM",
                galleryPhotos: []
            };
        }
    }

    salvarDados(dados) {
        this.dadosPerfil = { ...this.dadosPerfil, ...dados };
        localStorage.setItem('dadosPerfilAcademia', JSON.stringify(this.dadosPerfil));
        return true;
    }

    obterDados() {
        return this.dadosPerfil;
    }

    adicionarFotoGaleria(fotoUrl) {
        if (this.dadosPerfil.galleryPhotos.length < 9) {
            this.dadosPerfil.galleryPhotos.push(fotoUrl);
            this.salvarDados(this.dadosPerfil);
            return true;
        }
        return false;
    }

    removerFotoGaleria(index) {
        if (index >= 0 && index < this.dadosPerfil.galleryPhotos.length) {
            this.dadosPerfil.galleryPhotos.splice(index, 1);
            this.salvarDados(this.dadosPerfil);
            return true;
        }
        return false;
    }
}

// Instância global
const perfilManager = new PerfilData();
