import { InMemoryDbService } from "angular-in-memory-web-api";

export class InMemoryDatabase implements InMemoryDatabase {
    createDb(){
        const categories = [
            { id: 1, nome: "Moradia", description: "Pagamentos de Contas da Casa"},
            { id: 2, nome: "Saúde", description: "Plano de Saúde e Remédios"},
            { id: 3, nome: "Lazer", description: "Cinemas, parques, praia, etc"},
            { id: 4, nome: "Salário", description: "Recebimento de Salário"},
            { id: 5, nome: "Freelas", description: "Trabalhos como Freelancer"}
        ];

        return { categories };
    }
}