<?php
session_start();
  include_once 'dbconn.php';

        $acc = $_POST['oldpin'];
        $newpi = md5($_POST['newpin']);
        $pi = $_SESSION['accno'];
        $chpin = $_POST['oldpin'];
        $sql = "SELECT pin FROM users WHERE accNo='$pi'"  ;
        $result = mysqli_query($conn, $sql);
        $init='';
        while($row = $result->fetch_assoc()){
                $init = $row['pin'];
            } 
        $sql="UPDATE users  SET pin ='$newpi' WHERE AccNo='$pi'";
        if(mysqli_query($conn,$sql)){
            echo "pin changed successfully";
        }
        else{
            echo"failed ";
            
        }
        
?>