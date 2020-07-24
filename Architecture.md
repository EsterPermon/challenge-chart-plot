
# Importante:

> ### Espera-se que cada evento seja inputado separadamente e por quebra de linha, ou seja:
> * { evento 1 }
> * { evento 2 } 
> * { evento 3 }
>
> ### Caso contrário o gráfico não será gerado!

# Navegabilidade

## Referente ao botão

Inicialmente, o botão de gerar o gráfico está desabilitado, e permanece assim até que o usuário informe um input válido.

Ainda que o botão esteja habilitado, ao inserirmos dados incorretos, ele é automaticamente desabilitado.

O gráfico só é gerado/atualizado quando o usuário clica do botão.

# Validação do input

## Comportamento da aplicação

Se o usuário digitar dados considerados inválidos, eles são ignorados (não são adicionados ao gráfico), porém uma mensagem de warning é exibida infomando a linha.

Se o usuário digitar dados incorretos, o gráfico não poderá ser gerado/atualizado, e uma mensagem de erro é exibida na tela de forma mais enfática. 

## Inputs incorretos

Inputs são considerados incorretos se: 

* Propriedades mandatórias não são informadas (type e timestamp);
* Nenhum evento de start é informado;
* Input inserido fora do formato esperado;

## Inputs inválidos

Inputs são considerados inválidos se: 

* Inputs informados após um evento de stop
* Inputs informados antes de um evento de start
* Omissão de propriedades não mandatórias;
* Tipo de evento não esperado

# Usabilidade

## Referente ao resize

Para fazer resize dos componenentes, é preciso arrastar o botão que se encontra no canto inferior direito do campo de texto

## Legenda do gráfico

### Responsividade

Para fins de responsividade, a legenda foi feita de forma diferente da informada no README. O gráfico exibe duas legendas: uma para as linhas e outra para os pontos.

As linhas são referentes às propriedades informadas no campo *group*.
Os pontos são referentes às propriedades informadas no campo *select*.

Essa alteração foi feita devido à necessidade de combinação entre os dados de *group* e de *select* para gerar o gráfico. Se houvessem muitas possíveis combinações, a legenda ficaria muito grande, o que poderia causar um scroll na área do gráfico, prejudicando sua legibilidade.

### Interatividade

A fim de proporcionar uma experiência mais clara ao usuário, a legenda ganhou interatividade. 

Ao fazermos um hover em um de seus elemento, os elementos correspondentes são realçados no gráfico. 

Por exemplo: 

Se fizermos hover no elemento da legenda que plota um ponto azul, todos os pontos azuis do gráfico serão realçados.

Analogamente, se fizermos hover no elemento da legenda que plota uma vermelha, todas as linhas vermelhas do gráfico serão realçadas
