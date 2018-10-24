<?php
    session_start();
  include_once 'dbconn.php';
   
  $acc = $_POST['AccNo'];
 
  $newrole = strtoupper($_POST['rolenew']);

  if($newrole === 'ADMIN'){
      $sql = " UPDATE users  SET is_admin = 1 and is_teller = 0, is_clerk = 0, is_customer = 0 WHERE AccNo='$acc'  " ;
      mysqli_query($conn,$sql);
      $_SESSION['SCUCCESS'] = "SUCCESS";
      header ("location:admin.php");

  }elseif($newrole==='TELLER'){
    $sql = " UPDATE users SET is_teller = 1 and is_admin = 0,is_clerk = 0, is_customer = 0 WHERE AccNo='$acc'  " ;
    mysqli_query($conn,$sql);
    $_SESSION['SCUCCESS'] = "SUCCESS";
      header ("location:admin.php");
  }elseif($newrole==='CLERK'){
    $sql = " UPDATE users SET is_clerk = 1  and is_teller = 0, is_admin = 0, is_customer = 0 WHERE AccNo='$acc'  " ;
    mysqli_query($conn,$sql);
    $_SESSION['SCUCCESS'] = "SUCCESS";
      header ("location:admin.php");
  }elseif($newrole==='CUSTOMER'){
    $sql = " UPDATE users SET is_customer = 1 and is_admin = 0, is_teller = 0, is_clerk = 0 WHERE AccNo='$acc'  " ;
    mysqli_query($conn,$sql);
    $_SESSION['SCUCCESS'] = "SUCCESS";
      header ("location:admin.php");
  }else{
      echo "<script> alert('THE ROLE CANNOT BE CHANGED....')</script>";
  }


  ?>