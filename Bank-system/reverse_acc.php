<?php
    session_start();
  include_once 'dbconn.php';

   
          //$balance = $_POST['balance'];
          $account = $_POST['AccNo'];
          $bal = $_POST['balance'];
          $sql = "SELECT *FROM accounts WHERE AccNo='$account'"  ;
          $result = mysqli_query($conn, $sql);
  
            $init='';
            while($row = $result->fetch_assoc()){
                $init = $row['balance'];
            } 
         $newam = $bal-$init;
        $sql =" UPDATE accounts SET balance = '$newam' WHERE AccNo='$account'";

        if(mysqli_query($conn,$sql)){ 

            $sql1 ="INSERT into transactions (AccNo, amount, balance,date) values ( '$account', '$bal', '$newam', now())";
            
            mysqli_query($conn,$sql1);
       
            echo "<script> alert( ' BALANCE UPDATE COMPLETED SUCCESSFULLY...') </script>";
          

            //header("location:accountdeposit.php"); 
        }
        else{
            //$_SESSION['fail'] = "<script> alert( '  UNSUCCESSFULL...') </script>";
           echo "<script> alert( '  UNSUCCESSFULL...') </script>";
        }
  ?>
