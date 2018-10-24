<?php 
include_once 'dbconn.php';
function Newuser(){
    $fname =  strtoupper($_POST["fname"]);
    $lname =   strtoupper($_POST["lname"]);
   $bk = $_POST["AccNo"];
    $pass = md5($_POST["pin"]);

    $conn=mysqli_connect("localhost","root","","banking");

    $sql = "INSERT INTO  users (fname, lname, AccNo, pin, is_admin, is_teller, is_clerk, is_customer, date) VALUES ('$fname','$lname','$bk','$pass','0','0','1','0',now()) ";
    $data = mysqli_query($conn, $sql);//or die(mysql_error());
	if($data)
	{
        echo  "<script> alert( ' REGISTRATION COMPLETED SUCCESSFULLY...') </script>";
	}else{
        echo  "<script> alert( ' REGISTRATION UNSUCCESSFULL...') </script>";
         }
    }
 
if(isset($_POST['submit'])){
    Newuser();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
<form action="registerteller.php" >
            
    <button type="back" class="returnbtn">back</button>
    </form>
</body>
</html>