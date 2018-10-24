<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="css/style.css">
    <?php 
include_once 'dbconn.php';
function Newuser(){
   $fname =  strtoupper($_POST["fname"]);
   $lname =   strtoupper($_POST["lname"]);
   $bkcode = $_POST["AccNo"];
    $pass = md5($_POST["pin"]);

    $conn=mysqli_connect("localhost","root","","banking");

    $sql = "INSERT INTO  users (fname, lname, AccNo, pin, is_admin, is_teller, is_clerk, is_customer, date) VALUES ('$fname','$lname','$bkcode','$pass','0','1','0','0',now()) ";
    $data = mysqli_query($conn, $sql);//or die(mysql_error());
	if($data)
	{
        $sql1 ="INSERT into accounts (fname, lname, AccNo, balance, date ) values ( '$fname', '$lname', '$acc', 0.00,now())";
      mysqli_query($conn,$sql1);
   echo  "<script> alert( ' REGISTRATION COMPLETED SUCCESSFULLY...') </script>";
	}else{
        echo  "<script> alert( ' REGISTRATION UNSUCCESSFULL...') </script>";
         }
    }
 
if(isset($_POST['submit'])){
    Newuser();
}
?>

</head>
<div class="jumbotron text-center">
    <h1>M-Bank  </h1>
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
          <a class="nav-item nav-link active" href="admin.php">Home </a></li>
          
            <li><a class="nav-item nav-link active" href="registerteller.php">Registration </a></li>
    
            <li><a class="nav-item nav-link" href="index.php">logout</a></li>
          </div>
        </div>
  </header>



    <div class="container">
        <!--img src="image/bk2.jpg" width=640px height=380px /-->
        <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>" method="post">
            <h2>Register teller </h2>
            <hr>
            <label for="first name"><b>First Name :</b></label>
            <input type="text" placeholder="Enter your firstname" name="fname" required>
            <br>
            <label for="last name"><b>Last Name:</b></label>
            <input type="text" placeholder="Enter last name" name="lname" required>
            <br>
            <label for="Account number"><b>Account Number:</b></label>
            <input type="text" placeholder="enter account number" name="AccNo" required>
            <br>
            <label for="Pin"><b>Pin:</b></label>
            <input type="password" placeholder="enter the pin" name="pin" pattern="[0-9]{4}" required>
            <br>
            <hr>
            <button type="submit" class="registerbtn" name="submit">Register</button>

           
        </form>
        
    
    
    </div>
</body>

</html>