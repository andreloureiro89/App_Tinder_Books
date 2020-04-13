currentUser = {};

function setCurrentUser(user) {
      currentUser = user;
      stateView();
    }

function inputEnter(event, input) {
      const char = event.code;
      const key = event.key;
      if (char === 'Enter' || key === 'Enter') {
        if (input === "login") {
          getUserByUsername();
        } else if (input === "booksearch") {
          getBooksFromGoogle();
        }
      }
    }

function stateView() {
      if (currentUser.id != undefined) {

        $("#login").addClass("d-none");
        $("#main").removeClass("d-none ");
        $("#botoes").removeClass("d-none");
        $("#topo").removeClass("d-none");
        $("#tabela ").addClass("d-none ");
        $("#rating ").addClass("d-none ");
        $('#currentUsername').addClass('d-none');


        updateHeader();

      } else {

        $("#botoes").addClass("d-none");
        $("#login ").removeClass("d-none ");
        $("#main ").addClass("d-none ");
        $("#topo").addClass("d-none");
        $("#tabela ").addClass("d-none ");

      }
    }

function updateHeader() {
      $("#currentUsername").html(`Perfil de ${currentUser.username}`);
    }


function getUserByUsername() {


let username = $("#username ").val();

        if( username == ''){

            $('#username').removeClass().addClass('col-9 animated bounce')
            $('#loginError').text('* Forget username');

        } else {

            $.get('https://upacademytinder.herokuapp.com/api/users/?filter={"where":{"username":"' + username + '"},"include":"books"}').done((data) => {
                
                (data.length == 0) ? addUser(username) : setCurrentUser(data[0]);
            
            }).fail((err) => {
            
                console.error("Erro : ", err);
           
            });
        }

        $("#username ").val('');

    }


function addUser(username) {
      let tempUser = {
        username: username
      }
      $.post('https://upacademytinder.herokuapp.com/api/users',
        tempUser).done((data) => {
          setCurrentUser(data);
        }).fail((err) => {
          console.error("Erro : ", err);
        });
    }

function deleteUserById() {
      $.ajax({
        url: 'https://upacademytinder.herokuapp.com/api/users/' +
          currentUser.id,
        type: 'DELETE',
        success: () => {
          console.log("Deleted ");
          setCurrentUser();
        }
      });
    }

function updateUserById() {
      currentUser.username = $("#currentUsername ").val();
      $.ajax({
        url: 'https://upacademytinder.herokuapp.com/api/users/' + currentUser.id,
        type: 'PUT',
        data: currentUser,
        success: (user) => {
          console.log("Updated ");
          setCurrentUser(user);
        }
      });
    }


function addBook() {
      let tempBook = {
        name: $("#bookName ").val()
      }
      $.post('https://upacademytinder.herokuapp.com/api/users/' + currentUser.id + '/books',
        tempBook).done((data) => {
          console.log(data);
        }).fail((err) => {
          console.error("Erro : ", err);
        });
    }

function getBooksFromGoogle() {
      console.log("getBooksFromGoogle function", $("#h-search").val());
    }

function logout() {
      currentUser = {};
      stateView();
    }

function removeClass() {

        $('#username').removeClass().addClass('col-8')
        $('#loginError').text('');
        
    }

function readBooks() {

      
      $("#rating").addClass('d-none');
      $('#ratingTableBody tr').remove()
      $('#corpoTabela tr').remove()
      $('#currentUsername').addClass('d-none');
      $("#botoes").addClass("d-none");
      $("#main").addClass("d-none");
      $("#tabela").removeClass("d-none");
      $('#currentUsername').removeClass('d-none');

      getRatingBooks();

      $.ajax({
        type: "GET",
        url: urlApi + 'users/' + currentUser.id + '/books',
        success: function (info) {
          console.log(info)

              for ( i = 0; i < info.length; i++) {

                $('#bookTable tbody').append(`<tr>
                        <th scope="row"><a onclick="deleteBook('${info[i].id}')" class="fas fa-trash" href="#"></a><span><a onclick="rateBook('${info[i].id}, ${info[i].title}, ${info[i].authors[0]}, ${info[i].publisher}')" class="fas fa-check-square ml-4" href="#"></a></th>
                        <td style="font-size: 80%">${info[i].title}</td>
                        <td style="font-size: 80%">${info[i].authors}</td>
                        <td style="font-size: 80%">${info[i].publisher}</td>
                    </tr>`);
        
              }

        }, error: function (info) {
            console.log('Error')
        }
       
    })
     
    }

