
let googleEndpoint = 'https://www.googleapis.com/books/v1/volumes?q=';

function clean() {
    $('#procurar').val('');
    lista.length = 0;
    console.log(lista);
    
}

function getBooks(a) {

  $("#login").addClass("d-none");
  $("#main").removeClass("d-none ");
  $("#botoes").removeClass("d-none");
  $("#tabela ").addClass("d-none ");
  $("#rating ").addClass("d-none ");
  $('#procurar').val('');

    if (a !== '') {

        livros = [];
        lista = [];

        $('#titulo').text('');
        $('#imagem').attr("src", '');
        $('#descricao').text('');
        $('#autores').text('');
        $('#editora').text('');
        $('#data').text('');
        
        getData(a);

    }

}



function getData(a) {
    
    $.get(endpointFinal(a), function(data){
        console.log('success one');
    }).done( data => {
        let livros = data.items;
        console.log(livros)

        for ( i = 0; i < livros.length; i++) {

            let result = new Book(livros[i].volumeInfo.title, livros[i].volumeInfo.authors[0], livros[i].volumeInfo.publisher, livros[i].volumeInfo.publishedDate, livros[i].volumeInfo.description, livros[i].volumeInfo.imageLinks.smallThumbnail)
            listaDeLivros.adicionarLivros(result);

            
        }
        lista = listaDeLivros.lista;
        console.log(lista);
            $('#titulo').text(lista[0].title);
            $('#imagem').attr("src", lista[0].image);
            $('#descricao').text(lista[0].description);
            $('#autores').text(lista[0].authors);
            $('#editora').text(lista[0].publisher);
            $('#data').text(lista[0].publishedDate);
            reduceText();

    }).fail( data => {
        console.log('error: ')
    });
    
}


function endpointFinal(a) {

    let search = a;

    let endpoint = googleEndpoint + search;

    return endpoint;
    console.log(endpoint);
    
}


//-----------CLASS---------

class Lista {

    constructor(){
        this.lista = [];
    }

    adicionarLivros(result){
        this.lista.push(result);
    }
}


class Book {

    constructor(title, authors, publisher, publishedDate, description, image){

        this.title = title;
        this.authors = authors;
        this.publisher = publisher;
        this.publishedDate = publishedDate;
        this.description = description;
        this.image = image;

    }

}

let listaDeLivros = new Lista();
let lista = [];


//-----------CLASS---------



function like() {
     
    if (lista.length <= 1) {
    console.log('vou pedir mais livros')
    getFirstBooks(count)
}
    

    $('#main').addClass('animated bounceOutLeft');
    getBack()
    postBook(lista[0]);

}


function deslike() {
     
    if (lista.length <= 1) {
    console.log('vou pedir mais livros')
    getFirstBooks(count)
}

    $('#main').addClass('animated bounceOutRight');
    
    getBack()
    console.log(lista);

}


function getBack() {

        setTimeout(() => {

    lista.shift();
    $('#main').removeClass().addClass('box box-text neuomorphism text-center')
    $('#titulo').text(lista[0].title);
    $('#imagem').attr("src", lista[0].image);
    $('#descricao').text(lista[0].description);
    $('#autores').text(lista[0].authors);
    $('#editora').text(lista[0].publisher);
    $('#data').text(lista[0].publishedDate);
    //console.log(lista.length);
    reduceText();
            
        }, 1000);
    

    
}

function reduceText() {

    var showChar = 100;
    var ellipsestext = "...";

    $(".truncate").each(function() {
      var content = $(this).html();
      if (content.length > showChar) {
        var c = content.substr(0, showChar);
        var h = content;
        var html =
          '<div class="truncate-text" style="display:block">' + c + '<span class="moreellipses">' + ellipsestext +
          '&nbsp;&nbsp;<a href="" class="moreless more"><strong><ins>More</ins></strong></a></span></span></div><div class="truncate-text" style="display:none">' +
          h +
          '<a href="" class="moreless less"><strong><ins>Less</ins></strong></a></span></div>';

        $(this).html(html);
      }
    });

    $(".moreless").click(function() {
      var thisEl = $(this);
      var cT = thisEl.closest(".truncate-text");
      var tX = ".truncate-text";

      if (thisEl.hasClass("less")) {
        cT.prev(tX).toggle();
        cT.slideToggle();
      } else {
        cT.toggle();
        cT.next(tX).fadeToggle();
      }
      return false;
    });
    
}

let count = 0;

function getFirstBooks() {

    count = count + 10;

    let startIndex = '&startIndex=';
    let url = "https://www.googleapis.com/books/v1/volumes?q=''";
    let index = url + startIndex + count;
    console.log(index);
    $.get( index, function(data){
        console.log('success');
    }).done( data => {
        let livros = data.items;
        console.log(livros);
        console.log(livros.length);
        for ( i = 0; i < livros.length; i++) {

            let result = new Book(livros[i].volumeInfo.title, livros[i].volumeInfo.authors, livros[i].volumeInfo.publisher, livros[i].volumeInfo.publishedDate, livros[i].volumeInfo.description, livros[i].volumeInfo.imageLinks.smallThumbnail)
            listaDeLivros.adicionarLivros(result);

            
        }

        lista = listaDeLivros.lista;
        console.log(lista);
            $('#titulo').text(lista[0].title);
            $('#imagem').attr("src", lista[0].image);
            $('#descricao').text(lista[0].description);
            $('#autores').text(lista[0].authors);
            $('#editora').text(lista[0].publisher);
            $('#data').text(lista[0].publishedDate);
            reduceText();


    }).fail(data => {
        console.log('error')
    })
  
    
}

let urlApi = 'https://upacademytinder.herokuapp.com/api/';

function postBook(livro) {

    $.ajax({
        type: "POST",
        url: urlApi + 'users/' + currentUser.id + '/books',
        data: livro,
        success: function (book) {
            console.log('success' + book);
            livro.id = book.id;
        }, error: function () {

        }
       
    })

}

function deleteBook(id) {


    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'm-1 btn btn-success',
          cancelButton: 'm-1 btn btn-danger'
        },
        buttonsStyling: true
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Pretende apagar este livro?',
        text: "Esta acao nao pode ser revertida",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, apagar!',
        cancelButtonText: 'No, cancelar!',
        customClass: 'swal-wide',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {

            $.ajax({
                url: urlApi + 'users/' + currentUser.id  + '/books/' + id ,
                type: 'DELETE',
                success: () => {
                  console.log("Deleted ");
                  $("#corpoTabela tr").remove();
                  readBooks();
                }
              });

          swalWithBootstrapButtons.fire(
            'Removido!',
            'O livro foi removido.',
            'successo'
          )
        } else if (

          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'O seu livro esta salvo e seguro:)',
            'success'
          )
        }
      })
    
}