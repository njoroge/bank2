<?php
session_start();

include_once 'dbconn.php';

    $acc = $_POST['AccNo'];
    //echo $acc;
    $pi = md5($_POST['pin']);
    $sql = "SELECT *FROM users WHERE AccNo = '$acc' and pin = '$pi' ";
    $result = mysqli_query($conn, $sql);

    $_SESSION['accno'] = $_POST['AccNo'];
    //echo $sql;
    

    if(mysqli_fetch_assoc( $result)<1){ 
        echo "<script> alert('The account number or pin is wrong') </script>";             
        }
        else{
            $fname =""; 
            $lname="";
            $acc="";
            $isadmin="";
            $isteller="";
            $isclerk="";
            $iscustomer="";

        foreach($result as $key => $value){
            $fname = $value['fname'];
            $lname = $value['lname'];
            $isadmin = $value['is_admin'];
            $isteller = $value['is_teller'];
            $isclerk = $value['is_clerk'];
            $iscustomer = $value['is_customer'];
        }
        if($isadmin==1){
            header("location:admin.php"); 
        }
        elseif($isteller==1){
            header("location:accountdeposit.php"); 
        }
        elseif($isclerk==1 ){
            header("location:account.php");
        }
        else{
            header("location:balance.php");
        }
         
            
   }

   
  
?>