function sortTable(n) {


      changeIcon(n)


      var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
      table = document.getElementById("bookTable");
      switching = true;
      dir = "asc";

      while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {

          shouldSwitch = false;

          x = rows[i].getElementsByTagName("td")[n];
          y = rows[i + 1].getElementsByTagName("td")[n];
          

          if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

              shouldSwitch = true;
              break;
            }
          }
        }
        if (shouldSwitch) {

          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          switchcount ++;
        } else {

          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
          }
        }
      }
}



function changeIcon(n) {
    console.log('um')


                    let getIcon = $('#' + n ).attr('class');
                    let size = $('#cabecaTabela th').length;
                    let getValue = n;

                    if(getIcon == "fas fa-angle-double-down") {

                        $('#' + n).removeClass("fa-angle-double-down").addClass("fa-angle-double-up")

                        for ( i = 0; i < size - 1; i++) {

                            if (i == getValue) {
                                continue;
                            }

                            $('#' + i).removeClass("fa-angle-double-up").addClass("fa-angle-double-down")
                        }
                    }
            }




function rateBook(id) {

  $("#tabela").addClass("d-none");
  $("#rating").removeClass('d-none');

  let data = id;
  console.log(data);
  let values = data.split(',');
  console.log(values);

  $('#tituloRatingBook').html(values[1]);

  $(document).ready(function(){
  
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); 
   

    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    });
    
  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  });
  
  

  $('#stars li').on('click', function(){
    var onStar = parseInt($(this).data('value'), 10); 
    var stars = $(this).parent().children('li.star');
    
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
    

    var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
    var msg = "";
    if (ratingValue > 1) {
        msg = "Obrigado! Voce deu uma avaliação de " + ratingValue + " estrelas ao livro " + values[1];
        
        ratingBook(ratingValue, values[0]);

        setTimeout(() => {

          stateView()
                  
              }, 2500);

    } else {
        msg = "Voce avaliou o livro " + values[1] + " em " + ratingValue + " estrela apenas.";

        ratingBook(ratingValue, values[0]);

        setTimeout(() => {

          stateView()
                  
              }, 2500);

    }
    responseMessage(msg);
    
  });
  
  
});

function responseMessage(msg) {
      $('.success-box').fadeIn(200);  
      $('.success-box div.text-message').html("<span>" + msg + "</span>");
}

}


function ratingBook(ratingValue, id){

  console.log(ratingValue);
  console.log(id);

  $.ajax({
    url: 'https://upacademytinder.herokuapp.com/api/users/' + currentUser.id + '/books/' + id,
    type: 'PUT',
    data: {rating: ratingValue},
    success: (user) => {
      console.log("Livro update");
    }
  });
  
}


function getRatingBooks(){

  $.ajax({
    type: 'GET',
    url: 'https://upacademytinder.herokuapp.com/api/users/' + currentUser.id + '/books?filter=%7B%22where%22%3A%7B%22rating%22%3A%7B%22exists%22%3Atrue%7D%7D%7D' ,
    success: function (book) {

    for ( t = 0; t < book.length; t++) {
          
                    $('#ratingTable tbody').append(`<tr>
                        <td>${book[t].title}</td>
                        <td>${book[t].authors}</td>
                        <td>${book[t].publisher}</td>
                        <td>${book[t].rating}</td>
                    </tr>`);
    }


      console.log('sucesso' + book);
      console.log(book.length)
    }, error: function () {

    }

  });



}




// $.ajax({
//   type: "POST",
//   url: urlApi + 'users/' + currentUser.id + '/books',
//   data: book,
//   success: function (book) {
//       console.log('success' + book);
//       livro.id = book.id;
//   }, error: function () {

//   }
 
// })



// {"where":{"rating":{"exists":true}}}
