<?php
session_start();
echo ' welcome '; 

?>

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
        <link rel="stylesheet" href="css/style1.css">
  <?php 
include_once 'dbconn.php';
function Newuser(){
  $fname =  strtoupper($_POST["fname"]);
  $lname = strtoupper($_POST["lname"]);
   $acc = $_POST["AccNo"];
    $pin = md5($_POST["pin"]);

    $conn=mysqli_connect("localhost","root","","banking");

    $sql = "INSERT INTO  users (fname, lname, AccNo, pin, is_admin, is_teller, is_clerk, is_customer, date) VALUES ('$fname','$lname','$acc','$pin','0','0','0','1',now()) ";
    $data = mysqli_query($conn, $sql);//or die(mysql_error());

    

      
    
	if($data)
	{
    $sql1 ="INSERT into accounts (fname, lname, AccNo, balance, date ) values ( '$fname', '$lname', '$acc', 0.00,now())";
      mysqli_query($conn,$sql1);
     echo "<script> alert( ' REGISTRATION COMPLETED SUCCESSFULLY...') </script>";
	}else{
   echo "<script> alert( ' REGISTRATION  UNSUCCESSFULL...') </script>";
    }

  
}

if(isset($_POST['submit'])){
  newuser();
}

?>

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

            <li><a class="nav-item nav-link active" href="account.php">services</a></li>
            <li><a class="nav-item nav-link " href="./reports/custregreports.php">Registration Reports</a></li>
            <li><a class="nav-item nav-link" href="index.php">logout</a></li>
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
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
          Register new customer
        </button>
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">register new customer</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>" method="post">
                  <hr>
                  <label for="first name"><b>First Name :</b></label>
                  <input type="text" placeholder="Enter your firstname" name="fname" required>
                  <br>
                  <label for="last name"><b>Last Name:</b></label>
                  <input type="text" placeholder="Enter last name" name="lname" required>
                  <br>
                  <label for="Account number"><b>A/C NO:</b></label>
                  <input type="text" placeholder="enter account number" name="AccNo" required>
                  <br>
                  <label for="Pin number"><b>Pin:</b></label>
                  <input type="password" placeholder="enter pin number" name="pin" required>
                  <br>
                  <hr>
                  <button type="submit" class="registerbtn" name="submit">Register</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--<div class="col-md">
        <form action="deposit.php" method="post">
          <label for="Deposit"><b>deposit:</b></label>
          <input type="text" placeholder="enter amount to deposit" name="balance" required>
          <br><br>
          <button type="submit" class="depositbtn" name="deposit">Deposit</button>
          
        </form>
      </div>
    </div>-->
    <!-- Button trigger modal -->


</body>

</html>