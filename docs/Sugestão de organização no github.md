# Sugestões de uso do Github

### Ideia do fluxo de uma tarefa
0. Fazer um pull na main para garantir que está com a versão mais recente do código;
1. Criação da branch para a determinada tarefa seguindo o padrão de nomenclatura do professor:
	* Não é estritamente necessário que essa tarefa seja um requisito inteiro, pode ser uma correção ou ajuste menor (operações menores no código tem menos chances de criar conflitos e facilitam a revisão);
2. Desenvolvimento da tarefa em questão dentro da branch:
	* Sugiro que em casos onde se aplica, preferir commits pequenos e fazer push mais vezes, em vez de um único commit grande contendo a tarefa inteira, especialmente se a tarefa levar mais de um dia para ser desenvolvida;
3. Abertura de uma pull request no Github, selecionando um revisor:
	* A ideia da revisão do código é que um desenvolvimento não seja incorporado ao projeto unilateralmente;
	* É comum que uma segunda pessoa analisado o código consiga identificar problemas ou possibilidades de melhorias que o desenvolvedor não tenha percebido em um primeiro momento;
4. Revisão da pull request:
	* O revisor deve somente ler o código, levantar questões e/ou solicitar alterações caso julgar necessário, e eventualmente aprovar a pull request;
	* A responsabilidade de efetuar o merge cai sobre o desenvolvedor da tarefa, não do revisor (isso é especialmente importante ao utilizar o squash-and-merge, pois é gerado um commit novo atribuído à pessoa quem fez o processo de merge, e não ao dono dos commits originais da PR);
5. Fechamento da pull request:
	* No momento em que a PR estiver aprovada, o desenvolvedor deve efetuar o merge da mesma para a main;
	* A fins de organização, utilizar o squash-and-merge, seja pelo Github CLI ou pelo site, para que a main contenha commits mais completos;

### Comandos úteis
1. Criação de branch
	 ```git checkout -b "nome-da-branch"```
	 * Criar o nome da branch utilizando a nomenclatura de commits sugerida pelo professor
	 * Obs: Sempre lembrar de navegar para a main (```git checkout main```) antes de criar uma nova branch, senão ele criará branch dentro de branch, o que pode gerar confusão.
2. Para adicionar arquivos e efetuar commits, sugiro utilizar a interface gráfica do VSCode, por ser mais simples de usar.
3. [Necessária instalação do Github CLI (https://cli.github.com)] Para fazer merge de pull requests de forma que seja gerado um único commit na main, e sem deixar branches sem uso no repositório:
	```gh pr merge -s -d [número da pull request]```
	* Esse comando fará duas coisas:
		* Squash dos commits (virará um único commit na main com o nome dado à PR, OU com o nome dado ao commit, nos casos onde tenha um único commit na PR).
		* Excluirá a branch da qual o PR veio, para que o repositório (e a listagem do professor) não fiquem carregados.
		* Exemplo de merge da PR de número 2: ```gh pr merge -s -d 2```