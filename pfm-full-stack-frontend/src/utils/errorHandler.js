export const getErrorMessage = (error) => {
    if (error.response) {
        // Se o backend enviar uma mensagem de erro específica em formato de texto
        if (typeof error.response.data === 'string' && error.response.data.length > 0) {
            return error.response.data;
        }

        // Se o backend enviar um objeto com uma propriedade "message"
        if (error.response.data && typeof error.response.data.message === 'string') {
            return error.response.data.message;
        }

        // Mensagens padrão para códigos de erro HTTP comuns
        switch (error.response.status) {
            case 400:
                return 'Pedido inválido. Por favor, verifique os dados que inseriu.';
            case 401:
                return 'Não autorizado. Por favor, faça o login novamente.';
            case 403:
                return 'Acesso negado. Você não tem permissão para esta ação.';
            case 404:
                return 'O recurso que você procura não foi encontrado.';
            case 500:
                return 'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.';
            default:
                return `Ocorreu um erro inesperado (${error.response.status}).`;
        }
    }
    else if (error.request) {
        return 'Não foi possível conectar ao servidor. Verifique a sua conexão à internet ou se o servidor está indisponível.';
    }
    else {
        return 'Ocorreu um erro ao processar o seu pedido.';
    }
};