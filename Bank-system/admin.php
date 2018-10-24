<!DOCTYPE html>
<html lang="en">
<?php session_start(); ?>
<head>
  <title>admin M-banking</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
    crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
    crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
    crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>

  <link rel="stylesheet" href="css/style1.css">
  <script type="text/javascript">
    $(document).ready(function () {
      $('.search-box input[type="text"]').on("keyup input", function () {

        var inputVal = $(this).val();
        var resultDropdown = $(this).siblings(".result");
        if (inputVal.length) {
          $.get("searchacc.php", { term: inputVal }).done(function (data) {

            resultDropdown.html(data);
          });
        } else {
          resultDropdown.empty();
        }
      });


      $(document).on("click", ".result p", function () {
        $(this).parents(".search-box").find('input[type="text"]').val($(this).text());
        $(this).parent(".result").empty();
      });
    });
  </script>
</head>

<body>

  <div class="jumbotron text-center">
    <h1>M-Bank </h1>
  </div>
  <header>

    <nav class="navbar navbar-expand-lg navbar-light bg-light">

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Home
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="admin.php">home</a>
              <a class="dropdown-item" href="index.php">logout</a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              setup
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="registerteller.php">register teller</a>
              <a class="dropdown-item" href="registerclerk.php">register clerk</a>
              <a class="dropdown-item" href="account.php">register customer</a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Registration Reports
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="./reports/tellerregrep.php">Teller registration reports</a>
              <a class="dropdown-item" href="./reports/clerkregrep.php"> clerk registration reports</a>
              <a class="dropdown-item" href="./reports/custregreports.php">customer registration reports</a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Transactions
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="./reports/transaction_reports.php">transaction reports</a>
              <a class="dropdown-item" href="./reports/ministatement.php">mini-statements</a>
            </div>
          </li>

        </ul>
      </div>
    </nav>
  </header>
  <div class="container">
    <div class="row">
      <div class="col-md">
        <h2 align-items="center"> financial Tips</h2>
        <p align-items="center">1.Monitor your accounts regularly. </p>
        <p align-items="center">2.Access your accounts from a secure location. </p>
        <p align-items="center">3.Protect your computer. </p>
        <p align-items="center">4.Keep your system up-to-date</p>
      </div>
      <div class="col-md">
        <form action="roles.php" method="post">
          <div class="col-md">
            <div class="search-box">
              <label for="AccNo"><b>Account number:</b></label>
              <input type="text" autocomplete="off" placeholder="Search account number..." name="AccNo" />
              <div class="result"></div>
            </div>
            <label for="rolenew"><b> New Account type:</b></label>
            <input type="text" class="form-control" placeholder="assign new role ..." name ="rolenew">
            <button type="submit" class="btn btn-primary">Change</button>
            <div>
              <?php if(isset($_SESSION['SCUCCESS'])){echo $_SESSION['SCUCCESS'];} ?>
            </div>
          </div>
        </form>
      </div>
</body>
</html>