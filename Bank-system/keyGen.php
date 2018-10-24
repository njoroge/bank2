<?php
include_once 'dbconn.php' ;

 function checkey($conn, $randstr){
    $sql ="SELECT *from transactionkey";
    $result = mysqli_query($conn,$sql);

    while($row = mysqli_fetch_assoc($result)){
        if($row['keystring'] == $randstr){
            $keyExists = true;
            break;
        }
        else{
            $keyExists = false;
        }
    }
    return $keyExists;
 }

 function generatekey($conn){
     $keylength = 8;
     $str ="1234567890abcdefghijklmnopqrstuvwxyz";
     $randstr = substr(str_shuffle($str), 0, $keylength);
     $checkey = checkey($conn, $randstr);
     
     while($checkey == true){
         $randstr = substr(str_shuffle($str), 0, $keylength);
         $checkey = checkey($conn, $randstr);
         
     }
     return $randstr;
 }

 echo generatekey($conn);
?>