<!DOCTYPE html>
<html>

<head>
  <title>M-Bank services</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
    crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
    crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
    crossorigin="anonymous"></script>
    <link rel="stylesheet" href="../css/style1.css">

    <script type="text/javascript">
$(document).ready(function(){
    $('.search-box input[type="text"]').on("keyup input", function(){
       
        var inputVal = $(this).val();
        var resultDropdown = $(this).siblings(".result");
        if(inputVal.length){
            $.get("accsearch.php", {term: inputVal}).done(function(data){
                
                resultDropdown.html(data);
            });
        } else{
            resultDropdown.empty();
        }
    });
    
    
    $(document).on("click", ".result p", function(){
        $(this).parents(".search-box").find('input[type="text"]').val($(this).text());
        $(this).parent(".result").empty();
    });
});
</script>
</head>

<body class="news">
  <div class="jumbotron text-center">
    <h1>M-Bank services </h1>
  </div>
  <header>
    <div class="topnav">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">

            <li><a class="nav-item nav-link " href="../accountdeposit.php">Deposit money </a></li>
            <li><a class="nav-item nav-link " href="transaction_reports.php">Transaction Reports </a></li>
            <li><a class="nav-item nav-link active" href="ministatement.php">Mini-statements</a></li>
            <li><a class="nav-item nav-link" href="../index.php">logout</a></li>
          </div>
        </div>
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
        <form action="generatemini.php" method="post">
          <h3> Generate mini-statements</h3>
          <!--<div class="col-md">
            <div class="search-box">
              <label for="accno"><b>Account number:</b></label>
              <input type="text" autocomplete="off" placeholder="Search account..." name="accno" />
              <div class="result"></div>
            </div>
          </div>-->
          <label for="Account number"><b>A/C NO:</b></label>
                  <input type="text" placeholder="enter account number" name="accno" required>
          <br>
              <table>
                <tr>

                  <td>Start Date </td>
                  <td>
                    <input type="date" name="date1" required></td>
                </tr>

                <tr>
                  <td>End Date </td>
                  <td>
                    <input type="date" name="date2" required></td>
                </tr>
              </table>
              <table>
                <tr>
                  <td colspan="2"><input type="submit" name="summary_date" value="submit" class="addstaff_button" /></td>
                </tr>
              </table>
      </div>
      </form>
    </div>
  </div>
</body>
</html>