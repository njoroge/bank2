<?php
session_start();
include_once 'dbconn.php';
include_once 'libs/fpdf.php';

$pi = $_SESSION['accno'];
//$display_heading = array('fname'=>'First name','lname'=>'Last name',)
$sql = "SELECT fname, lname, AccNo, balance FROM accounts WHERE AccNo = '$pi'";
$result = mysqli_query($conn, $sql);

        while($row = $result->fetch_assoc()){   
        echo "your details are:".'<br>';
        echo'first name:'."  "; echo  $fname = $row['fname'].'<br>';
        echo 'last name:'."  ";echo $fname = $row['lname'].'<br>';
        echo 'Ac/No:'." ";echo $acc=$row['AccNo'].'<br>';
        echo'balance:'." ";echo $bal=$row['balance'].'<br>';
} 
?>
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
<form action="balance.php" >
            
    <button type="back" class="returnbtn">back</button>
    </form>
</body>
</html>
  